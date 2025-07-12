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
    <div className="space-y-6">
      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gallery Images</h2>
          <p className="text-sm text-gray-500">{images.length} images total</p>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {images.map((image) => (
          <div key={image.id} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
            {/* Image */}
            <div className="relative aspect-square">
              {image.url ? (
                <Image
                  src={`/api/images/${image.thumbUrl || image.url}`}
                  alt="Gallery image"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              
              {/* Delete Button */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Image</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this image? This action cannot be undone.
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
            </div>
            
            {/* Image Info */}
            <div className="p-3">
              <div className="text-xs text-gray-500 mb-1">
                {image.category || 'No category'}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(image.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
            <p className="text-gray-500">Upload your first image to get started.</p>
          </div>
        </div>
      )}
    </div>
  )
} 