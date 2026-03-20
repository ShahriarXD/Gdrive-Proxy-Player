# CloudStream by KM

CloudStream is a Next.js 15 App Router application that lets users authenticate with Google, explore their Google Drive in a dashboard UI, and stream video files through a range-aware proxy route.

## Stack

- Next.js 15 App Router
- Auth.js / NextAuth v5 beta with Google OAuth
- Tailwind CSS v4 + shadcn styling primitives
- Video.js for the media player
- Google Drive REST API

## Environment variables

Create a local `.env.local` file with:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=replace-with-google-client-id
GOOGLE_CLIENT_SECRET=replace-with-google-client-secret
```

## Google Cloud setup

1. Enable the Google Drive API.
2. Create OAuth 2.0 credentials.
3. Add your local or deployed origin to Authorized JavaScript Origins.
4. Add `http://localhost:3000/api/auth/callback/google` for local development.
5. Add `https://your-app.vercel.app/api/auth/callback/google` for production.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Vercel deployment notes

- Add all four environment variables in the Vercel dashboard.
- Update `NEXTAUTH_URL` to your production URL.
- The stream route is configured with `runtime = "edge"` and `dynamic = "force-dynamic"`.
- Middleware protects `/api/*` routes and skips `/api/auth/*`.

# Gdrive-Proxy-Player
