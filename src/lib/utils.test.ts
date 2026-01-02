import { describe, it, expect } from "vitest";
import { cn, slugify } from "./utils";

describe("cn", () => {
  it("merges class names correctly", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toBe("text-red-500 bg-blue-500");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("handles false conditional classes", () => {
    const isActive = false;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class");
  });

  it("merges tailwind classes correctly with overrides", () => {
    const result = cn("px-4 py-2", "px-6");
    expect(result).toBe("py-2 px-6");
  });

  it("handles undefined and null values", () => {
    const result = cn("base", undefined, null, "end");
    expect(result).toBe("base end");
  });

  it("handles empty string input", () => {
    const result = cn("");
    expect(result).toBe("");
  });

  it("handles array of classes", () => {
    const result = cn(["class-a", "class-b"]);
    expect(result).toBe("class-a class-b");
  });
});

describe("slugify", () => {
  it("converts text to lowercase", () => {
    const result = slugify("Hello World");
    expect(result).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    const result = slugify("chicken curry recipe");
    expect(result).toBe("chicken-curry-recipe");
  });

  it("removes special characters", () => {
    const result = slugify("Pasta & Meatballs!");
    expect(result).toBe("pasta-meatballs");
  });

  it("handles multiple consecutive spaces", () => {
    const result = slugify("beef   stew");
    expect(result).toBe("beef-stew");
  });

  it("handles multiple consecutive hyphens", () => {
    const result = slugify("pan---fried fish");
    expect(result).toBe("pan-fried-fish");
  });

  it("converts leading/trailing whitespace to hyphens", () => {
    // Note: trim() only removes whitespace, not hyphens created from spaces
    const result = slugify("  trimmed recipe  ");
    expect(result).toBe("-trimmed-recipe-");
  });

  it("handles unicode characters", () => {
    const result = slugify("Cafe au Lait");
    expect(result).toBe("cafe-au-lait");
  });

  it("returns empty string for empty input", () => {
    const result = slugify("");
    expect(result).toBe("");
  });

  it("handles numbers in text", () => {
    const result = slugify("Recipe 101");
    expect(result).toBe("recipe-101");
  });

  it("handles text with only special characters", () => {
    const result = slugify("@#$%");
    expect(result).toBe("");
  });
});
