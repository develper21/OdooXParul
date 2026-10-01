# 📋 Development Rules

## Traveloop — Project Guidelines for AI & Human Collaboration

This document defines the development rules, coding standards, and best practices for the **Traveloop** application. These rules ensure consistency, maintainability, security, and speed. Both AI assistants and human contributors must follow these guidelines.

---

## 1️⃣ General Principles

These rules apply to the entire project.

- ✅ Follow the project documentation (**PRD**, **ARCHITECTURE**, **DESIGN**) before building any feature.
- ✅ Keep the code clean, readable and well-structured.
- ✅ Prioritize simplicity and maintainability.
- ✅ Do not duplicate logic. Reuse existing components, utilities or services.
- ✅ Make small, focused changes instead of large, risky edits.
- ✅ Do not modify unrelated files.
- ✅ Write self-explanatory code with meaningful variable and function names.

---

## 2️⃣ Technology & Coding Standards

Rules related to the tech stack and coding style:

| Category | Rule |
| --- | --- |
| 🟣 **Language** | Use **TypeScript**. Avoid `any` unless absolutely necessary. |
| 🔷 **Framework** | Follow **Next.js (App Router)** best practices — server components by default, `"use client"` only when needed. |
| 🎨 **Styling** | Use **Tailwind CSS** and follow the design system in **DESIGN.md**. Reuse `.glass`, `.btn-primary`, `.input-glass` classes from `globals.css`. |
| 🧹 **Linting** | Follow **ESLint** (`next lint`) — no warnings on commit. |
| 📐 **Formatting** | Use consistent formatting (2-space indent, double quotes, semicolons). |
| 📦 **Dependencies** | Use stable, well-maintained packages only. Ask before adding new dependencies. |
| 📁 **File Naming** | Use clear names: `kebab-case` for routes, `PascalCase` for components (`TripCard.tsx`), `camelCase` for utilities (`formatDate.ts`). |

### Code Examples

```tsx
// ✅ Good — typed props, reuses GlassCard
import { GlassCard } from "@/components/ui";

interface TripStatProps {
  trips: Trip[];
  className?: string;
}

export function TripStat({ trips, className }: TripStatProps) {
  return (
    <GlassCard hover className={className}>
      <span>{trips.length} Trips</span>
    </GlassCard>
  );
}
```

```tsx
// ❌ Bad — any, inline styles, no reuse
export function Card(props: any) {
  return <div style={{ padding: 20 }}>{props.children}</div>;
}
```

---

## 3️⃣ Project Structure

Follow the defined folder structure in **ARCHITECTURE.md**.

- ✅ Place reusable UI components in **`/components/ui`**.
- ✅ Feature-specific code should be inside its route folder or `/components/common`.
- ✅ Database and external service logic should live in **`/lib`** (e.g., `mongodb.ts`, `email.ts`).
- ✅ Common utilities should be in **`/lib/utils.ts`** (e.g., `cn()`, date/currency formatting).
- ✅ Types and interfaces should be placed in **`/lib/types.ts`**.
- ✅ Do not create new folders without a clear reason — keep the structure predictable.

---

## 4️⃣ API & Backend Rules

- ✅ All Route Handlers live under **`/app/api`** and export named HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`).
- ✅ Every protected route must call **`verifyJwtToken()`** from `lib/auth.ts` — middleware alone is *not* enough.
- ✅ Always validate request body before touching the database.
- ✅ Use `connectToDatabase()` from `lib/mongodb.ts` — never create new MongoClients per request.
- ✅ Return documents via **`serializeDocument()`** so `_id` becomes a string `id`.
- ✅ Respond with the standard envelope:

```json
{ "success": true, "data": {} }
{ "success": false, "error": "Reason" }
```

- ✅ Correct status codes: `200` OK, `201` Created, `400` Bad input, `401` Unauthorized, `403` Forbidden, `404` Not found, `500` Server error.
- ✅ Wrap handler logic in `try/catch` and log errors server-side; never leak stack traces to clients.

### Membership & Authorization

- ✅ Before any trip mutation, verify the requester is a **trip member** (or owner).
- ✅ Role hierarchy: `owner` > `organizer` > `member`; respect `permissions` (`view` / `edit` / `admin`).
- ✅ Invitations must have an **expiry** and single-use tokens.

---

## 5️⃣ Security Rules

- 🔐 Passwords hashed with **bcrypt** (cost 10). Never store or log plain passwords.
- 🔐 JWT secrets only from environment variables (`JWT_SECRET`). Never hardcode.
- 🔐 Auth cookie `auth-token` must be **HTTP-only**, `Secure` in production, `SameSite=Lax`.
- 🔐 Validate ALL user input (length, type, format) on the server — client validation is UX only.
- 🔐 Never expose `MONGODB_URI`, SMTP credentials, or API keys to the client (`NEXT_PUBLIC_` prefix only for public values).
- 🔐 Sanitize any string rendered as HTML (invitation emails use templates — keep them escaped).
- 🔐 Keep `.env*` files out of Git (already in `.gitignore`).

---

## 6️⃣ Git & Collaboration Rules

- ✅ Branch naming: `feature/trip-itinerary`, `fix/login-redirect`, `chore/deps`.
- ✅ Commit style (Conventional Commits): `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- ✅ Small commits with clear messages — one logical change per commit.
- ✅ Never commit directly to `main`; use feature branches + Pull Requests.
- ✅ Update **TASKS.md** and **MEMORY.md** status columns as part of the same PR.
- ✅ Do not push `.env`, build output (`.next/`), or lockfile churn without review.

---

## 7️⃣ UI / UX Rules

- ✅ Reuse UI kit components (`GlassCard`, `AnimatedButton`, `StatCard`…) before creating new ones.
- ✅ Every async action shows a **loading state** and handles **error states** gracefully.
- ✅ All interactive elements need hover/active/focus states.
- ✅ Keep animations subtle (Framer Motion, 200–400ms) — motion should feel cinematic, not slow.
- ✅ Fully responsive: design mobile-first, verify at 375px / 768px / 1440px.
- ✅ Use Lucide icons consistently; never mix icon libraries.

---

## 8️⃣ Documentation Rules

- ✅ Keep `docs/` as the single source of truth: **PRD**, **ARCHITECTURE**, **RULES**, **DESIGN**, **TASKS**, **MEMORY**.
- ✅ Update ARCHITECTURE.md whenever you add an API route, collection, or top-level folder.
- ✅ Update DESIGN.md when introducing new colors, components or patterns.
- ✅ Every feature merged → tick its task in **TASKS.md** and log state in **MEMORY.md**.

---

## 9️⃣ Definition of Done

A task is complete only when:

- [ ] Code is typed (no `any`), lint-clean, and follows the design system
- [ ] Error, loading and empty states are handled
- [ ] Responsive on mobile, tablet and desktop
- [ ] API changes documented in ARCHITECTURE.md + Postman collection updated
- [ ] TASKS.md marked ✅ and MEMORY.md updated

---

*Last updated: Oct 1, 2026 — Maintained by Team Traveloop*
