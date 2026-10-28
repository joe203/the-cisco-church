/** What a household sends from /directory, and the rules that clean it. */

export type Adult = { name: string; cell: string; email: string; birthday: string };
export type Child = { name: string; birthday: string };
export type DirectoryStatus = "no_changes" | "changed";

export type DirectorySubmission = {
  household_name: string;
  /** Who is filling the form out */
  submitted_by: string;
  status: DirectoryStatus;
  adults: Adult[];
  children: Child[];
  street: string;
  city_state_zip: string;
  home_phone: string;
  anniversary: string;
  privacy_notes: string;
};

export const MAX_PEOPLE = 12;

const text = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max) : "";

const oneLine = (v: unknown, max: number) => text(v, max).replace(/\s*\n\s*/g, " ");

/** "MM-DD" with a real month and day, or "" */
const monthDay = (v: unknown) => {
  const s = oneLine(v, 10);
  return /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(s) ? s : "";
};

/** "MM-DD" or "MM-DD-YYYY", or "" */
const dateWithYear = (v: unknown) => {
  const s = oneLine(v, 12);
  return /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(-(19|20)\d{2})?$/.test(s) ? s : "";
};

export const isEmail = (s: string) => /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(s);

const rows = (v: unknown): unknown[] => (Array.isArray(v) ? v.slice(0, MAX_PEOPLE) : []);
const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});

/** Returns the cleaned form, or a plain-language reason it can't be accepted. */
export function cleanSubmission(input: unknown): { ok: true; value: DirectorySubmission } | { ok: false; error: string } {
  const b = obj(input);

  const adults: Adult[] = rows(b.adults)
    .map((r) => {
      const a = obj(r);
      const email = oneLine(a.email, 160);
      return {
        name: oneLine(a.name, 120),
        cell: oneLine(a.cell, 40),
        email: isEmail(email) ? email : "",
        birthday: monthDay(a.birthday),
      };
    })
    .filter((a) => a.name || a.cell || a.email || a.birthday);

  const children: Child[] = rows(b.children)
    .map((r) => {
      const c = obj(r);
      return { name: oneLine(c.name, 120), birthday: monthDay(c.birthday) };
    })
    .filter((c) => c.name || c.birthday);

  const household_name = oneLine(b.household_name, 120);
  const submitted_by = oneLine(b.submitted_by, 120);
  const status = b.status === "no_changes" || b.status === "changed" ? b.status : null;
  if (!household_name) return { ok: false, error: "Add your family or household name." };
  if (!submitted_by) return { ok: false, error: "Add your name, so we know who sent this." };
  if (!status) return { ok: false, error: "Choose whether your information is correct or has changed." };

  // "No changes" sends only who they are (and anything to keep unpublished).
  const changed = status === "changed";
  const value: DirectorySubmission = {
    household_name,
    submitted_by,
    status,
    adults: changed ? adults : [],
    children: changed ? children : [],
    street: changed ? oneLine(b.street, 160) : "",
    city_state_zip: changed ? oneLine(b.city_state_zip, 120) : "",
    home_phone: changed ? oneLine(b.home_phone, 40) : "",
    anniversary: changed ? dateWithYear(b.anniversary) : "",
    privacy_notes: text(b.privacy_notes, 2000),
  };

  if (changed && !adults.some((a) => a.email || a.cell)) {
    return { ok: false, error: "Add at least one email address or cell number, so we can reach you." };
  }
  return { ok: true, value };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function prettyDate(v: string): string {
  const m = /^(\d\d)-(\d\d)(?:-(\d{4}))?$/.exec(v);
  if (!m) return "";
  return `${MONTHS[Number(m[1]) - 1]} ${Number(m[2])}${m[3] ? `, ${m[3]}` : ""}`;
}

export const MONTH_NAMES = MONTHS;

/** The plain-text email the office reads. */
export function submissionText(s: DirectorySubmission): string {
  const status =
    s.status === "no_changes"
      ? "Our information is correct as currently listed (no changes needed)."
      : "Our information has changed. Please update it.";

  const head = [
    `Family / household: ${s.household_name}`,
    `Sent by: ${s.submitted_by}`,
    `Directory status: ${status}`,
    "",
  ];
  if (s.status === "no_changes") {
    return [...head, "DO NOT PUBLISH IN THE DIRECTORY", s.privacy_notes || "(nothing)"].join("\n");
  }

  const lines: string[] = [...head, "PEOPLE"];
  s.adults.forEach((a) => {
    lines.push(`- ${a.name || "(no name)"}`);
    if (a.cell) lines.push(`    Cell: ${a.cell}`);
    if (a.email) lines.push(`    Email: ${a.email}`);
    if (a.birthday) lines.push(`    Birthday: ${prettyDate(a.birthday)}`);
  });
  lines.push("", "CHILDREN LIVING AT HOME");
  if (s.children.length === 0) lines.push("(none listed)");
  s.children.forEach((c) => lines.push(`- ${c.name || "(no name)"}${c.birthday ? ` — birthday ${prettyDate(c.birthday)}` : ""}`));
  lines.push(
    "",
    "ADDRESS",
    s.street || "(not given)",
    s.city_state_zip || "",
    "",
    `Home phone: ${s.home_phone || "(not given)"}`,
    `Anniversary: ${s.anniversary ? prettyDate(s.anniversary) : "(not given)"}`,
    "",
    "DO NOT PUBLISH IN THE DIRECTORY",
    s.privacy_notes || "(nothing — fine to publish everything above)",
  );
  return lines.filter((l, i, all) => !(l === "" && all[i - 1] === "")).join("\n");
}
