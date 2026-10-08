import { canUseMail } from "@/lib/bulletin/schema";
import type { StaffMember } from "@/lib/bulletin/types";
import { unreadCount } from "@/lib/inbox/data";
import { StaffNav } from "./StaffNav";

export async function StaffHeader({ staff }: { staff: StaffMember }) {
  const mail = canUseMail(staff.role);
  const unread = mail ? await unreadCount() : 0;

  return (
    <header className="border-b rule-tint bg-cloud">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4 sm:px-8">
        <StaffNav inbox={mail} people={staff.role === "admin"} unread={unread} />
        <form action="/auth/signout" method="post" className="flex items-center gap-4">
          <span className="text-[0.85rem] text-ink/72">{staff.name || staff.email}</span>
          <button type="submit" className="eyebrow link-under cursor-pointer text-coral hover:text-clay">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
