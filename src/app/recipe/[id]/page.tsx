import FullPageRecipeView from "~/app/_components/FullRecipePage";

export default function RecipePage({
  params: { id: recipeId },
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(recipeId);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo ID");

  return (
    <div>
      <FullPageRecipeView id={idAsNumber} />
    </div>
  );
}
