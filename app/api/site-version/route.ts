import { NextResponse } from "next/server";
import { todayInCisco } from "@/lib/series";

export const dynamic = "force-dynamic";

/** Lets an open page notice a new release of the site or a new day (StayCurrent). */
export function GET() {
  return NextResponse.json(
    { build: process.env.BUILD_STAMP ?? "dev", day: todayInCisco() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
