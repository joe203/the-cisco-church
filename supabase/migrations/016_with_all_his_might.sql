-- 016_with_all_his_might.sql — Lesson 3 content: key verse, summary, quotes, guide questions, points.
-- Mirrors withAllHisMight in lib/seed.ts. Idempotent. Requires 010 and 012.
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 016_with_all_his_might.sql

begin;

update cisco.cisco_sermons set
  scripture_text = '“And David danced before the Lord with all his might.”',
  summary = 'Everything we receive as good for our lives must point to Jesus, and spiritual growth is learning to make choices that continually move us closer to him. But when we lose sight of the purpose, we begin protecting the routine — and how we worship can become more important than Who we worship. In 2 Samuel 6, David and all Israel celebrated with all their might as God’s presence came home. His worship was expressive, but it was never aimless; its center was God. The Psalms invite the same joy, and Paul, steeped in the Psalms, tells the Ephesians to be filled with the Spirit, speaking to one another in psalms, hymns, and spiritual songs. Paul doesn’t tell believers to suppress their joy. He tells them what should fill their hearts. Some of us are naturally expressive and others are more reserved, but everyone has something to celebrate when they recognize God’s goodness — because heaven knows how to celebrate what is good.',
  nuggets = array[
  'Nobody has to teach us how to celebrate something that truly matters to us.',
  'David’s worship was expressive, but it wasn’t aimless. His celebration had a center — and that center was God.',
  'Some people are naturally expressive. Others are more reserved. But everyone has something to celebrate when they recognize God’s goodness.',
  'The question isn’t whether we’re going to be moved by something. The question is what’s moving us.'
],
  guide_questions = array[
  'Think of something good you’ve received lately — a song, a book, a teacher, a habit. Run it through the three questions of the Jesus Test: Is Jesus at the center? Does it lead me toward following him? Does it line up with what he taught? Which question is hardest for you to answer honestly?',
  'Read Luke 9:50. The disciples were focused on who belonged to their group; Jesus was focused on whose name was being honored. Where are you tempted to ask “Is he one of us?” before asking “Is Jesus being honored?”',
  '“When we lose sight of the purpose, we begin protecting the routine.” Is there something in your own life — or in how we worship — where HOW has become more important than WHY? What would it take to bring the purpose back into focus?',
  'Read 2 Samuel 6:1–5, 12–15. David wasn’t celebrating because everything was going his way; he was celebrating because God’s presence was coming home. What has God done lately that you have been slow to celebrate?',
  'How do you express yourself when you’re truly joyful — a goal reached, a big win, a child’s first step? What do you do when you encounter God’s goodness? If you had stood watching David that day, would you have joined him, or questioned him like Michal (2 Samuel 6:20)?',
  'Read Ephesians 5:15–20. “The question isn’t whether we’re going to be moved by something. The question is what’s moving us.” What fills your heart right now? And if our whole community joined us next Sunday, what would they leave believing about our God?'
]
where slug = 'with-all-his-might' and summary is null;

insert into cisco.cisco_sermon_points (sermon_id, position, title, label, body)
values
  ('b1000000-0000-4000-8000-000000000005', 1, 'Everything Good Must Point to Jesus', 'The Jesus Test',
   'The Jesus Test asks three things: Is Jesus truly at the center? Does it lead me toward following Jesus? Does it line up with what Jesus taught? People in Jesus’ day faced the same challenge. In Luke 9:50 the disciples tried to stop someone casting out demons in Jesus’ name — they were focused on who belonged to their group, but Jesus was focused on whose name was being honored. Spiritual growth is learning to make choices that continually move us closer to Jesus.'),
  ('b1000000-0000-4000-8000-000000000005', 2, 'When We Lose the Purpose, We Protect the Routine', 'Focus',
   'The more we stay focused on the important things, the more what we’re doing makes sense. When we lose focus, other things take over — we begin protecting the routine, and before long HOW we do things becomes more important than WHY we do them. Sometimes we become so concerned about how we worship that we lose sight of Who we’re worshiping. That is exactly the tension in 2 Samuel 6.'),
  ('b1000000-0000-4000-8000-000000000005', 3, 'David Celebrated With All His Might', '2 Samuel 6',
   'The Ark of the Covenant was Israel’s most sacred object — the earthly footstool of God, and proof that God was fighting for them. David and all Israel celebrated with all their might as it came home. Enthusiasm matters, but so does honoring God’s instructions. David wasn’t celebrating because everything was going his way; he was celebrating because God’s presence was coming home. His worship was expressive, but it wasn’t aimless — its center was God. The Psalms invite God’s people into the same joy (Psalm 149:3, 150:4).'),
  ('b1000000-0000-4000-8000-000000000005', 4, 'Nobody Has to Teach Us to Celebrate', 'Joy',
   'A diet goal reached, a big win, a baby’s first step — nobody has to teach us how to celebrate what truly matters. We naturally express what excites us, so why should our joy in God be any different? Some people are naturally expressive and others are more reserved, but everyone has something to celebrate when they recognize God’s goodness. The measure of worship isn’t how much we move, but how deeply our hearts are moved toward God. Would you have joined David — or pulled him aside like Michal?'),
  ('b1000000-0000-4000-8000-000000000005', 5, 'Be Filled With the Spirit', 'Ephesians 5:18–20',
   'When Paul described Spirit-filled worship, he reached for language God’s people already knew — psalms, hymns, and spiritual songs. The problem isn’t celebration; it’s celebration that loses sight of its purpose, like being drunk with wine. Paul doesn’t tell believers to suppress their joy; he tells them what should fill their hearts. The question isn’t whether we’ll be moved by something — it’s what’s moving us. David celebrated with all his might. Paul calls us to worship with Spirit-filled hearts. In both, God remains the focus.'),
  ('b1000000-0000-4000-8000-000000000005', 6, 'Heaven Celebrates What Is Good', 'Revelation 5 · Luke 15',
   'Genuine worship communicates something words alone cannot — an undeniable voice. Heaven celebrates the worthiness of the Lamb (Revelation 5:8–12), and Jesus tells us heaven rejoices when a sinner comes home (Luke 15). If our whole community joined us for worship next Sunday, would they leave convinced that we serve an awesome God and deeply love our Savior? If heaven knows how to celebrate what is good, perhaps we should rediscover the joy of celebrating it here.')
on conflict (sermon_id, position) do nothing;

commit;
