-- 014_ask_better_questions.sql — Lesson 2 content: summary, quotes, guide questions, points.
-- Mirrors askBetterQuestions in lib/seed.ts. Idempotent. Requires 010 and 012.
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 014_ask_better_questions.sql

begin;

update cisco.cisco_sermons set
  summary = 'Kids go through a phase of asking why, how, and what — and somewhere along the way many of us stop. But much of what we enjoy exists because someone before us dared to ask a better question: penicillin, gravity, relativity. Proverbs 18:15 says the heart of the discerning acquires knowledge, and the ears of the wise seek it out. The posture of wisdom is not “Let me find what is wrong with this,” but “Let me understand this better.” The Bereans of Acts 17:11 were open enough to listen and grounded enough to examine, and Scripture calls them noble for it. A faith that welcomes questions isn’t weaker. Ask better questions, ask deeper questions, seek to understand — because questions lead to conversations, to investigating, to sharing, and someone in the kingdom gets blessed.',
  nuggets = array[
  'Wisdom is curious before it is critical.',
  'The posture of wisdom is not, “Let me find what is wrong with this.” It is, “Let me understand this better.”',
  'They were open enough to listen and grounded enough to examine.',
  'A faith that welcomes questions isn’t weaker.'
],
  guide_questions = array[
  'Think of a question someone once asked you — a child, a teacher, a friend — that changed how you saw something. What made it a better question than the ones you’d been asking?',
  'Read Proverbs 18:15. When you meet an idea or a teaching that is unfamiliar, which comes first for you: “Let me find what is wrong with this,” or “Let me understand this better”? What shapes that reaction?',
  'Read Matthew 6:33. What are you actively seeking right now? How is seeking different from being critical?',
  'Read Acts 17:10–12. The Bereans were open enough to listen and grounded enough to examine. Which of those two comes more naturally to you, and which takes more effort?',
  'Is there a question about your faith — or about something you’ve always simply assumed — that you have been hesitant to ask out loud? Who could you ask?',
  'Ask better questions. Ask deeper questions. Seek to understand. Which one will you practice this week, and with whom could that become a conversation?'
]
where slug = 'ask-better-questions' and summary is null;

insert into cisco.cisco_sermon_points (sermon_id, position, title, label, body)
values
  ('b1000000-0000-4000-8000-000000000004', 1, 'Aren’t You Glad Someone Asked a Better Question?', 'Curiosity',
   'Kids go through a phase of asking why, how, what. And much of what we enjoy exists because someone dared to ask a better question. Alexander Fleming noticed that mold had killed bacteria in one of his cultures and, instead of discarding it, investigated — penicillin. Isaac Newton wondered why an apple always fell straight toward the Earth — the start of gravity. Albert Einstein imagined traveling alongside a beam of light and questioned the assumptions about space and time.'),
  ('b1000000-0000-4000-8000-000000000004', 2, 'Wisdom Is Curious Before It Is Critical', 'Proverbs 18:15',
   'The posture of wisdom is not, “Let me find what is wrong with this.” It is, “Let me understand this better.” Wisdom begins by asking, “What can I learn?”'),
  ('b1000000-0000-4000-8000-000000000004', 3, 'Seeking Is Not the Same as Criticizing', 'Matthew 6:33',
   'Jesus says to seek first the kingdom of God. The Spanish word is buscar — to go looking, the way you go to the tool shed for the garden hoe or look for presents under the tree. Seeking goes looking for something good to find; being critical goes looking for what’s wrong.'),
  ('b1000000-0000-4000-8000-000000000004', 4, 'The Bereans: Open Enough to Listen, Grounded Enough to Examine', 'Acts 17:11',
   'They received the message with great eagerness and examined the Scriptures every day to see if what Paul said was true. Questioning the preacher was called noble, and nobody in that church got lectured for asking. These Jews stood out because other Jews were not like this. A faith that welcomes questions isn’t weaker — it’s Berean.'),
  ('b1000000-0000-4000-8000-000000000004', 5, 'Questions Lead Somewhere', 'Your Turn',
   'Ask better questions. Ask deeper questions. Seek to understand. Questions lead to conversations, to investigating, to sharing — and someone in the kingdom gets blessed.')
on conflict (sermon_id, position) do nothing;

commit;
