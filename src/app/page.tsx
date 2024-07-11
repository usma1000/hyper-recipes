import { SignedIn, SignedOut } from "@clerk/nextjs";
import RecipesCarousel from "./_components/RecipesCarousel";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1>Featured Recipes</h1>
        <RecipesCarousel />
      </section>
      <section>
        <h2>My favorites</h2>
        <p className="text-sm text-slate-500">
          You can save any recipe to your favorites by clicking the star icon.
        </p>
        <RecipesCarousel />
      </section>
      <section>
        <SignedOut>
          <div className="h-full w-full text-center text-2xl">
            Please sign in
          </div>
        </SignedOut>
        <SignedIn>
          <div>Signed in: Button to create or edit recipes.</div>
        </SignedIn>
      </section>
    </div>
  );
}
