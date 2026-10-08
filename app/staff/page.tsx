import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImportBulletin } from "@/components/staff/ImportBulletin";
import { NewBulletin } from "@/components/staff/NewBulletin";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { importConfigured } from "@/lib/bulletin/import";
import { nextSunday } from "@/lib/bulletin/schema";
import { listBulletins, suggestNextDate } from "@/lib/bulletin/staff-data";
import { formatDate } from "@/lib/format";
import { authConfigured, getStaff } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function StaffHome() {
  if (!authConfigured()) {
    return (
      <main className="mx-auto max-w-xl px-5 py-20">
        <h1 className="font-display text-[2rem] font-extrabold">Staff area isn’t connected yet</h1>
        <p className="mt-3 text-ink/70">
          The database settings are missing from this server, so sign-in and editing are switched off.
        </p>
      </main>
    );
  }

  const staff = await getStaff();
  if (!staff) redirect("/staff/login");

  const bulletins = await listBulletins();
  const suggested = suggestNextDate(bulletins, nextSunday());

  return (
    <>
      <StaffHeader staff={staff} />
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <h1 className="font-display text-[2.4rem] leading-[1.05] font-extrabold tracking-[-0.03em]">
          Bulletins
        </h1>
        <p className="mt-2 text-ink/72">
          {staff.role === "admin"
            ? "You can edit every part of the bulletin and manage who has access."
            : "You can edit the order of service, announcements and prayer list."}
        </p>

        <p className="mt-6 rounded-xl bg-white px-5 py-3.5 text-[0.95rem] shadow-card">
          <strong className="font-bold">First time, or not sure what to do?</strong>{" "}
          <Link href="/staff/help" className="link-under font-semibold text-teal">
            Read the quick guide
          </Link>
          .
        </p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
          <ul className="divide-y rule-tint rounded-2xl bg-white shadow-panel-light">
            {bulletins.length === 0 && (
              <li className="p-6 text-ink/72">No bulletins yet. Start the first one.</li>
            )}
            {bulletins.map((b) => (
              <li key={b.bulletin_date}>
                <Link
                  href={`/staff/bulletin/${b.bulletin_date}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-opacity duration-300 hover:opacity-70"
                >
                  <span className="font-display text-[1.15rem] font-bold">{formatDate(b.bulletin_date)}</span>
                  <span
                    className={`eyebrow rounded-full px-3 py-1 ${
                      b.status === "published" ? "bg-teal text-white" : "bg-marigold/30 text-ink"
                    }`}
                  >
                    {b.status === "published" ? "Published" : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="order-first space-y-8 lg:order-none">
            <ImportBulletin enabled={importConfigured()} />
            <NewBulletin suggestedDate={suggested} />
          </div>
        </div>
      </main>
    </>
  );
}
