import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

async function Recipes() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {images.map((image) => (
        <div key={image.id} className="w-48">
          <Link href={`/recipe/${image.id}`}>
            <img src={image.url} alt="" className="w-full rounded-md" />
            <span className="mt-2 block font-semibold text-white">Title</span>
            <p className="text-sm text-gray-400">Description</p>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">Please sign in</div>
      </SignedOut>
      <SignedIn>
        <Recipes />
      </SignedIn>
    </main>
  );
}
