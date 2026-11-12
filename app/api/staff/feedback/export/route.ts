import { NextResponse } from "next/server";
import { listFeedback } from "@/lib/feedback/data";
import {
  AGE,
  AREA_CHOICES,
  AREAS,
  ATTENDANCE,
  GROWTH,
  labelOf,
  READ,
  SHARE,
  STANCE,
  TENURE,
  traditionGroup,
  TRADITION_GROUPS,
  TRIES,
  TRY_CHOICES,
  VALUE_CHOICES,
} from "@/lib/feedback/schema";
import { getStaff } from "@/lib/supabase/auth";
import { ALL_VALUES } from "@/lib/together/values";

/** A spreadsheet cell: quoted, and never read as a formula. */
function cell(v: unknown): string {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** GET — every response as a CSV that opens in Excel or Google Sheets. Admins only. */
export async function GET() {
  const staff = await getStaff();
  if (!staff || staff.role !== "admin") return NextResponse.json({ error: "Not allowed." }, { status: 403 });

  const rows = await listFeedback();
  if (!rows) return NextResponse.json({ error: "The feedback table isn’t set up yet." }, { status: 503 });

  const header = [
    "Date",
    "Name",
    "Age",
    "Tradition (1-10)",
    "Tradition group",
    "Feelings about the changes",
    "If Sundays doubled",
    "Time at the church",
    "Sunday attendance",
    "Read Where we're headed",
    ...ALL_VALUES.map((v) => `Value: ${v.name}`),
    "About them (their words)",
    ...AREAS.flatMap((a) => [`Seeing: ${a.label}`, `Seeing: ${a.label} (note)`]),
    "What tells them we're moving forward",
    "Keep doing",
    ...TRIES.flatMap((t) => [`Try: ${t.label}`, `Try: ${t.label} (note)`]),
    "Their own idea",
    "Concern (private)",
    "Their suggestion",
    "Wants to talk",
    "May we share",
    "Test response",
  ];

  const lines = rows.map((r) => {
    const p = r.profile;
    return [
      new Date(r.created_at).toLocaleDateString("en-US", { timeZone: "America/Chicago" }),
      r.member_name,
      labelOf(AGE, p.age),
      p.tradition,
      labelOf(TRADITION_GROUPS, traditionGroup(p.tradition)),
      labelOf(STANCE, p.stance),
      labelOf(GROWTH, p.growth),
      labelOf(TENURE, p.tenure),
      labelOf(ATTENDANCE, p.attendance),
      labelOf(READ, p.read),
      ...ALL_VALUES.map((v) => labelOf(VALUE_CHOICES, p.values?.[v.key])),
      p.note,
      ...AREAS.flatMap((a) => [labelOf(AREA_CHOICES, r.areas?.[a.key]), r.area_notes?.[a.key] ?? ""]),
      r.noticed,
      r.keep_doing,
      ...TRIES.flatMap((t) => [labelOf(TRY_CHOICES, r.tries?.[t.key]), r.try_notes?.[t.key] ?? ""]),
      r.idea,
      r.concern,
      r.suggestion,
      r.wants_talk ? "Yes" : "",
      labelOf(SHARE, r.share),
      r.is_test ? "Yes" : "",
    ]
      .map(cell)
      .join(",");
  });

  const csv = `﻿${[header.map(cell).join(","), ...lines].join("\r\n")}`;
  const stamp = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cisco-feedback-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
