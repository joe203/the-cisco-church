import { NextResponse } from "next/server";
import { adminEmails } from "@/lib/bulletin/inbound";
import { mailConfigured, sendMail } from "@/lib/mail";
import { site } from "@/lib/site";
import { readJson } from "@/lib/staff-api";
import { tooMany } from "@/lib/together/access";

type Body = { name?: unknown; phone?: unknown; email?: unknown; website?: unknown };
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** POST { name, phone, email } — someone not on the list asks to be added. Emailed to the admins and the office. */
export async function POST(request: Request) {
  if (tooMany(request, "request", 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  const body = await readJson<Body>(request);
  if (!body) return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);
  if (!name || (!phone && !email)) {
    return NextResponse.json({ error: "Add your name and a phone number or email." }, { status: 400 });
  }
  if (!mailConfigured()) {
    return NextResponse.json(
      { error: "Sending isn’t available right now. Please tell Joe or the church office." },
      { status: 503 },
    );
  }

  const to = [...new Set([...(await adminEmails()), ...(site.email ? [site.email.toLowerCase()] : [])])];
  const text = [
    `${name} asked to be added to the page about where the church is headed.`,
    "",
    `Name: ${name}`,
    `Cell number: ${phone || "(not given)"}`,
    `Email: ${email || "(not given)"}`,
    "",
    "To let them in, add them at https://theciscochurch.org/staff/together",
  ].join("\n");

  const sent = await sendMail({ to, subject: `Access request: ${name}`, text });
  if (!sent) return NextResponse.json({ error: "That didn’t send. Please try again in a minute." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
