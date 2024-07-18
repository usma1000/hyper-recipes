import FullRecipePage from "./_components/FullRecipePage";

export default function RecipePage({
  params: { id: recipeId },
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(recipeId);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo ID");

  return (
    <div>
      <FullRecipePage id={idAsNumber} />
    </div>
  );
}
