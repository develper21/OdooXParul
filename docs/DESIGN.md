# 🎨 Design System

## Traveloop — Cinematic. Luxurious. Alive.

This document defines the visual design system, UI components, and user experience guidelines for **Traveloop**. The goal is to create a modern, immersive, and traveler-friendly interface with a consistent premium identity across every screen.

---

## 1. Design Principles

| | | |
| --- | --- | --- |
| 🌌 **Cinematic & Immersive**<br>Every screen should feel like a luxury travel film — depth, glow and motion. | 🍃 **Minimal & Clean**<br>Reduce clutter and focus on the journey, not the UI. | 🧊 **Glassmorphism First**<br>Frosted glass surfaces, ambient glow, layered depth. |
| ⚡ **Consistent**<br>Follow a unified design system — one source of truth in `globals.css`. | 📱 **Responsive**<br>Mobile-first layouts that scale beautifully to large displays. | ✨ **Alive**<br>Subtle motion everywhere — hover depth, floating glows, gradients. |

---

## 2. Color Palette

Primary colors used across the application (defined as CSS variables in `app/globals.css` and consumed via Tailwind):

| Swatch | Token | HSL Value | Usage |
| --- | --- | --- | --- |
| 🟣 `#7c3aed` | `--primary` | `268 80% 58%` | Main brand color — buttons, links, active states |
| 🟠 `#f97316` | `--secondary` | `25 95% 56%` | Secondary actions, sunset accents, badges |
| 🔵 `#06b6d4` | `--accent` | `190 95% 48%` | Success messages, highlights, sapphire glows |
| 🌑 `#050a14` | `--background` | `220 30% 5%` | Deep navy app background |
| 🃏 `hsl(220 25% 9%)` | `--card` | `220 25% 9%` | Card surfaces |
| ⚪ `hsl(215 18% 52%)` | `--muted-foreground` | `215 18% 52%` | Secondary text, captions |
| 🔴 `#ef4444` | `--destructive` | `0 84% 60%` | Error messages, validation, destructive actions |
| 🟡 `#f59e0b` | warning | — | Warnings, caution states, gold buttons |
| 🟢 `#10b981` | success | — | Completed tasks, positive changes |

### Gradient Library

```css
.text-gradient          /* a78bfa → 67e8f9 → f472b6  (signature brand gradient) */
.text-gradient-sunset   /* c084fc → f97316           (hero headings) */
.text-gradient-gold     /* fbbf24 → d97706           (luxury accents) */
.text-gradient-ocean    /* 38bdf8 → 818cf8           (map / water sections) */

.btn-primary            /* 135deg: #7c3aed → #db2777 + purple glow shadow */
.btn-gold               /* 135deg: #f59e0b → #d97706 (premium CTAs) */
```

---

## 3. Typography

We use **Inter** as the primary font for a clean, modern and highly readable interface, with **Playfair Display** for luxury serif accents (hero headlines, editorial moments).

### Type Scale

| Element | Font | Weight | Size | Line Height |
| --- | --- | --- | --- | --- |
| Hero Display | Inter / Playfair | 800 | `text-6xl`–`text-8xl` | 1.05 |
| Section Title | Inter | 700 | `text-3xl`–`text-5xl` | 1.15 |
| Card Title | Inter | 600 | `text-xl` | 1.3 |
| Body | Inter | 400 | `text-base` | 1.6 |
| Caption / Label | Inter | 500 | `text-sm` | 1.4 |
| Micro / Badge | Inter | 500 | `text-xs` | 1.2 |

```ts
// tailwind.config.ts
fontFamily: {
  sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
  serif: ["var(--font-playfair)", ...defaultTheme.fontFamily.serif],
}
```

**Rules:**
- Headlines may use `.text-gradient` for the signature purple→cyan→pink look
- Body text uses `text-foreground` (soft white on deep navy), captions use `text-muted-foreground`
- Letter-spacing stays default; never use uppercase body text (badges only)

---

## 4. UI Components

Standard components to be used throughout the application (source: `components/ui/`):

### Buttons

| Variant | Class | Usage |
| --- | --- | --- |
| Primary | `.btn-primary` | Main actions — Create Trip, Save |
| Secondary | `.btn-secondary` | Glass outline actions — Cancel, View |
| Gold | `.btn-gold` | Premium CTAs — Upgrade, Pro features |
| Destructive | `bg-red-500` | Delete trip, Remove member |

```tsx
<AnimatedButton variant="primary" icon={<Plus />}>Create Trip</AnimatedButton>
```

### Cards

| Component | Usage |
| --- | --- |
| `GlassCard` | Default glass surface — content containers, hover-lift on `hover` prop |
| `glass-lg` | Large hero panels, modals |
| `StatCard` | Dashboard metrics with icon, value & change indicator |
| `TripCard` | Trip previews — image, title, destination, dates, travelers |
| `BudgetCard` | Budget vs spent with category breakdown |
| `ActivityCard` | Itinerary entries — time, location, cost, category icon |
| `TimelineCard` | Day-by-day itinerary flow |

### Inputs

- `.input-glass` — frosted glass text inputs with purple focus ring
- Selects & textareas follow the same token set
- Labels: `text-sm text-muted-foreground`, errors: `text-destructive text-sm`

### Badges (Trip Status)

| Status | Class |
| --- | --- |
| Planning | `.badge-planning` (purple) |
| Ongoing | `.badge-ongoing` (cyan) |
| Completed | `.badge-completed` (green) |
| Archived | `.badge-archived` (gray) |

### Layout & Navigation

- `components/layout/` — `Navbar`, `Sidebar`, `MobileSidebar`
- `.sidebar-item` / `.sidebar-item.active` — nav states with purple gradient active pill
- `PageWrapper` — consistent page padding & max-width (`--gutter: 1.5rem`)

### Maps

- `components/map/TripMapViewer.tsx` — Leaflet map with dark tiles to match the theme
- Marker types: destination / hotel / restaurant / activity / custom

---

## 5. Glassmorphism & Elevation

The signature Traveloop surface system:

```css
.glass       /* blur(16px), bg white 4%, border white 8% — small panels */
.glass-card  /* + rounded-2xl, hover lift (translateY -3px) + deeper shadow */
.glass-lg    /* blur(24px), bg white 6% — hero panels, rounded-3xl */
```

**Elevation rules:**
- Cards rest directly on the deep-navy background — never stack glass on glass more than 2 levels
- Hover = lift + glow (`0 20px 48px rgba(0,0,0,0.4)`)
- Ambient glows use the `animate-glow` / `animate-float` keyframes from `tailwind.config.ts`
- `GradientBackground` component paints ambient orbs behind content

---

## 6. Motion Guidelines

Powered by **Framer Motion**:

| Interaction | Duration | Easing |
| --- | --- | --- |
| Micro (hover, tap) | 200ms | `ease-out` |
| Component enter | 300–400ms | `spring` (stiffness ~260, damping ~20) |
| Page/section reveal | 500–700ms | `ease-in-out`, staggered children |
| Ambient (float, glow) | 3–4s loop | `ease-in-out` infinite |

**Rules:**
- Respect `prefers-reduced-motion` — disable ambient loops
- Never animate layout properties (`width/height`) — use `transform`/`opacity`
- Stagger list reveals by 60–80ms per item

---

## 7. Iconography & Imagery

- **Icons:** Lucide React only (`lucide-react`), stroke width 2, 20–24px
- **Trip images:** Unsplash-quality landscape photography, `object-cover`, rounded-2xl
- **Empty states:** illustrated globe/compass motifs with a clear CTA
- **Avatars:** circular, 2px purple ring for owners

---

## 8. Spacing & Radius

| Token | Value | Usage |
| --- | --- | --- |
| `--gutter` | `1.5rem` | Page horizontal padding |
| `--radius` | `1rem` | Default radius (`rounded-lg` → `rounded-2xl`/`3xl` for glass) |
| Section spacing | `py-16`–`py-24` | Landing sections breathe |
| Card padding | `p-5`–`p-8` | Glass cards |

---

## 9. Voice & Tone

- Confident, aspirational, wanderlust-driven — *"Your next adventure awaits"*
- Microcopy is short and human: **"Let's plan something unforgettable."**
- Errors are helpful, never blameful: **"We couldn't load your trips — try again."**
- Currency & dates formatted per user preference (`lib/constants.ts` tokens)

---

*Last updated: Oct 1, 2026 — Maintained by Team Traveloop*
