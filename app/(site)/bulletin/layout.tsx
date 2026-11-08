import { BulletinLive } from "@/components/bulletin/BulletinLive";

export default function BulletinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BulletinLive />
      {children}
    </>
  );
}
