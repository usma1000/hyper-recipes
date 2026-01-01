# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Package Manager
This project uses **pnpm** (v9.1.4) as the package manager. Always use pnpm instead of npm or yarn.

### Core Commands
- `pnpm dev` - Start Next.js development server
- `pnpm build` - Build the Next.js application for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint on the codebase
- `pnpm typecheck` - Run TypeScript type checking without emitting files

### Database Commands
- `pnpm db:push` - Push schema changes to database (development)
- `pnpm db:generate` - Generate Drizzle migrations from schema
- `pnpm db:migrate` - Apply migrations to database
- `pnpm db:studio` - Open Drizzle Studio to view/edit database

### Database Setup
- Run `./start-database.sh` to start a local PostgreSQL Docker container
- Database connection is configured via `POSTGRES_URL` in `.env`
- Schema is defined in `src/server/db/schemas/`

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Clerk (user authentication and role-based access)
- **Styling**: Tailwind CSS with shadcn/ui components
- **File Uploads**: UploadThing
- **Rich Text Editor**: Novel (for recipe steps)
- **Monitoring**: Sentry for error tracking and performance

### Project Structure

#### Database Layer (`src/server/db/`)
- `schemas/` - Drizzle ORM schema definitions for all tables
  - `recipes.ts` - Recipe table and relations
  - `gamification.ts` - Points, achievements, and badges tables
  - `ingredients.ts`, `tags.ts`, `favorites.ts` - Supporting tables
  - All schemas export through `schemas/index.ts`
- `index.ts` - Database instance with custom query logger
- `tableCreator.ts` - Helper for table name prefixing

#### Server Queries (`src/server/queries/`)
Query functions are organized by domain. Each file exports functions that interact with the database and handle caching/revalidation:
- `recipes.ts` - Recipe CRUD operations with `unstable_cache` for performance
- `gamification.ts` - XP/level system, achievements, and badges
- `ingredients.ts` - Ingredient management and recipe associations
- `tags.ts` - Tag management and recipe tagging
- `favorites.ts` - User favorites system
- `utils.ts` - Shared revalidation utilities

**Important**: Query functions use Next.js `unstable_cache` with cache tags. After mutations, call appropriate revalidation functions from `utils.ts` to clear caches.

#### Server Actions (`src/app/_actions/`)
Thin wrappers around server query functions that handle authentication and are exposed to client components:
- All actions use `"use server"` directive
- Mirror the structure of `src/server/queries/`
- Handle auth checks before calling query functions

#### App Router (`src/app/`)
- `page.tsx` - Home page with recipe grid
- `recipe/[slug]/` - Dynamic recipe detail pages
- `dashboard/` - Admin dashboard for managing recipes, ingredients, tags
- `new-recipe/` - Recipe creation form
- `kitchen-journey/` - Gamification profile page
- `_components/` - Shared UI components
- `_actions/` - Server actions

#### Components
- `src/components/ui/` - shadcn/ui components (Button, Dialog, etc.)
- `src/app/_components/` - App-specific shared components
- Route-specific components in `_components/` folders next to pages

### Key Patterns

#### Authentication & Authorization
- Uses Clerk for authentication
- Admin access checked via `sessionClaims?.metadata?.role === 'admin'`
- Middleware protects `/dashboard` and `/new-recipe` routes
- Use `checkRole()` from `~/utils/roles.ts` for role checks in server actions

#### Caching Strategy
- Most read queries use Next.js `unstable_cache` with:
  - 60-second revalidation
  - Cache tags: `["recipes"]`, `["ingredients"]`, `["tags"]`
- After mutations, call revalidation utilities:
  - `revalidateRecipePaths()` after recipe changes
  - `revalidateTagCache()` after tag changes
  - `revalidateIngredientCache()` after ingredient changes

#### Database Queries
- All queries must use `"server-only"` import at the top
- Use Drizzle's query API for reads: `db.query.RecipesTable.findMany()`
- Use builders for writes: `db.insert()`, `db.update()`, `db.delete()`
- **Critical**: The ESLint rule `drizzle/enforce-delete-with-where` requires all deletes/updates to have a WHERE clause

#### Gamification System
- XP/level system tracks user cooking activity
- Users earn points by trying recipes and uploading photos
- Level progression uses exponential curve: `100 * level^1.5`
- Always call `initializeUserPoints(userId)` before querying user progress
- Points functions handle level-ups automatically

#### Recipe Steps
- Recipe steps are stored as JSON in the database
- Uses Novel editor (Tiptap-based) for rich text editing
- Type is `JSONContent` from the `novel` package
- Steps are edited in `StepsEditor.tsx` component

#### Image Uploads
- UploadThing handles all file uploads
- Images stored in `ImagesTable` with userId tracking
- Recipe hero images linked via `heroImageId` foreign key
- Upload route: `src/app/api/uploadthing/`

### Environment Variables
Managed by `@t3-oss/env-nextjs` in `src/env.js`:
- Schema validation for all environment variables
- Server-only vars: `POSTGRES_URL`, `NODE_ENV`
- Add new variables to both the schema AND the `runtimeEnv` object

### Path Aliases
- `~/` maps to `src/`
- `@/components/` maps to `src/components/`
- `@types/` maps to `src/types/`

## Code Style

### TypeScript
- Strict mode enabled with `noUncheckedIndexedAccess`
- Prefer type imports: `import { type Foo } from './bar'`
- Use Drizzle's inference types: `typeof TableName.$inferInsert`

### ESLint Rules
- Unused variables allowed if prefixed with `_`
- `drizzle/enforce-delete-with-where` - Must include WHERE clause in all DB deletes/updates
- `drizzle/enforce-update-with-where` - Must include WHERE clause in all DB updates

### Formatting
- Prettier with Tailwind CSS plugin
- Run `pnpm lint` before committing

## Important Notes

### Recipe Publishing
- Recipes have a `published` boolean field
- Unpublished recipes only viewable by authenticated users
- Use `setPublishRecipe(id, boolean)` to publish/unpublish

### Slug Generation
- Recipe slugs auto-generated from recipe names using `slugify()` from `~/lib/utils`
- Duplicates handled by appending a counter: `recipe-name-2`
- Slugs are unique and indexed in the database

### Admin Routes
- `/dashboard` and `/new-recipe` are admin-only
- Middleware redirects non-admins to home page
- Check admin status with `checkRole('admin')`

### Sentry Integration
- Automatic error tracking and performance monitoring
- Custom instrumentation in `sentry.server.config.ts`, `sentry.client.config.ts`
- Query logger in development, Sentry spans in production

### Development Database
- Use `./start-database.sh` to spin up local Postgres in Docker
- Container name: `hyper-recipes-postgres`
- Default credentials in `.env.example`
- Tables prefixed with `hyper-recipes_`
