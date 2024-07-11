"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";
import { ModeToggle } from "./ModeToggle";
import { CommandSearch } from "./CommandSearch";
import { Button } from "@/components/ui/button";

export default function TopNav() {
  // const router = useRouter();
  return (
    <div className="border-b border-slate-500 border-opacity-20 py-4">
      <nav className="mx-auto flex max-w-3xl items-center justify-between font-semibold">
        <Link href="/" className="text-xl font-semibold">
          Hyper Recipes
        </Link>

        <div className="flex items-center gap-4">
          <CommandSearch />
          <SignedOut>
            <Button>
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            {/* <Link href="/dashboard">Add New Recipe</Link> */}
            {/* <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={() => {
              router.refresh();
            }}
          /> */}
            <div className="h-6 w-6 rounded-full bg-slate-500">
              <UserButton />
            </div>
          </SignedIn>
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
}
