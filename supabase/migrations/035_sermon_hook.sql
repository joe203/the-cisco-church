-- 035: the homepage spotlight's headline question for each lesson (2026-11-17).
-- Additive and idempotent. cisco_sermons already has a table-level anon SELECT
-- grant + public-read policy (031/032), so the new column is readable as-is.
alter table cisco.cisco_sermons add column if not exists hook text;
