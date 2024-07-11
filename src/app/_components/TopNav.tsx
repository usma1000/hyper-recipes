"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";
import { ModeToggle } from "./ModeToggle";

export default function TopNav() {
  // const router = useRouter();
  return (
    <nav className="flex items-center justify-between border-b border-slate-500 border-opacity-20 p-8 text-xl font-semibold">
      <Link href="/" className="font-semibold">
        Hyper Recipes
      </Link>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">Add New Recipe</Link>
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
      </div>
    </nav>
  );
}
