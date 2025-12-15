# CAS Platform - Community As A Service

A full-stack platform for discovering and managing local communities, events, and meetups.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: Zustand
- **Payments**: Razorpay
- **Form Validation**: Zod + React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Razorpay account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cas-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
- Supabase URL and keys
- Razorpay keys

4. Set up the database:
- Go to your Supabase project
- Run the SQL from `schema.sql` in the SQL Editor

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (public)/     # Public pages (landing, search, details)
│   ├── (auth)/       # Auth pages (login, signup)
│   ├── (organizer)/  # Organizer dashboard
│   ├── (admin)/      # Admin dashboard
│   └── api/          # API routes
├── components/       # React components
│   ├── ui/           # shadcn/ui components
│   ├── common/       # Shared components
│   ├── forms/        # Form components
│   └── admin/        # Admin components
├── services/         # API service wrappers
├── store/            # Zustand stores
├── lib/              # Utilities
└── types/            # TypeScript types
```

## Features

### For Users
- Browse events and communities
- Search and filter
- Join events with ticket purchase
- User profile management

### For Organizers
- Create and manage events
- Create and manage communities
- Dashboard with analytics
- Payment collection via Razorpay

### For Admins
- Approve/reject listings
- View payment history
- Platform analytics

## Database Schema

See `schema.sql` for the complete database schema including:
- Users and organizers
- Events and communities
- Tickets and payments
- Row Level Security (RLS) policies

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Supabase

1. Create a new project
2. Run the SQL schema
3. Configure authentication providers
4. Set up storage buckets for images

## Payment Integration

The platform uses Razorpay for payments:
- **Listing fees**: Organizers pay to publish events
- **Ticket purchases**: Users pay to join events

Configure Razorpay webhook URL: `https://yourdomain.com/api/webhooks/razorpay`

## License

MIT
