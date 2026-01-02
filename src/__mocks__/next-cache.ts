import { vi } from "vitest";

/**
 * Mock implementations for Next.js cache functions.
 * These mocks allow testing server-side code without Next.js runtime.
 */

/**
 * Mock revalidatePath - tracks calls for assertion.
 */
export const mockRevalidatePath = vi.fn();

/**
 * Mock revalidateTag - tracks calls for assertion.
 */
export const mockRevalidateTag = vi.fn();

/**
 * Mock unstable_cache - executes the wrapped function directly.
 * In tests, caching is bypassed to ensure predictable behavior.
 */
export const mockUnstableCache = vi.fn(
  <T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T) =>
    (...args: Parameters<T>): ReturnType<T> =>
      fn(...args),
);

/**
 * Resets all Next.js cache mocks.
 * Call this in beforeEach to ensure clean state between tests.
 */
export function resetNextCacheMocks(): void {
  mockRevalidatePath.mockClear();
  mockRevalidateTag.mockClear();
  mockUnstableCache.mockClear();
}
