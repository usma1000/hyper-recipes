import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/new-recipe(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) auth().protect()
})

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};