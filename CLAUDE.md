# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack for fast refresh
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

## Architecture Overview

This is a Next.js 15 application built with TypeScript and Firebase, implementing a request management system with user authentication and admin functionality.

### Firebase Integration

- **Client-side**: Firebase v9 SDK (`src/lib/firebase.ts`) for Firestore database and client authentication
- **Server-side**: Firebase Admin SDK (`src/lib/admin.ts`) for server-side authentication and user management
- **Authentication**: Session-based auth using Firebase session cookies with server-side verification

### Key Architecture Patterns

**Server Actions**: All form submissions use Next.js server actions:

- `src/app/requests/new/actions.ts` - Creates new requests
- `src/app/promote/actions.ts` - Promotes users to admin role

**Authentication Flow**:

- `src/utils/server.ts` contains `identify()` function for server-side user verification
- `hold()` function creates secure session cookies from Firebase tokens
- Admin access controlled via Firebase custom claims

**Data Flow**:

- Requests are stored in Firestore with user association via `uid`
- User identification happens server-side before database operations
- Form data processing uses `shape()` utility from `src/utils/client.ts`

### Route Structure

- `/` - Home page
- `/login` & `/signup` - Authentication pages
- `/requests` - User's request listing (protected)
- `/requests/new` - Create new request form (protected)
- `/requests/[id]` - Individual request details (protected)
- `/review` - Admin review interface (admin-only)
- `/promote` - User promotion to admin (admin-only)

### Environment Configuration

- Requires `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to Firebase service account JSON
- Firebase client config is hardcoded in `src/lib/firebase.ts`

### Styling

- Uses Tailwind CSS v4 with PostCSS
- Base styles in `src/styles/base.css`
- Inter font loaded via Next.js font optimization
