import Link from "next/link";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return (
    <main className="">
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
    </main>
  );
}
