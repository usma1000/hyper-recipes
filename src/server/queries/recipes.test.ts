import { describe, it, expect, vi, beforeEach } from "vitest";
import { slugify } from "~/lib/utils";

// Mock the database module
vi.mock("../db", () => ({
  db: {
    query: {
      RecipesTable: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
  },
}));

// Mock server-only (no-op in tests)
vi.mock("server-only", () => ({}));

// Mock the utils module
vi.mock("./utils", () => ({
  revalidateRecipePaths: vi.fn(),
}));

// Get the mocked modules
const { db } = await import("../db");
const { auth } = await import("@clerk/nextjs/server");

describe("recipes queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to authenticated user
    const authMock = vi.mocked(auth);
    authMock.mockReturnValue({ userId: "test-user-id" } as ReturnType<
      typeof auth
    >);
  });

  describe("getRecipeIdFromSlug", () => {
    it("returns recipe id when recipe exists", async () => {
      const mockRecipe = { id: 123 };
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const findFirstMock = vi.mocked(db.query.RecipesTable.findFirst);
      findFirstMock.mockResolvedValue(mockRecipe as never);

      // Import fresh to get the mocked version
      const { getRecipeIdFromSlug } = await import("./recipes");
      const result = await getRecipeIdFromSlug("test-recipe");

      expect(result).toBe(123);
      expect(findFirstMock).toHaveBeenCalled();
    });

    it("throws error when recipe not found", async () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const findFirstMock = vi.mocked(db.query.RecipesTable.findFirst);
      findFirstMock.mockResolvedValue(undefined as never);

      const { getRecipeIdFromSlug } = await import("./recipes");

      await expect(getRecipeIdFromSlug("non-existent")).rejects.toThrow(
        "Recipe not found",
      );
    });
  });

  describe("getRecipe", () => {
    it("returns recipe with hero image when found", async () => {
      const mockRecipe = {
        id: 1,
        name: "Test Recipe",
        slug: "test-recipe",
        description: "A test recipe",
        published: true,
        heroImage: { id: 1, url: "https://example.com/image.jpg" },
      };
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const findFirstMock = vi.mocked(db.query.RecipesTable.findFirst);
      findFirstMock.mockResolvedValue(mockRecipe as never);

      const { getRecipe } = await import("./recipes");
      const result = await getRecipe(1);

      expect(result).toEqual(mockRecipe);
    });

    it("throws error when recipe not found", async () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const findFirstMock = vi.mocked(db.query.RecipesTable.findFirst);
      findFirstMock.mockResolvedValue(undefined as never);

      const { getRecipe } = await import("./recipes");

      await expect(getRecipe(999)).rejects.toThrow("Recipe not found.");
    });

    it("throws error for unpublished recipe when user not authenticated", async () => {
      const mockRecipe = {
        id: 1,
        name: "Unpublished Recipe",
        published: false,
      };
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const findFirstMock = vi.mocked(db.query.RecipesTable.findFirst);
      findFirstMock.mockResolvedValue(mockRecipe as never);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const authMock = vi.mocked(auth);
      authMock.mockReturnValue({ userId: null } as ReturnType<typeof auth>);

      const { getRecipe } = await import("./recipes");

      await expect(getRecipe(1)).rejects.toThrow("Recipe is unpublished.");
    });

    it("returns unpublished recipe when user is authenticated", async () => {
      const mockRecipe = {
        id: 1,
        name: "Unpublished Recipe",
        published: false,
        heroImage: null,
      };
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const findFirstMock = vi.mocked(db.query.RecipesTable.findFirst);
      findFirstMock.mockResolvedValue(mockRecipe as never);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const authMock = vi.mocked(auth);
      authMock.mockReturnValue({ userId: "test-user-id" } as ReturnType<
        typeof auth
      >);

      const { getRecipe } = await import("./recipes");
      const result = await getRecipe(1);

      expect(result).toEqual(mockRecipe);
    });
  });

  describe("getUnpublishedRecipes", () => {
    it("returns list of unpublished recipes", async () => {
      const mockRecipes = [
        { id: 1, name: "Draft Recipe 1", published: false },
        { id: 2, name: "Draft Recipe 2", published: false },
      ];
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const findManyMock = vi.mocked(db.query.RecipesTable.findMany);
      findManyMock.mockResolvedValue(mockRecipes as never);

      const { getUnpublishedRecipes } = await import("./recipes");
      const result = await getUnpublishedRecipes();

      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe("Draft Recipe 1");
    });

    it("returns empty array when no unpublished recipes", async () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const findManyMock = vi.mocked(db.query.RecipesTable.findMany);
      findManyMock.mockResolvedValue([] as never);

      const { getUnpublishedRecipes } = await import("./recipes");
      const result = await getUnpublishedRecipes();

      expect(result).toHaveLength(0);
    });
  });

  describe("createNewRecipe", () => {
    it("throws error when user not authenticated", async () => {
      const authMock = vi.mocked(auth);
      authMock.mockReturnValue({ userId: null } as ReturnType<typeof auth>);

      const { createNewRecipe } = await import("./recipes");

      await expect(
        createNewRecipe({
          name: "New Recipe",
          description: "A description",
        }),
      ).rejects.toThrow("Not authenticated");
    });
  });

  describe("updateRecipeNameAndDescription", () => {
    it("throws error when user not authenticated", async () => {
      const authMock = vi.mocked(auth);
      authMock.mockReturnValue({ userId: null } as ReturnType<typeof auth>);

      const { updateRecipeNameAndDescription } = await import("./recipes");

      await expect(
        updateRecipeNameAndDescription(1, "New Name", "New Description"),
      ).rejects.toThrow("Not authenticated");
    });
  });

  describe("setPublishRecipe", () => {
    it("throws error when user not authenticated", async () => {
      const authMock = vi.mocked(auth);
      authMock.mockReturnValue({ userId: null } as ReturnType<typeof auth>);

      const { setPublishRecipe } = await import("./recipes");

      await expect(setPublishRecipe(1, true)).rejects.toThrow(
        "Not authenticated",
      );
    });
  });

  describe("saveStepsForRecipeId", () => {
    it("throws error when user not authenticated", async () => {
      const authMock = vi.mocked(auth);
      authMock.mockReturnValue({ userId: null } as ReturnType<typeof auth>);

      const { saveStepsForRecipeId } = await import("./recipes");

      await expect(
        saveStepsForRecipeId(1, JSON.stringify({ steps: [] })),
      ).rejects.toThrow("Not authenticated");
    });
  });

  describe("updateRecipeHeroImage", () => {
    it("throws error when user not authenticated", async () => {
      const authMock = vi.mocked(auth);
      authMock.mockReturnValue({ userId: null } as ReturnType<typeof auth>);

      const { updateRecipeHeroImage } = await import("./recipes");

      await expect(updateRecipeHeroImage(1, 5)).rejects.toThrow(
        "Not authenticated",
      );
    });
  });
});

describe("slugify integration with recipes", () => {
  it("generates correct slug from recipe name", () => {
    const recipeName = "Grandma's Chicken Pot Pie";
    const slug = slugify(recipeName);
    expect(slug).toBe("grandmas-chicken-pot-pie");
  });

  it("handles recipe names with numbers", () => {
    const recipeName = "5 Minute Pasta Sauce";
    const slug = slugify(recipeName);
    expect(slug).toBe("5-minute-pasta-sauce");
  });
});
