import {
  getRecipeIdFromSlug,
  getRecipeNameAndDescription,
} from "~/server/queries";
import FullRecipePage from "./_components/FullRecipePage";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params: { slug } }: Props) {
  const id = await getRecipeIdFromSlug(slug);
  const { name, description } = await getRecipeNameAndDescription(id);
  return {
    title: `Recipe for ${name}`,
    description: description,
  };
}

export default async function RecipePage({ params: { slug } }: Props) {
  const id = await getRecipeIdFromSlug(slug);

  return (
    <div>
      <FullRecipePage id={id} />
    </div>
  );
}
