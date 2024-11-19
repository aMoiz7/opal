import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes should be protected
const isProtected = createRouteMatcher([
    "/dashboard(.*)", "/api/payment", "/payment(.*)"
]);

// Define the Clerk middleware for route protection
export default clerkMiddleware(async (auth, req) => {
  // Apply auth protection only to routes matched by isProtected
  if (isProtected(req)) {
    auth.protect(); // Protect the route if it's in the protected list
  }
  // For other routes, no protection is applied
});

export const config = {
  matcher: [
    // Apply to everything except the files listed below (like Next.js internals or static assets)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always apply to API routes
    "/(api|trpc)(.*)",
  ],
};
