# Deployment Guide - Frisspits Visitor Tracking

## Prerequisites
- Vercel account
- Project connected to Vercel

## Vercel Blob Storage Setup

The visitor tracking system uses Vercel Blob Storage to persist data in production (serverless environments).

### Step 1: Enable Vercel Blob Storage

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project (frisspits)
3. Go to **Storage** tab in the top menu
4. Click **Create Database**
5. Select **Blob** from the options
6. Click **Create** to create your Blob store
7. Vercel will automatically add the `BLOB_READ_WRITE_TOKEN` environment variable to your project

### Step 2: Verify Environment Variables

After creating the Blob store, verify the environment variable is set:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. You should see:
   - `BLOB_READ_WRITE_TOKEN` (automatically added by Vercel)

### Step 3: Deploy

1. Push your latest code to your repository:
   ```bash
   git add .
   git commit -m "Implement Vercel Blob storage for visitor tracking"
   git push
   ```

2. Vercel will automatically deploy your changes

3. Wait for deployment to complete

### Step 4: Test Tracking

1. Visit any diensten page on your production site:
   - https://your-site.vercel.app/diensten/vve-schoonmaken
   - https://your-site.vercel.app/diensten/glazenwasser
   - etc.

2. Check the admin dashboard:
   - Visit: https://your-site.vercel.app/admin/logs
   - Password: `Frisspits2025AdminSecurePassword123`

3. You should see visitor logs appearing in the dashboard

## How It Works

### Vercel Blob Storage
- Visitor logs are stored in a JSON blob file called `visitor-logs.json`
- The blob is stored in Vercel's cloud storage (not on the filesystem)
- Blob storage works perfectly in serverless environments
- Data persists across deployments

### Tracking Flow
1. User visits diensten page
2. `useVisitorTracking` hook runs with `required=true`
3. POST request sent to `/api/track-visitor`
4. Server fetches IP geolocation data
5. Log saved to Vercel Blob using `@vercel/blob` package
6. Old logs cleaned up (keeping last 100)

### Admin Dashboard
- Protected by hardcoded password
- Shows paginated logs (20 per page)
- Displays stats: total visitors, top page, top country
- Search functionality for filtering logs

## Troubleshooting

### Logs Not Appearing
- Check that `BLOB_READ_WRITE_TOKEN` is set in Vercel environment variables
- Check browser console for errors
- Check Vercel function logs for errors

### 401 Unauthorized on Admin Dashboard
- Verify you're using the correct password: `Frisspits2025AdminSecurePassword123`
- Clear browser cache and try again

### Blob Creation Issues
- Ensure you have the Blob add-on enabled in your Vercel project
- Ensure your Vercel plan supports Blob storage

## Privacy & GDPR Compliance

The visitor tracking system is GDPR-compliant:
- **Required tracking** on diensten pages for spam prevention (legitimate interest)
- **Optional tracking** on other pages (requires cookie consent)
- Privacy policy clearly explains data collection
- Cookie consent banner informs users

### Legal Basis
- **Diensten pages**: Legitimate interest (spam prevention)
- **Other pages**: Consent-based tracking

See [privacybeleid](src/app/privacybeleid/page.tsx) for the full privacy policy.
