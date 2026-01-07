# ADHD Command Centre

Phone-first PWA MVP for gentle ADHD support.

## Requirements
- Node.js 18+
- npm

## Setup
```bash
npm install
npm run prisma:generate
npm run prisma:migrate
```

Create a `.env` file from `.env.example` and fill in Google OAuth credentials.

## Google OAuth + Calendar API
1. Create a Google Cloud project.
2. Enable the Google Calendar API.
3. Configure OAuth consent screen (external) and add the calendar scope.
4. Create OAuth credentials (Web application) and add `http://localhost:3000/api/auth/callback/google` as a redirect URI.
5. Copy `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into `.env`.

## Run
```bash
npm run dev
```

## File tree summary
```
src/
  app/            # App Router pages, API routes, and layouts
  components/     # UI and feature components
  lib/            # Prisma, helpers, and suggestion engine
  styles/         # Tailwind globals
prisma/           # Schema and migrations
public/           # PWA assets and service worker
```

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run test` - run unit tests
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run SQLite migrations
