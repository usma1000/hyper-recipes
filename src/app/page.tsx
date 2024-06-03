import Link from "next/link";

export const dynamic = "force-dynamic";

const mockUrls = [
  "https://utfs.io/f/be838078-efd1-4855-80b3-6ee57ec952b9-567z33.webp",
  "https://utfs.io/f/18a61f93-dcb4-4fdc-ba0d-581bb7c58f9b-9ff3qs.jpg",
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-4 p-4">
        {mockImages.map((image) => (
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
