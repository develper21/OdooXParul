# 🧠 Project Memory

## Traveloop — Context, Progress & Important Notes

This document keeps track of the current state of the project, important decisions, and things to remember. It helps maintain continuity across development sessions and for new contributors.

---

## 📅 Quick Stats

| 🗓️ Last Updated | 🚀 Current Phase | 📈 Progress |
| :---: | :---: | :---: |
| **Oct 1, 2026** | **Phase 7** | `████████▌░░` 81% |

*AI & Future Features*

---

## 🎯 Current Status

- ✅ Project setup completed (Next.js 15, TypeScript, Tailwind, App Router)
- ✅ Git repository initialized and pushed to GitHub
- ✅ MongoDB connection established (`lib/mongodb.ts`, cached client)
- ✅ Authentication (signup, login, OTP reset, protected routes) completed
- ✅ Trip Management (CRUD, detail workspace, status lifecycle) completed
- ✅ Collaboration (invites via email/link/code, crew manager, activity feed) completed
- ✅ Itinerary, Activities, Budget, Notes, Packing, Map — completed
- 🔄 Working on AI features (itinerary generation, budget insights)

---

## ✅ Completed Tasks

| # | Task | Completed On |
| --- | --- | --- |
| 1.1 | Initialize Next.js project | May 10, 2026 |
| 1.2 | Configure Tailwind CSS + design tokens | May 10, 2026 |
| 1.3 | Set up Git repository | May 10, 2026 |
| 1.4 | Configure ESLint & formatting | May 10, 2026 |
| 1.5 | Environment variables setup | May 10, 2026 |
| 1.6 | Vercel deployment config | May 10, 2026 |
| 2.1 | MongoDB connection (`lib/mongodb.ts`) | May 10, 2026 |
| 2.2 | Signup API + page | May 11, 2026 |
| 2.3 | Login API + page | May 11, 2026 |
| 2.4 | Protect dashboard routes | May 11, 2026 |
| 2.5 | Forgot password + OTP flow | May 11, 2026 |
| 2.6 | Reset password flow | May 11, 2026 |
| 2.7 | Session refresh | May 11, 2026 |
| 3.1–3.8 | Trip management (CRUD, UI, statuses, covers) | May 12, 2026 |
| 4.1–4.8 | Collaboration system (members, invites, crew) | Jun 12, 2026 |
| 5.1–5.8 | Itinerary, activities, budget, notes, packing, map | Jun 12, 2026 |
| 6.1–6.6 | Dashboard, settings, landing polish, Postman | Sep 15, 2026 |

---

## 🔄 In Progress

| # | Task | Started On | Notes |
| --- | --- | --- | --- |
| 7.1 | AI itinerary generation | Sep 15, 2026 | Smart trip suggestions from destination + dates |
| 7.2 | AI budget insights | Sep 15, 2026 | Spending pattern analysis per category |

---

## 🔑 Key Technical Decisions

| Decision | Reason |
| --- | --- |
| Next.js 15 App Router | Server components + API routes in one codebase |
| Native `mongodb` driver (no Mongoose) | Lighter, cached client across serverless invocations |
| JWT in HTTP-only cookie (`auth-token`) | XSS-safe sessions, 30d expiry |
| Middleware checks cookie presence only | Fast edge redirects; real verification in API handlers via `verifyJwtToken()` |
| Route groups `(auth)` / `(dashboard)` | Different layouts without URL changes |
| `_id` → `id` via `serializeDocument()` | Clean API contract for the frontend |
| Glassmorphism tokens in `globals.css` | Single source of truth for the luxury design language |
| Join codes + email + link invites | Frictionless onboarding for non-technical travelers |

---

## 📁 Important File Locations

| File | Purpose |
| --- | --- |
| [lib/mongodb.ts](../lib/mongodb.ts) | DB connection (cached) + `serializeDocument()` |
| [lib/auth.ts](../lib/auth.ts) | bcrypt hashing + JWT sign/verify |
| [lib/api.ts](../lib/api.ts) | Frontend API client |
| [lib/constants.ts](../lib/constants.ts) | Categories, statuses, colors, messages |
| [lib/types.ts](../lib/types.ts) | All TypeScript interfaces |
| [middleware.ts](../middleware.ts) | Route protection |
| [app/globals.css](../app/globals.css) | Design system tokens & glass classes |
| [components/ui/](../components/ui/index.ts) | UI kit (GlassCard, StatCard, TripCard…) |
| [postman/](../postman/README.md) | API collections (dev + prod) |

---

## ⚠️ Important Notes & Gotchas

1. **Env vars required:** `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `NEXT_PUBLIC_APP_DOMAIN` — see [.env.example](../.env.example). Email needs `EMAIL_HOST/PORT/USER/PASS/FROM`.
2. **Never trust middleware alone** — it only checks cookie presence. Always `verifyJwtToken()` inside API routes.
3. **Always serialize Mongo docs** — raw `_id` (ObjectId) breaks the frontend; route through `serializeDocument()`.
4. **Membership check before mutations** — every `/api/trips/[tripId]/*` write must confirm the requester is a member/owner.
5. **Invitations expire** — `expiresAt` is enforced; tokens are single-use.
6. **Leaflet needs dynamic import** (`ssr: false`) — window access breaks server rendering.
7. **JWT_SECRET throws at import time if missing** — `lib/auth.ts` fails fast; set it before running the app.

---

## 🧭 Next Session Checklist

- [ ] Continue **7.1** — AI itinerary generation
- [ ] Continue **7.2** — AI budget insights
- [ ] Decide: budget per-member vs per-trip (PRD open question)
- [ ] Evaluate PWA/offline map caching

---

*Last updated: Oct 1, 2026 — Maintained by Team Traveloop*
