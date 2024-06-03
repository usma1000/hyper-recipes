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
      {/* replace with a modal, image on left, scrollable ingredients on right */}
      <FullPageRecipeView id={idAsNumber} />
    </div>
  );
}
