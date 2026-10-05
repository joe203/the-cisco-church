-- 010_nuggets.sql — "gold nuggets" (standout lines) an optional homepage teaser, and reflection-guide questions per sermon
-- Idempotent. Apply with:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 010_nuggets.sql
-- Additive only. Mirrors the nuggets in lib/seed.ts. Requires 001/002 (cisco_sermons).

begin;

alter table cisco.cisco_sermons
  add column if not exists nuggets text[] not null default '{}',
  add column if not exists teaser text,
  add column if not exists guide_questions text[] not null default '{}';

update cisco.cisco_sermons set nuggets = array[
  'God celebrates faithfulness.',
  'Talent is meant to be used, not admired.',
  'Fear stops the flow of faith.'
] where slug = 'the-hard-truth-about-the-kingdom' and nuggets = '{}';

update cisco.cisco_sermons set nuggets = array[
  'God doesn''t measure the bag. He watches what leaves it.',
  'Emptying the bag is ours. Growing the seed is God''s.',
  'Your legacy is in the seed you sow.'
] where slug = 'the-bag-of-seeds' and nuggets = '{}';

commit;
