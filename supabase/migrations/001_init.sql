-- 001_init.sql — TheCiscoChurch.org schema
-- Shared FiveSixteen Supabase instance: this app owns the `cisco` schema.
-- Idempotent. Apply with:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 001_init.sql
--
-- DEPLOY STEP (once, instance-level): add `cisco` to PGRST_DB_SCHEMAS in the
-- Supabase docker .env and restart PostgREST, or the API cannot reach this
-- schema at all.

begin;

create schema if not exists cisco;
grant usage on schema cisco to anon, authenticated, service_role;

-- ---------------------------------------------------------------- speakers
create table if not exists cisco.cisco_speakers (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  photo_url   text,
  tags        text[] not null default '{}',
  bio         text,
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- sermons
create table if not exists cisco.cisco_sermons (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  thesis         text,
  scripture_ref  text,
  scripture_text text,
  sermon_date    date not null,
  artwork_url    text,
  summary        text,
  youtube_url    text,
  podcast_url    text,
  guide_url      text,
  pdf_url        text,
  speaker_id     uuid references cisco.cisco_speakers(id) on delete set null,
  is_featured    boolean not null default false,
  metadata       jsonb not null default '{}',
  created_at     timestamptz not null default now()
);

create index if not exists cisco_sermons_date_idx
  on cisco.cisco_sermons (sermon_date desc);

-- ---------------------------------------------------------------- points
create table if not exists cisco.cisco_sermon_points (
  id         uuid primary key default gen_random_uuid(),
  sermon_id  uuid not null references cisco.cisco_sermons(id) on delete cascade,
  position   int not null,
  title      text not null,
  label      text,
  body       text,
  metadata   jsonb not null default '{}',
  unique (sermon_id, position)
);

-- ---------------------------------------------------------------- decks
create table if not exists cisco.cisco_decks (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  sermon_id  uuid references cisco.cisco_sermons(id) on delete set null,
  metadata   jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- slides
create table if not exists cisco.cisco_slides (
  id        uuid primary key default gen_random_uuid(),
  deck_id   uuid not null references cisco.cisco_decks(id) on delete cascade,
  position  int not null,
  html      text not null,
  notes     text,               -- presenter notes: NEVER granted to anon
  metadata  jsonb not null default '{}',
  unique (deck_id, position)
);

-- ---------------------------------------------------------------- live cursor
create table if not exists cisco.cisco_deck_state (
  deck_id       uuid primary key references cisco.cisco_decks(id) on delete cascade,
  current_slide int not null default 1,
  is_live       boolean not null default false,
  updated_at    timestamptz not null default now()
);

create or replace function cisco.touch_deck_state()
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

drop trigger if exists cisco_deck_state_touch on cisco.cisco_deck_state;
create trigger cisco_deck_state_touch
  before update on cisco.cisco_deck_state
  for each row execute function cisco.touch_deck_state();

-- ---------------------------------------------------------------- RLS
-- Security model: the browser (anon) can only read. Every write goes through
-- a Next.js Route Handler holding the service role key, gated by PRESENTER_KEY.

alter table cisco.cisco_speakers      enable row level security;
alter table cisco.cisco_sermons       enable row level security;
alter table cisco.cisco_sermon_points enable row level security;
alter table cisco.cisco_decks         enable row level security;
alter table cisco.cisco_slides        enable row level security;
alter table cisco.cisco_deck_state    enable row level security;

drop policy if exists "cisco public read" on cisco.cisco_speakers;
create policy "cisco public read" on cisco.cisco_speakers
  for select to anon, authenticated using (true);

drop policy if exists "cisco public read" on cisco.cisco_sermons;
create policy "cisco public read" on cisco.cisco_sermons
  for select to anon, authenticated using (true);

drop policy if exists "cisco public read" on cisco.cisco_sermon_points;
create policy "cisco public read" on cisco.cisco_sermon_points
  for select to anon, authenticated using (true);

drop policy if exists "cisco public read" on cisco.cisco_decks;
create policy "cisco public read" on cisco.cisco_decks
  for select to anon, authenticated using (true);

drop policy if exists "cisco public read" on cisco.cisco_slides;
create policy "cisco public read" on cisco.cisco_slides
  for select to anon, authenticated using (true);

drop policy if exists "cisco public read" on cisco.cisco_deck_state;
create policy "cisco public read" on cisco.cisco_deck_state
  for select to anon, authenticated using (true);

-- No INSERT/UPDATE/DELETE policies exist for anon/authenticated: RLS therefore
-- denies all writes from the browser. service_role bypasses RLS by design.

-- ---------------------------------------------------------------- grants
-- Column-level grant on cisco_slides deliberately EXCLUDES `notes` — anon
-- clients must select explicit columns (never `*`) on this table.

grant select on cisco.cisco_speakers,
                cisco.cisco_sermons,
                cisco.cisco_sermon_points,
                cisco.cisco_decks,
                cisco.cisco_deck_state
  to anon, authenticated;

revoke all on cisco.cisco_slides from anon, authenticated;
grant select (id, deck_id, position, html)
  on cisco.cisco_slides to anon, authenticated;

grant all on all tables in schema cisco to service_role;

-- ---------------------------------------------------------------- realtime
alter table cisco.cisco_deck_state replica identity full;

do $$
begin
  alter publication supabase_realtime add table cisco.cisco_deck_state;
exception
  when duplicate_object then null;
end;
$$;

commit;
