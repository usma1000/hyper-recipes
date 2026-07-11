# Hyper Recipes — Vercel Fluid Active CPU Audit

Date: 2026-07-10  
Stack: Next.js 14 App Router, Clerk, Drizzle/Neon Postgres, Vercel

## 1. Highest-risk compute hotspots

Ranked most → least likely to explain free-tier Active CPU spikes with few real users:

| Rank | Hotspot | Why expensive | Amplification |
|------|---------|---------------|---------------|
| 1 | Homepage over-fetch (`src/app/page.tsx`) | Every `/` hit called `auth()` (dynamic), then `getAllRecipes` + `getAllTagsByType` + **N× `getRecipesByTag`** (~35 tags). Anonymous landing only needed 1 featured recipe. | Bots/crawlers hit `/` constantly → dozens of DB queries per request |
| 2 | Recipe pages forced dynamic (`FullRecipePageServer.tsx`) | `auth()` on every recipe render defeated ISR (`revalidate=60` + `generateStaticParams`) | Scrapers crawl `/recipe/*` → full SSR + DB each time |
| 3 | Related recipes via `getAllRecipes()` | Full published catalog loaded to pick 6 “More like this” cards | Multiplied by every recipe page view |
| 4 | No `robots.txt` | Public site fully crawlable; `/api`, auth pages, recipe SSR all open | Bot traffic multiplies 1–3 |
| 5 | Middleware always called `auth()` | `clerkMiddleware` resolved auth on **all** matched routes, including public pages | Edge CPU on every HTML request |
| 6 | Tag N+1 query pattern | ~35 parallel relation queries per homepage load | Logged-in users + any code path that mapped tags |
| 7 | `/api/sentry-example-api` | `force-dynamic` route that **throws** on GET | Scanners probe `/api/*`; error + Sentry overhead |
| 8 | Uncached `hasV2DataAsync` | Extra DB round-trip on every recipe page | Same as #2 |
| 9 | `revalidatePath("/", "layout")` | Mutations invalidated entire layout tree under `/` | Next visitor wave recomputes more than needed |
| 10 | Clerk on public SSR paths | Homepage/recipe personalization mixed with public content | Harder to serve static HTML to bots |

Lower risk (noted, not primary): client `router.refresh()` after mutations (user-driven), `KitchenJourneyBadge` fetch (signed-in only), `CommandSearch` (on open only), UploadThing (auth-gated), CookingTimer `setInterval` (client-only).

## 2. Bad query findings

| File / function | Issue | Better shape |
|-----------------|-------|--------------|
| `page.tsx` → `tags.map(fetchRecipesByTag)` | Classic N+1: one query per tag | Single `getAllRecipesByTagMap()` (implemented) |
| `getRecipesByTag` | Loads all tag relations then filters `published` in JS | Prefer SQL/join filter; batch map already filters once |
| `FullRecipePageServer` → `getAllRecipes()` | Unbounded catalog read for 6 related cards | `getSliderRecipes()` / limited related query (implemented) |
| `hasV2DataAsync` | Uncached `findFirst` per recipe SSR | Wrap in `unstable_cache` (implemented) |
| `getAllImages` | Unbounded `findMany` (admin gallery) | Add `.limit()` when gallery grows |
| `RecipesTable.published` | Filtered often, **no index** | Add btree index on `published` (manual migration) |

No Supabase client usage — ORM is Drizzle against Neon. Patterns above are the Drizzle equivalents of `select('*')` / missing limits.

## 3. Quick wins (done)

1. Anonymous homepage: only `fetchSliderRecipes()` — no tag fan-out  
2. Logged-in homepage: one `fetchAllRecipesByTagMap()` instead of N tag queries  
3. Recipe SSR: call `auth()` only for unpublished recipes  
4. Related recipes: use `getSliderRecipes()` not full catalog  
5. Cache `hasV2DataAsync`  
6. Middleware: skip `auth()` unless admin route  
7. Add `public/robots.txt` (block `/api`, private areas, aggressive scrapers)  
8. Remove `/api/sentry-example-api`  
9. Soften `revalidatePath("/", "layout")` → `"page"`

## 4. Structural fixes (recommended next)

1. **Split public vs authenticated data loading** — make `/` statically cacheable for anonymous by moving favorites/collections to client-mounted server actions (remove `auth()` from homepage entirely).  
2. **Include tags on `getAllRecipes`** — ExploreGrid only uses `recipesByTag` for reverse tag lookup; embedding tags on recipes removes the map entirely.  
3. **Index `recipes.published`** — supports list/filter queries.  
4. **CDN/ISR verification** — confirm Vercel shows HIT for `/recipe/[slug]` after deploy.  
5. **Rate-limit** UploadThing and any future public APIs via Vercel Firewall / WAF.  
6. **Optional:** `export const dynamic = 'force-static'` on marketing pages (`/pricing`, `/terms`, `/privacy`) if they stay auth-free.

## 5. Bot hardening recommendations

| Route | Action |
|-------|--------|
| `/` | Cache aggressively for anonymous; robots allow (cheap after fix) |
| `/recipe/*` | Keep ISR; avoid `auth()`/`cookies()` on published path |
| `/api/*` | Disallow in robots; only UploadThing remains (auth-gated) |
| `/dashboard`, `/new-recipe` | Already admin-gated in middleware |
| `/favorites`, `/collections`, `/kitchen-journey` | Disallow in robots; require auth at page level |
| Vercel Firewall | Block known bad bots; challenge `/api` if spikes return |

## 6. How this reduces Vercel Active CPU

- **Fewer DB round-trips per bot hit to `/`**: ~37 queries → 1 cached slider query.  
- **Published recipe pages can use ISR again**: no unconditional `auth()` → less SSR CPU per crawl.  
- **Smaller recipe page work**: related set is 6 cached rows, not full catalog + uncached v2 check.  
- **Less Edge work**: middleware no longer resolves Clerk auth on every public URL.  
- **Less junk traffic**: robots + deleted Sentry example route cut scanner-driven dynamic work.

## 7. Still risky — inspect manually

1. Vercel Analytics / logs: confirm which paths still dominate CPU after deploy.  
2. Neon query insights: watch for sequential scans on `recipes` / `recipes_to_tags`.  
3. Clerk dashboard: session/middleware volume on public routes.  
4. Whether `unstable_cache` is effective on your Vercel plan (Data Cache).  
5. Admin `getAllImages()` growth.  
6. Any external uptime monitors hitting `/` every minute.
