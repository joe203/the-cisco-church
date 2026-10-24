-- 018_make_room_for_a_new_life.sql — The New Thing series, Lesson 1 (Sept 13, 2026)
-- Mirrors makeRoomForANewLife / newThingSeries in lib/seed.ts. Idempotent, additive.
-- Requires 001, 010, 011. Apply:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 018_make_room_for_a_new_life.sql

begin;

insert into cisco.cisco_series (id, slug, title, scripture_ref, tagline, artwork_url)
values (
  'd1000000-0000-4000-8000-000000000002',
  'the-new-thing',
  'The New Thing',
  'Isaiah 43:19',
  'See, I am doing a new thing!',
  '/series/the-new-thing/artwork.jpg'
)
on conflict (slug) do nothing;

insert into cisco.cisco_sermons
  (id, slug, title, thesis, teaser, scripture_ref, scripture_text, sermon_date,
   artwork_url, summary, youtube_url, nuggets, guide_questions, speaker_id, is_featured,
   series_id, lesson_number)
values (
  'b1000000-0000-4000-8000-000000000007',
  'make-room-for-a-new-life',
  'Make Room for a New Life',
  'The danger isn’t forgetting what God has done. It’s believing His greatest works are all behind us.',
  null,
  'Isaiah 43:16–19',
  '“See, I am doing a new thing! Now it springs up; do you not perceive it?”',
  '2026-09-13',
  '/sermons/make-room-for-a-new-life/artwork.jpg',
  'Israel had crossed the Red Sea, and it was the story of their lives. Then Isaiah told them to stop dwelling on the past, because God was about to do something new. Are you still living in yesterday’s victory? And what has to die before something new can live?',
  'https://youtu.be/ykh8tU1NV2M',
  array[
    'Yesterday’s testimony was never meant to become today’s limitation.',
    'The danger is not that we forget what God has done. The danger is that we start believing God’s greatest works are all behind us.',
    'We want resurrection without a burial.',
    'Rebirth is the courage to begin again.'
  ],
  array[]::text[],
  'a1000000-0000-4000-8000-000000000001',
  false,
  'd1000000-0000-4000-8000-000000000002',
  1
)
on conflict (slug) do nothing;

insert into cisco.cisco_sermon_points (sermon_id, position, title, label, body)
values
  ('b1000000-0000-4000-8000-000000000007', 1, 'God Has Always Been Willing to Do Something New', 'Isaiah 43:16–19',
   'God reminds Israel of the Exodus: He made a way through the sea. That was their defining story. And then, almost surprisingly: “Forget the former things; do not dwell on the past. See, I am doing a new thing!” He isn’t saying the Exodus didn’t matter. We can have faith in what God did then and still have no expectation for what God can do now. Same God. Same faithfulness. Different way — through the wilderness this time.'),
  ('b1000000-0000-4000-8000-000000000007', 2, 'Yesterday’s Testimony Was Never Meant to Become Today’s Limitation', 'Remember, Don’t Remain',
   'Remember the Exodus. Remember Jericho. Remember David. He delivered Israel from Egypt, but I’m not sure He can deliver me. He brought down the walls of Jericho, but I’m still living behind walls of negativity. David killed Goliath, but the giants in my house still roam free. Don’t become so attached to what God did yesterday that you fail to recognize what God is doing now.'),
  ('b1000000-0000-4000-8000-000000000007', 3, 'Do You Not Perceive It?', 'Isaiah 43:19',
   'The new thing may already be beginning while we are still looking backward. New possibilities often start small — an idea, a question, a conversation: “What if…?” “Could we…?” Our first response to something unfamiliar is often to criticize it, dismiss it, or explain why it won’t work. You will never begin what you refuse even to imagine.'),
  ('b1000000-0000-4000-8000-000000000007', 4, 'New Things Disturb Old Things', 'Old Isn’t Bad',
   'The difficulty isn’t only believing that God can do something new. New things disturb what we already have: our ways of thinking, our expectations, traditions, and familiar ways of serving God. Old doesn’t necessarily mean bad. Making room for something new doesn’t mean the old thing was wrong; it means God isn’t finished with that stage and it’s time for a new season. Yesterday’s miracle isn’t the blueprint God is obligated to follow tomorrow.'),
  ('b1000000-0000-4000-8000-000000000007', 5, 'Something Has to Die for Something to Live', 'Romans 6:3–4',
   'We love new beginnings, new life, resurrection, rebirth. But Scripture keeps attaching new life to death. Romans 6:3–4 gives the movement: death, burial, resurrection, newness of life. “I have been crucified with Christ” (Galatians 2:20). The seed falls into the earth (John 12:24). We want resurrection without a burial. But the emphasis is on life, not death: what might God be trying to bring to life in me?'),
  ('b1000000-0000-4000-8000-000000000007', 6, 'You Cannot Enter This New Thing as the Same Old Man', 'John 3:1–8',
   'Nicodemus had history, Scripture, tradition, knowledge, identity, and position. Then Jesus said, “You must be born again.” He wasn’t offering an improvement or new information. He was offering a new beginning. Rebirth isn’t the end of the journey; it is the beginning (2 Corinthians 5:17; Ephesians 4:22–24). God isn’t only doing something new around us. He wants to begin something new in us. Rebirth is the courage to begin again.')
on conflict (sermon_id, position) do nothing;

commit;
