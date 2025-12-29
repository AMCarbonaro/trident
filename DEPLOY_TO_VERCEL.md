# Deploying to Vercel

This guide will help you deploy your Content Creator CRM to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A Supabase database (or any PostgreSQL database) with the schema set up
3. The Vercel CLI installed (optional, for CLI deployment)

## Step 1: Push Your Code to GitHub (Recommended)

1. Create a new repository on GitHub
2. Initialize git in your project directory (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add your GitHub repository as remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js configuration
4. **Add Environment Variables** before deploying:
   - `DATABASE_URL` - Your PostgreSQL connection string (e.g., from Supabase)
   - `NEXTAUTH_SECRET` - A random secret string (generate one with: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI (if not installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to preview:
   ```bash
   npm run vercel
   ```

4. Deploy to production:
   ```bash
   npm run vercel:deploy
   ```

5. **Important**: Set environment variables in Vercel Dashboard:
   - Go to your project on Vercel
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`

## Step 3: Configure Environment Variables

After your first deployment, you need to set environment variables:

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables for **Production**, **Preview**, and **Development**:

   ```
   DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres
   NEXTAUTH_SECRET=your-random-secret-string-here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

   **Note**: 
   - Replace `PASSWORD` and `HOST` with your actual database credentials
   - Make sure to URL-encode special characters in the password (e.g., `!` becomes `%21`)
   - Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
   - Update `NEXTAUTH_URL` after you know your Vercel deployment URL

4. Click "Save"
5. Redeploy your application (Vercel will automatically redeploy if you trigger a new deployment)

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Try signing up for a new account
3. Verify that you can create leads and they persist
4. Check that authentication works correctly

## Troubleshooting

### Database Connection Issues

- Ensure your `DATABASE_URL` is correct and URL-encoded
- Check that your database allows connections from Vercel's IP addresses
- For Supabase, ensure you're using the connection pooling string if needed

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set and is a strong random string
- Ensure `NEXTAUTH_URL` matches your actual Vercel deployment URL exactly
- Check Vercel logs for any authentication errors

### Build Errors

- Check the build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally with `npm run build`

## Important Notes

- **Database**: Make sure your database is accessible from the internet (Vercel servers)
- **Secrets**: Never commit `.env.local` or any secrets to Git
- **URL Encoding**: If your database password contains special characters, URL-encode them:
  - `!` → `%21`
  - `@` → `%40`
  - `#` → `%23`
  - etc.

## Next Steps

After successful deployment:
1. Set up a custom domain (optional) in Vercel Dashboard
2. Enable Vercel Analytics (optional)
3. Set up monitoring and error tracking (optional)

