"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";
import { ModeToggle } from "./ModeToggle";

export default function TopNav() {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between p-4 text-xl font-semibold">
      <Link href="/" className="font-semibold">
        Hyper Recipes
      </Link>

      <div className="flex flex-row">
        <Link href="/new">Recipes</Link>
        <ModeToggle />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={() => {
              router.refresh();
            }}
          />
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
