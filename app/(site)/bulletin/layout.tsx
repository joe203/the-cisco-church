import { LiveRefresh } from "@/components/sections/LiveRefresh";

export default function BulletinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LiveRefresh tables={["cisco_bulletins"]} />
      {children}
    </>
  );
}
