-- 024_family_of_god.sql — the November 2026 series (Romans 8:15), five lessons.
-- Mirrors familySeries / theFatherWhoNeverGaveUp / familyPlaceholders in lib/seed.ts.
-- Lesson 1 is announced (slide + teaser); Lessons 2–5 are placeholders (title + date).
-- Idempotent. Requires 011.
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 024_family_of_god.sql

begin;

insert into cisco.cisco_series (id, slug, title, scripture_ref, tagline, artwork_url)
values (
  'd1000000-0000-4000-8000-000000000002',
  'the-family-of-god',
  'The Family of God',
  'Romans 8:15',
  'What does it really mean to be part of God’s family?',
  '/series/the-family-of-god/artwork.jpg'
)
on conflict (slug) do nothing;

insert into cisco.cisco_sermons
  (id, slug, title, thesis, teaser, scripture_ref, scripture_text, sermon_date, artwork_url, speaker_id, is_featured, series_id, lesson_number)
values (
  'b1000000-0000-4000-8000-000000000010',
  'the-father-who-never-gave-up',
  'The Father Who Never Gave Up',
  'His love never stopped reaching.',
  E'We often call God our Father. But have we stopped to think about how remarkable that is?

From the garden to the prodigal son’s long road home, the Bible tells the story of a God who wanted more than our worship and obedience. He wanted a family. And when His children wandered, He kept reaching.

This Sunday we begin The Family of God, a November series on being loved by God, belonging to His family, learning to love one another, and giving thanks for the place He has given us. We start where the story starts: with a Father who never gave up.

His love never stopped reaching.',
  'Romans 8:15',
  '“The Spirit you received brought about your adoption to sonship. And by him we cry, ‘Abba, Father.’”',
  '2026-11-01',
  '/sermons/the-father-who-never-gave-up/artwork.jpg',
  'a1000000-0000-4000-8000-000000000001',
  false,
  'd1000000-0000-4000-8000-000000000002',
  1
)
on conflict (slug) do nothing;

insert into cisco.cisco_sermons
  (id, slug, title, sermon_date, speaker_id, is_featured, series_id, lesson_number)
values
  ('b1000000-0000-4000-8000-000000000011', 'a-place-to-belong', 'A Place to Belong', '2026-11-08',
   'a1000000-0000-4000-8000-000000000001', false, 'd1000000-0000-4000-8000-000000000002', 2),
  ('b1000000-0000-4000-8000-000000000012', 'learning-to-love-like-family', 'Learning to Love Like Family', '2026-11-15',
   'a1000000-0000-4000-8000-000000000001', false, 'd1000000-0000-4000-8000-000000000002', 3),
  ('b1000000-0000-4000-8000-000000000013', 'thankful-to-be-his', 'Thankful to Be His', '2026-11-22',
   'a1000000-0000-4000-8000-000000000001', false, 'd1000000-0000-4000-8000-000000000002', 4),
  ('b1000000-0000-4000-8000-000000000014', 'the-family-business', 'The Family Business', '2026-11-29',
   'a1000000-0000-4000-8000-000000000001', false, 'd1000000-0000-4000-8000-000000000002', 5)
on conflict (slug) do nothing;

commit;
