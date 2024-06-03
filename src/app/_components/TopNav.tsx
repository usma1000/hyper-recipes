import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function TopNav() {
  return (
    <nav className="flex items-center justify-between bg-black p-4 text-xl font-semibold text-white">
      <Link href="/" className="font-semibold">
        Hyper Recipes
      </Link>

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
