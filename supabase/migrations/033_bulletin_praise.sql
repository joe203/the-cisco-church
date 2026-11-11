-- 033 — Bulletin "Good news" (praise reports), added 2026-11-11.
--
-- A sixth weekly section on cisco_bulletins: praise reports — answered prayers,
-- new babies, good news — one paragraph per entry, as a jsonb array of strings.
-- Additive and idempotent. Existing grants and RLS on cisco_bulletins are
-- table-level, so anon still sees this column on published rows only, and the
-- table is already in the Realtime publication (028).

alter table cisco.cisco_bulletins
  add column if not exists praise jsonb not null default '[]';
