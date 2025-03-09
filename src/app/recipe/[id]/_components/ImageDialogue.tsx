"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { UploadButton } from "~/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { updateRecipeImage } from "./actions";

interface UploadImageDialogProps {
  recipeId: number;
}

const UploadImageDialog: React.FC<UploadImageDialogProps> = ({ recipeId }) => {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ImageIcon size={16} className="mr-1" />
          Upload Image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload an image to set as the hero image for this recipe.
          </DialogDescription>
        </DialogHeader>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={async (res) => {
            if (res && res[0]) {
              const imageId = res[0].serverData.newImageId;
              const result = await updateRecipeImage(recipeId, imageId);

              if (result.success) {
                router.refresh();
              }
            } else {
              console.error("Failed to upload image");
            }
          }}
          className="ut-button:bg-black"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImageDialog;
