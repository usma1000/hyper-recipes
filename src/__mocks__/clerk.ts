import { vi } from "vitest";

/**
 * Mock Clerk auth state for testing.
 * Provides helpers to simulate authenticated and unauthenticated states.
 */

export interface MockAuthState {
  userId: string | null;
}

let currentAuthState: MockAuthState = { userId: "test-user-id" };

/**
 * Mock auth function matching Clerk's auth() signature.
 */
export const mockAuth = vi.fn(() => currentAuthState);

/**
 * Sets the mock auth state for testing different user scenarios.
 * @param state - The auth state to set
 */
export function setMockAuthState(state: MockAuthState): void {
  currentAuthState = state;
  mockAuth.mockReturnValue(state);
}

/**
 * Simulates an authenticated user.
 * @param userId - Optional user ID, defaults to "test-user-id"
 */
export function mockAuthenticatedUser(userId = "test-user-id"): void {
  setMockAuthState({ userId });
}

/**
 * Simulates an unauthenticated state.
 */
export function mockUnauthenticatedUser(): void {
  setMockAuthState({ userId: null });
}

/**
 * Resets auth mock to default authenticated state.
 */
export function resetMockAuth(): void {
  mockAuthenticatedUser();
}
