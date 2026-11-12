import { getServiceClient } from "@/lib/supabase/server";
import {
  AGE,
  AREAS,
  ATTENDANCE,
  STANCE,
  TENURE,
  TRADITION_GROUPS,
  traditionGroup,
  TRIES,
  type Feedback,
  type Opt,
  type Share,
} from "./schema";

export type FeedbackRow = Omit<Feedback, "keep_doing" | "idea" | "concern" | "suggestion" | "profile" | "share"> & {
  id: string;
  member_id: string | null;
  member_name: string;
  profile: Feedback["profile"];
  keep_doing: string | null;
  idea: string | null;
  concern: string | null;
  suggestion: string | null;
  share: Share;
  is_test: boolean;
  created_at: string;
};

const COLUMNS =
  "id, member_id, member_name, age_range, tradition, stance, growth, tenure, attendance, read_direction, value_ratings, about_note, areas, area_notes, noticed, keep_doing, tries, try_notes, idea, concern, suggestion, wants_talk, share, is_test, created_at";

type Stored = Omit<FeedbackRow, "profile"> & {
  age_range: string;
  tradition: number;
  stance: string;
  growth: string;
  tenure: string;
  attendance: string;
  read_direction: string;
  value_ratings: Record<string, string>;
  about_note: string | null;
};

/** Newest first. null = the table isn't reachable (not created yet, or no database). */
export async function listFeedback(): Promise<FeedbackRow[] | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db
    .from("cisco_feedback")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) return null;
  return ((data as Stored[] | null) ?? []).map(
    ({ age_range, tradition, stance, growth, tenure, attendance, read_direction, value_ratings, about_note, ...rest }) =>
      ({
        ...rest,
        profile: {
          age: age_range,
          tradition,
          stance,
          growth,
          tenure,
          attendance,
          read: read_direction,
          values: value_ratings ?? {},
          note: about_note ?? "",
        },
      }) as FeedbackRow,
  );
}

/**
 * Each person's most recent response only, so someone who sends the form every
 * week doesn't outweigh someone who sends it once. `rows` must be newest first.
 */
export function latestPerPerson(rows: FeedbackRow[]): FeedbackRow[] {
  const seen = new Set<string>();
  return rows.filter((r) => {
    if (r.is_test) return false;
    const who = r.member_id ?? r.member_name;
    if (seen.has(who)) return false;
    seen.add(who);
    return true;
  });
}

/** How many of `rows` gave each answer, in the order of `options`. */
export function count<T>(
  rows: T[],
  options: readonly Opt[],
  answer: (row: T) => string | undefined,
): { key: string; label: string; n: number }[] {
  return options.map((o) => ({ ...o, n: rows.filter((r) => answer(r) === o.key).length }));
}

// ── Looking at the answers from different sides ────────────────────────

/** The ways responses can be filtered and compared. The key is the URL parameter. */
export const DIMENSIONS = [
  { key: "age", label: "Age", options: AGE, of: (r: FeedbackRow) => r.profile.age },
  { key: "tradition", label: "Tradition scale", options: TRADITION_GROUPS, of: (r: FeedbackRow) => traditionGroup(r.profile.tradition) },
  { key: "stance", label: "Feelings about the changes", options: STANCE, of: (r: FeedbackRow) => r.profile.stance },
  { key: "tenure", label: "Time at the church", options: TENURE, of: (r: FeedbackRow) => r.profile.tenure },
  { key: "attendance", label: "Sunday attendance", options: ATTENDANCE, of: (r: FeedbackRow) => r.profile.attendance },
] as const;

export type DimensionKey = (typeof DIMENSIONS)[number]["key"];
export type Filters = Partial<Record<DimensionKey, string>>;

export function applyFilters(rows: FeedbackRow[], filters: Filters): FeedbackRow[] {
  return rows.filter((r) => DIMENSIONS.every((d) => !filters[d.key] || d.of(r) === filters[d.key]));
}

const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : null);

export type GroupSummary = {
  key: string;
  label: string;
  people: number;
  /** average on the 1–10 tradition scale */
  tradition: number | null;
  /** % who feel good about the changes (hoping for them, or on board) */
  welcomeChange: number | null;
  /** % of "what you're seeing" answers that were "Better" */
  seeingBetter: number | null;
  /** % of "things we might try" answers that were "Let's try it" or "Open to it" */
  readyToTry: number | null;
  /** % of value answers that were "All in" */
  valuesAllIn: number | null;
};

export function summarize(key: string, label: string, rows: FeedbackRow[]): GroupSummary {
  const areas = rows.flatMap((r) => AREAS.map((a) => r.areas?.[a.key]).filter(Boolean));
  const tries = rows.flatMap((r) => TRIES.map((t) => r.tries?.[t.key]).filter(Boolean));
  const values = rows.flatMap((r) => Object.values(r.profile.values ?? {}));
  return {
    key,
    label,
    people: rows.length,
    tradition: rows.length ? Math.round((rows.reduce((s, r) => s + r.profile.tradition, 0) / rows.length) * 10) / 10 : null,
    welcomeChange: pct(rows.filter((r) => r.profile.stance === "longing" || r.profile.stance === "on_board").length, rows.length),
    seeingBetter: pct(areas.filter((a) => a === "better").length, areas.length),
    readyToTry: pct(tries.filter((t) => t === "yes" || t === "open").length, tries.length),
    valuesAllIn: pct(values.filter((v) => v === "all_in").length, values.length),
  };
}

/** One summary per group of a dimension, plus everyone, over `rows` (already filtered). */
export function compare(rows: FeedbackRow[], by: DimensionKey): GroupSummary[] {
  const d = DIMENSIONS.find((x) => x.key === by) ?? DIMENSIONS[0];
  return [
    ...d.options.map((o) => summarize(o.key, o.label, rows.filter((r) => d.of(r) === o.key))),
    summarize("all", "Everyone shown", rows),
  ];
}
