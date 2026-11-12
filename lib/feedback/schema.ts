/**
 * The "How's it going?" feedback form at /together/feedback. One place for the
 * questions, the allowed answers, and the rules a submission must pass — shared
 * by the form, the Route Handler and the staff page.
 *
 * Four parts, in this order on purpose:
 *   1. A little about you     — read the rest in light of this
 *   2. What you're seeing     — changes already made
 *   3. Things we might try    — ideas not started yet
 *   4. Anything else          — a private concern, permission to share
 */

import { ALL_VALUES, type ValueKey } from "@/lib/together/values";

export type Opt = { readonly key: string; readonly label: string };

// ── Part 1: a little about you ─────────────────────────────────────────

export const READ = [
  { key: "closely", label: "Yes, closely" },
  { key: "skimmed", label: "I skimmed it" },
  { key: "not_yet", label: "Not yet" },
] as const;

export const VALUE_CHOICES = [
  { key: "all_in", label: "All in" },
  { key: "mostly", label: "Mostly" },
  { key: "thinking", label: "Still thinking" },
  { key: "not_really", label: "Not really" },
] as const;

/** Roughly how people meet change, from eager to reluctant. Order = that scale. */
export const STANCE = [
  { key: "longing", label: "I’ve been hoping for changes like these for a long time." },
  { key: "on_board", label: "I’m on board, and I’m learning as we go." },
  { key: "waiting", label: "I’m open, but I’m waiting to see how it goes." },
  { key: "struggling", label: "Honestly, some of this is hard for me." },
  { key: "prefer_past", label: "I’d rather we kept things the way they’ve been." },
] as const;

/**
 * A 1–10 scale between two views of how a Church of Christ keeps and reaches
 * people. Both ends are worded so a faithful person could hold either.
 */
export const TRADITION_LEFT =
  "Keep to our traditional ways. Doing things the way Churches of Christ always have is how we keep people. When people don’t come, it’s because fewer are looking for the gospel.";
export const TRADITION_RIGHT =
  "Try new ideas. It’s time to be more creative, within our Church of Christ beliefs, about how we reach people and keep them.";
export const TRADITION = Array.from({ length: 10 }, (_, i) => ({ key: String(i + 1), label: String(i + 1) }));

export const GROWTH = [
  { key: "prayer", label: "That’s my prayer" },
  { key: "glad", label: "Glad, though it’d take getting used to" },
  { key: "unsure", label: "I’m not sure" },
  { key: "as_is", label: "I like us the size we are" },
] as const;

export const AGE = [
  { key: "under25", label: "Under 25" },
  { key: "25_39", label: "25–39" },
  { key: "40_54", label: "40–54" },
  { key: "55_69", label: "55–69" },
  { key: "70plus", label: "70 or older" },
] as const;

/** The tradition scale folded into three groups, for comparing answers. */
export const TRADITION_GROUPS = [
  { key: "traditional", label: "Traditional (1–3)", min: 1, max: 3 },
  { key: "middle", label: "In the middle (4–7)", min: 4, max: 7 },
  { key: "new_ideas", label: "New ideas (8–10)", min: 8, max: 10 },
] as const;

export function traditionGroup(n: number | null | undefined): string | undefined {
  return TRADITION_GROUPS.find((g) => n != null && n >= g.min && n <= g.max)?.key;
}

export const TENURE = [
  { key: "lt1", label: "Less than a year" },
  { key: "1_5", label: "1–5 years" },
  { key: "6_20", label: "6–20 years" },
  { key: "20plus", label: "Over 20 years" },
] as const;

export const ATTENDANCE = [
  { key: "most", label: "Most Sundays" },
  { key: "monthly", label: "A couple times a month" },
  { key: "sometimes", label: "Now and then" },
] as const;

// ── Part 2: what you're seeing (changes already made) ──────────────────

export const AREAS = [
  { key: "worship", label: "Sunday morning worship", hint: "Singing, energy, the feel of the hour" },
  { key: "welcome", label: "How welcome guests feel", hint: "Greeting, helping newcomers find their way" },
  { key: "teaching", label: "Sermons and Bible classes", hint: "Lessons you can use during the week" },
  { key: "ideas", label: "Ideas are welcome", hint: "Talking about ministries, trying new things" },
  { key: "family", label: "How we treat each other", hint: "Grace, encouragement, time together" },
] as const;

export const AREA_CHOICES = [
  { key: "better", label: "Better" },
  { key: "same", label: "Same" },
  { key: "unsure", label: "Too soon" },
] as const;

/** The optional follow-up under an area, worded for the answer they gave. */
export const AREA_PROMPT: Record<AreaChoice, string> = {
  better: "What made the difference?",
  same: "What would make it better?",
  unsure: "What’s giving you pause?",
};

// ── Part 3: things we might try (not started yet) ──────────────────────

/**
 * TODO(Joe): these four come from the /together page. Replace or add your own —
 * each needs a short key (never change a key once responses come in), a name,
 * and one line saying what it would look like.
 */
export const TRIES = [
  {
    key: "lords_supper_prayer",
    label: "Praying together during the Lord’s Supper",
    hint: "A few minutes to pray in small groups with the people around you.",
  },
  {
    key: "wednesday_meal",
    label: "A family meal on Wednesday nights",
    hint: "Eat together, then a Bible study where everyone gets to talk.",
  },
  {
    key: "socials",
    label: "Coffee nights and ice cream socials",
    hint: "Easy, seasonal evenings built for inviting a friend.",
  },
  {
    key: "front_refresh",
    label: "Refreshing the front of our worship area",
    hint: "A screen, warm lighting, and less clutter, so nothing gets in the way.",
  },
] as const;

export const TRY_CHOICES = [
  { key: "yes", label: "Let’s try it" },
  { key: "open", label: "Open to it" },
  { key: "unsure", label: "Not sure" },
  { key: "rather_not", label: "Rather not" },
] as const;

// ── Part 4 ─────────────────────────────────────────────────────────────

export const SHARE = [
  { key: "first_name", label: "Yes, with my first name" },
  { key: "anonymous", label: "Yes, but leave my name off" },
  { key: "private", label: "No, keep it between us" },
] as const;

// ── Types ──────────────────────────────────────────────────────────────

type KeyOf<T extends readonly Opt[]> = T[number]["key"];
export type AreaKey = (typeof AREAS)[number]["key"];
export type AreaChoice = KeyOf<typeof AREA_CHOICES>;
export type TryKey = (typeof TRIES)[number]["key"];
export type TryChoice = KeyOf<typeof TRY_CHOICES>;
export type ValueChoice = KeyOf<typeof VALUE_CHOICES>;
export type Share = KeyOf<typeof SHARE>;
export type Stance = KeyOf<typeof STANCE>;

export type Profile = {
  read: KeyOf<typeof READ>;
  values: Record<ValueKey, ValueChoice>;
  stance: Stance;
  /** 1 = keep to traditional ways … 10 = try new ideas */
  tradition: number;
  growth: KeyOf<typeof GROWTH>;
  age: KeyOf<typeof AGE>;
  tenure: KeyOf<typeof TENURE>;
  attendance: KeyOf<typeof ATTENDANCE>;
  note: string;
};

export type Feedback = {
  profile: Profile;
  areas: Partial<Record<AreaKey, AreaChoice>>;
  area_notes: Partial<Record<AreaKey, string>>;
  noticed: string;
  keep_doing: string;
  tries: Partial<Record<TryKey, TryChoice>>;
  try_notes: Partial<Record<TryKey, string>>;
  idea: string;
  concern: string;
  suggestion: string;
  wants_talk: boolean;
  share: Share;
};

// ── Cleaning ───────────────────────────────────────────────────────────

const LONG = 4000;
const NOTE = 1500;
/** "It's better" isn't feedback; a sentence is. */
export const MIN_NOTICED = 20;

const text = (v: unknown, max = LONG) =>
  typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, max) : "";

function pick<T extends readonly Opt[]>(list: T, v: unknown): KeyOf<T> | null {
  return list.some((o) => o.key === v) ? (v as KeyOf<T>) : null;
}

const obj = (v: unknown) => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

type Result = { ok: true; value: Feedback } | { ok: false; error: string };

export function cleanFeedback(body: Record<string, unknown>): Result {
  const p = obj(body.profile);
  const rawValues = obj(p.values);
  const values = {} as Record<ValueKey, ValueChoice>;
  for (const v of ALL_VALUES) {
    const c = pick(VALUE_CHOICES, rawValues[v.key]);
    if (!c) return { ok: false, error: `Tell us how “${v.name}” sits with you.` };
    values[v.key] = c;
  }
  const read = pick(READ, p.read);
  const stance = pick(STANCE, p.stance);
  const growth = pick(GROWTH, p.growth);
  const tradition = Number(p.tradition);
  const age = pick(AGE, p.age);
  const tenure = pick(TENURE, p.tenure);
  const attendance = pick(ATTENDANCE, p.attendance);
  if (!read || !stance || !growth || !age || !tenure || !attendance || !Number.isInteger(tradition) || tradition < 1 || tradition > 10) {
    return { ok: false, error: "Answer each question in “A little about you.”" };
  }

  const rawAreas = obj(body.areas);
  const rawAreaNotes = obj(body.area_notes);
  const areas: Feedback["areas"] = {};
  const area_notes: Feedback["area_notes"] = {};
  for (const a of AREAS) {
    const c = pick(AREA_CHOICES, rawAreas[a.key]);
    if (!c) return { ok: false, error: `Tell us what you’re seeing in “${a.label}.”` };
    areas[a.key] = c;
    const note = text(rawAreaNotes[a.key], NOTE);
    if (note) area_notes[a.key] = note;
  }

  const rawTries = obj(body.tries);
  const rawTryNotes = obj(body.try_notes);
  const tries: Feedback["tries"] = {};
  const try_notes: Feedback["try_notes"] = {};
  for (const t of TRIES) {
    const c = pick(TRY_CHOICES, rawTries[t.key]);
    if (!c) return { ok: false, error: `Tell us how you feel about “${t.label}.”` };
    tries[t.key] = c;
    const note = text(rawTryNotes[t.key], NOTE);
    if (note) try_notes[t.key] = note;
  }

  const share = pick(SHARE, body.share);
  const value: Feedback = {
    profile: { read, values, stance, tradition, growth, age, tenure, attendance, note: text(p.note, NOTE) },
    areas,
    area_notes,
    noticed: text(body.noticed),
    keep_doing: text(body.keep_doing),
    tries,
    try_notes,
    idea: text(body.idea),
    concern: text(body.concern),
    suggestion: text(body.suggestion),
    wants_talk: body.wants_talk === true,
    share: share ?? "private",
  };

  if (value.noticed.length < MIN_NOTICED) {
    return { ok: false, error: "Tell us a little more about what you’ve seen — a sentence or two." };
  }
  if (value.concern && !value.suggestion) {
    return { ok: false, error: "You shared a concern. Add what you’d suggest we do about it — even a small idea helps." };
  }
  if (!share) return { ok: false, error: "Let us know whether we may share what you wrote." };
  return { ok: true, value };
}

// ── Labels + the admins' email ─────────────────────────────────────────

export function labelOf(list: readonly Opt[], key: string | null | undefined): string {
  return list.find((o) => o.key === key)?.label ?? "";
}

export function feedbackText(name: string, f: Feedback): string {
  const p = f.profile;
  const lines = [
    `From: ${name}`,
    `May we share it? ${labelOf(SHARE, f.share)}`,
    "",
    "ABOUT THEM",
    `  Change: ${labelOf(STANCE, p.stance)}`,
    `  Tradition scale: ${p.tradition} of 10 (1 = keep to traditional ways, 10 = try new ideas)`,
    `  If Sundays doubled: ${labelOf(GROWTH, p.growth)}`,
    `  Read "Where we're headed": ${labelOf(READ, p.read)}`,
    `  Age: ${labelOf(AGE, p.age)}`,
    `  Part of the church: ${labelOf(TENURE, p.tenure)}; ${labelOf(ATTENDANCE, p.attendance)}`,
    "  Our values:",
    ...ALL_VALUES.map((v) => `    ${v.name}: ${labelOf(VALUE_CHOICES, p.values[v.key])}`),
    ...(p.note ? ["  In their words:", `    ${p.note}`] : []),
    "",
    "WHAT THEY'RE SEEING",
    ...(Object.keys(f.areas).length
      ? AREAS.filter((a) => f.areas[a.key]).flatMap((a) => [
          `  ${a.label}: ${labelOf(AREA_CHOICES, f.areas[a.key])}`,
          ...(f.area_notes[a.key] ? [`    "${f.area_notes[a.key]}"`] : []),
        ])
      : ["  (skipped)"]),
    "",
    "What tells them we're moving forward:",
    f.noticed,
    "",
    "Keep doing / do more of:",
    f.keep_doing || "(left blank)",
    "",
    "THINGS WE MIGHT TRY",
    ...(Object.keys(f.tries).length
      ? TRIES.filter((t) => f.tries[t.key]).flatMap((t) => [
          `  ${t.label}: ${labelOf(TRY_CHOICES, f.tries[t.key])}`,
          ...(f.try_notes[t.key] ? [`    "${f.try_notes[t.key]}"`] : []),
        ])
      : ["  (skipped)"]),
    "",
    "Their own idea:",
    f.idea || "(left blank)",
  ];
  if (f.concern) {
    lines.push(
      "",
      "A CONCERN (private — never shared)",
      f.concern,
      "",
      "What they'd suggest:",
      f.suggestion,
      "",
      f.wants_talk ? "They'd like to talk about it in person." : "They didn't ask to talk in person.",
    );
  }
  return lines.join("\n");
}
