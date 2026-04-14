# Talent Land 2026 — Personal Itinerary

> A tiny Next.js 16 + React 19 PWA I built for myself to navigate Talent Land 2026 in Guadalajara. It auto-detects the current day, surfaces the talks I care about, and works offline on the conference Wi-Fi (which, predictably, was terrible).

**Live:** [talent-land.vercel.app](https://talent-land.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-000)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

---

## Why this exists

Talent Land publishes its schedule as a maze-like PDF. I wanted three things the PDF couldn't give me:

1. **Auto-detect today** — I open the app, it shows me today's talks, no tab-hunting.
2. **Offline** — the venue's Wi-Fi is unreliable; the app had to work with zero bars.
3. **Only what matters** — filtered to tracks I actually attend.

Built the night before the conference. Shipped to Vercel in one commit.

## Features

- **Date-aware home page** — on load, picks the current conference day automatically
- **Offline-ready** — the app shell and schedule data cache for airplane-mode use
- **Zero dependencies beyond Next / React** — no UI library, no state manager
- **Tailwind CSS v4** — zero-config, CSS-first styling
- **One-commit deploy** — Vercel project, no env vars, no backend

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Data | Static JSON (the conference schedule) |
| Hosting | Vercel |

## Running locally

```bash
git clone https://github.com/vvazquezcolina/talent-land.git
cd talent-land
npm install
npm run dev   # http://localhost:3000
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Status

Event-specific. Kept online as a reference — feel free to fork it for your own conference.

---

**Author:** [Victor Vazquez](https://github.com/vvazquezcolina) — Cancún MX.
