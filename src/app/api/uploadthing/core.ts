import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { ImagesTable } from "~/server/db/schemas";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const user = auth();

      // If you throw, the user will not be able to upload
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const [newImageId] = await db
        .insert(ImagesTable)
        .values({
          name: file.name,
          url: file.url,
          userId: metadata.userId,
        })
        .returning({ id: ImagesTable.id });

      if (!newImageId) throw new Error("Failed to insert image");

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { newImageId: newImageId.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
