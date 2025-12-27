# MedLab Diagnostics

## Overview
A full-stack web application for a medical diagnostics lab service. Built with React frontend and Express backend using TypeScript.

## Tech Stack
- **Frontend**: React with Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter for client-side routing

## Project Structure
```
client/          - React frontend application
  src/           - React source code
  public/        - Static assets
server/          - Express backend
  index.ts       - Server entry point
  routes.ts      - API routes
  db.ts          - Database connection
  storage.ts     - Data access layer
  vite.ts        - Vite dev server integration
shared/          - Shared code between frontend and backend
  schema.ts      - Drizzle database schema
```

## Scripts
- `npm run dev` - Start development server on port 5000
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run db:push` - Push database schema changes

## Database Schema
- **tests** - Lab tests with pricing and categories
- **packages** - Test packages/bundles
- **reviews** - Customer reviews
- **bookings** - Test booking records

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
