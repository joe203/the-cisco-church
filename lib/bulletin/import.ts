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
  praise: z.array(z.string()),
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

The secretary's layout changes from week to week: sections move between columns and pages, headings are worded differently or missing, and boxes sit beside unrelated text. Find each section by what it IS, not by where it sits or what it is called. Read every column and every box on every page before deciding something is absent. Almost every bulletin has an order of service, a prayer list, and at least one announcement — if you have not found one, look again. Paper line breaks are layout only: join wrapped lines into normal sentences and paragraphs.

Fields:
- bulletin_date: the Sunday this bulletin is for, as YYYY-MM-DD.
- order_of_service: the Sunday morning worship order (often headed "Order of Service"). song_leader is the person named as song leader. items are the remaining lines in printed order. A role is often printed on one line and the person on the next, or joined with a dash ("Sermon- Joe Cabrera"); either way label = the role, who = the person. Lines with no person (e.g. "Congregational Singing", "Invitation Song") are items with who "". The sermon is its own item: label "Sermon", who = the preacher, note = the sermon title in curly quotes.
- announcements: every announcement or event notice, wherever it is printed — with or without an "Announcements" heading, including recurring ones such as Sunday morning Bible study. title is the notice's heading (without a date or time); when is the date/time text in or beside the heading (e.g. "9:30 AM", "November 18"); body is the paragraph(s); note is a short bold standalone line such as "No evening service." Keep the printed order.
- prayer_groups: the prayer list.
  * The main list has label "". One entry per person or family exactly as printed (e.g. "James & Lauren Dye and family" stays one name). Names are usually separated by commas and may run on with no comma where a line wraps — split those into separate people.
  * A separate named list of people (e.g. "Nursing Home: Joan Penn, ...", even when it follows the main list inside the same box) is its own group with label = its name as printed ("Nursing Home"). Do not leave its label inside a name.
- praise: praise reports — answered prayers and good news (e.g. a successful surgery, a new baby), usually under a heading like "Praise Reports", often in or near the prayer list box. One entry per report, each the full paragraph verbatim. Empty list if there are none.
- article: the minister's article (e.g. "A Word of Encouragement" or "From the Minister's Desk"). kicker is that label; title is the article's heading; subtitle is a distinct secondary line under the kicker or title (such as "The Family of God — Week 3"), else "". body is the full text, verbatim, with a blank line between paragraphs. Wrap lines that are printed bold in **double asterisks** and keep a bold heading and the lines under it together in one paragraph separated by single newlines.
- series: the sermon series schedule — a boxed or listed run of dates, each with a sermon title (e.g. "November 1 / The Father Who Never Gave Up- His Love For Us"), wherever it appears. title is the series name printed with it; tagline and verse only if printed, else "". weeks = every dated entry in order, title as printed; use the bulletin's year for the date.

Do NOT include the standing information that is the same every week: the "Welcome, Visitors" box, the sermon-notes lines, the QR code, contact details, the weekly meeting times, or the list of elders and staff. Ignore decorative images.`;

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
      output_config: { format: zodOutputFormat(Extracted), effort: "high" },
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
      praise: cleanSection("praise", parsed.praise),
      article: cleanSection("article", parsed.article),
      series: cleanSection("series", parsed.series),
    },
  };
}
