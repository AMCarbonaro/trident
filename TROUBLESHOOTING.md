# Troubleshooting "Failed to Create Account" Error

## Most Common Cause: Database Tables Don't Exist

If you're getting "Failed to create account", the most likely issue is that the database tables haven't been created in Supabase yet.

### Solution: Create Database Tables

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New query**

3. **Run the Schema**
   - Copy the entire contents of `lib/db/schema.sql` from this repository
   - Paste it into the SQL editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

4. **Verify Tables Were Created**
   - Go to **Table Editor** in the left sidebar
   - You should see three tables: `users`, `leads`, and `saved_views`

## Other Common Issues

### Check Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Verify all three variables are set:
   - `DATABASE_URL` - Should start with `postgresql://`
   - `NEXTAUTH_SECRET` - Should be a random string
   - `NEXTAUTH_URL` - Should be your Vercel URL (e.g., `https://trident-xyz.vercel.app`)

### Check Vercel Deployment Logs

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Check the **Logs** tab for any errors
4. Look for:
   - Database connection errors
   - Missing environment variable errors
   - Table not found errors

### Verify DATABASE_URL Format

Your `DATABASE_URL` should look like:
```
postgresql://postgres:PASSWORD@HOST:5432/postgres
```

**Important**: If your password contains special characters, they must be URL-encoded:
- `!` → `%21`
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

For example, if your password is `pass!word@123`, it should be:
```
postgresql://postgres:pass%21word%40123@db.xxx.supabase.co:5432/postgres
```

### Test Database Connection

If you want to test if your database is accessible, you can:

1. Check Supabase Dashboard → **Database** → **Connection pooling**
2. Make sure your database is **Active** (not paused)
3. Verify the connection string matches what you have in Vercel

## After Fixing

1. **Redeploy** your Vercel app (if you changed environment variables)
2. **Try signing up again**
3. Check the browser console (F12) for any client-side errors
4. Check Vercel logs for server-side errors

