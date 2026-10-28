-- 022_together_access.sql — who may open the members-only /together page
-- Idempotent. Apply with:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 022_together_access.sql
--
-- One row per member. They sign in with their email (exact match) or cell
-- number (stored as the 10 digits, no country code). Service-role only: RLS is
-- on with no policies, so no browser can read the list.

begin;

create table if not exists cisco.cisco_together_members (
  id           uuid primary key default gen_random_uuid(),
  name         text not null default '',
  email        text,
  phone        text,
  last_seen_at timestamptz,
  metadata     jsonb not null default '{}',
  created_at   timestamptz not null default now(),
  constraint cisco_together_members_contact check (email is not null or phone is not null),
  constraint cisco_together_members_email_lower check (email is null or email = lower(email)),
  constraint cisco_together_members_phone_digits check (phone is null or phone ~ '^[0-9]{10}$')
);

create unique index if not exists cisco_together_members_email_key
  on cisco.cisco_together_members (email) where email is not null;
create unique index if not exists cisco_together_members_phone_key
  on cisco.cisco_together_members (phone) where phone is not null;

alter table cisco.cisco_together_members enable row level security;
revoke all on cisco.cisco_together_members from anon, authenticated;
grant all on cisco.cisco_together_members to service_role;

commit;
