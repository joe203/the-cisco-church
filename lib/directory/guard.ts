import { sendSms } from "@/lib/sms";

/**
 * Abuse brake for /directory. Every attempt is counted; if the form is hit far
 * faster than real families ever would, it pauses itself for an hour and (if
 * texting is on) sends the operator one fixed sentence. State is in memory on
 * purpose: a restart or deploy clears it, which is a fine way to reopen.
 */
const WINDOW_MS = 10 * 60_000;
const TRIP_AFTER = 40;
const PAUSE_MS = 60 * 60_000;

const TEXT = "The Cisco Church: the directory form paused itself for 1 hour after unusual traffic. It reopens on its own.";

type State = { hits: number[]; pausedUntil: number };
const g = globalThis as unknown as { __directoryGuard?: State };
const state = (): State => (g.__directoryGuard ??= { hits: [], pausedUntil: 0 });

/** When the pause ends, or null if the form is open. */
export function pausedUntil(): Date | null {
  const s = state();
  return s.pausedUntil > Date.now() ? new Date(s.pausedUntil) : null;
}

/** Count one attempt. Returns the pause end if this attempt tripped (or hit) the brake. */
export async function recordAttempt(): Promise<Date | null> {
  const s = state();
  const now = Date.now();
  if (s.pausedUntil > now) return new Date(s.pausedUntil);

  s.hits = s.hits.filter((t) => now - t < WINDOW_MS);
  s.hits.push(now);
  if (s.hits.length <= TRIP_AFTER) return null;

  s.pausedUntil = now + PAUSE_MS;
  s.hits = [];
  const phone = process.env.OPERATOR_PHONE;
  if (process.env.MAIL_ALERT_SMS_ENABLED === "true" && phone) await sendSms(phone, TEXT);
  return new Date(s.pausedUntil);
}

export function backAt(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" });
}
