import { Button } from "@/components/ui/button"
import { getGalleryImages } from "@/lib/data"
import { Plus } from "lucide-react"
import Link from "next/link"
import GalleryTableClient from "./gallery-table-client"

export default async function AdminGalleryPage() {
  const images = await getGalleryImages()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <Link href="/admin/gallery/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </Link>
      </div>

      <GalleryTableClient images={images as any} />
    </div>
  )
}
