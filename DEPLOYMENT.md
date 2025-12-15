# Deployment Instructions

## Prerequisites

1. **Supabase Project**
   - Create a new project at [supabase.com](https://supabase.com)
   - Note your project URL and anon key

2. **Razorpay Account**
   - Sign up at [razorpay.com](https://razorpay.com)
   - Get your API keys from the dashboard

3. **Vercel Account** (for deployment)
   - Sign up at [vercel.com](https://vercel.com)

## Step 1: Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the entire `schema.sql` file to create:
   - All tables (users, organizers, communities, events, tickets, payments)
   - Row Level Security policies
   - Necessary indexes

4. Verify tables were created in the Table Editor

## Step 2: Storage Setup (Optional)

1. In Supabase, go to Storage
2. Create buckets:
   - `event-images`
   - `community-images`
   - `organizer-logos`
3. Set appropriate policies for public read access

## Step 3: Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

## Step 4: Local Testing

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to test the application.

## Step 5: Deploy to Vercel

### Option A: Via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add all environment variables from `.env.local`
5. Click Deploy

### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

## Step 6: Configure Razorpay Webhook

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-domain.vercel.app/api/webhooks/razorpay`
3. Select events:
   - `payment.captured`
   - `payment.failed`
4. Copy the webhook secret and add to environment variables

## Step 7: Post-Deployment

1. Test authentication flow
2. Create a test organizer account
3. Create a test event
4. Test payment flow with Razorpay test mode
5. Verify webhook is receiving events

## Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check if RLS policies are properly set

### Payment Issues
- Ensure Razorpay is in test mode initially
- Verify webhook URL is accessible
- Check webhook secret matches

### Build Errors
- Run `npm run build` locally first
- Check for TypeScript errors
- Ensure all environment variables are set

## Production Checklist

- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] RLS policies tested
- [ ] Razorpay webhook configured
- [ ] Test user flows (signup, login, create event, purchase ticket)
- [ ] Switch Razorpay to live mode
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/analytics
