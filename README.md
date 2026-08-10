# A Daily Productive Plan

A production-ready, full-stack personal productivity management application. This system is designed specifically for single-user daily execution, combining the best concepts of Google Calendar, Google Tasks, Linear, and Notion into a seamless, unified dashboard. 

The primary goal of the app is simple: **Decide what needs to be done today, execute it, and clearly understand what to work on next.**

## Features
- **Mobile-First & Apple Glass UI**: A beautiful, dark-mode exclusive interface utilizing frosted glassmorphism (`backdrop-blur`), translucent elements, and ambient mesh gradients.
- **Single-User Architecture**: Built for a single developer without the overhead of authentication or multi-tenant database constraints.
- **SPA-like Performance**: Built on Next.js App Router using soft navigation (`<Link>`), giving instantaneous page transitions without full browser reloads.
- **Action-Driven Data Flow**: Completely removes boilerplate API route fetching by leveraging Next.js Server Components for reading data and Server Actions for all CRUD mutations.

## Tech Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI) + Lucide Icons
- **Database ORM**: [Prisma v6](https://www.prisma.io/)
- **Database**: MongoDB (Atlas)
- **Validation**: Zod + React Hook Form

## Developer Point of View & Architecture

This project is built around modern Next.js server-first patterns. If you are developing on this repository, keep the following patterns in mind:

### 1. Data Fetching (Server Components)
Do not use `fetch` or `TanStack Query` on the client for initial page loads. The UI is built using React Server Components (RSC). Pages like `src/app/page.tsx` fetch data directly from the database using Prisma (`await db.task.findMany()`) and render the HTML on the server.

### 2. Mutations (Server Actions)
API routes (`/api/...`) are mostly reserved for raw data inspection or external integrations. For application UI interactions (Creating, Updating, Deleting tasks), we use **Server Actions**.
- Look in `src/actions/` for the core business logic (`task.ts`, `project.ts`).
- Server actions automatically call `revalidatePath()` to instantly refresh the Server Components without requiring client-side state management (like Redux or Zustand).

### 3. Client Components
Components that require interactivity (like checking a box, opening a modal, or handling a form) are marked with `"use client"`. 
- `TaskItem.tsx` handles the `useTransition` hook to show loading states while Server Actions execute.
- State is kept local. Global UI states (like opening the global task creation modal) are handled via URL Search Parameters (`?modal=create-task`) rather than React Context to maintain the server-driven architecture.

## Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory and add your MongoDB connection string.
```env
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/portfolio?retryWrites=true&w=majority"
```
*(Ensure you specify the database name in the connection string, e.g., `/portfolio`)*

### 2. Install Dependencies
```bash
npm install
```

### 3. Sync Database Schema
Sync your Prisma schema with your MongoDB cluster (this creates the collections):
```bash
npx prisma db push
```

### 4. (Optional) Seed the Database
To populate the database with sample projects and tasks for testing:
```bash
node scripts/seed.mjs
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. To test the database connection and raw API routes, visit [http://localhost:3000/api-test](http://localhost:3000/api-test).
