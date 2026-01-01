# Hyper Recipe

A social recipe sharing platform with gamification features, built with Next.js 14 App Router and PostgreSQL. Discover, share, and track your cooking journey with achievements, levels, and community features.

## 🚀 Features

### Current Features

- **Recipe Management**

  - Create, edit, and publish recipes with rich text editing
  - Organize recipes with tags (Cuisine, Meal Type, Dietary Preferences)
  - Ingredient management with quantities
  - Recipe search and filtering
  - Image uploads via UploadThing

- **User Experience**

  - User authentication via Clerk
  - Favorite recipes
  - Personal recipe notes (coming soon)
  - Cooking history tracking
  - Responsive design with dark mode support

- **Gamification**

  - XP and leveling system
  - Achievement badges
  - Kitchen Journey dashboard
  - Progress tracking

- **Admin Features**
  - Dashboard for managing unpublished recipes
  - Tag and ingredient management
  - Recipe publishing controls

### Planned Features

See [Gamification Features](#gamification-features) section below for detailed roadmap.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5+
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS + shadcn/ui
- **Rich Text**: Novel (TipTap-based)
- **File Uploads**: UploadThing
- **Monitoring**: Sentry
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ or later
- pnpm 9.1.4+
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- UploadThing account for file uploads
- Sentry account for error monitoring (optional)

## 🏃 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hyper-recipes
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_URL="postgresql://user:password@host:5432/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# UploadThing
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."

# Sentry (optional)
SENTRY_DSN="https://..."
SENTRY_ORG="..."
SENTRY_PROJECT="..."
SENTRY_AUTH_TOKEN="..."

# Node Environment
NODE_ENV="development"
```

### 4. Set Up Database

#### Option A: Using Neon (Recommended)

1. Create a Neon account and project
2. Copy the connection string to `POSTGRES_URL`
3. Run migrations:

```bash
pnpm db:migrate
```

#### Option B: Local PostgreSQL

1. Start local PostgreSQL instance
2. Update `POSTGRES_URL` in `.env`
3. Run migrations:

```bash
pnpm db:migrate
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
hyper-recipes/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── _actions/          # Server actions
│   │   ├── _components/       # Page-specific components
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Admin dashboard
│   │   ├── recipe/[slug]/     # Recipe detail pages
│   │   └── ...
│   ├── components/            # Shared UI components
│   ├── server/
│   │   ├── db/               # Database schemas and client
│   │   └── queries/          # Database query functions
│   └── lib/                  # Utility functions
├── drizzle/                   # Database migrations
├── public/                   # Static assets
└── ...
```

## 🗄️ Database Management

### Generate Migrations

After modifying schema files in `src/server/db/schemas/`:

```bash
pnpm db:generate
```

This creates SQL migration files in the `drizzle/` directory.

### Apply Migrations

**Local Development:**

```bash
pnpm db:migrate
```

**Production (Vercel):**

1. Generate migrations locally: `pnpm db:generate`
2. Commit migration files to your PR
3. After merging, run migrations manually:
   ```bash
   vercel env pull .env.production
   POSTGRES_URL=$(grep POSTGRES_URL .env.production | cut -d '=' -f2) pnpm db:migrate
   ```

### Database Studio

Open Drizzle Studio to browse your database:

```bash
pnpm db:studio
```

### Schema Changes

- Schema files: `src/server/db/schemas/`
- Table creator: `src/server/db/tableCreator.ts`
- Database client: `src/server/db/index.ts`

## 🚢 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure these are set in Vercel:

- `POSTGRES_URL` - Your Neon production database URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`
- `NODE_ENV=production`

### Running Migrations in Production

After deploying schema changes:

1. **Manual Migration (Recommended for first time):**

   ```bash
   vercel env pull .env.production
   POSTGRES_URL=$(grep POSTGRES_URL .env.production | cut -d '=' -f2) pnpm db:migrate
   ```

2. **Or via Neon Dashboard:**
   - Connect to your Neon database
   - Run the SQL from migration files manually

## ⚡ Performance Optimizations

This project includes several performance optimizations:

- **Query Optimization**

  - Consolidated recipe queries using Drizzle relations
  - Parallel data fetching with `Promise.all()`
  - Database indexes on frequently queried columns

- **Caching Strategy**

  - `unstable_cache` for public recipe content (60s TTL)
  - ISR (Incremental Static Regeneration) for recipe pages
  - Client-side caching for user-specific data

- **Rendering Optimizations**

  - Separated auth-dependent content to client components
  - React `cache()` for request deduplication
  - Suspense boundaries for progressive loading

- **Database Indexes**
  - Composite index on `favorites(userId, recipeId)`
  - Index on `recipes_to_tags(tagId)`

## 🎮 Gamification Features

### 1. Achievement Badges

- **"Home Chef"** – Cook 10 different recipes
- **"Spice Explorer"** – Try recipes from 5+ different cuisines
- **"Master Baker"** – Make 5 different baked goods
- **"One-Pan Pro"** – Cook 3 one-pan meals
- **Seasonal badges** – Special achievements for cooking certain recipes during holidays

### 2. Cooking Streaks & Levels

- Track how many days/weeks in a row someone has cooked a recipe
- Level up as you cook more dishes (e.g., "Apprentice" → "Sous Chef" → "Master Chef")

### 3. Recipe Check-ins & Reviews

- Users can log when they've made a recipe and leave a short review or rating
- Add a "Tried It" count to each recipe
- Let users click the Tried It button to earn 2XP
- Let users attach photos of their dish for 5XP instead, incentivizing photos
- Users can only get on the leaderboard if they upload photos

### 4. Ingredient Collection

- Unlock "Ingredient Cards" for rare or exotic ingredients used in a recipe
- Have a virtual pantry where users track their most-used ingredients

### 5. Challenges & Community Goals

- **Weekly cooking challenges** (e.g., "Make a dish with 5 or fewer ingredients")
- **Monthly themes** (e.g., "Italian February," "Vegan January")
- **Community goal tracking**, like "Collectively cook 1,000 dishes this month!"

### 6. Social & Friends Features

- Follow friends to see what they're cooking
- Create a "Cook Together" mode where friends try the same recipe and compare results
- Leaderboards for most recipes cooked, highest-rated dishes, etc.

## 💡 Future Ideas

- Add a start/pause/finish timer button so users can record how long it takes them to make a recipe
- Badge for cooking the same recipe multiple times
- Badge for beating your previous time on the same recipe
- For steps that require timing (cook pasta for 8 min), include a button to start timer. Timer makes noise, but in case user doesn't have sound on, cover the entire screen in an overlay with animation

## 🧪 Development Scripts

```bash
# Development
pnpm dev              # Start development server

# Database
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Apply migrations
pnpm db:push          # Push schema changes (dev only)
pnpm db:studio        # Open Drizzle Studio

# Build & Deploy
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm typecheck        # Type check without building
```

## 🐛 Error Monitoring

Sentry is configured for error tracking. To suppress the global error handler warning:

```env
SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING=1
```

The project includes:

- `sentry.client.config.ts` - Client-side error tracking
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime error tracking
- `src/app/global-error.tsx` - Global error boundary

## 📝 Code Standards

This project follows:

- **TypeScript**: Strict mode with explicit types
- **ESLint**: Next.js recommended config + Drizzle plugin
- **Prettier**: Code formatting
- **Functional Style**: Prefer functional components and composable functions
- **Server Components**: Default to server components, use client components only when needed

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Generate database migrations if schema changed: `pnpm db:generate`
4. Test locally: `pnpm dev`
5. Commit changes
6. Create a pull request

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Built with [T3 Stack](https://create.t3.gg/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Rich text editing with [Novel](https://novel.sh/)
