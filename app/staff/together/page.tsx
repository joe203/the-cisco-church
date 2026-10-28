import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { TogetherManager } from "@/components/staff/TogetherManager";
import { getStaff } from "@/lib/supabase/auth";
import { listMembers } from "@/lib/together/members";

export const metadata: Metadata = { title: "Members page" };
export const dynamic = "force-dynamic";

export default async function TogetherStaffPage() {
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");
  const members = await listMembers();

  return (
    <>
      <StaffHeader staff={staff} />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <h1 className="font-display text-[2.4rem] leading-[1.05] font-extrabold tracking-[-0.03em]">
          Members page
        </h1>
        <p className="mt-2 mb-8 text-ink/72">
          Who can open <span className="font-semibold">theciscochurch.org/together</span>. They enter their
          cell number or email; numbers match however they type them.
        </p>
        <TogetherManager members={members} />
      </main>
    </>
  );
}
