import { NextResponse } from "next/server";
import { adminEmails } from "@/lib/bulletin/inbound";
import { mailConfigured, sendMail } from "@/lib/mail";
import { readJson } from "@/lib/staff-api";
import { site } from "@/lib/site";
import { getMember, tooMany } from "@/lib/together/access";

const MAX = 4000;

type Body = { story?: unknown; dream?: unknown; concerns?: unknown; name?: unknown; website?: unknown };

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, max) : "";

/**
 * Members' story + ideas from /together. Emailed to the admins and the church
 * office; nothing is stored. Sent as a notice, so it never impersonates a member.
 */
export async function POST(request: Request) {
  if (!(await getMember())) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  if (tooMany(request, "ideas", 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many tries. Please wait a bit." }, { status: 429 });
  }
  const body = await readJson<Body>(request);
  if (!body) return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });

  // Hidden field only a bot fills in: pretend it worked.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const story = clean(body.story, MAX);
  const dream = clean(body.dream, MAX);
  const concerns = clean(body.concerns, MAX);
  const name = clean(body.name, 120);
  if (!story && !dream && !concerns) {
    return NextResponse.json({ error: "Write something in at least one box." }, { status: 400 });
  }
  if (!mailConfigured()) {
    return NextResponse.json({ error: "Sending isn’t available right now. Please tell Joe in person." }, { status: 503 });
  }

  const to = [...new Set([...(await adminEmails()), ...(site.email ? [site.email.toLowerCase()] : [])])];
  const text = [
    `From: ${name || "A member (name left blank)"}`,
    "",
    "A story about this church that means a lot:",
    story || "(left blank)",
    "",
    "What could we do better than 1,000 other churches? What could be us?",
    dream || "(left blank)",
    "",
    "What's on their heart or mind (concerns, questions, feedback):",
    concerns || "(left blank)",
  ].join("\n");

  const sent = await sendMail({ to, subject: `Where we're headed: ${concerns ? "feedback and concerns" : "a reply"} from ${name || "a member"}`, text });
  if (!sent) {
    return NextResponse.json({ error: "That didn’t send. Please try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
