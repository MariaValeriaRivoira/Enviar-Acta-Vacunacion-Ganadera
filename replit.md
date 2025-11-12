# Document Submission Portal

## Overview

A single-purpose web application for submitting vaccination certificates (Acta de Vacunación). Users complete a simple form with their contact information and upload a document, which is then emailed to a designated recipient. The application prioritizes trust, clarity, and efficiency with a Material Design-inspired interface.

**Core Purpose**: Enable users to securely submit vaccination documents via a streamlined web form that sends submissions directly via email without persistent storage.

**Technology Stack**:
- Frontend: React with TypeScript, Vite build system
- UI Framework: shadcn/ui components with Radix UI primitives
- Styling: Tailwind CSS with custom design tokens
- Backend: Express.js with TypeScript
- Email Service: Resend API integration
- Database: PostgreSQL with Drizzle ORM (configured but not actively used for form submissions)
- File Handling: Multer for multipart form data

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 12, 2025)

### Completed Features
1. **Document Submission Form**: Fully functional form with nombre, teléfono, email (optional), and file upload
2. **File Upload Component**: Drag-and-drop support with validation for PDF, Word, and image files (max 10MB)
3. **Email Integration**: Resend connector configured and working - sends emails to mariavaleriarivoira@gmail.com with subject "Acta de Vacunacion de [nombre]"
4. **Validation**: Comprehensive form validation with Zod schema shared between frontend and backend
5. **Error Handling**: Proper error states and user feedback for validation errors and submission failures
6. **Success Flow**: Success screen with option to submit another document
7. **E2E Testing**: Comprehensive automated tests verify all user flows including optional email field
8. **UI Refinement**: Removed footer with contact information per user request - clean, minimal design
9. **CORS Configuration**: Backend configured to accept requests from Firebase Hosting domains
10. **Firebase Deployment**: Ready for deployment with frontend on Firebase, backend on Replit

### Technical Implementation
- Backend route `/api/submit-document` accepts multipart/form-data and processes file uploads
- Zod schema with transform pipeline handles optional email field (empty string → undefined)
- Frontend uses React Hook Form with zodResolver for client-side validation
- FileUpload component provides drag-and-drop and click-to-browse functionality
- Responsive design works on mobile, tablet, and desktop devices
- Home page simplified to show only the form without footer

## System Architecture

### Frontend Architecture

**Single-Page Application (SPA)**: The application uses a minimal routing structure with wouter, featuring primarily a home page with the document submission form and a 404 fallback page.

**Component Structure**:
- **Design System**: Utilizes shadcn/ui component library built on Radix UI primitives for accessible, composable UI components
- **Form Management**: React Hook Form with Zod validation for type-safe form handling
- **State Management**: TanStack Query (React Query) for server state management
- **Styling Approach**: Utility-first CSS with Tailwind, custom design tokens defined for consistent theming

**Key Design Decisions**:
- Single-page layout eliminates navigation complexity
- Material Design principles for form-heavy utility applications
- Centered card layout (max-width 2xl) with ample whitespace
- Responsive design with mobile-first approach
- High contrast and clear focus states for accessibility

### Backend Architecture

**Express.js Server**: Lightweight HTTP server handling API requests and serving static files.

**Request Flow**:
1. Client submits form with multipart/form-data (includes file upload)
2. Multer middleware processes file upload (10MB limit)
3. Zod schema validates form data
4. Resend API sends email with attached document
5. No data persistence - stateless transaction

**File Upload Strategy**:
- In-memory storage via Multer (no disk writes)
- Allowed formats: PDF, Word (DOC/DOCX), images (JPEG, JPG, PNG, GIF)
- 10MB maximum file size
- Files transmitted directly to email service without storage

**API Endpoints**:
- `POST /api/submit-document`: Accepts form data and file, sends email

**Development vs Production**:
- Vite dev server middleware in development
- Static file serving in production
- Request logging for API routes

### Data Validation

**Schema-Driven Validation**: Shared Zod schemas between client and server ensure consistent validation.

**Form Schema** (`shared/schema.ts`):
- `nombre` (name): Required string
- `telefono` (phone): Required string  
- `email`: Optional, validated email format when provided
- `documento` (file): Validated via Multer middleware on server

**Rationale**: Shared schemas eliminate duplication and ensure client-side validation matches server-side requirements.

### Email Integration

**Resend API**: Third-party email service for reliable transactional email delivery.

**Authentication Approach**: Uses Replit Connectors system for secure credential management:
- Retrieves API credentials via Replit's internal connector API
- Supports both development (REPL_IDENTITY) and deployment (WEB_REPL_RENEWAL) tokens
- Credentials fetched dynamically on each email send (uncachable client)

**Email Content**:
- HTML-formatted body with submitted form data
- Attached vaccination document from upload
- Sent from configured "from_email" address
- Recipient email embedded in template

**Design Trade-off**: Direct email sending without database storage simplifies architecture but provides no audit trail or retry mechanism.

### Database Layer (Configured, Not Utilized)

**Drizzle ORM with PostgreSQL**: Database infrastructure is configured but not actively used for form submissions.

**Current State**:
- Neon Database serverless PostgreSQL configured
- Drizzle schema defined in `shared/schema.ts`
- Migration system set up (`drizzle.config.ts`)
- Connection pool not initialized in current implementation

**Rationale**: Application designed as stateless email relay. Database setup may support future features (submission history, user accounts, etc.).

### Build and Development Pipeline

**Vite Configuration**:
- React plugin for JSX transformation
- Path aliases for clean imports (`@/`, `@shared/`, `@assets/`)
- Development: HMR with Vite dev server
- Production: Optimized bundle to `dist/public`

**TypeScript Configuration**:
- Strict mode enabled for type safety
- ESNext module system
- Shared types between client/server via path mapping

**Build Process**:
- Frontend: Vite builds React app
- Backend: esbuild bundles Express server to ESM format
- Single production artifact combining both

**Replit-Specific Features**:
- Runtime error overlay in development
- Cartographer plugin for code navigation
- Dev banner for development environment indication

### Security Considerations

**File Upload Security**:
- MIME type validation (whitelist approach)
- File size limits enforced
- In-memory processing prevents disk-based attacks
- No file persistence reduces attack surface

**Data Handling**:
- No sensitive data storage
- Transient processing only
- Email transmission over HTTPS

**Missing Considerations** (potential improvements):
- No rate limiting implemented
- No CSRF protection
- No request authentication
- File content scanning not performed

## External Dependencies

### Third-Party Services

**Resend Email Service**:
- Purpose: Transactional email delivery
- Integration: REST API with API key authentication
- Configuration: Via Replit Connectors for secure credential management
- Critical dependency: Application cannot function without valid Resend credentials

### Database

**Neon Database (PostgreSQL)**:
- Purpose: Serverless PostgreSQL hosting
- Current Usage: Configured but not actively utilized
- Connection: Via `@neondatabase/serverless` driver
- Note: Database schema exists but form submissions bypass persistence

### UI Component Libraries

**Radix UI**: Headless UI primitives providing accessible, unstyled components
- Used by shadcn/ui for dialogs, dropdowns, tooltips, form controls, etc.
- Ensures WCAG compliance and keyboard navigation

**shadcn/ui**: Curated component library built on Radix UI
- Pre-styled with Tailwind CSS
- Customizable via design tokens
- Components configured in `components.json`

### Development Dependencies

**Replit Platform Services**:
- Connectors API for secure credential management
- Development tooling (cartographer, runtime error overlay)
- Deployment infrastructure

### Frontend Libraries

**React Ecosystem**:
- React 18+ for UI rendering
- React Hook Form for form state management
- TanStack Query for server state
- wouter for lightweight routing
- Zod for runtime type validation

**Styling**:
- Tailwind CSS for utility-first styling
- PostCSS for CSS processing
- class-variance-authority for component variants
- clsx/tailwind-merge for conditional classes

### Backend Libraries

**Express Middleware**:
- Multer for multipart/form-data parsing
- connect-pg-simple (configured for session storage, not currently used)

**Utilities**:
- date-fns for date manipulation
- nanoid for unique ID generation