-- Open /bulletin pages update live when a bulletin is published or edited.
-- RLS still applies to Realtime: anon only hears about published rows.
-- Idempotent. Requires 007.
-- Apply: docker exec -i supabase-db psql -U supabase_admin -d postgres < 028_bulletin_realtime.sql

do $$
begin
  alter publication supabase_realtime add table cisco.cisco_bulletins;
exception
  when duplicate_object then null;
end;
$$;
