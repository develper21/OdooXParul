# Traveloop - Premium Travel Planning SaaS

A modern, premium travel planning application built with Next.js 15, Tailwind CSS, Framer Motion, and Shadcn UI components.

## Project Overview

Traveloop is a sophisticated multi-city travel itinerary planner with a futuristic glassmorphism UI design. The application focuses on providing a premium SaaS experience for travel enthusiasts.

### Design Philosophy

- **Glassmorphism UI**: Transparent, frosted glass effect with backdrop blur
- **Soft Claymorphism**: Smooth, rounded surfaces with subtle shadows
- **Dark Mode Default**: Navy blue backgrounds with purple and cyan accents
- **Premium Animations**: Smooth, purposeful motion design with Framer Motion
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Database**: Prisma (ready for integration)

## Project Structure

```
traveloop/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── trips/
│   │   │   ├── create/
│   │   │   ├── [tripId]/
│   │   │   │   ├── itinerary/
│   │   │   │   └── budget/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── GlassCard.tsx
│   │   ├── AnimatedButton.tsx
│   │   ├── GradientBackground.tsx
│   │   ├── FloatingOrb.tsx
│   │   ├── SectionTitle.tsx
│   │   ├── StatCard.tsx
│   │   ├── TripCard.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── TimelineCard.tsx
│   │   ├── BudgetCard.tsx
│   │   ├── PageWrapper.tsx
│   │   ├── Utilities.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileSidebar.tsx
│   │   └── index.ts
│   ├── common/
│   ├── dashboard/
│   ├── trip/
│   ├── itinerary/
│   └── budget/
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   └── dummy-data.ts
├── hooks/
│   └── index.ts
├── public/
│   ├── travel/
│   ├── avatars/
│   └── icons/
├── styles/
├── prisma/
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── next.config.ts
└── package.json
```

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Shadcn UI Components** (optional, as they're already configured)
   ```bash
   npx shadcn-ui@latest init
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:3000`

## Available Routes

### Public Routes
- `/` - Landing page
- `/login` - Sign in
- `/signup` - Create account

### Protected Routes
- `/dashboard` - Main dashboard
- `/trips` - All trips list
- `/trips/create` - Create new trip
- `/trips/[tripId]/itinerary` - Trip itinerary
- `/trips/[tripId]/budget` - Trip budget
- `/settings` - Account settings

## UI Components

### Core Components

- **GlassCard**: Reusable glass morphism card with hover animations
- **AnimatedButton**: Interactive button with hover and tap effects
- **GradientBackground**: Animated gradient background with floating orbs
- **FloatingOrb**: Animated floating gradient orbs
- **SectionTitle**: Styled section headers with gradients
- **StatCard**: Statistics display cards with icons
- **TripCard**: Trip preview cards with details
- **ActivityCard**: Activity timeline cards
- **TimelineCard**: Timeline event cards
- **BudgetCard**: Budget progress cards with breakdown

### Utility Components

- **SkeletonLoader**: Animated skeleton loaders
- **LoadingSpinner**: Rotating loading spinner
- **Badge**: Status/category badges
- **Tooltip**: Hover tooltips
- **EmptyState**: Empty state placeholders

### Layout Components

- **Navbar**: Top navigation with responsive mobile menu
- **Sidebar**: Desktop sidebar with route active states
- **MobileSidebar**: Floating mobile menu button
- **PageWrapper**: Page container with animations

## Features

### Implemented

- ✅ Premium glassmorphism UI design
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Dark mode by default
- ✅ Smooth animations with Framer Motion
- ✅ Navigation system (desktop & mobile)
- ✅ Dashboard layout
- ✅ Trip management views
- ✅ Itinerary planning interface
- ✅ Budget tracking interface
- ✅ Settings page
- ✅ Custom hooks for common patterns
- ✅ TypeScript throughout

### Ready for Development

- 🔄 Backend API integration (API routes ready)
- 🔄 Database integration (Prisma ready)
- 🔄 Authentication system
- 🔄 Real trip data management
- 🔄 AI-powered recommendations
- 🔄 Collaboration features
- 🔄 Export/Share functionality

## Customization

### Colors

Edit `tailwind.config.ts` to customize:
- Primary color: Purple (#a855f7)
- Secondary color: Cyan (#06b6d4)
- Accent color: Blue (#0ea5e9)

### Typography

Font family is set to "Inter" via Google Fonts. Customize in `app/layout.tsx`.

### Animations

All animations use Framer Motion. Configure in individual components or `tailwind.config.ts` for global animation settings.

## Best Practices

- Use `PageWrapper` component for consistent page styling
- Use `GlassCard` for consistent card styling
- Use `AnimatedButton` for all interactive buttons
- Import from `@/components/ui` for cleaner paths
- Use TypeScript for type safety
- Follow the folder structure for scalability

## Performance Optimization

- Image optimization ready with Next.js Image component
- Lazy loading for components
- Code splitting via Next.js App Router
- CSS-in-JS with Tailwind for optimized bundles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Contributing

1. Create feature branches
2. Follow the existing code style
3. Use TypeScript for new code
4. Add components to the appropriate directories
5. Update this README if adding major features

## License

Proprietary - Traveloop

## Support

For issues or questions, please create an issue or contact the development team.

---

Built with ❤️ for the travel enthusiasts
