-- 012_hold_on_to_what_is_good.sql — the four lessons of the October 2026 series (1 Thessalonians 5:21–22)
-- Mirrors theJesusTest / askBetterQuestions / the upcoming lessons in lib/seed.ts.
-- Idempotent. Requires 001/002, 010, and 011 (the series row).
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 012_hold_on_to_what_is_good.sql

begin;

insert into cisco.cisco_sermons
  (id, slug, title, thesis, teaser, scripture_ref, scripture_text, sermon_date,
   artwork_url, summary, nuggets, guide_questions, speaker_id, is_featured, series_id, lesson_number)
values (
  'b1000000-0000-4000-8000-000000000003',
  'the-jesus-test',
  'The Jesus Test',
  null,
  E'We live in a world filled with voices telling us what to believe, who to trust, and what is true. But that challenge isn’t new. God’s people have always lived among competing voices.\n\nIn The Jesus Test, we look at how Paul entered a world full of different beliefs without running from the conversation—and without accepting everything he heard. His example gives us a better way: keep Jesus at the center, test what we hear, and hold on to what is good.\n\nThe voices have changed. The challenge has not.',
  '1 Thessalonians 5:21–22',
  '“…test them all; hold on to what is good, reject every kind of evil.”',
  '2026-10-04',
  null,
  'The voices have changed; the challenge has not. From Abraham to Daniel to Paul in Athens, God’s people have always lived among competing voices — and ours now fit in a pocket. This first lesson in the series follows Paul into a city full of idols and ideas: he didn’t run, and he didn’t accept everything. He listened, recognized what was true, tested it, and brought the conversation to Jesus.',
  array[
    'God doesn’t tell us to be afraid of everything we hear. He tells us to test it.',
    'Religion often begins with humanity reaching upward. The Gospel begins with God reaching downward.',
    'Paul didn’t run from the voices. He brought Jesus into the conversation.',
    'If Jesus is firmly at the center, we don’t have to be afraid of the noise around us.'
  ],
  array[
    'Where do you hear the most competing voices about God and faith right now — screens, friends, family? Which ones get most of your attention?',
    'Every culture asks, “How do I reach God?” Where do you catch yourself acting as if the answer is something you have to earn? Read John 1:14 and Philippians 2:5–8: what does it mean to you that God came looking for you?',
    'Read Acts 17:16–34. Paul observed, listened, reasoned, and engaged. Which of those is hardest for you when you meet a belief you disagree with?',
    'Read 1 John 4:1–3 and 1 Corinthians 15:3–4. When you hear something new about faith, how could you use the three questions: What does it say about Jesus? Does it lead me toward following Jesus? Does it line up with what Jesus taught?',
    'Is there something good you’ve been slow to receive — a song, a book, a teacher, a conversation — because of who it came from? What would it look like to test it instead of dismissing it?',
    '“Embrace the greater. Talk through the lesser.” What belongs at the center of your life this week, and what has been crowding it?'
  ],
  'a1000000-0000-4000-8000-000000000001',
  false,
  'd1000000-0000-4000-8000-000000000001',
  1
)
on conflict (slug) do nothing;

-- Lesson 2 — announced (slide + teaser); content arrives with the manuscript.
insert into cisco.cisco_sermons
  (id, slug, title, teaser, scripture_ref, scripture_text, sermon_date, artwork_url, speaker_id, is_featured, series_id, lesson_number)
values (
  'b1000000-0000-4000-8000-000000000004',
  'ask-better-questions',
  'Ask Better Questions',
  E'Sometimes the things we question most quickly are the things that are unfamiliar. But what about the things we’ve never thought to question at all?

Faith doesn’t have to be afraid of honest questions. In fact, sometimes a better question can help us see Scripture—and even our own familiar ways of doing things—with fresh eyes.

This week, we’ll discover how a faith firmly anchored in Christ can be curious enough to listen, humble enough to examine, and courageous enough to ask:

Is this what Scripture actually says—or simply what I’ve always assumed?',
  'Proverbs 18:15',
  '“The heart of the discerning acquires knowledge, for the ears of the wise seek it out.”',
  '2026-10-11',
  '/sermons/ask-better-questions/artwork.jpg',
  'a1000000-0000-4000-8000-000000000001',
  false,
  'd1000000-0000-4000-8000-000000000001',
  2
)
on conflict (slug) do nothing;

-- Lessons 3 and 4 — placeholders (title + date) so the series shows its whole run.
insert into cisco.cisco_sermons
  (id, slug, title, sermon_date, speaker_id, is_featured, series_id, lesson_number)
values
  ('b1000000-0000-4000-8000-000000000005', 'with-all-his-might', 'With All His Might', '2026-10-18',
   'a1000000-0000-4000-8000-000000000001', false, 'd1000000-0000-4000-8000-000000000001', 3),
  ('b1000000-0000-4000-8000-000000000006', 'hope-for-the-family', 'Hope For The Family', '2026-10-25',
   'a1000000-0000-4000-8000-000000000001', false, 'd1000000-0000-4000-8000-000000000001', 4)
on conflict (slug) do nothing;

insert into cisco.cisco_sermon_points (sermon_id, position, title, label, body)
values
  ('b1000000-0000-4000-8000-000000000003', 1, 'Every Religion Asks: How Do I Reach God?', 'The System',
   'Human beings have always been searching — Who is God? Why am I here? What happens when I die? How do I get to God? The answers have produced systems: meditation, discipline, ritual, pilgrimage, moral achievement, enlightenment. Not mocking any of them. People are searching. Three out of four people on earth identify with some religion — the search is as alive today as it was in ancient Athens, where Paul preached (Acts 17).'),
  ('b1000000-0000-4000-8000-000000000003', 2, 'The Gospel Begins With God’s Love', 'The Savior',
   'Before the Gospel tells us what we must do, it tells us what God has done. He came toward us because He loves us. The story of salvation begins not with humanity searching for God, but with a God whose love moves Him toward His creation — the Word became flesh and made His dwelling among us. At the center of Christianity is not a man climbing a throne. It is God stepping down from one.'),
  ('b1000000-0000-4000-8000-000000000003', 3, 'Paul Didn’t Run From the Voices', 'Acts 17:16–34',
   'God’s people have never lived in a world with only one voice — Abraham, Moses, Daniel, Jesus, Paul. Paul’s story is told in Acts 17:16–34. He walked into Athens, the great Greek city, full of idols and the latest ideas — and he observed, listened, reasoned, and engaged. He quoted their poets without accepting their whole worldview. He listened, recognized, tested, and redirected — and brought the conversation to Jesus.'),
  ('b1000000-0000-4000-8000-000000000003', 4, 'Jesus Must Remain at the Center', 'The Jesus Test',
   'Paul’s Athens was a city full of competing voices. Ours fits in our pocket — YouTube, Facebook, TikTok, podcasts, and more, all on one phone. We don’t suffer from a lack of information; we suffer from an abundance of voices. Tradition, culture, teachers, experience, and opinion can’t be the center. John doesn’t say believe every voice — and he doesn’t say be afraid of every voice. He says, “test the spirits” (1 John 4:1–3). And the test always comes back to Jesus: he must remain at the center.'),
  ('b1000000-0000-4000-8000-000000000003', 5, 'Test It. Keep What Is Good. Leave What Isn’t.', '1 Thessalonians 5:21–22',
   'A critical spirit listens for what to reject. A discerning spirit listens carefully enough to recognize what is true. We don’t have to surrender our convictions in order to listen, and we don’t have to reject a person in order to disagree with them. Embrace the greater. Talk through the lesser. Jesus belongs at the center.')
on conflict (sermon_id, position) do nothing;

commit;
