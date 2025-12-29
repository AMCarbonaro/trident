# Quick Setup Instructions

## 1. Create `.env.local` file

Create a file named `.env.local` in the root of your project with:

```env
DATABASE_URL=postgresql://postgres:Ineedusna1!Harvard1!@db.grxkfockjuozyykkysnb.supabase.co:5432/postgres
NEXTAUTH_SECRET=C3IRO6aItg9dLJkWJmHUjAKXONvpoGm21Yjs7MGzc1c=
NEXTAUTH_URL=http://localhost:3000
```

## 2. Run the Database Schema

Go to your Supabase dashboard:
1. Open https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste the contents of `lib/db/schema.sql`
6. Click **Run** (or press Cmd/Ctrl + Enter)

This will create all the necessary tables.

## 3. Test Locally

```bash
npm run dev
```

Then visit http://localhost:3000

## 4. Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/dashboard
3. Click **Add New Project**
4. Import your GitHub repository
5. Add Environment Variables in Vercel:
   - `DATABASE_URL` = your Supabase connection string
   - `NEXTAUTH_SECRET` = C3IRO6aItg9dLJkWJmHUjAKXONvpoGm21Yjs7MGzc1c=
   - `NEXTAUTH_URL` = https://your-app.vercel.app (update after first deploy)
6. Click **Deploy**

After first deployment, update `NEXTAUTH_URL` in Vercel to match your actual deployment URL.

## That's it! 🎉

Your multi-tenant CRM platform is ready to use. Users can now:
- Sign up for accounts
- Log in
- Create and manage their own leads
- All data is isolated per user

