-- 034_feedback.sql — "How's it going?" member feedback (/together/feedback)
-- Idempotent. Apply with:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 034_feedback.sql
--
-- One row per response. Only members who signed in through an emailed link can
-- send one, so every row carries who wrote it. Service-role only: RLS is on with
-- no policies, so no browser can read it — /api/together/feedback writes,
-- /staff/feedback (admins) reads.
--
-- Built to be sliced: everything about the person ("A little about you") is its
-- own column, so answers can be compared by age, tradition, tenure, and so on.
-- Allowed keys live in lib/feedback/schema.ts; never rename one after responses
-- arrive.

begin;

create table if not exists cisco.cisco_feedback (
  id             uuid primary key default gen_random_uuid(),
  member_id      uuid references cisco.cisco_together_members (id) on delete set null,
  -- the member's name when they sent it (kept if they later leave the list)
  member_name    text not null,

  -- ── A little about you ──
  -- 'under25' | '25_39' | '40_54' | '55_69' | '70plus'
  age_range      text not null,
  -- 1 = keep to traditional Church of Christ ways … 10 = try new ideas
  tradition      smallint not null check (tradition between 1 and 10),
  -- 'longing' | 'on_board' | 'waiting' | 'struggling' | 'prefer_past'
  stance         text not null,
  -- if Sundays doubled: 'prayer' | 'glad' | 'unsure' | 'as_is'
  growth         text not null,
  -- 'lt1' | '1_5' | '6_20' | '20plus'
  tenure         text not null,
  -- 'most' | 'monthly' | 'sometimes'
  attendance     text not null,
  -- read "Where we're headed": 'closely' | 'skimmed' | 'not_yet'
  read_direction text not null,
  -- { jesus: 'all_in' | 'mostly' | 'thinking' | 'not_really', relationships: …, … }
  value_ratings  jsonb not null default '{}',
  about_note     text,

  -- ── What you're seeing (changes already made) ──
  -- { worship: 'better' | 'same' | 'unsure', … }
  areas          jsonb not null default '{}',
  -- optional "tell us more" per area: { worship: '…' }
  area_notes     jsonb not null default '{}',
  noticed        text not null,
  keep_doing     text,

  -- ── Things we might try (not started yet) ──
  -- { lords_supper_prayer: 'yes' | 'open' | 'unsure' | 'rather_not', … }
  tries          jsonb not null default '{}',
  try_notes      jsonb not null default '{}',
  idea           text,

  -- ── Anything else ──
  -- private to the admins, never shared
  concern        text,
  suggestion     text,
  wants_talk     boolean not null default false,
  -- may we quote what they've seen?
  share          text not null default 'private'
                 check (share in ('first_name', 'anonymous', 'private')),

  -- a trial run (e.g. Joe testing the form): listed on /staff/feedback but left
  -- out of every total. Set by hand: update cisco.cisco_feedback set is_test = true where …
  is_test        boolean not null default false,
  metadata       jsonb not null default '{}',
  created_at     timestamptz not null default now()
);

create index if not exists cisco_feedback_created_idx on cisco.cisco_feedback (created_at desc);
create index if not exists cisco_feedback_member_idx on cisco.cisco_feedback (member_id, created_at desc);

alter table cisco.cisco_feedback enable row level security;
revoke all on cisco.cisco_feedback from anon, authenticated;
grant all on cisco.cisco_feedback to service_role;

-- Each person's most recent response — the one to count when comparing groups.
create or replace view cisco.cisco_feedback_latest
  with (security_invoker = true) as
  select distinct on (coalesce(member_id::text, member_name)) *
  from cisco.cisco_feedback
  order by coalesce(member_id::text, member_name), created_at desc;

revoke all on cisco.cisco_feedback_latest from anon, authenticated;
grant select on cisco.cisco_feedback_latest to service_role;

commit;
