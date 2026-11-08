-- 029_a_place_to_belong_content.sql — Lesson 2 content: key verse, summary, quotes, guide questions, points.
-- Mirrors aPlaceToBelong in lib/seed.ts. Idempotent. Requires 010, 024 and 027.
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 029_a_place_to_belong_content.sql

begin;

update cisco.cisco_sermons set
  scripture_ref = 'Ephesians 2:19 · Luke 15:11–32',
  scripture_text = '“You are no longer foreigners and strangers, but fellow citizens with God’s people and also members of his household.”',
  summary = 'Sometimes we can be exactly where we belong and still feel like we don’t belong. Paul says we are no longer foreigners and strangers, but members of God’s household. What makes us family isn’t everything we have in common with one another. It’s the Father we have in common. In Luke 15, the younger son left home believing something better was waiting somewhere else, and the older son stayed home living like a servant. Neither of them knew how to be a son, and the father went out to both of them. The Spirit we received does not make us slaves. It brought about our adoption to sonship. The Father has already come out to meet you. The door is open. There is a place for you.',
  nuggets = array[
  'Belonging isn’t about how much we have in common. It’s about the Father we have in common.',
  'The son came home questioning his worth. The father welcomed him without questioning his place.',
  'You can live in the Father’s house and still misunderstand the Father’s heart.'
],
  guide_questions = array[
  'Read Ephesians 2:19. Many people quietly carry questions like “Am I accepted?” and “Is there really a place for someone like me?” Which of these have you carried? Paul could have stopped at “citizens.” What is the difference between having rights and having a seat at the table?',
  'Read Luke 15:12–13. “He was in the right place, but he was looking at it through the wrong eyes.” When have you looked at a good place in your life — your home, your family, your church — and believed something better was waiting somewhere else?',
  'Read Genesis 3:5. The serpent didn’t say, “God is evil.” He said, “God is holding something back from you.” What voices are influencing your decisions right now? How can you tell which ones are speaking for the Father?',
  'Read Luke 15:18–22. The son rehearsed his speech all the way home, but the father interrupted it with a robe, a ring, and sandals. What speech about yourself have you been rehearsing to God? What do you think the Father would say back?',
  'Read Luke 15:28–31. The older son never left home and still described his life as “slaving.” Where do you see yourself in the older brother? Is there someone whose welcome you have found hard to celebrate?',
  'Read Romans 8:15. “A servant asks, ‘Am I good enough?’ A son asks, ‘What does my Father want?’” Which question do you ask more often? What is one way you could help make room for someone in our church family this week?'
]
where slug = 'a-place-to-belong' and summary is null;

insert into cisco.cisco_sermon_points (sermon_id, position, title, label, body)
values
  ('b1000000-0000-4000-8000-000000000011', 1, 'The Question We All Ask: Do I Belong Here?', 'Ephesians 2:19',
   'Many people quietly carry questions through life: Am I accepted? Am I good enough? Is there really a place for someone like me? Notice how far Paul says we have traveled. We were foreigners. We were strangers. Now we are fellow citizens. And then he goes one step further: members of his household. A citizen has rights. A member of the household has a seat at the table. We don’t all look alike, think alike, or even speak the same language. What makes us family isn’t everything we have in common with one another. It’s the Father we have in common. Are we seeing the Father’s house through the Father’s eyes, or through our own?'),
  ('b1000000-0000-4000-8000-000000000011', 2, 'When We Lose Sight of Home', 'Luke 15:12–13 · Genesis 3:5',
   'In that world, a son received his inheritance when his father died. To ask for it while the father was still living was to say, “I wish you were already gone.” Before this son ever left home, he had already left his father in his heart. He was in the right place, but he was looking at it through the wrong eyes. The serpent did the same thing in the garden. He didn’t say, “God is evil.” He said, “God is holding something back from you.” That is the same voice the younger son heard, and the same voice we hear. Sometimes the greatest danger isn’t simply making a wrong decision. It’s failing to recognize the voices influencing our decisions. When we abandon kingdom values, we become vulnerable to destructive values.'),
  ('b1000000-0000-4000-8000-000000000011', 3, 'The Father Never Stopped Making Room', 'Luke 15:18–22',
   'The son rehearsed his speech all the way home. He had decided what he was: not a son anymore, a hired hand. But you can only see someone “a long way off” if you are looking. The father had been watching that road. The son never finished his speech. The father would not let his son ask to be a slave. The best robe. A ring for his finger. Sandals for his feet. Servants went barefoot. Sons wore sandals. Every item said, “You are not a servant here. You are my son.” Families aren’t perfect, and we bring our own struggles into the family. Our Father knows all of them, and none of them diminish His love for us.'),
  ('b1000000-0000-4000-8000-000000000011', 4, 'Learning to See Home Through the Father’s Eyes', 'Luke 15:28–31',
   'The older son stayed home, but he became resentful. “All these years I’ve been slaving for you.” He did everything right, and he still thought of himself as a slave. The younger son came home planning to ask to be a servant. The older son had been living at home as though he already was one. Neither of them knew how to be a son. The father ran to the one who was far away, and he went out to the one standing just outside the door. If we are honest, most of us are the older brother. Belonging is not earned by years of faithful service any more than it is lost by years of failure. It is not about seniority. It is about the Father.'),
  ('b1000000-0000-4000-8000-000000000011', 5, 'There’s a Place for You', 'Romans 8:15',
   'This is the story of the two sons in a single verse. The Spirit you received does not make you slaves. It brought about your adoption to sonship. A servant asks, “Am I good enough? Have I done enough? Will I be sent away?” A son asks, “What does my Father want?” A servant lives in fear of losing his place. A son knows his place was never up for discussion. And a hired hand would never call the master “Abba.” Our belonging is rooted in our relationship with the Father. The church is not simply a place we attend, but a family where we belong, and where we learn to make room for one another.'),
  ('b1000000-0000-4000-8000-000000000011', 6, 'The Door Is Open', 'Luke 15:32',
   'The younger son needed to come home. The older son needed to recognize what he already had. And both needed to understand the heart of their father. Jesus never tells us whether the older brother went in to the celebration. The story ends with the father’s invitation still open. The next line of the story belongs to the one listening. Sometimes finding our place isn’t about finding somewhere new. It’s about learning to see the Father’s house through the Father’s eyes. The Father has already come out to meet you. The door is open. There is a place for you.')
on conflict (sermon_id, position) do nothing;

commit;
