"use client";

import { useUser } from "@clerk/nextjs";

interface AdminWrapperProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper that only renders children for admin users.
 * Uses Clerk's useUser hook to check admin status without blocking SSR.
 */
export function AdminWrapper({ children }: AdminWrapperProps): JSX.Element | null {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}

