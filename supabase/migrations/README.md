# Migrations — TheCiscoChurch.org

Numbered, idempotent, additive. Apply in numeric order on the droplet:

```bash
docker exec -i supabase-db psql -U supabase_admin -d postgres < 001_init.sql
docker exec -i supabase-db psql -U supabase_admin -d postgres < 002_seed.sql
```

**One-time instance step:** add `cisco` to `PGRST_DB_SCHEMAS` in the Supabase
docker `.env` and restart PostgREST (`docker compose up -d --force-recreate rest`),
or the API cannot see the schema.

After applying, verify from a machine with the anon key:

1. Anon can `select` from `cisco_sermons` (should succeed).
2. Anon `insert`/`update` on any table (must fail).
3. Anon `select notes from cisco_slides` (must fail — column not granted).
4. Realtime fires on `cisco_deck_state` updates (subscribe, then update a row).
