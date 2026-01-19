# Contact Form Email Setup Guide

Your contact form is now configured to send emails directly to your inbox! Follow these steps to complete the setup.

## 🚀 Quick Setup

### Step 1: Get Your Resend API Key (FREE)

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month free)
3. Verify your email address
4. Go to **API Keys** section
5. Click **Create API Key**
6. Copy your API key (starts with `re_`)

### Step 2: Add Environment Variables

Open your `.env` file and add these two lines:

```env
RESEND_API_KEY="re_your_actual_api_key_here"
ADMIN_EMAIL="your-email@example.com"
```

Replace:
- `re_your_actual_api_key_here` with your actual Resend API key
- `your-email@example.com` with YOUR email address where you want to receive contact form submissions

### Step 3: Run Database Migration

Run this command in your terminal:

```bash
npx prisma db push
```

This will create the `contact_submissions` table in your database.

### Step 4: Restart Your Dev Server

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
```

## ✅ Testing Your Setup

1. Go to `http://localhost:3000/contact`
2. Fill out the contact form
3. Click "Send Message"
4. Check both:
   - Your email inbox (you should receive the message)
   - The user's email (they should receive a confirmation)

## 📧 What Emails Are Sent?

### Admin Email (You receive this)
- Subject: "New Contact Form: [Subject]"
- Contains: Name, Email, Subject, and Message
- Includes a "Reply" button for easy response

### User Auto-Reply (User receives this)
- Subject: "We received your message - [Subject]"
- Confirms their message was received
- Includes a copy of their message
- Sets expectations for response time (24 hours)

## 🎨 Customizing Emails

### Change the Sender Name/Email

Edit `lib/email.ts` and update the `from` field:

```typescript
from: 'YourCompany <noreply@yourdomain.com>'
```

**Note:** With the free Resend plan, you can only send from `onboarding@resend.dev`. To use your own domain:
1. Add your domain in Resend dashboard
2. Add DNS records (Resend provides these)
3. Verify your domain
4. Update the `from` field in the code

### Customize Email Templates

Edit `lib/email.ts` to change:
- Email styling (CSS in the `<style>` tags)
- Email content (HTML in the template strings)
- Response time expectations
- Company branding

## 🔧 Advanced Configuration

### Multiple Admin Emails

In `lib/email.ts`, change the `to` array:

```typescript
to: ['admin1@example.com', 'admin2@example.com', 'admin3@example.com']
```

### Disable Auto-Reply to Users

In `lib/email.ts`, comment out or remove this section:

```typescript
// const userEmail = await resend.emails.send({ ... })
```

### Custom Email Templates

You can create separate template files for better organization:

```
lib/
  email/
    templates/
      contact-admin.ts
      contact-user.ts
    send.ts
```

## 🗄️ Viewing Submissions in Database

Contact form submissions are saved in your database even if email sending fails.

To view them, you can:

1. Use the API endpoint:
   ```
   GET http://localhost:3000/api/contact?status=UNREAD
   ```

2. Access directly via Prisma Studio:
   ```bash
   npx prisma studio
   ```
   Then navigate to `ContactSubmission` table

3. Build an admin dashboard (future enhancement)

## 🐛 Troubleshooting

### "Email sending failed" but form still works
- Check your `RESEND_API_KEY` in `.env`
- Ensure you've restarted the dev server
- Verify your API key is active in Resend dashboard
- Check console logs for specific error messages

### Emails not arriving
- Check spam/junk folder
- Verify `ADMIN_EMAIL` is correct in `.env`
- Check Resend dashboard for delivery logs
- Ensure you're using `onboarding@resend.dev` as sender (for free plan)

### Database errors
- Run `npx prisma db push` to sync schema
- Check your `DATABASE_URL` in `.env`
- Ensure database is accessible

### API Key errors
- Make sure API key starts with `re_`
- No quotes or spaces around the key in `.env`
- API key should be from resend.com, not another service

## 📊 Email Tracking

Resend provides:
- Delivery tracking
- Open rates
- Click tracking
- Bounce handling

Access these in your Resend dashboard at [https://resend.com/emails](https://resend.com/emails)

## 💰 Pricing

**Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Perfect for small to medium traffic websites

**Paid Plans:**
- Start at $20/month for 50,000 emails
- No daily limits
- Custom domains included
- Priority support

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Rotate API keys regularly** - Generate new keys every few months
3. **Use environment variables** - Never hardcode sensitive data
4. **Rate limiting** - Consider adding rate limiting to prevent spam
5. **CAPTCHA** - Add reCAPTCHA for production use

## 🚀 Production Deployment

Before deploying to production:

1. **Add your domain to Resend**
2. **Update environment variables** on your hosting platform (Vercel, etc.)
3. **Test thoroughly** in production environment
4. **Set up monitoring** for email delivery failures
5. **Consider adding CAPTCHA** to prevent spam

## 📝 Example .env Configuration

```env
# Database
DATABASE_URL="your-database-url"

# Email Configuration
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
ADMIN_EMAIL="admin@yourcompany.com"

# Other required variables...
```

## ✨ Features

✅ **Instant email notifications** to admin
✅ **Auto-reply to users** with confirmation
✅ **Beautiful HTML email templates**
✅ **Database backup** of all submissions
✅ **Validation** on all form fields
✅ **Error handling** and fallbacks
✅ **Mobile-responsive** email templates
✅ **Professional branding** in emails

## 🎉 You're All Set!

Your contact form is now fully functional and will send beautiful emails directly to your inbox!

Need help? Check the [Resend Documentation](https://resend.com/docs) or open an issue.
