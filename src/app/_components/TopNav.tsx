"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";
// import { ModeToggle } from "./ModeToggle";
import { CommandSearch } from "./CommandSearch";
import { Button, buttonVariants } from "@/components/ui/button";
import { LayoutDashboard, PlusCircle, Zap } from "lucide-react";

export default function TopNav() {
  // const router = useRouter();
  return (
    <div className="border-b border-slate-200 bg-white py-4 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
      <nav className="container flex items-center justify-between font-semibold">
        <Link href="/" className="flex align-middle text-xl font-semibold">
          <Zap size={16} className="fill-yellow-300" />
          Hyper Recipes
        </Link>

        <CommandSearch />

        <div className="flex items-center gap-4">
          <SignedOut>
            <Button>
              <SignInButton mode="modal" />
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
            <Link
              href="/new-recipe"
              className={buttonVariants({
                variant: "default",
                size: "sm",
              })}
            >
              <PlusCircle size={16} className="mr-2" />
              New Recipe
            </Link>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
              })}
            >
              <LayoutDashboard size={24} />
            </Link>
            <div className="h-6 w-6 rounded-full bg-slate-500">
              <UserButton />
            </div>
          </SignedIn>
          {/* <ModeToggle /> */}
        </div>
      </nav>
    </div>
  );
}
