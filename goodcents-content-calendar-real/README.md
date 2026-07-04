# Goodcents Content Promotional Calendar

This is a real Next.js project foundation for the Goodcents Content Promotional Calendar.

## What is included

- Next.js app structure
- React components
- Dashboard
- Calendar workspace
- Campaign Library
- Documents & Links
- Marketing Insights
- Dynamic Create Item form
- Campaign detail drawer
- Editable and deletable campaigns
- Day modal with mass delete
- Editable and deletable links
- Holiday styling
- Supabase-ready client file
- Vercel-ready project structure

## Run locally

```bash
npm install
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Deploy to Vercel

1. Upload this folder to GitHub.
2. Import the repository into Vercel.
3. Click Deploy.

## Important

Right now data is saved in browser localStorage for the working demo.
The next step is connecting Supabase so Megan and Winnie share the same live data.

## Supabase next step

Create these tables later:

- campaigns
- links
- users
- activity_log
- comments
- files

The Supabase client is already prepared in `lib/supabaseClient.js`.
