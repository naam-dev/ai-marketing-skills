# Insight Clinic — Web App

A full-stack Next.js web application for Insight Clinic Islington, backed by a Supabase (PostgreSQL) online database.

## Stack

| Layer    | Tech |
|----------|------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database  | Supabase (PostgreSQL, online, free tier) |
| Styling   | Tailwind CSS |
| Deploy    | Vercel (recommended) |

## Features

- **Homepage** — Hero, services, how it works, testimonials, lead magnet, team from DB
- **Services page** — Full detail for all 6 disciplines + functional testing
- **About page** — Team from database (editable without code)
- **New Patients page** — Booking info, fees, directions
- **FAQ page** — Dynamic FAQs from database, category filter, accordion
- **Admin dashboard** `/admin` — View & manage appointment requests, discovery calls, email leads
- **API routes** — POST /api/book, /api/discovery, /api/leads → saved to Supabase

## Setup

### 1. Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor → New Query**
3. Paste and run `supabase/schema.sql`
4. Copy your **Project URL** and **anon key** from Settings → API

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_PASSWORD=choose-a-strong-password
```

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
npx vercel
```

Add the three environment variables in Vercel dashboard → Settings → Environment Variables.

## Admin dashboard

Visit `/admin` and enter the password set in `NEXT_PUBLIC_ADMIN_PASSWORD`.

From here you can:
- View all appointment booking requests (with status: pending / confirmed / cancelled)
- View all discovery call requests
- View all email leads from the lead magnet
- Update appointment and call statuses inline

## Database schema

| Table | Purpose |
|-------|---------|
| `appointments` | Consultation booking requests |
| `discovery_calls` | Free 15-min call requests |
| `leads` | Email subscribers (lead magnet) |
| `practitioners` | Team members (edit in Supabase dashboard) |
| `faqs` | FAQ content (edit in Supabase dashboard) |

To add/edit practitioners or FAQs, open your Supabase dashboard → Table Editor.
