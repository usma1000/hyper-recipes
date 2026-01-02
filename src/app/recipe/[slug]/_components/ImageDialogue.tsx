"use client";

import { useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UploadButton } from "~/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { fetchAllImages, updateRecipeImage } from "./actions";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import Image from "next/image";

interface UploadImageDialogProps {
  recipeId: number;
}

const UploadImageDialog: React.FC<UploadImageDialogProps> = ({ recipeId }) => {
  const router = useRouter();
  const [images, setImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAccordionChange = async (value: string) => {
    if (value === "gallery" && images.length === 0) {
      setIsLoading(true);
      try {
        const fetchedImages = await fetchAllImages();
        setImages(fetchedImages);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Upload a new image to set as the hero image for this recipe or
            select one from the Image Gallery below.
          </DialogDescription>
        </DialogHeader>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={async (res) => {
            if (res?.[0]) {
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
        <Accordion
          type="single"
          collapsible
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value="gallery">
            <AccordionTrigger>Image Gallery</AccordionTrigger>
            <AccordionContent>
              {isLoading ? (
                <div className="flex justify-center p-4">Loading images...</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative">
                      <AspectRatio ratio={16 / 9} className="bg-muted">
                        <Image
                          src={image.url}
                          alt={image.name}
                          fill
                          className="h-full w-full rounded-md object-cover transition-all hover:opacity-90"
                        />
                      </AspectRatio>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={async () => {
                          const result = await updateRecipeImage(
                            recipeId,
                            image.id,
                          );
                          if (result.success) {
                            setOpen(false);
                            router.refresh();
                          }
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
