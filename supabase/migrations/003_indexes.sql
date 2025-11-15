-- 003_indexes.sql
create index if not exists idx_contacts_created_at on public.contacts (created_at desc);
create index if not exists idx_failed_emails_created_at on public.failed_emails (created_at asc);
create index if not exists idx_contact_rate_key on public.contact_rate_limits (key);