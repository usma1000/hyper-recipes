import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getAllImages } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

async function Recipes() {
  const images = await getAllImages();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {images.length === 0 && (
        <div className="w-full text-center text-2xl">No recipes yet</div>
      )}
      {images.map((image) => (
        <div key={image.id} className="w-48">
          <Dialog>
            <DialogTrigger asChild>
              <div>
                <Image
                  src={image.url}
                  alt={image.name}
                  width={200}
                  height={160}
                  className="rounded-md shadow-lg hover:shadow-2xl"
                />
                <span className="mt-2 block font-semibold">Title</span>
                <p className="text-sm text-gray-400">Description</p>
              </div>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Title</DialogTitle>
                  <DialogDescription>Description</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Link
                    href={`/recipe/${image.id}`}
                    className={buttonVariants({ variant: "default" })}
                  >
                    View Recipe
                  </Link>
                  <Button variant="outline" size="icon">
                    <Star className="h-3 w-3" />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <h2>All Recipes</h2>
      <Recipes />
      <h2>My favorites</h2>
      <p>Favorites go here...</p>
      <SignedOut>
        <div className="h-full w-full text-center text-2xl">Please sign in</div>
      </SignedOut>
      <SignedIn>
        <div>Signed in: Button to create or edit recipes.</div>
      </SignedIn>
    </>
  );
}
