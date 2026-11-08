import { SiteHeader } from "@/components/sections/SiteHeader";
import { StayCurrent } from "@/components/sections/StayCurrent";
import { TogetherFooter } from "@/components/together/TogetherFooter";
import { todayInCisco } from "@/lib/series";

export const dynamic = "force-dynamic";

/**
 * The members-only pages carry the new schedule in their footer instead of the
 * public footer, so they sit outside the (site) group.
 */
export default function TogetherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <StayCurrent build={process.env.BUILD_STAMP ?? "dev"} day={todayInCisco()} />
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <TogetherFooter />
    </div>
  );
}
