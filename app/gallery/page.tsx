export const dynamic = "force-dynamic";
import { getGalleryImages } from "@/lib/data"
import { Suspense } from "react"
import GalleryPageClient from "./GalleryPageClient"

export default async function GalleryPage() {
  const images = await getGalleryImages();
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <GalleryPageClient images={images as any} />
      </Suspense>
    </div>
  );
}
