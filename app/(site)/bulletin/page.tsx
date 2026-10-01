import type { Metadata } from "next";
import { BulletinView } from "@/components/bulletin/BulletinView";
import { getCurrentBulletin, messageTitle } from "@/lib/bulletin/data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const bulletin = await getCurrentBulletin();
  const message = messageTitle(bulletin);
  return {
    title: "Bulletin",
    description: message
      ? `This Sunday at the Cisco Church: “${message}.” Order of service, announcements, and the prayer list.`
      : "This week at the Cisco Church — order of service, announcements, and the prayer list.",
  };
}

export default async function BulletinPage() {
  const bulletin = await getCurrentBulletin();
  return <BulletinView bulletin={bulletin} />;
}
