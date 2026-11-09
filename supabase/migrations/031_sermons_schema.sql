-- 031_sermons_schema.sql — the sermon tables, consolidated from 001, 003, 010 and 011.
-- Those four were never applied; this creates the same schema in one step.
-- Sermon CONTENT is not loaded by migrations any more: `node scripts/sync-sermons.mjs`
-- copies lib/seed.ts into these tables (012–030 are kept as history only).
--
-- RLS is on and there are deliberately NO read policies yet, so the public
-- (anon) sees nothing and the site keeps serving its bundled copy while the
-- data is loaded and checked. 032 is the switch that makes them public.
-- Idempotent. Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 031_sermons_schema.sql

begin;

create schema if not exists cisco;
grant usage on schema cisco to anon, authenticated, service_role;

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

create table if not exists cisco.cisco_series (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  scripture_ref text,
  tagline       text,
  artwork_url   text,
  metadata      jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

create table if not exists cisco.cisco_sermons (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  thesis          text,
  teaser          text,
  scripture_ref   text,
  scripture_text  text,
  sermon_date     date not null,
  artwork_url     text,
  summary         text,
  youtube_url     text,
  podcast_url     text,
  guide_url       text,
  pdf_url         text,
  nuggets         text[] not null default '{}',
  guide_questions text[] not null default '{}',
  speaker_id      uuid references cisco.cisco_speakers(id) on delete set null,
  series_id       uuid references cisco.cisco_series(id) on delete set null,
  lesson_number   int,
  is_featured     boolean not null default false,
  metadata        jsonb not null default '{}',
  created_at      timestamptz not null default now()
);

create index if not exists cisco_sermons_date_idx on cisco.cisco_sermons (sermon_date desc);

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

create table if not exists cisco.cisco_decks (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  sermon_id  uuid references cisco.cisco_sermons(id) on delete set null,
  metadata   jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists cisco.cisco_slides (
  id           uuid primary key default gen_random_uuid(),
  deck_id      uuid not null references cisco.cisco_decks(id) on delete cascade,
  position     int not null,
  html         text not null,
  outline_html text,
  bg           text,
  notes        text,               -- presenter notes: NEVER granted to anon
  metadata     jsonb not null default '{}',
  unique (deck_id, position)
);

create table if not exists cisco.cisco_deck_state (
  deck_id       uuid primary key references cisco.cisco_decks(id) on delete cascade,
  current_slide int not null default 1,
  is_live       boolean not null default false,
  is_blank      boolean not null default false,
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

alter table cisco.cisco_speakers      enable row level security;
alter table cisco.cisco_series        enable row level security;
alter table cisco.cisco_sermons       enable row level security;
alter table cisco.cisco_sermon_points enable row level security;
alter table cisco.cisco_decks         enable row level security;
alter table cisco.cisco_slides        enable row level security;
alter table cisco.cisco_deck_state    enable row level security;

-- Grants are in place now; with no policies, RLS still returns zero rows to anon.
grant select on cisco.cisco_speakers,
                cisco.cisco_series,
                cisco.cisco_sermons,
                cisco.cisco_sermon_points,
                cisco.cisco_decks,
                cisco.cisco_deck_state
  to anon, authenticated;

-- Column-level grant on cisco_slides EXCLUDES `notes` — anon must select
-- explicit columns (never `*`) on this table.
revoke all on cisco.cisco_slides from anon, authenticated;
grant select (id, deck_id, position, html, outline_html, bg)
  on cisco.cisco_slides to anon, authenticated;

grant all on cisco.cisco_speakers, cisco.cisco_series, cisco.cisco_sermons,
             cisco.cisco_sermon_points, cisco.cisco_decks, cisco.cisco_slides,
             cisco.cisco_deck_state
  to service_role;

-- PostgREST caches the schema; without this the new tables 404 until it restarts.
notify pgrst, 'reload schema';

commit;
