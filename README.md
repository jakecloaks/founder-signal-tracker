# Founder Signal Tracker

AI-powered outbound reconnaissance for agencies targeting local businesses and SMBs.

## Quick start

```bash
npm install
npm run dev:client    # UI + mock data (no API keys)
npm run dev           # UI + API (Google Places when configured)
```

Open http://localhost:5173/dashboard

## Google Places (optional)

1. Copy `.env.example` to `.env`
2. Add `GOOGLE_PLACES_API_KEY` from [Google Cloud Console](https://console.cloud.google.com/) (enable **Places API (New)**)
3. Run `npm run dev` (starts API on port 3001 + Vite on 5173)

Without a key, the app uses **simulated** local business data — full UI and scoring still work.

## Architecture

```
src/services/business/
  businessSearchService.ts   ← entry: searchBusinesses()
  mockBusinessProvider.ts    ← simulated Maps results
  placesApiBusinessProvider.ts ← POST /api/places/search
  enrichPlace.ts             ← Places → opportunity scores
  types.ts

src/data/mock/
  businessGenerator.ts       ← mock data only (not in UI)

server/services/places/
  googlePlacesProvider.mjs   ← Google Places Text Search
  placesSearchService.mjs    ← routes mock vs live
```

**Swap mock → live:** set `GOOGLE_PLACES_API_KEY` and run `npm run dev`. No UI changes required.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:client` | Frontend only, mock fallback |
| `npm run dev` | API + frontend (Places + optional enterprise analyze) |
| `npm run build` | Production build |

## PowerShell

```powershell
npm.cmd run dev
```
