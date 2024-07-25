import { getRecipeNameAndDescription } from "~/server/queries";
import FullRecipePage from "./_components/FullRecipePage";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params: { id } }: Props) {
  const { name, description } = await getRecipeNameAndDescription(Number(id));
  return {
    title: `Recipe for ${name}`,
    description: description,
  };
}

export default function RecipePage({ params: { id } }: Props) {
  const idAsNumber = Number(id);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid ID");

  return (
    <div>
      <FullRecipePage id={idAsNumber} />
    </div>
  );
}
