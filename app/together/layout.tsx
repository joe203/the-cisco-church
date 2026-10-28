import { SiteHeader } from "@/components/sections/SiteHeader";
import { TogetherFooter } from "@/components/together/TogetherFooter";

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
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <TogetherFooter />
    </div>
  );
}
