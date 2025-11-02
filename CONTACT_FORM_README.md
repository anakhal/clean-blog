# Contact Form - SMTP Configuration

## Railway Trial Limitation

Railway blocks SMTP ports (25, 465, 587) in their trial/hobby tier to prevent abuse. This means email sending via nodemailer will fail in production.

## Fallback Solution Implemented

The contact form now has a robust fallback system:

### How It Works:
1. **Tries to send email** via SMTP (works locally)
2. **If SMTP fails** (Railway blocks it):
   - Message is saved to MongoDB
   - User gets confirmation that message was received
   - Admin can view all messages at `/admin/contact-messages`

### All Messages Are Saved
Every contact form submission is saved to the database with:
- Name, email, phone, message
- Timestamp
- Email sent status (true/false)
- Error details (if email failed)

### Accessing Messages
**Admin Dashboard → Contact Messages Button**

Or directly at: `https://your-domain.com/admin/contact-messages`

## For Production (Paid Railway Plan)

If you upgrade to a paid Railway plan, SMTP will work automatically. No code changes needed!

The system will:
- ✅ Send email to admin
- ✅ Send auto-reply to user  
- ✅ Save to database as backup

## Alternative Solutions

If you need email in production without upgrading Railway:

1. **SendGrid** (Free tier: 100 emails/day)
   - Sign up at sendgrid.com
   - Use their API instead of SMTP
   
2. **Mailgun** (Free tier: 1000 emails/month for first 3 months)
   - API-based, no SMTP needed

3. **AWS SES** (Free tier: 62,000 emails/month)
   - Requires AWS account

## Current Setup (Development)

The app currently uses Gmail SMTP (from your .env):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

This works locally but will be blocked on Railway trial.
