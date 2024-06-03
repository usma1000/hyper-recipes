import FullPageRecipeView from "~/components/FullRecipePage";

export default function PhotoModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(photoId);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo ID");

  return (
    <div>
      <FullPageRecipeView id={idAsNumber} />
    </div>
  );
}
