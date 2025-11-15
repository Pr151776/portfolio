# Operations Playbook — Prakash Portfolio

## Common incidents

### Email send failure
1. Check Resend dashboard → “Events”.
2. Check `failed_emails` table.
3. Manually trigger retry function:
   ```bash
   curl -X POST https://<proj>.functions.supabase.co/retry_failed_emails \
     -H "Authorization: Bearer <RETRY_INVOKE_TOKEN>"
