/**
 * Clerk middleware that ensures each authenticated user has an organization.
 * If a signed-in user has no active org and no memberships, it auto-creates one
 * and then allows the request to proceed.
 */
import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth) => {
  // Access the current auth context from Clerk
  const { userId, orgId } = await auth();

  if (userId && !orgId) {
    // Only act when the user is signed in and not currently scoped to an organization
    try {
      const client = await clerkClient();

      // Check if the user has any organization memberships
      const { data: organizations } =
        await client.users.getOrganizationMembershipList({ userId: userId });

      if (organizations && organizations.length > 0) {
        // User already has at least one organization; continue normally
        return NextResponse.next();
      }

      // Load user details to derive a friendly organization name
      const user = await client.users.getUser(userId);

      // Derive organization name from available user fields, with sensible fallbacks
      const orgName = user.fullName
        ? `${user.fullName}'s Organization`
        : user.firstName
          ? `${user.firstName}'s Organization`
          : user.username
            ? `${user.username}'s Organization`
            : user.primaryEmailAddress?.emailAddress
              ? `${user.primaryEmailAddress?.emailAddress}'s Organization`
              : 'My Organization';

      // Create a new organization for the user
      await client.organizations.createOrganization({
        name: orgName,
        createdBy: userId,
      });

      console.info('Auto-created organization:', orgName);
    } catch (error) {
      // Log the error but do not block the request
      console.error('Error auto-creating organization:', error);
    }
  }

  // Always continue to the next handler/route
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except Next.js internals and common static assets
    // (unless those assets are explicitly requested via search params)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API and tRPC routes
    '/(api|trpc)(.*)',
  ],
};
