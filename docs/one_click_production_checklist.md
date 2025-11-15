# One-Click Production Checklist — Prakash Portfolio

Before enabling public traffic:
1. ReCAPTCHA
   - [ ] reCAPTCHA v3 site & secret keys created and added.
   - [ ] Add domains: `portfolio-pr151776.vercel.app` and `localhost`.

2. DNS & Email
   - [ ] Configure sending domain (optional but recommended): add SPF, DKIM, DMARC for `yourdomain.com`.
   - [ ] Verify sending domain in Resend.

3. Secrets
   - [ ] Set Supabase secrets (SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, OPENAI_API_KEY, RECAPTCHA_SECRET)
   - [ ] Set ADMIN_SECRET (rotate regularly)
   - [ ] Set NOTIFY_EMAIL = pr151776@gmail.com

4. Migrations & Deploy
   - [ ] Commit migrations to `supabase/migrations`
   - [ ] Push to main → GitHub Actions deploy should run
   - [ ] Confirm `contact` & `retry_failed_emails` & `admin` functions deployed

5. Tests
   - [ ] Test contact form locally using Vite (with VITE_SUPABASE_FUNCTION_URL pointing to staging)
   - [ ] Confirm recaptcha token sends & validated
   - [ ] Confirm contact inserted into contacts table
   - [ ] Confirm emails (notify + auto-reply) delivered
   - [ ] Simulate spam message, ensure classified as spam (and not emailed)
   - [ ] Run scheduled retry job manually (cURL)

6. Monitoring & Alerts
   - [ ] Add Sentry / error webhook or log forwarder
   - [ ] Add Resend webhooks for bounces to `/resend_webhook` (optional)
   - [ ] Add Slack webhook for GitHub Actions failures

7. Backups & Retention
   - [ ] Configure daily backups to S3 (check scheduled job)
   - [ ] Setup S3 lifecycle rules (30 days)

8. Go Live
   - [ ] Enable public traffic
   - [ ] Inspect first 24 hours’ logs for false positives / failed sends
