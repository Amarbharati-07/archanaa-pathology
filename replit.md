# Archana Pathology Lab

## Overview

A full-stack web application for a pathology laboratory that allows users to browse diagnostic tests and health packages, add them to a cart, and book appointments for home sample collection. The application features a React frontend with a modern UI component library and an Express backend with PostgreSQL database storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - TanStack React Query for server state and API caching
  - React Context for local state (Cart and Auth contexts)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Development**: Hot module replacement via Vite middleware in development mode

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: shared/schema.ts defines all tables (tests, packages, reviews, bookings)
- **Migrations**: Drizzle Kit for schema migrations (output to ./migrations)
- **Fallback**: MemStorage class provides in-memory storage with seed data for development

### Shared Code Pattern
- The `/shared` directory contains code used by both frontend and backend
- `schema.ts`: Drizzle table definitions and Zod validation schemas
- `routes.ts`: API route definitions with input/output types for type-safe API calls

### Key Design Decisions

1. **Monorepo Structure**: Client code in `/client`, server in `/server`, shared types in `/shared`. This enables type sharing between frontend and backend.

2. **API Type Safety**: Routes are defined once in `shared/routes.ts` with Zod schemas, ensuring consistent validation on both ends.

3. **Component Architecture**: UI components follow the shadcn/ui pattern - unstyled Radix primitives wrapped with Tailwind styling, allowing full customization.

4. **Cart Management**: Client-side cart using React Context with localStorage-like persistence through component state. No server-side cart storage.

5. **Authentication**: Mock authentication via AuthContext (client-side only). No real authentication implemented yet.

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and migrations

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation library
- **embla-carousel-react**: Carousel component for reviews/packages
- **react-hook-form + @hookform/resolvers**: Form handling with Zod validation
- **wouter**: Lightweight routing
- **lucide-react**: Icon library

### UI Framework
- **Radix UI**: Headless component primitives (dialog, dropdown, tabs, etc.)
- **Tailwind CSS**: Utility-first styling
- **class-variance-authority**: Component variant management

### Backend Libraries
- **express**: HTTP server framework
- **drizzle-orm + drizzle-zod**: Database ORM with schema-to-validation conversion
- **connect-pg-simple**: PostgreSQL session store (available but not actively used)
- **zod**: Runtime validation for API inputs

### Build Tools
- **Vite**: Frontend bundling and development server
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development