-- 023_directory.sql — church directory information updates (/directory)
-- Idempotent. Apply with:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 023_directory.sql
--
-- One row per form a household sends in. Each submission is kept as sent (it is
-- also emailed to the office), so the future online directory can be built from
-- these rows. Service-role only: RLS is on with no policies, so no browser can
-- read it — the /api/directory Route Handler is the only door.

begin;

create table if not exists cisco.cisco_directory_submissions (
  id             uuid primary key default gen_random_uuid(),
  household_name text not null,
  -- who filled the form out
  submitted_by   text,
  -- 'no_changes' | 'changed' | null (they did not say)
  status         text check (status is null or status in ('no_changes', 'changed')),
  -- [{ name, cell, email, birthday }]  birthday is "MM-DD" or ""
  adults         jsonb not null default '[]',
  -- [{ name, birthday }]
  children       jsonb not null default '[]',
  street         text,
  city_state_zip text,
  home_phone     text,
  -- "MM-DD" or "MM-DD-YYYY" or ""
  anniversary    text,
  -- Anything they do not want published in the directory
  privacy_notes  text,
  -- Set once the office has entered it into the directory
  reviewed_at    timestamptz,
  -- emailed to the office, user agent, anything the directory needs later
  metadata       jsonb not null default '{}',
  created_at     timestamptz not null default now()
);

create index if not exists cisco_directory_submissions_created_idx
  on cisco.cisco_directory_submissions (created_at desc);

alter table cisco.cisco_directory_submissions enable row level security;
revoke all on cisco.cisco_directory_submissions from anon, authenticated;
grant all on cisco.cisco_directory_submissions to service_role;

commit;
