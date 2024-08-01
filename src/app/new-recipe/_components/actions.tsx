"use server";

import { z } from "zod";
import { createNewRecipe } from "~/server/queries";

// export async function onNewRecipeSubmit(
//   // values: z.infer<typeof CreateIngredientFormSchema>,
// ) {
//   const ingredientNames = await getAllIngredientNames();
//   const ingredientExists = ingredientNames.find(
//     (ingredient) => ingredient.name === values.name,
//   );

//   if (ingredientExists) {
//     throw new Error("Ingredient already exists");
//   }

//   await createNewIngredient(values);

//   return { success: true };
// }
