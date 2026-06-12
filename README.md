# Loanza
Frontend Design Experiment for Circlebreaker

A frontend-only design prototype of **Circle Breaker** (破圈俱乐部), a curated, decoded database of
global opportunities — fellowships, scholarships, summits, roles — for people breaking out of the
circle they were born into. Built per `FRONTEND-PROTOTYPE-BRIEF.md`, in the exact Loanza
(Rondesignlab) design language: porcelain ground on lavender washes, compact white panels,
Poppins with light-weight numerals and ▲/▼ deltas, fine tick-bar charts with 0–100 scales,
tick gauges, browser-chrome mockups, dot kickers, ink pill buttons.

> *Your circle is not your ceiling. · 你的圈子，不是你的天花板。*

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
npm run typecheck  # strict TS check
```

No backend, no network calls, no env vars. All data is local fixtures; all state lives in
memory + `localStorage` (key `circle-breaker:v1` — clear site data to reset).

## Demo account

| | |
|---|---|
| Email | `demo@circlebreaker.club` |
| Password | `breakout` |

Or click **“Tour with the demo account”** on the sign-in page. The demo member (Amara Diallo,
🇸🇳) ships verified, with membership, a complete profile, saved opportunities and live
closing-soon deadlines. Fresh sign-ups walk the real path: unverified banner → onboarding
stepper → profile tick-gauge → matching unlocks.

## What's inside

- **36 realistic opportunity fixtures** (Rhodes, Schwarzman, Chevening, Fulbright, DAAD, CERN,
  YC, UNV, JET, Yenching, Mastercard Foundation…) using the brief's exact controlled
  vocabularies, with bilingual editorial bodies, timelines and tips.
- **The database** — gallery / list / dot-matrix world **map** views, free-text search, every
  filter in §3.2 (type, mode, cascading Region→Country→City, funding, sector, duration range
  slider, Open/All with due-window, program-dates window, undated toggle, saved-only), live
  count, three sorts.
- **Eligibility lens** — searchable multi-nationality lens with “Open to you” badges, plus
  “Match my profile” (4-rule eligibility engine: nationality, residency, degree ladder with
  exact-enrolled semantics, experience bands).
- **Member dashboard** — tick-chart stat cards with scale labels and marker dots,
  profile-strength tick gauge with checklist, urgent deadlines, interest-ranked
  recommendations, saved list.
- **Resources hub** — six bilingual guides, category filters, membership gate (simulated
  one-click upgrade).
- **Simulated auth** — sign up / in / out, forgot → reset, email-verification banner; protected
  routes redirect.
- **Bilingual EN / 简体中文** everywhere — live toggle in the header, localized dates, vocab and
  CJK-appropriate tracking.
- **Designed states** — skeleton loading, distinct empty states (search / filters / saved),
  error states, branded 404 + error boundary.

### Demo tricks

- `?state=error` on `/opportunities` or `/resources` shows the designed error state.
- “Today” is pinned to **2026-06-11** (`src/lib/dates.ts`) so closing-soon / closed fixtures
  stay believable.
- The world map is rasterized at runtime from coarse continent polygons
  (`src/components/mapview.tsx`) — pins project with the same equirectangular transform.

## Stack

Vite · React 18 · TypeScript (strict) · react-router · hand-written CSS design system
(no UI libraries) · @fontsource Poppins + Noto Sans SC.
