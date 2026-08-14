-- 002_seed.sql — first real sermon + two placeholder sermons + the live deck.
-- Mirrors lib/seed.ts (the app's offline fallback). Idempotent via fixed UUIDs
-- and ON CONFLICT DO NOTHING.
--
-- PLACEHOLDER NOTE: the two older sermons exist so the card grid and archive
-- can be judged with more than one item. Replace with real past sermons.

begin;

insert into cisco.cisco_speakers (id, slug, name, photo_url, tags, bio)
values (
  'a1000000-0000-4000-8000-000000000001',
  'joe-cabrera',
  'Joe Cabrera',
  null,
  array['Minister', 'Educator', 'Consultant'],
  'Joe serves the Cisco congregation in an interim ministry role, bringing years of teaching and preaching alongside his work as an educator and consultant.'
)
on conflict (slug) do nothing;

insert into cisco.cisco_sermons
  (id, slug, title, thesis, scripture_ref, scripture_text, sermon_date,
   summary, speaker_id, is_featured)
values
  (
    'b1000000-0000-4000-8000-000000000001',
    'the-hard-truth-about-the-kingdom',
    'The Hard Truth About the Kingdom',
    'God celebrates results.',
    'Matthew 25:14–30',
    '“Well done, good and faithful servant. You have been faithful over a little; I will set you over much. Enter into the joy of your master.”',
    '2026-08-17',
    'Jesus told a story about a master, three servants, and a long absence — and it does not end the way we would write it. The parable of the talents is warm to the workers and unsparing to the fearful, and it asks a question most of us would rather not sit with: what did you do with what you were given? This lesson walks through each servant and lands on five hard truths about how the Kingdom actually works.',
    'a1000000-0000-4000-8000-000000000001',
    true
  ),
  (
    'b1000000-0000-4000-8000-000000000002',
    'the-lord-is-my-shepherd',
    'The Lord Is My Shepherd',
    'Provision begins with belonging.',
    'Psalm 23:1–6',
    '“The Lord is my shepherd; I shall not want.”',
    '2026-08-10',
    'PLACEHOLDER — a sample past sermon so the archive has depth. David''s most familiar psalm, read slowly enough to notice what it actually promises.',
    'a1000000-0000-4000-8000-000000000001',
    false
  ),
  (
    'b1000000-0000-4000-8000-000000000003',
    'salt-and-light',
    'Salt and Light',
    'A hidden disciple is a contradiction.',
    'Matthew 5:13–16',
    '“You are the light of the world. A city set on a hill cannot be hidden.”',
    '2026-08-03',
    'PLACEHOLDER — a sample past sermon so the card grid can be judged with more than one item in it.',
    'a1000000-0000-4000-8000-000000000001',
    false
  )
on conflict (slug) do nothing;

insert into cisco.cisco_sermon_points (sermon_id, position, title, label, body)
values
  ('b1000000-0000-4000-8000-000000000001', 1, 'The Ready Servant', 'Five Talents',
   'Given the most, he went at once and put it to work. Readiness is not a personality trait — it is a decision made before the opportunity arrives.'),
  ('b1000000-0000-4000-8000-000000000001', 2, 'The Faithful Servant', 'Two Talents',
   'He received less and was praised identically. The master measures faithfulness against what was entrusted, never against what someone else was given.'),
  ('b1000000-0000-4000-8000-000000000001', 3, 'The Fearful Servant', 'One Talent',
   'He buried the gift and called it prudence. Fear dressed up as caution still leaves the master''s property in a hole in the ground.'),
  ('b1000000-0000-4000-8000-000000000001', 4, 'Five Hard Truths', 'The Reckoning',
   'The master comes back. Accounts get settled. And the parable closes with truths about reward, risk, and responsibility that are hard precisely because they are clear.')
on conflict (sermon_id, position) do nothing;

insert into cisco.cisco_decks (id, slug, title, sermon_id)
values (
  'c1000000-0000-4000-8000-000000000001',
  'the-hard-truth',
  'The Hard Truth About the Kingdom',
  'b1000000-0000-4000-8000-000000000001'
)
on conflict (slug) do nothing;

insert into cisco.cisco_slides (deck_id, position, html, notes)
values
  ('c1000000-0000-4000-8000-000000000001', 1,
   '<p class="kicker">Cisco Church</p><h1>The Hard Truth <em>About the Kingdom</em></h1><p class="ref">Matthew 25:14–30</p>',
   'Welcome everyone. Read the parable in full before advancing.'),
  ('c1000000-0000-4000-8000-000000000001', 2,
   '<blockquote>“For it will be like a man going on a journey, who called his servants and entrusted to them his property.”</blockquote><p class="ref">Matthew 25:14</p>',
   'Set the scene — a long absence, real money, real trust.'),
  ('c1000000-0000-4000-8000-000000000001', 3,
   '<p class="kicker">One</p><h2>The Ready Servant</h2><p>Five talents. He went <strong>at once</strong> and traded with them.</p>',
   'Readiness is decided before the opportunity arrives.'),
  ('c1000000-0000-4000-8000-000000000001', 4,
   '<p class="kicker">Two</p><h2>The Faithful Servant</h2><p>Two talents — and the <strong>same praise</strong> as five.</p>',
   'Faithfulness is measured against what was entrusted.'),
  ('c1000000-0000-4000-8000-000000000001', 5,
   '<p class="kicker">Three</p><h2>The Fearful Servant</h2><p>“I was afraid, and I hid your talent in the ground.”</p>',
   'Fear dressed up as prudence. Slow down here.'),
  ('c1000000-0000-4000-8000-000000000001', 6,
   '<p class="kicker">The Reckoning</p><h2>Five Hard Truths</h2><p>The master returns. Accounts get settled. The Kingdom celebrates <strong>results</strong>.</p>',
   'Land the five truths, then invitation.')
on conflict (deck_id, position) do nothing;

insert into cisco.cisco_deck_state (deck_id, current_slide, is_live)
values ('c1000000-0000-4000-8000-000000000001', 1, false)
on conflict (deck_id) do nothing;

commit;
