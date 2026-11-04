-- The Family of God, Lesson 2: A Place to Belong (Nov 8, 2026) — slide + teaser.
-- Mirrors aPlaceToBelong in lib/seed.ts. Fills in the placeholder row from 024.
-- Idempotent. Requires 024.
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 027_a_place_to_belong.sql

begin;

update cisco.cisco_sermons
set
  thesis = 'A place at the Father’s table.',
  teaser = E'Everyone wants to belong somewhere—to be welcomed, accepted, and know that their life matters. But God offers us something greater than simply a place to fit in. Through Jesus Christ, He invites us into His own family.

What does it really mean to be a son or daughter of God? And how should that change the way we see ourselves and one another?

Join us this Sunday as we discover what it means to have a place at the Father’s table.',
  scripture_ref = 'Ephesians 2:19',
  scripture_text = '“You are no longer foreigners and strangers … but also members of his household.”',
  artwork_url = '/sermons/a-place-to-belong/artwork.jpg'
where slug = 'a-place-to-belong';

commit;
