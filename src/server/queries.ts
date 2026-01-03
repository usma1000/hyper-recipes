/**
 * This file is kept for backwards compatibility.
 * All functionality has been moved to individual files in the `queries` directory.
 *
 * New code should import directly from the appropriate module:
 * import { functionName } from "~/server/queries/moduleName";
 */

export * from "./queries/utils";
export * from "./queries/images";
export * from "./queries/recipes";
export * from "./queries/favorites";
export * from "./queries/tags";
export * from "./queries/ingredients";
export * from "./queries/gamification";
export * from "./queries/cookingHistory";
export * from "./queries/collections";

// Recipe Authoring v2 queries
export * from "./queries/recipeVersions";
export * from "./queries/recipeView";
