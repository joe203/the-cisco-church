import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MailClient } from "@/components/staff/MailClient";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { canUseMail } from "@/lib/bulletin/schema";
import { listMail } from "@/lib/inbox/data";
import { getStaff } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Inbox" };
export const dynamic = "force-dynamic";

export default async function MailPage() {
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");
  // A signed-in staff member without access gets a 404 — the page doesn't announce itself.
  if (!canUseMail(staff.role)) notFound();

  const { messages, unread } = await listMail("all");

  return (
    <>
      <StaffHeader staff={staff} />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <p className="eyebrow text-teal">hello@theciscochurch.org</p>
        <h1 className="font-display mt-2 mb-8 text-[2.4rem] leading-[1.05] font-extrabold tracking-[-0.03em]">
          Inbox
        </h1>
        <MailClient initialMessages={messages} initialUnread={unread} />
      </main>
    </>
  );
}
