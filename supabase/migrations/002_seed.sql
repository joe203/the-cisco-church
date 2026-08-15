-- 002_seed.sql — the two real past sermons + the live deck.
-- Mirrors lib/seed.ts (the app's offline fallback). Idempotent via fixed UUIDs
-- and ON CONFLICT DO NOTHING.
--
-- Sermon assets (artwork, reflection guides, slide images) are served from
-- the app's own public/sermons/[slug]/ directory, so URLs are site-relative.
-- Dates confirmed by Joe 2026-08-15.

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
   artwork_url, summary, youtube_url, guide_url, speaker_id, is_featured)
values
  (
    'b1000000-0000-4000-8000-000000000001',
    'the-hard-truth-about-the-kingdom',
    'The Hard Truth About the Kingdom',
    'God celebrates faithfulness.',
    'Matthew 25:14–30',
    '“Well done, good and faithful servant. You have been faithful over a little; I will set you over much. Enter into the joy of your master.”',
    '2026-07-19',
    '/sermons/the-hard-truth-about-the-kingdom/artwork.jpg',
    'Jesus told a story about a master, three servants, and a long absence — and it does not end the way we would write it. The parable of the talents is warm to the workers and unsparing to the fearful, and it asks a question most of us would rather not sit with: what did you do with what you were given? This lesson walks through each servant and lands on five hard truths about how the Kingdom actually works.',
    'https://youtu.be/BrBm6-QasUo',
    '/sermons/the-hard-truth-about-the-kingdom/reflection-guide.pdf',
    'a1000000-0000-4000-8000-000000000001',
    false
  ),
  (
    'b1000000-0000-4000-8000-000000000002',
    'the-bag-of-seeds',
    'The Bag of Seeds',
    'What are you carrying — and what will you plant?',
    'Matthew 13:1–23',
    '“A sower went out to sow… He who has ears, let him hear.”',
    '2026-07-26',
    '/sermons/the-bag-of-seeds/artwork.jpg',
    'Jesus sat down by the sea and told a story about a sower who scattered seed everywhere he went — on the path, in the rocks, among the thorns, and into good soil. The seed is God''s Word. The soil is our heart. The harvest is changed lives. And the question the parable keeps asking is the one this lesson sits with: what''s still in your bag, what keeps it closed, and who is ready for what you''re carrying? Growing the seed is God''s work. Emptying the bag is ours.',
    'https://youtu.be/q1ILOtr_yAM',
    '/sermons/the-bag-of-seeds/reflection-guide.pdf',
    'a1000000-0000-4000-8000-000000000001',
    true
  )
on conflict (slug) do nothing;

insert into cisco.cisco_sermon_points (sermon_id, position, title, label, body)
values
  -- The Hard Truth About the Kingdom — from Joe's outline.
  ('b1000000-0000-4000-8000-000000000001', 1, 'The Kingdom Comes First', 'Matthew 6:33',
   'If you don''t get the Kingdom right, you don''t get Jesus right. The Kingdom wasn''t a side topic for Jesus — it was His central message, the thread that tied all of His teaching together. That''s why He said it must come first: "Seek first the Kingdom of God."'),
  ('b1000000-0000-4000-8000-000000000001', 2, 'The Five-Talented Servant', 'Five Talents',
   'When he received the five talents, he knew the expectation — a huge problem to solve, no experience, new things to learn. However he learned, the knowledge became a process, the process became a habit, and when it came time to take action, he did. God celebrates trust.'),
  ('b1000000-0000-4000-8000-000000000001', 3, 'The Two-Talented Servant', 'Two Talents',
   'He could have complained — "Why did he get five and I only got two?" Instead, he put his talents to work. The Kingdom is not built on comparison. It is built on faithfulness with what you have been uniquely given.'),
  ('b1000000-0000-4000-8000-000000000001', 4, 'The One-Talented Servant', 'One Talent',
   'The Bible tells us exactly what he was thinking: he was afraid. He buried the talent, protected it, and completely failed to use it. Fear stops the flow of faith — and it kept him from ever discovering what faith could have accomplished.'),
  ('b1000000-0000-4000-8000-000000000001', 5, 'Five Hard Truths', 'The Reckoning',
   'Everyone has talent. Time is an opportunity — you''re on the clock. Talent is meant to be used, not admired. Results matter, because accountability is real. And talents increase only when you use them.'),
  -- The Bag of Seeds — from Joe's outline.
  ('b1000000-0000-4000-8000-000000000002', 1, 'Every Believer Carries a Bag', 'On Purpose',
   'The farmer in Jesus'' parable scatters his seed everywhere — he never sends soil samples to the lab. God has been filling your bag your whole life. He doesn''t consult your past to determine your future; He gives your past a new purpose. God doesn''t measure the bag. He watches what leaves it.'),
  ('b1000000-0000-4000-8000-000000000002', 2, 'The Bag Was Never Meant to Stay Full', 'Empty the Bag',
   'Seed has one purpose: to leave the bag and be planted. A farmer is measured by what he plants, not by what he owns — and sowing is intentional; no field was ever planted by accident. The rich fool built a bigger barn. Barnabas kept emptying his hands.'),
  ('b1000000-0000-4000-8000-000000000002', 3, 'Every Generation Has a Bag', 'One Courageous Yes',
   '"I don''t know enough." "I''m too busy." "My time has passed." Every generation has its own excuse — and every excuse keeps the seed in the bag. Every Kingdom conversation begins with one courageous yes.'),
  ('b1000000-0000-4000-8000-000000000002', 4, 'Emptying Is Our Job. Growing Is God''s.', 'We Plant. God Grows.',
   'The sower never makes a single seed grow — that was never his job. Paul plants, Apollos waters, God gives the increase. Our assignment isn''t to change hearts. Our job is to scatter the seed. We have the easy job.'),
  ('b1000000-0000-4000-8000-000000000002', 5, 'Some Seeds Won''t Grow Until After You''re Gone', 'Sow Today. Change Tomorrow.',
   'That''s not failure — that''s seed growing when it''s ready. Who sowed into you? Someone whose seed is still growing, who may never have seen the harvest. The most powerful seeds you sow will yield their harvest in your absence. Your legacy is in the seed you sow.')
on conflict (sermon_id, position) do nothing;

insert into cisco.cisco_decks (id, slug, title, sermon_id)
values
  ('c1000000-0000-4000-8000-000000000001',
   'the-hard-truth',
   'The Hard Truth About the Kingdom',
   'b1000000-0000-4000-8000-000000000001'),
  ('c1000000-0000-4000-8000-000000000002',
   'the-bag-of-seeds',
   'The Bag of Seeds',
   'b1000000-0000-4000-8000-000000000002')
on conflict (slug) do nothing;

-- Image decks: each slide is one exported 16:9 image served from the app's
-- public/sermons/[slug]/slides/ directory (styled by app/slides/slides.css).
insert into cisco.cisco_slides (deck_id, position, html, notes)
values
  ('c1000000-0000-4000-8000-000000000001', 1,
   '<img class="slide-image" src="/sermons/the-hard-truth-about-the-kingdom/slides/01.jpg" alt="The Hard Truth About the Kingdom — Matthew 25:14–30">',
   'Welcome everyone. Read Matthew 25:14–30 in full. It sounds like a story about money — it isn''t.'),
  ('c1000000-0000-4000-8000-000000000001', 2,
   '<img class="slide-image" src="/sermons/the-hard-truth-about-the-kingdom/slides/02.jpg" alt="Introduction — The Kingdom Comes First. Seek first the Kingdom of God, Matthew 6:33">',
   'If you don''t get the Kingdom right, you don''t get Jesus right. The Kingdom was Jesus'' central message — Matthew 6:33.'),
  ('c1000000-0000-4000-8000-000000000001', 3,
   '<img class="slide-image" src="/sermons/the-hard-truth-about-the-kingdom/slides/03.jpg" alt="The Five-Talented Servant — Prepared. Faithful. Fruitful. God celebrates trust.">',
   'He knew the expectation. He learned, built a process, made it a habit — and when it came time to act, he did. God celebrates trust.'),
  ('c1000000-0000-4000-8000-000000000001', 4,
   '<img class="slide-image" src="/sermons/the-hard-truth-about-the-kingdom/slides/04.jpg" alt="Faithfulness, Not Comparison — be faithful with what you have">',
   'He could have complained — ''Why did he get five and I only got two?'' Instead he put his talents to work. Faithfulness, not comparison.'),
  ('c1000000-0000-4000-8000-000000000001', 5,
   '<img class="slide-image" src="/sermons/the-hard-truth-about-the-kingdom/slides/05.jpg" alt="Fear Buries Potential — don''t bury what God has entrusted to you">',
   'He was afraid. He protected the talent and completely failed to use it. Fear stops the flow of faith — slow down here.'),
  ('c1000000-0000-4000-8000-000000000001', 6,
   '<img class="slide-image" src="/sermons/the-hard-truth-about-the-kingdom/slides/06.jpg" alt="Five Hard Truths About the Kingdom — wake up, step up, get to work">',
   'Everyone has talent. You''re on the clock. Talent is meant to be used, not admired. Accountability is real. Talents increase only when you use them.'),
  ('c1000000-0000-4000-8000-000000000001', 7,
   '<img class="slide-image" src="/sermons/the-hard-truth-about-the-kingdom/slides/07.jpg" alt="Faithful Today. Impact Tomorrow. The Kingdom Forever. — Well done, good and faithful servant, Matthew 25:21">',
   'Final challenges: What talent have you buried? What step of faith have you been afraid to take? Land Matthew 25:21 — ''Well done.'''),
  ('c1000000-0000-4000-8000-000000000002', 1,
   '<img class="slide-image" src="/sermons/the-bag-of-seeds/slides/01.jpg" alt="The Bag of Seeds — Full Bags vs Empty Bags, Matthew 13:1–23">',
   'Welcome. Read Matthew 13:1–23. This time, you''re not the soil — you''re the sower.'),
  ('c1000000-0000-4000-8000-000000000002', 2,
   '<img class="slide-image" src="/sermons/the-bag-of-seeds/slides/02.jpg" alt="Point one — Every believer carries a bag. Your bag is not random; it''s on purpose.">',
   'The farmer scatters everywhere — he never sends soil samples to the lab. God doesn''t consult your past to determine your future.'),
  ('c1000000-0000-4000-8000-000000000002', 3,
   '<img class="slide-image" src="/sermons/the-bag-of-seeds/slides/03.jpg" alt="Point two — The bag was never meant to stay full. Empty the bag, multiply the seed.">',
   'Seed has one purpose: to leave the bag. Rich fool vs Barnabas — one built a bigger barn, the other kept emptying his hands.'),
  ('c1000000-0000-4000-8000-000000000002', 4,
   '<img class="slide-image" src="/sermons/the-bag-of-seeds/slides/04.jpg" alt="Point three — Every generation has a bag. Don''t let fear or ''not yet'' keep your bag full.">',
   'Young: ''I don''t know enough.'' Busy: ''I''m too busy.'' Seasoned: ''My time has passed.'' Every Kingdom conversation begins with one courageous yes.'),
  ('c1000000-0000-4000-8000-000000000002', 5,
   '<img class="slide-image" src="/sermons/the-bag-of-seeds/slides/05.jpg" alt="Point four — Emptying is our job. Growing is God''s. We plant, we water, God gives the increase.">',
   'The sower never makes a single seed grow. Jonah vs Ananias. Our job is to scatter the seed — we have the easy job.'),
  ('c1000000-0000-4000-8000-000000000002', 6,
   '<img class="slide-image" src="/sermons/the-bag-of-seeds/slides/06.jpg" alt="Point five — Some seeds won''t grow until after you''re gone. Sow today, change tomorrow.">',
   'That''s not failure — that''s seed growing when it''s ready. Joseph''s bones. The most powerful seeds yield their harvest in your absence.'),
  ('c1000000-0000-4000-8000-000000000002', 7,
   '<img class="slide-image" src="/sermons/the-bag-of-seeds/slides/07.jpg" alt="Closing — God never asked us to become the harvest. He simply asked us to empty the bag.">',
   'Empty the bag. Trust God with the harvest. Jesus sowed every seed He had — He poured it all out on the cross. Invitation.')
on conflict (deck_id, position) do nothing;

insert into cisco.cisco_deck_state (deck_id, current_slide, is_live)
values
  ('c1000000-0000-4000-8000-000000000001', 1, false),
  ('c1000000-0000-4000-8000-000000000002', 1, false)
on conflict (deck_id) do nothing;

commit;
