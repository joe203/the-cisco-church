-- 020_hope_for_the_family.sql — Lesson 4 content: key verse, summary, quotes, guide questions, points.
-- Mirrors hopeForTheFamily in lib/seed.ts. Idempotent. Requires 010 and 012.
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 020_hope_for_the_family.sql

begin;

update cisco.cisco_sermons set
  scripture_ref = '1 Corinthians 3:10–17 · 1 Thessalonians 5:21',
  scripture_text = '“For no one can lay any foundation other than the one already laid, which is Jesus Christ.”',
  summary = 'Sometimes the greatest thing a family passes down isn’t what they own. It’s how they treat people. Our families give us our first picture of the world, but they don’t have to determine how we see it forever. Paul tells the Corinthians that each of us should build with care, because there is only one foundation: Jesus Christ. Some lives are built on a painful foundation, like Joyce Meyer’s; others walk away from a promising one, like Damon West. Both discovered that their beginning didn’t have to determine their ending. We don’t have to hold on to everything from our past to hold on to what is good — and the foundation matters.',
  nuggets = array[
  'Our families give us our first experiences with life, but not all those experiences are good to hold on to.',
  'Healing doesn’t change what happened yesterday. It changes what we carry into tomorrow.',
  'A good foundation doesn’t guarantee good choices, but it gives us something worth returning to.'
],
  guide_questions = array[
  'Think of a way your family treated people — a habit, a kindness, a way of showing up — that you still carry. What did it teach you about what matters, even though nobody ever said it out loud?',
  '“Our families give us our first picture of the world, but they don’t have to determine how we see it forever.” What is one thing from your family’s picture of the world that you are glad to hold on to? Is there something you have had to question or let go of?',
  'Read 1 Corinthians 3:10–15. Paul says each one should build with care on the one foundation, Jesus Christ. Looking at your home and your daily choices, what are you building with — gold, silver, costly stones, or wood, hay, and straw?',
  '“What gets passed down doesn’t always have to get passed on.” Is there something you received that you want to stop at your generation? Who could walk with you as you build something different?',
  '“Sometimes we walk away from the very things that gave us a strong foundation.” Is there something good you were taught — a habit of prayer, a church family, a value — that you have drifted from? What would it look like to return to it? Who has reminded you of who you can still become?',
  'Read 1 Thessalonians 5:21. “We don’t have to hold on to everything from our past to hold on to what is good.” What will you hold on to, what will you let go of, and who in the next generation is counting on the foundation you are building today?'
]
where slug = 'hope-for-the-family' and summary is null;

insert into cisco.cisco_sermon_points (sermon_id, position, title, label, body)
values
  ('b1000000-0000-4000-8000-000000000006', 1, 'Family Shapes Who We Become', 'Family Matters',
   'Sometimes the greatest thing a family passes down isn’t what they own. It’s how they treat people. We don’t have to have everything to give someone something that matters. Our families give us our first picture of the world, but they don’t have to determine how we see it forever. God designed us for relationships and community. Our families influence our values, beliefs, personalities, and worldview, and family experiences can leave us with wonderful blessings or painful scars.'),
  ('b1000000-0000-4000-8000-000000000006', 2, 'There’s Hope for Every Generation', 'Start From Something',
   'Many of us didn’t have great teachers — no James Dobson, no Paul Faulkner or Carl Brecheen, and we hadn’t read books like His Needs, Her Needs. But we don’t have to start from scratch. What if we could discover what really matters and pass it on to the next generation? What if we could build our families on what lasts? What if we could give the next generation a strong foundation?'),
  ('b1000000-0000-4000-8000-000000000006', 3, 'Build on the Right Foundation', '1 Corinthians 3:10–17',
   'There was division in the church at Corinth. Paul told them they were infants, not ready for solid food, and addressed the controversy over Paul and Apollos. Verses 10–17 are about building on the right foundation: no one can lay any foundation other than Jesus Christ, and each one should build with care. Gold, silver, costly stones, wood, hay, or straw — the Day will bring it to light. The principle speaks strongly to the very challenges of a family.'),
  ('b1000000-0000-4000-8000-000000000006', 4, 'What Gets Passed Down Doesn’t Have to Get Passed On', 'A Painful Foundation',
   'Not everyone grows up in a loving, supportive family. Some family experiences leave wounds, and sometimes the very people who should have protected us are the ones who hurt us the most. Joyce Meyer’s childhood is a powerful example of how difficult that foundation can be. We may inherit a painful beginning, but we can build a different future. Healing doesn’t change what happened yesterday. It changes what we carry into tomorrow. The past doesn’t have to be the future.'),
  ('b1000000-0000-4000-8000-000000000006', 5, 'A Good Foundation Gives Us Something Worth Returning To', 'A Promising Foundation Abandoned',
   'Not everyone who grows up in a loving, supportive family makes good choices. Damon West had a promising future — a college quarterback, a successful career, and parents who loved and supported him — but his choices took him down a very different path. Sometimes holding on to what is good means letting go of what has hurt us, and sometimes it means returning to what we’ve forgotten. His mom: “You come back as the man we raised.” Hope begins when someone reminds us of who we can still become. His parents couldn’t undo his choices, but they could remind him of his foundation.'),
  ('b1000000-0000-4000-8000-000000000006', 6, 'There Is Still Hope for the Family', '1 Thessalonians 5:21',
   'Joyce Meyer had to overcome much of what she inherited. Damon West had to rediscover much of what he inherited. Both discovered that their beginning didn’t have to determine their ending. “Hold on to what is good!” We don’t have to hold on to everything from our past to hold on to what is good. You cannot rewrite the beginning of your family’s story, but with God’s help you can influence what happens in the next chapter. Tomorrow’s families are counting on the foundation we are building today. The foundation matters.')
on conflict (sermon_id, position) do nothing;

commit;
