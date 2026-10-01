// Give someone access to /staff.
//   node scripts/add-staff.mjs <email> <admin|secretary> ["Full Name"]
//
// Reads .env.local (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY), so it
// works from any machine that can run the site. The auth users table is shared
// with the other FiveSixteen apps: if the person already has a login for
// another app that account is reused, otherwise one is created (no password —
// they sign in at /staff/login by emailed link).
//
// Once Joe is in, further people can be added from /staff/people instead.

import { createClient } from "@supabase/supabase-js";

try {
  process.loadEnvFile(".env.local");
} catch {
  // fall through — the variables may already be in the environment
}

const [email, role, ...nameParts] = process.argv.slice(2);
const name = nameParts.join(" ").trim() || null;

if (!email || !["admin", "secretary"].includes(role)) {
  console.error('Usage: node scripts/add-staff.mjs <email> <admin|secretary> ["Full Name"]');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (.env.local).");
  process.exit(1);
}

const db = createClient(url, key, { db: { schema: "cisco" }, auth: { persistSession: false } });
const normalized = email.trim().toLowerCase();

let userId;
const created = await db.auth.admin.createUser({
  email: normalized,
  email_confirm: true,
  user_metadata: { app: "cisco" },
});
if (created.data.user) {
  userId = created.data.user.id;
  console.log(`Created login for ${normalized}`);
} else {
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  userId = data?.users.find((u) => u.email?.toLowerCase() === normalized)?.id;
  if (!userId) {
    console.error("Could not create or find that account:", created.error?.message);
    process.exit(1);
  }
  console.log(`Reusing the existing login for ${normalized}`);
}

const { error } = await db
  .from("cisco_staff")
  .upsert({ user_id: userId, email: normalized, name, role }, { onConflict: "user_id" });
if (error) {
  console.error("Could not save staff access:", error.message);
  process.exit(1);
}
console.log(`${normalized} is now ${role}${name ? ` (${name})` : ""}. They can sign in at /staff/login.`);
