# Traveloop

![Traveloop Dashboard](traveloop/public/image.png)

**Traveloop** is a premium travel planning SaaS application built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **MongoDB**. It delivers a cinematic booking experience with a modern dashboard, trip management, itinerary planning, budgeting, and collaborative features.

## Key Features

- **Modern landing page** with animated hero and curated destination cards
- **User authentication** using email/password and secure JWT cookies
- **Trip management** with create, list, and detail views
- **Travel dashboard** for itinerary, activities, budget, packing, and notes
- **Responsive UI** with Tailwind CSS and Framer Motion animations
- **API-first routes** for users, trips, activities, budgets, notes, and cities
- **MongoDB backend** integration for persistent user and trip data

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- MongoDB
- bcryptjs + jsonwebtoken
- lucide-react icons

## Installation

```bash
cd traveloop
npm install
```

## Environment Variables

Create a `.env.local` file inside the `traveloop` folder with the following values:

```env
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
MONGODB_DB=traveloop
```

> `MONGODB_DB` defaults to `traveloop` if not set.

## Run Locally

```bash
cd traveloop
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Build for Production

```bash
cd traveloop
npm run build
npm start
```

## Project Structure

- `traveloop/app/` — Next.js pages and layouts
- `traveloop/app/api/` — API routes for auth, trips, activities, budgets, notes, etc.
- `traveloop/components/` — Reusable UI components and layout controls
- `traveloop/lib/` — Helpers for auth, API, MongoDB, constants, and types
- `traveloop/public/` — Static assets and project images

## Backend & Auth

- Uses `JWT_SECRET` to sign user session tokens
- Stores user data and trip metadata in MongoDB
- Protects API calls through HTTP-only cookies
- Supports login, signup, logout, password reset, and user profile flows

## Notes

- The repo is designed as a full-stack travel planner with modular route and component structure.
- Replace placeholder environment values before running locally.
- The included screenshot is available at `traveloop/public/image.png`.

---

## License

This repository is licensed under the terms of the existing `LICENSE` file.
