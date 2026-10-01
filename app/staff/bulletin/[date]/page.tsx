import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BulletinEditor } from "@/components/staff/BulletinEditor";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { isIsoDate } from "@/lib/bulletin/schema";
import { getBulletinForStaff } from "@/lib/bulletin/staff-data";
import { getStaff } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Edit bulletin" };
export const dynamic = "force-dynamic";

export default async function EditBulletinPage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ imported?: string }>;
}) {
  const { date } = await params;
  const { imported } = await searchParams;
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");
  if (!isIsoDate(date)) notFound();
  const bulletin = await getBulletinForStaff(date);
  if (!bulletin) notFound();

  return (
    <>
      <StaffHeader staff={staff} />
      <BulletinEditor initial={bulletin} role={staff.role} imported={imported === "1"} />
    </>
  );
}
