import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Recipes() {
  const images = await getMyImages();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {images.length === 0 && (
        <div className="w-full text-center text-2xl">No recipes yet</div>
      )}
      {images.map((image) => (
        <div key={image.id} className="w-48">
          <Link href={`/recipe/${image.id}`}>
            <Image
              src={image.url}
              alt={image.name}
              width={200}
              height={160}
              className="rounded-md shadow-lg hover:shadow-2xl"
            />
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
