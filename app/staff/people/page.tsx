import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PeopleManager } from "@/components/staff/PeopleManager";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { listStaff } from "@/lib/bulletin/staff-data";
import { getStaff } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "People" };
export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");
  if (staff.role !== "admin") redirect("/staff");
  const people = await listStaff();

  return (
    <>
      <StaffHeader staff={staff} />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <h1 className="font-display text-[2.4rem] leading-[1.05] font-extrabold tracking-[-0.03em]">People</h1>
        <p className="mt-2 mb-8 text-ink/72">Who can sign in to edit the bulletin.</p>
        <PeopleManager people={people} selfId={staff.user_id} />
      </main>
    </>
  );
}
