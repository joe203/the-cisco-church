import { NextResponse } from "next/server";
import { LINK_LIFE, makeLinkToken } from "@/lib/feedback/access";
import { mailConfigured, sendMailOne } from "@/lib/mail";
import { readJson, siteOrigin } from "@/lib/staff-api";
import { findMember, normalizeEmail, tooMany } from "@/lib/together/access";

/**
 * POST { email } — email a sign-in link for /together/feedback to a member on
 * the list. Only ever sends to the address already on file, never to one typed
 * in that isn't, so the form can't be used to mail strangers.
 */
export async function POST(request: Request) {
  if (tooMany(request, "feedback-link", 6, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many tries. Please wait a few minutes." }, { status: 429 });
  }
  const body = await readJson<{ email?: unknown; website?: unknown }>(request);
  if (typeof body?.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });

  const email = typeof body?.email === "string" ? normalizeEmail(body.email.slice(0, 200)) : null;
  if (!email) return NextResponse.json({ error: "That doesn’t look like an email address. Please check it." }, { status: 400 });

  const member = await findMember(email);
  if (!member?.email) return NextResponse.json({ found: false }, { status: 404 });

  const token = makeLinkToken(member.id);
  if (!token || !mailConfigured()) {
    return NextResponse.json({ error: "Sign-in emails aren’t working right now. Please tell Joe or the church office." }, { status: 503 });
  }

  const first = member.name.trim().split(/\s+/)[0] || "there";
  const url = `${siteOrigin(request)}/together/feedback/enter?t=${encodeURIComponent(token)}`;
  const sent = await sendMailOne({
    to: member.email,
    subject: "Your link to “How’s it going?”",
    text: [
      `Hi ${first},`,
      "",
      "Here’s your link to the church feedback page. Tap it to sign in:",
      "",
      url,
      "",
      `The link works for ${LINK_LIFE}, on this phone or computer or any other.`,
      "If you didn’t ask for it, you can ignore this email.",
      "",
      "The Cisco Church",
    ].join("\n"),
  });
  if (!sent.ok) return NextResponse.json({ error: "That didn’t send. Please try again in a minute." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
