// Load a bulletin from lib/bulletin/seed.ts into the database as a DRAFT.
//   node scripts/load-bulletin.mjs            (the bundled Oct 4, 2026 bulletin)
//
// For starting the first bulletin from existing content. Refuses to overwrite a
// bulletin that already exists. Publish it afterwards from /staff.

import { createClient } from "@supabase/supabase-js";
import { seedBulletin } from "../lib/bulletin/seed.ts";

try {
  process.loadEnvFile(".env.local");
} catch {
  // variables may already be in the environment
}

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  db: { schema: "cisco" },
  auth: { persistSession: false },
});

const b = seedBulletin;
const { error } = await db.from("cisco_bulletins").insert({
  bulletin_date: b.bulletin_date,
  status: "draft",
  order_of_service: b.order_of_service,
  announcements: b.announcements,
  prayer_groups: b.prayer_groups,
  article: b.article,
  series: b.series,
});

if (error) {
  console.error(error.code === "23505" ? `A bulletin for ${b.bulletin_date} already exists.` : error.message);
  process.exit(1);
}
console.log(`Loaded ${b.bulletin_date} as a draft. Open /staff/bulletin/${b.bulletin_date} to review and publish.`);
