import { clerkClient } from "@clerk/nextjs/server";
import { getImage } from "~/server/queries";

export default async function FullPageRecipeView(props: { id: number }) {
  const image = await getImage(props.id);

  const uploaderInfo = await clerkClient.users.getUser(image.userId);

  return (
    <>
      <div>
        <p>Ingredients</p>
        <ul>
          <li>
            <input type="checkbox" />
            <span>Onions</span>
          </li>
        </ul>
      </div>
      <div>
        <img src={image.url} alt={image.name} className="w-96" />
        <p>Posted by: {uploaderInfo.fullName}</p>
        <p>Posted on: {new Date(image.createdAt).toLocaleDateString()}</p>
      </div>
    </>
  );
}
