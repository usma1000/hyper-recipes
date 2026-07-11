import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/dashboard(.*)", "/new-recipe(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Only resolve auth on admin routes. Calling auth() on every public
  // request (/, /recipe/*, etc.) burns Edge CPU and is amplified by bots.
  if (!isAdminRoute(req)) {
    return NextResponse.next();
  }

  // eslint-disable-next-line @typescript-eslint/await-thenable
  const authResult = await auth();
  if (authResult.sessionClaims?.metadata?.role !== "admin") {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
