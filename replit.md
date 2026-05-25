# Founder Signal Tracker

AI-powered outbound reconnaissance tool for agencies targeting local businesses and SMBs. Searches local businesses via Google Places and analyzes company data with AI.

## Architecture

- **Frontend:** React 19 + TypeScript, Vite, Tailwind CSS v4 — runs on port 5000
- **Backend:** Node.js Express API — runs on port 3001
- **Data:** Falls back to mock data when API keys are not configured

## Development

```bash
npm run dev         # Starts both frontend (port 5000) and backend API (port 3001)
npm run dev:client  # Frontend only with mock data fallback
npm run dev:server  # Backend API only
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `GOOGLE_PLACES_API_KEY` — enables live local business search via Google Places
- `NEWS_API_KEY` — enables news enrichment for company analysis
- `OPENROUTER_API_KEY` — enables AI-powered company analysis
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — optional Supabase integration

The app works without any API keys using simulated data.

## User Preferences

- Frontend runs on port 5000, backend on port 3001
