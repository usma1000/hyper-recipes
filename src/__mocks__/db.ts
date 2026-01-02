import { vi } from "vitest";
import { mockDeep, type DeepMockProxy } from "vitest-mock-extended";

/**
 * Mock database instance for testing.
 * Uses vitest-mock-extended to create a deep mock of the Drizzle db object.
 */
export type MockDb = DeepMockProxy<typeof import("../server/db").db>;

export const mockDb = mockDeep<typeof import("../server/db").db>();

/**
 * Creates a mock query result helper for Drizzle's query API.
 * @param data - The data to return from the mock query
 * @returns Mock implementation for findFirst/findMany
 */
export function createMockQueryResult<T>(data: T): () => Promise<T> {
  return vi.fn().mockResolvedValue(data);
}

/**
 * Resets all mock implementations on the mock database.
 * Call this in beforeEach to ensure clean state between tests.
 */
export function resetMockDb(): void {
  vi.clearAllMocks();
}
