-- 008_inbound_log.sql — one row per bulletin email received at bulletin@theciscochurch.org
-- Idempotent. Apply with:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 008_inbound_log.sql
--
-- Mailgun retries a webhook it thinks failed, so message_id is UNIQUE: a message
-- is processed exactly once. The log also records what happened to each email.

begin;

create table if not exists cisco.cisco_inbound_log (
  id            uuid primary key default gen_random_uuid(),
  message_id    text unique not null,
  sender        text,
  subject       text,
  status        text not null default 'received',
  bulletin_date date,
  detail        text,
  metadata      jsonb not null default '{}',
  received_at   timestamptz not null default now(),
  processed_at  timestamptz
);

-- RLS on, no policies, no grants: only the service role (Route Handlers) can touch it.
alter table cisco.cisco_inbound_log enable row level security;
revoke all on cisco.cisco_inbound_log from anon, authenticated;
grant all on cisco.cisco_inbound_log to service_role;

commit;
