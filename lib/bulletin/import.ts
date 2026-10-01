import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { cleanSection, isIsoDate } from "./schema";
import type { Bulletin, SectionKey } from "./types";

/**
 * Reads a finished paper bulletin (PDF) and returns it as bulletin sections,
 * so the secretary uploads the file instead of retyping it. The result is
 * always saved as a DRAFT that a person reads over before publishing — names
 * in a prayer list are not something to publish unchecked.
 */

const Extracted = z.object({
  bulletin_date: z.string(),
  order_of_service: z.object({
    song_leader: z.string(),
    items: z.array(z.object({ label: z.string(), who: z.string(), note: z.string() })),
  }),
  announcements: z.array(
    z.object({ title: z.string(), when: z.string(), body: z.string(), note: z.string() }),
  ),
  prayer_groups: z.array(z.object({ label: z.string(), names: z.array(z.string()) })),
  article: z.object({
    kicker: z.string(),
    title: z.string(),
    subtitle: z.string(),
    body: z.string(),
  }),
  series: z.object({
    title: z.string(),
    tagline: z.string(),
    verse: z.string(),
    weeks: z.array(z.object({ date: z.string(), title: z.string() })),
  }),
});

const INSTRUCTIONS = `You are reading a finished weekly church bulletin (PDF) for the Cisco Church of Christ and transcribing it into structured fields for the church's website.

Transcribe faithfully. Copy names, dates, times and wording exactly as printed — never invent, correct, or "improve" anything. If a field is not on the page, return an empty string (or an empty list).

Fields:
- bulletin_date: the Sunday this bulletin is for, as YYYY-MM-DD.
- order_of_service: the Sunday morning worship order. song_leader is the person named as song leader. items are the list in printed order. Put a person's name in "who" when the line has one (e.g. a line "Presiding: Mike Lewis" becomes label "Presiding", who "Mike Lewis"). The sermon is its own item: label "Sermon", who = the preacher, note = the sermon title in curly quotes.
- announcements: each announcement under the announcements/events heading. title is the heading; when is the date/time text printed beside it (e.g. "October 10, 9:30 am-3pm"); body is the paragraph; note is a short bold standalone line such as "No evening service." Keep the printed order.
- prayer_groups: the prayer list. The main list has label "". A separate named list (such as a nursing home) gets its own group with that name as the label. One entry per person or family exactly as printed (e.g. "James & Lauren Dye and family" stays one name).
- article: the minister's article. kicker is the "From the Minister's Desk" style label; title is its heading; subtitle only if there is a distinct italic subtitle, else "". body is the full text, verbatim, with a blank line between paragraphs. Wrap lines that are printed bold in **double asterisks** and keep a bold heading and the lines under it together in one paragraph separated by single newlines.
- series: the sermon series box. title, tagline, and the key verse line (verse). weeks are each dated entry in order; use the bulletin's year for the date.

Do NOT include the standing information that is the same every week: the "Welcome, Visitors" box, contact details, the weekly meeting times box, or the list of elders and staff. Ignore decorative images.`;

export type ExtractResult =
  | { ok: true; date: string; sections: Pick<Bulletin, SectionKey> }
  | { ok: false; reason: "not-configured" | "unreadable" | "no-date" | "refused" | "unavailable" };

export function importConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function extractBulletin(pdf: Buffer): Promise<ExtractResult> {
  if (!importConfigured()) return { ok: false, reason: "not-configured" };

  const client = new Anthropic();
  let response;
  try {
    response = await client.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { format: zodOutputFormat(Extracted), effort: "medium" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: pdf.toString("base64") },
            },
            { type: "text", text: INSTRUCTIONS },
          ],
        },
      ],
    });
  } catch (error) {
    // Only a complaint about the document itself means "this PDF can't be read".
    // Anything else (account, key, workspace, quota) is a problem on our side.
    if (error instanceof Anthropic.BadRequestError && /pdf|document|page/i.test(error.message)) {
      return { ok: false, reason: "unreadable" };
    }
    return { ok: false, reason: "unavailable" };
  }

  if (response.stop_reason === "refusal") return { ok: false, reason: "refused" };
  const parsed = response.parsed_output;
  if (!parsed) return { ok: false, reason: "unreadable" };
  if (!isIsoDate(parsed.bulletin_date)) return { ok: false, reason: "no-date" };

  // Same validators the editor uses — the model's output is never trusted raw.
  return {
    ok: true,
    date: parsed.bulletin_date,
    sections: {
      order_of_service: cleanSection("order_of_service", parsed.order_of_service),
      announcements: cleanSection("announcements", parsed.announcements),
      prayer_groups: cleanSection("prayer_groups", parsed.prayer_groups),
      article: cleanSection("article", parsed.article),
      series: cleanSection("series", parsed.series),
    },
  };
}
