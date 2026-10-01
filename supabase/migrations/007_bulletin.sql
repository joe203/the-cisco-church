-- 007_bulletin.sql — weekly bulletin + staff access
-- Self-contained: creates the `cisco` schema if it does not exist yet, so it
-- can be applied on its own (001–006 are not required for the bulletin).
-- Idempotent. Apply with:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 007_bulletin.sql
--
-- Instance-level steps (once): add `cisco` to PGRST_DB_SCHEMAS and recreate
-- PostgREST; add https://theciscochurch.org/** to ADDITIONAL_REDIRECT_URLS.
--
-- No trigger is attached to auth.users. Staff are added explicitly
-- (scripts/add-staff.mjs or /staff/people), so the app-tag gate is not needed.

begin;

create schema if not exists cisco;
grant usage on schema cisco to anon, authenticated, service_role;

-- ---------------------------------------------------------------- staff
-- Who may sign in to /staff, and what they may edit. A row here — not the
-- existence of an auth.users row — is what grants access, because the auth
-- users table is shared with every other app on the instance.
create table if not exists cisco.cisco_staff (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text,
  role        text not null check (role in ('admin', 'secretary')),
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- bulletins
-- One row per Sunday. The weekly pieces are jsonb documents validated in the
-- Route Handlers (lib/bulletin/schema.ts), so the editor can grow a field
-- without a migration.
create table if not exists cisco.cisco_bulletins (
  id               uuid primary key default gen_random_uuid(),
  bulletin_date    date unique not null,
  status           text not null default 'draft' check (status in ('draft', 'published')),
  order_of_service jsonb not null default '{}',
  announcements    jsonb not null default '[]',
  prayer_groups    jsonb not null default '[]',
  article          jsonb not null default '{}',
  series           jsonb not null default '{}',
  published_at     timestamptz,
  updated_by       uuid references auth.users(id) on delete set null,
  metadata         jsonb not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists cisco_bulletins_published_idx
  on cisco.cisco_bulletins (bulletin_date desc) where status = 'published';

create or replace function cisco.touch_bulletin()
returns trigger
language plpgsql
security definer
set search_path = cisco
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists cisco_bulletins_touch on cisco.cisco_bulletins;
create trigger cisco_bulletins_touch
  before update on cisco.cisco_bulletins
  for each row execute function cisco.touch_bulletin();

-- ---------------------------------------------------------------- RLS
alter table cisco.cisco_staff     enable row level security;
alter table cisco.cisco_bulletins enable row level security;

-- Anyone may read PUBLISHED bulletins. Drafts are invisible to the browser;
-- staff read drafts through Route Handlers / Server Components that verify
-- the signed-in user against cisco_staff and then use the service role.
drop policy if exists "cisco published bulletins read" on cisco.cisco_bulletins;
create policy "cisco published bulletins read" on cisco.cisco_bulletins
  for select to anon, authenticated using (status = 'published');

-- A signed-in user can see only their own staff row (so the UI can ask
-- "am I staff?"). Nobody can read the roster from the browser.
drop policy if exists "cisco staff read own" on cisco.cisco_staff;
create policy "cisco staff read own" on cisco.cisco_staff
  for select to authenticated using (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies exist for anon/authenticated: every write
-- goes through a Route Handler holding the service role key.

-- ---------------------------------------------------------------- grants
revoke all on cisco.cisco_staff, cisco.cisco_bulletins from anon, authenticated;
grant select on cisco.cisco_bulletins to anon, authenticated;
grant select on cisco.cisco_staff to authenticated;
grant all on cisco.cisco_staff, cisco.cisco_bulletins to service_role;

commit;
