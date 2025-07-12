"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface GalleryImage {
  id?: string
  url?: string
  createdAt: string
  category?: string
  thumbUrl?: string
}

function getLangField(field: any, lang: "en" | "ar"): string {
  if (typeof field === "string") return field;
  if (field && typeof field === "object") {
    if (typeof field[lang] === "string") return field[lang];
    if (typeof field.en === "string") return field.en;
    if (typeof field.ar === "string") return field.ar;
  }
  return "";
}

function brief(text: any, max: number = 20): string {
  if (typeof text !== "string") return "";
  return text.length > max ? text.substring(0, max) + "..." : text;
}

export default function GalleryTableClient({ images }: { images: GalleryImage[] }) {
  const router = useRouter();

  async function handleDelete(imageId: string | undefined) {
    if (!imageId) return;
    console.log('Deleting gallery image with ID:', imageId);
    try {
      const formData = new FormData();
      formData.append("id", imageId);
      const response = await fetch("/api/gallery/delete", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      router.refresh();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 md:p-4 text-left">Image</th>
            <th className="p-2 md:p-4 text-left">Category</th>
            <th className="p-2 md:p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image) => (
            <tr key={image.id} className="border-b">
              <td className="p-2 md:p-4">
                {image.url && (
                  <div className="relative w-20 h-20">
                    <Image
                      src={`/api/images/${image.thumbUrl || image.url}`}
                      alt="Gallery image"
                      fill
                      className="object-cover rounded"
                      loading="lazy"
                    />
                  </div>
                )}
              </td>
              <td className="p-2 md:p-4">{image.category || '-'}</td>
              <td className="p-2 md:p-4">
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the image.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {image.id && (
                          <AlertDialogAction onClick={() => handleDelete(image.id)}>
                            Delete
                          </AlertDialogAction>
                        )}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 