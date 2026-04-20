import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Intentionally throws in non-production for Sentry tests.
 * Disabled in production so bots cannot drive errors and Fluid CPU.
 */
export function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  throw new Error("Sentry Example API Route Error");
}
