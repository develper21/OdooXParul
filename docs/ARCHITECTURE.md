# 🏛️ System Architecture

## Traveloop — Premium AI Travel Companion

This document describes the overall system architecture, technology stack, folder structure, data flow, and key design decisions for the **Traveloop** application.

---

## 1. High-Level Architecture

Traveloop follows a **full-stack architecture** using **Next.js (App Router)** and **MongoDB**.

```
┌──────────┐   HTTPS   ┌─────────────────┐          ┌──────────────────┐          ┌───────────┐
│   User   │ ◄───────► │  Next.js        │ ◄──────► │  Next.js Backend │ ◄──────► │  MongoDB  │
│ (Web     │           │  Frontend       │          │  (API Routes /   │          │ (Atlas /  │
│ Browser) │           │  (RSC / Client) │          │  Route Handlers) │          │  Mongoose)│
└──────────┘           └─────────────────┘          └──────────────────┘          └───────────┘
        │                                                                                        │
        │                              ┌──────────────────┐                                      │
        └───────── SMTP Emails ◄────── │  Email Service   │                                      │
              (OTP / Invitations)      │  (Nodemailer)    │                                      │
                                       └──────────────────┘                                      │
```

**Flow:** User → Next.js Frontend → Next.js Backend (API Routes) → MongoDB, with Nodemailer handling transactional emails (OTP + trip invitations).

---

## 2. Technology Stack

Technologies used in the project and their purpose:

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | Next.js 15 (App Router) | UI framework & file-based routing |
| Language | TypeScript | Type safety and better developer experience |
| Styling | Tailwind CSS | Modern and responsive UI, design tokens |
| Animation | Framer Motion | Cinematic motion, hover depth, transitions |
| Icons | Lucide React | Consistent premium icon set |
| Maps | Leaflet + React-Leaflet | Interactive trip maps with markers & routes |
| Backend | Next.js API Routes (Route Handlers) | Backend logic and REST API endpoints |
| Database | MongoDB (driver: native `mongodb`) | Data and real-time capable storage |
| Authentication | JWT + bcrypt + HTTP-only cookies | User authentication & authorization |
| Email | Nodemailer (SMTP) | OTP emails & trip invitations |
| Deployment | Vercel | Hosting and deployment |
| Version Control | Git + GitHub | Source code management |

---

## 3. Folder Structure

The project follows an **App Router feature-based folder structure** to keep the code organized and scalable.

```
traveloop/
├── docs/                    # 📚 Project documentation (PRD, ARCHITECTURE, RULES…)
├── app/                     # Next.js App Router
│   ├── (auth)/              #   🔐 Auth group — login, signup, forgot/reset password
│   ├── (dashboard)/         #   📊 Dashboard group — protected app shell
│   │   ├── dashboard/       #     Overview, stats, upcoming adventures
│   │   ├── trips/           #     Trip list, create, detail sub-pages
│   │   │   └── [tripId]/    #       itinerary, activities, budget, map,
│   │   │                    #       notes, packing, edit
│   │   ├── settings/        #     Profile, preferences, security
│   │   └── join/            #     Join trip via code / link
│   ├── api/                 # REST API Route Handlers
│   │   ├── auth/            #   signup, login, logout, me, refresh, verify-otp…
│   │   ├── trips/           #   CRUD + [tripId] sub-resources
│   │   ├── invitations/     #   Trip invitations (email / link / code)
│   │   ├── users/           #   User search & profile
│   │   └── cities/          #   City autocomplete / search
│   ├── invite/              # Public invitation landing
│   ├── layout.tsx           # Root layout (fonts, providers)
│   ├── globals.css          # Design system tokens & component classes
│   └── page.tsx             # 🎬 Cinematic landing page
├── components/
│   ├── ui/                  # Reusable UI kit (GlassCard, StatCard, TripCard…)
│   ├── layout/              # Navbar, Sidebar, MobileSidebar
│   ├── map/                 # TripMapViewer, TripMapInner (Leaflet)
│   ├── common/              # Dashboard-specific shared components
│   └── ShareTripModal.tsx   # Collaboration modals (share, invite, crew)
├── lib/                     # Core utilities & shared logic
│   ├── mongodb.ts           #   MongoDB connection (cached client)
│   ├── auth.ts              #   JWT + bcrypt helpers
│   ├── email.ts             #   Nodemailer transport & templates
│   ├── api.ts               #   Frontend API client
│   ├── constants.ts         #   App-wide constants & enums
│   ├── types.ts             #   TypeScript interfaces
│   └── utils.ts             #   cn(), formatting helpers
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
├── middleware.ts            # Route protection (auth-token cookie check)
├── postman/                 # API collections for dev & prod
└── tailwind.config.ts       # Design tokens, animations, fonts
```

---

## 4. Data Models (MongoDB Collections)

| Collection | Key Fields | Notes |
| --- | --- | --- |
| `users` | name, email, passwordHash, avatar, preferences | Preferences: theme, currency, notifications |
| `trips` | title, destination, startDate, endDate, travelers, budget, status, joinCode, createdBy | status: planning / ongoing / completed / archived |
| `trip_members` | tripId, userId, role, permissions, status | role: owner / organizer / member |
| `activities` | tripId, title, location, date, time, category, cost | Per-day itinerary entries |
| `budget_items` | tripId, category, name, amount, date | Fintech-style expense log |
| `notes` | tripId, authorId, content | Shared trip notes |
| `packing_items` | tripId, name, category, packed | Checkable packing list |
| `map_points` | tripId, name, lat, lng, type, day, order | destination / hotel / activity / restaurant |
| `invitations` | tripId, invitedEmail, token, inviteMethod, status, expiresAt | email / link / code / search |
| `collaboration_activities` | tripId, type, actorId, message | Activity feed for the crew |
| `otp_tokens` | email, code, purpose, expiresAt | Password-reset OTPs |

---

## 5. Data Flow (Example: Creating a Trip)

```
1. User fills trip form            →  app/(dashboard)/trips/create/page.tsx
2. Client submits                  →  lib/api.ts  →  POST /api/trips
3. middleware.ts                   →  checks `auth-token` cookie (presence only)
4. Route handler                   →  app/api/trips/route.ts
   ├── verifyJwtToken()            →  lib/auth.ts (full JWT verification)
   ├── zod-style input validation  →  title, dates, budget
   └── connectToDatabase()         →  lib/mongodb.ts (cached client)
5. Insert document                 →  db.collection("trips").insertOne(...)
6. Response                        →  201 { success: true, data: trip }
7. Client                          →  redirect to /trips/[tripId] + toast
```

**Authentication flow:**

```
Login  → POST /api/auth/login → bcrypt.compare → JWT signed (30d)
       → Set-Cookie: auth-token (HTTP-only, Secure, SameSite=Lax)
       → middleware.ts guards all private routes on every request
```

**Collaboration flow:**

```
Owner invites → POST /api/trips/[tripId]/invitations
             → Nodemailer email with invite link / code
Member joins → POST /api/trips/[tripId]/join (or /api/invitations/[token])
             → trip_members entry created (role: member)
```

---

## 6. Key Design Decisions

| # | Decision | Rationale |
| --- | --- | --- |
| 1 | **Next.js App Router (RSC)** | One codebase for UI + API; server components cut client JS |
| 2 | **Route Groups `(auth)` / `(dashboard)`** | Separate layouts (cinematic vs app shell) without affecting URLs |
| 3 | **Middleware cookie-presence check + API-level JWT verify** | Fast edge redirect; secure real verification at the data layer |
| 4 | **Native `mongodb` driver with cached client** | No Mongoose overhead; connection reused across lambdas |
| 5 | **`serializeDocument()` helper** | Converts Mongo `_id` → `id` string for a clean API contract |
| 6 | **Join codes + email invitations + share links** | Frictionless collaboration for non-technical travelers |
| 7 | **Glassmorphism design tokens in `globals.css`** | One source of truth for the luxury visual language |
| 8 | **Central `lib/constants.ts`** | Categories, statuses, messages — no magic strings |

---

## 7. API Surface (Summary)

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login (sets `auth-token` cookie) |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/forgot-password` | Send OTP email |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/reset-password` | Set new password |
| GET/POST | `/api/trips` | List / create trips |
| GET/PATCH/DELETE | `/api/trips/[tripId]` | Trip detail operations |
| POST | `/api/trips/[tripId]/join` | Join via code |
| GET/POST | `/api/trips/[tripId]/activities` | Itinerary activities |
| GET/POST | `/api/trips/[tripId]/budget` | Budget items |
| GET/POST | `/api/trips/[tripId]/notes` | Shared notes |
| GET/POST | `/api/trips/[tripId]/packing` | Packing checklist |
| GET/POST | `/api/trips/[tripId]/map` | Map points (+ `/sync`) |
| GET/POST | `/api/trips/[tripId]/invitations` | Member invitations |
| GET | `/api/trips/by-code/[code]` | Resolve trip join code |
| GET | `/api/users` | User search (invite by search) |
| GET | `/api/cities` | City autocomplete |

Full request/response examples: see the [postman/](../postman/README.md) collections.

---

## 8. Environments

| Environment | Hosting | Database | Notes |
| --- | --- | --- | --- |
| Development | `localhost:3000` | Local / Atlas dev cluster | `.env.local` |
| Production | Vercel | MongoDB Atlas | `.env.production`, verified via Vercel checks |

---

*Last updated: Oct 1, 2026 — Maintained by Team Traveloop*
