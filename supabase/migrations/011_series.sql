-- 011_series.sql — sermon series ("Hold On to What Is Good") and lesson numbers
-- Idempotent, additive. Apply with:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 011_series.sql
-- Requires 001 (cisco_sermons). A sermon with series_id null is a standalone sermon.

begin;

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

alter table cisco.cisco_sermons
  add column if not exists series_id     uuid references cisco.cisco_series(id) on delete set null,
  add column if not exists lesson_number int;

alter table cisco.cisco_series enable row level security;

drop policy if exists "cisco public read" on cisco.cisco_series;
create policy "cisco public read" on cisco.cisco_series
  for select to anon, authenticated using (true);

grant select on cisco.cisco_series to anon, authenticated;
grant all on cisco.cisco_series to service_role;

insert into cisco.cisco_series (id, slug, title, scripture_ref, tagline, artwork_url)
values (
  'd1000000-0000-4000-8000-000000000001',
  'hold-on-to-what-is-good',
  'Hold On to What Is Good',
  '1 Thessalonians 5:21–22',
  'Open to every good gift. Anchored in Christ.',
  '/series/hold-on-to-what-is-good/artwork.jpg'
)
on conflict (slug) do nothing;

commit;
