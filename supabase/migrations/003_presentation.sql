-- 003_presentation.sql — outline-driven presentation module.
-- Additive only. Idempotent.
--
-- The controller (/slides/[deck]/present) renders each slide's
-- `outline_html` as a clickable segment of the full sermon outline; the
-- screen (/slides/[deck]) renders `html`, switching background loops by
-- the slide's `bg` key (defined in cisco_decks.metadata -> 'backgrounds').
-- `is_blank` lets the presenter drop the screen to background-only.

begin;

alter table cisco.cisco_slides
  add column if not exists outline_html text,
  add column if not exists bg text;

alter table cisco.cisco_deck_state
  add column if not exists is_blank boolean not null default false;

-- outline_html and bg are public (the outline is sermon content); `notes`
-- remains excluded from the anon grant.
grant select (id, deck_id, position, html, outline_html, bg)
  on cisco.cisco_slides to anon, authenticated;

commit;
