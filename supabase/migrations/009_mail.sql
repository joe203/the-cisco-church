-- 009_mail.sql — the theciscochurch.org inbox (/staff/mail)
-- Idempotent. Apply with:
--   docker exec -i supabase-db psql -U supabase_admin -d postgres < 009_mail.sql
--
-- Mail for any @theciscochurch.org address (except bulletin@, which feeds the
-- bulletin importer) is forwarded by Mailgun to /api/inbound/mail and stored
-- here. Sent mail (replies and composed messages) is kept here too, in the
-- 'sent' folder. Service-role only: RLS is on with no policies, so no browser
-- can read it — the /staff/mail Route Handlers are the only door.

begin;

create table if not exists cisco.cisco_mail (
  id          uuid primary key default gen_random_uuid(),
  -- UNIQUE so a Mailgun retry cannot store a message twice. Sent rows leave this
  -- NULL on purpose: Mailgun delivers a copy of a message sent to our own domain
  -- back with the SAME Message-Id, and that copy must still be recordable.
  message_id  text unique,
  folder      text not null default 'inbox' check (folder in ('inbox', 'sent')),
  status      text not null default 'received'
                check (status in ('received', 'read', 'replied', 'archived', 'sent')),
  from_email  text not null,
  from_name   text,
  to_email    text,
  subject     text not null default '',
  text_body   text,
  html_body   text,
  received_at timestamptz not null default now(),
  read_at     timestamptz,
  replied_at  timestamptz,
  archived_at timestamptz,
  -- replies[], recipients[] (sent), spam score, attachment names, alert flag …
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists cisco_mail_folder_received_idx
  on cisco.cisco_mail (folder, received_at desc);

alter table cisco.cisco_mail enable row level security;
revoke all on cisco.cisco_mail from anon, authenticated;
grant all on cisco.cisco_mail to service_role;

commit;
