-- 032_sermons_public.sql — THE SWITCH: the public site starts reading sermons from
-- the database (until now it served its bundled copy). Apply only after
-- `node scripts/sync-sermons.mjs` has loaded and checked the data.
-- Undo (back to the bundled copy, nothing deleted): drop the "cisco public read"
-- policies on these seven tables.
--
-- Also turns on live updates: open pages refresh when sermons change.
-- cisco_slides is deliberately NOT in the realtime publication — its rows carry
-- presenter notes, and the column grant that hides them does not apply to
-- realtime payloads.
-- Idempotent. Requires 031.
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 032_sermons_public.sql

begin;

do $$
declare
  t text;
begin
  foreach t in array array['cisco_speakers', 'cisco_series', 'cisco_sermons', 'cisco_sermon_points',
                           'cisco_decks', 'cisco_slides', 'cisco_deck_state']
  loop
    execute format('drop policy if exists "cisco public read" on cisco.%I', t);
    execute format('create policy "cisco public read" on cisco.%I for select to anon, authenticated using (true)', t);
  end loop;

  foreach t in array array['cisco_speakers', 'cisco_series', 'cisco_sermons', 'cisco_sermon_points',
                           'cisco_decks', 'cisco_deck_state']
  loop
    begin
      execute format('alter publication supabase_realtime add table cisco.%I', t);
    exception
      when duplicate_object then null;
    end;
  end loop;
end;
$$;

alter table cisco.cisco_deck_state replica identity full;

commit;
