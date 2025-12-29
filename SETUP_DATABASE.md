# Database Setup Guide - Quick Start

## ⚠️ Important: Vercel Postgres Requires Paid Plan

Vercel Postgres is only available on paid Vercel plans ($20/month). If you're on the free tier, use **Supabase** (recommended) or **Neon** instead - they're free and easier!

---

## ✅ Recommended: Supabase (Free & Easy)

**Best option for getting started quickly with a free tier.**

### Steps:

1. **Sign up at Supabase**
   - Go to: https://supabase.com
   - Click "Start your project"
   - Sign up (can use GitHub)

2. **Create a New Project**
   - Click "New Project"
   - Fill in:
     - **Name:** trident-crm (or any name)
     - **Database Password:** Choose a strong password (save this!)
     - **Region:** Choose closest to you
   - Click "Create new project"
   - Wait ~2 minutes for setup

3. **Get Your Connection String**
   - Once project is ready, go to **Project Settings** (gear icon)
   - Click **Database** in the left sidebar
   - Scroll to **Connection string** section
   - Select **URI** tab
   - Copy the connection string (looks like: `postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`)
   - Replace `[YOUR-PASSWORD]` with the password you set in step 2

4. **Create Database Tables**
   - In Supabase dashboard, click **SQL Editor** (in left sidebar)
   - Click **New query**
   - Copy the entire contents of `lib/db/schema.sql` from this project
   - Paste into the SQL editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

5. **Add to Vercel**
   - Go to your Vercel project dashboard
   - Click **Settings** → **Environment Variables**
   - Add these variables:
     
     **Name:** `DATABASE_URL`  
     **Value:** (paste your Supabase connection string from step 3)
     
     **Name:** `NEXTAUTH_SECRET`  
     **Value:** (generate one: run `openssl rand -base64 32` in terminal, or use any random string)
     
     **Name:** `NEXTAUTH_URL`  
     **Value:** `https://your-app.vercel.app` (your Vercel deployment URL)
     
   - Make sure all are set for **Production**, **Preview**, and **Development**
   - Click **Save**

6. **For Local Development**
   - Create `.env.local` file in project root:
     ```env
     DATABASE_URL=your-supabase-connection-string-here
     NEXTAUTH_SECRET=your-secret-here
     NEXTAUTH_URL=http://localhost:3000
     ```

7. **Deploy**
   - Push your code to GitHub (if not already)
   - Vercel will automatically redeploy with new environment variables
   - Your app should now work!

---

## Alternative: Neon (Also Free)

If you prefer Neon:

1. Go to https://neon.tech
2. Sign up (can use GitHub)
3. Click "Create Project"
4. Choose name and region
5. Copy the connection string shown
6. Follow steps 4-7 above (same process)

---

## Quick Command to Generate NEXTAUTH_SECRET

Run this in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET` value.

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Neon Docs: https://neon.tech/docs
- Your schema file is at: `lib/db/schema.sql`
