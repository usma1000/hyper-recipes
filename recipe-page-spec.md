Recipe Page Spec (Implementation-Only)
SCOPE (STRICT)

Page: /recipe/[slug] (or your equivalent)

Implement UI/UX changes only

No backend changes required (use existing data; graceful fallbacks)

No auth logic changes (just UI gating where needed)

PRIMARY GOALS

Make it feel like a cooking tool, not a blog

Make “adaptive recipe” obvious within the first screen

Reduce cooking friction: scannable ingredients, step focus, decision support

For anonymous users: convert via contextual locked controls, not nagging

Page Layout
Desktop (>=1024px)

Two-column layout

Left (main): Steps + cook mode

Right (sticky sidebar): “Adapt this recipe” + Ingredients

Mobile

Single column with sticky bottom action bar (“Start Cook Mode”, “Adapt”, “Save”)

Ingredients collapsible

Steps are compact cards

Top Section: Recipe Header
Header content (always visible near top)

Recipe Title (H1)

One-line description (if available; else omit)

Meta row:

Total time

Active time (if you have it; else omit)

Difficulty (“Beginner-friendly”, “Intermediate”, “Advanced”)

Servings (current)

Tag chips (up to 4 if tags exist; else omit)

Actions (top right on desktop, below meta on mobile)

Save button (icon + “Save”)

Share button (icon + “Copy link”)

Print button (icon) optional

Copy (exact):

Save: “Save”

Saved: “Saved”

Share tooltip: “Copy link”

Print tooltip: “Print”

Section 1: “Adapt this recipe” (Key Differentiator)

This must appear immediately after header on mobile, and in the sticky sidebar on desktop.

Card Title (exact)

“Adapt this recipe”

Controls (show always, but behavior differs by auth)

Servings

Stepper: – / current / +

Label: “Servings”

Options: any integer range you support; default from recipe

Time

Segmented control with 3 options:

“Quick”

“Standard”

“Slow”

Subtext under selector: “Adjust steps and pacing”

Ingredient swaps

Button: “See swaps”

Shows modal/drawer list of swap suggestions if available

If not available, still open with empty state message

Difficulty

Segmented control:

“Beginner”

“Confident”

Subtext: “More guidance vs. fewer prompts”

Logged-in behavior

Controls are functional (even if your app only partially supports them today, implement UI state + graceful no-op with toasts like “Coming soon” ONLY if absolutely necessary)

Changing servings updates ingredient quantities (if you can do it client-side from existing base amounts; else visually updates servings label and leaves quantities unchanged but show a subtle “Scaling coming soon” label—only if unavoidable)

Anonymous behavior (gating rules)

Controls are visible

Interaction triggers a signup gate modal (NOT redirect immediately)

Gate modal copy (exact):
Title: “Unlock smart recipe controls”
Body: “Adjust time, servings, and ingredient swaps with a free account.”
Primary button: “Create free account”
Secondary: “Not now”
Footer microtext: “Google login • takes ~10 seconds”

(Use your Clerk flow for the primary action.)

Section 2: Ingredients (Designed for real cooking)
Desktop: in sticky sidebar beneath Adapt card
Mobile: collapsible card near top
Title (exact)

“Ingredients”

Layout

Group ingredients by heading if your data supports groups (e.g., “Sauce”, “Pasta”)

Each ingredient row:

Quantity (bold)

Ingredient name

Prep note (lighter, e.g., “minced”, “divided”) aligned right or below

Interactions

Checkbox per ingredient (optional, but nice): tap to check off

“Add to list” button (only if feature exists; otherwise omit)

Empty-state if ingredient list missing:
“Ingredients unavailable.”

Section 3: Steps (The core cooking experience)
Title (exact)

“Steps”

Step card format (each step)

Step number

Step text

Optional: “What to look for” hint line (if data exists; else omit)

Optional: Timer chip (only if you already have timers; else omit)

“Decision support” microcopy (always present as UI slots)

Add two expandable callouts that can be populated later; for now they can be generic.

Callout: “Common fixes”

Expand shows 2–3 bullet tips (generic but helpful)

“Too thick? Add a splash of water.”

“Too thin? Simmer 2–3 minutes longer.”

“Too salty? Add acid or unsalted starch.”

Callout: “Key cues”

Expand shows sensory cues

“Look for glossy sauce.”

“Aromatics should be fragrant, not browned.”

“Taste and adjust before serving.”

These should be short and not feel like blog content.

Section 4: Cook Mode (Focus mode that feels like a tool)
Entry point

Primary button shown:

Desktop: near Steps title

Mobile: sticky bottom bar

Button copy (exact): “Start Cook Mode”

Cook Mode behavior (overlay page state)

Highlights one step at a time

Shows:

Current step large

Previous/Next controls

Quick access to ingredients list (drawer)

“Mark step done” button

Optional: screen wake lock if you already have it (not required)

Cook Mode controls copy (exact):

“Next”

“Back”

“Done”

“Ingredients”

Exit: “Exit Cook Mode”

Section 5: Notes / Tweak This (Logged-in only if feature exists)

If you already support personal notes:

Show a card under Steps:

Title: “Make it yours”
Body text: “Save notes, swaps, and ratings for next time.”
Controls: Notes textarea + “Save notes” button

If notes don’t exist yet: omit this section entirely (don’t add a fake box).

Section 6: Related Recipes (Discovery without feeling like a blog)
Title (exact)

“More like this”

3–6 cards, compact

Each card shows:

Title

Time

Difficulty

“Smart” mini-icons row: Swaps / Scale / Adjust time (icons only)

Sticky Actions
Desktop

Sticky sidebar stays in view with Adapt + Ingredients

Mobile sticky bottom bar (always visible after slight scroll)

Buttons:

Primary: “Start Cook Mode”

Secondary: “Adapt” (opens Adapt drawer)

Icon: Save

Anonymous user tapping Adapt should open gate modal.

Visual / Design Rules

No “blog intro”

No giant image-first hero that pushes utility down

The tooling (adapt + ingredients + cook mode) must dominate

Typography hierarchy:

H1 large

section titles medium

step text readable with comfortable line height

Subtle dividers, generous whitespace, soft shadows

REQUIRED COPY (Exact Strings)

Use these exact strings:

“Adapt this recipe”

“Ingredients”

“Steps”

“Start Cook Mode”

“Exit Cook Mode”

“More like this”

Gate modal:

“Unlock smart recipe controls”

“Adjust time, servings, and ingredient swaps with a free account.”

“Create free account”

“Not now”

“Google login • takes ~10 seconds”

Final Acceptance Checklist (Cursor must verify)

The first screen clearly shows Adapt controls + key recipe meta

Steps are scannable, not a wall of text

Cook Mode exists and is usable

Anonymous gating happens only on interaction with Adapt (not immediately on page load)

Page feels like a product tool, not a recipe blog
