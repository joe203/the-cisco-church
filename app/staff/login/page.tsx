import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/staff/LoginForm";
import { getStaff } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>;
}) {
  if (await getStaff()) redirect("/staff");
  const { expired } = await searchParams;

  return (
    <main className="mx-auto max-w-md px-5 py-20">
      <p className="eyebrow text-teal">The Cisco Church</p>
      <h1 className="font-display mt-3 text-[2.4rem] leading-[1.05] font-extrabold tracking-[-0.03em]">
        Staff sign-in
      </h1>
      <p className="mt-3 mb-8 text-ink/70">
        For the minister and office staff. We’ll email you a link — no password to remember.
      </p>
      <LoginForm expired={expired === "1"} />
    </main>
  );
}
