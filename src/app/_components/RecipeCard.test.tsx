import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RecipeCard from "./RecipeCard";

// Mock Next.js components
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    sizes,
    className,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
  }) => (
    <img
      src={src}
      alt={alt}
      data-fill={fill}
      data-sizes={sizes}
      className={className}
    />
  ),
}));

describe("RecipeCard", () => {
  const mockRecipeWithImage: Recipe = {
    id: 1,
    name: "Delicious Pasta",
    slug: "delicious-pasta",
    description: "A wonderful Italian pasta dish with fresh ingredients",
    heroImageId: 1,
    heroImage: {
      id: 1,
      name: "Pasta Image",
      url: "https://example.com/pasta.jpg",
      userId: "test-user-id",
      createdAt: new Date(),
      updatedAt: null,
    },
    steps: null,
    createdAt: new Date(),
    updatedAt: null,
    published: true,
  };

  const mockRecipeWithoutImage: Recipe = {
    id: 2,
    name: "Simple Salad",
    slug: "simple-salad",
    description: "A quick and healthy salad recipe",
    heroImageId: null,
    heroImage: null,
    steps: null,
    createdAt: new Date(),
    updatedAt: null,
    published: true,
  };

  describe("rendering with hero image", () => {
    it("renders recipe name", () => {
      render(<RecipeCard recipe={mockRecipeWithImage} />);

      expect(screen.getByText("Delicious Pasta")).toBeInTheDocument();
    });

    it("renders recipe description", () => {
      render(<RecipeCard recipe={mockRecipeWithImage} />);

      expect(
        screen.getByText(
          "A wonderful Italian pasta dish with fresh ingredients",
        ),
      ).toBeInTheDocument();
    });

    it("renders hero image with correct src and alt", () => {
      render(<RecipeCard recipe={mockRecipeWithImage} />);

      const image = screen.getByAltText("Pasta Image");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/pasta.jpg");
    });

    it("links to correct recipe page", () => {
      render(<RecipeCard recipe={mockRecipeWithImage} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/recipe/delicious-pasta");
    });
  });

  describe("rendering without hero image", () => {
    it("renders recipe name", () => {
      render(<RecipeCard recipe={mockRecipeWithoutImage} />);

      expect(screen.getByText("Simple Salad")).toBeInTheDocument();
    });

    it("renders recipe description", () => {
      render(<RecipeCard recipe={mockRecipeWithoutImage} />);

      expect(
        screen.getByText("A quick and healthy salad recipe"),
      ).toBeInTheDocument();
    });

    it("does not render an image element", () => {
      render(<RecipeCard recipe={mockRecipeWithoutImage} />);

      // Check that no img element exists (placeholder icon is rendered instead)
      const image = screen.queryByRole("img");
      expect(image).not.toBeInTheDocument();
    });

    it("links to correct recipe page", () => {
      render(<RecipeCard recipe={mockRecipeWithoutImage} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/recipe/simple-salad");
    });
  });

  describe("description truncation", () => {
    it("renders long descriptions (truncation handled by CSS)", () => {
      const recipeWithLongDescription: Recipe = {
        ...mockRecipeWithImage,
        description:
          "This is a very long description that would normally be truncated by the line-clamp CSS utility. It contains a lot of text that describes the recipe in great detail including all the wonderful flavors and aromas.",
      };

      render(<RecipeCard recipe={recipeWithLongDescription} />);

      // The full text should be in the DOM (CSS handles visual truncation)
      expect(
        screen.getByText(/This is a very long description/),
      ).toBeInTheDocument();
    });
  });
});
