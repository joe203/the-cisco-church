import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Staff", template: "%s — Staff" },
  robots: { index: false, follow: false },
};

export default function StaffLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh bg-sand text-ink">{children}</div>;
}
