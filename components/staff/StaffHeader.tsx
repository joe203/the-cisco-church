import Link from "next/link";
import type { StaffMember } from "@/lib/bulletin/types";

export function StaffHeader({ staff }: { staff: StaffMember }) {
  return (
    <header className="border-b rule-tint bg-cloud">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4 sm:px-8">
        <nav className="flex items-center gap-6" aria-label="Staff">
          <Link href="/staff" className="font-display text-[1.1rem] font-extrabold tracking-[-0.01em] text-ink hover:opacity-75">
            Staff
          </Link>
          {staff.role === "admin" && (
            <Link href="/staff/people" className="eyebrow link-under text-teal hover:text-deepsea">
              People
            </Link>
          )}
          <Link href="/staff/help" className="eyebrow link-under text-teal hover:text-deepsea">
            Help
          </Link>
          <Link href="/bulletin" className="eyebrow link-under text-teal hover:text-deepsea">
            View site
          </Link>
        </nav>
        <form action="/auth/signout" method="post" className="flex items-center gap-4">
          <span className="text-[0.85rem] text-ink/60">{staff.name || staff.email}</span>
          <button type="submit" className="eyebrow link-under cursor-pointer text-coral hover:text-clay">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
