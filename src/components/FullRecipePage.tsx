import { getImage } from "~/server/queries";

export default async function FullPageRecipeView(props: { id: number }) {
  const image = await getImage(props.id);
  return (
    <div>
      <img src={image.url} alt={image.name} className="w-96" />
    </div>
  );
}
