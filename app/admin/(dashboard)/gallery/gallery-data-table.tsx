"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { deleteGalleryImage } from "@/lib/actions"
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

interface GalleryImage {
  id: string
  title: string
  description: string
  url?: string
  createdAt: string
}

interface GalleryDataTableProps {
  images: GalleryImage[]
}

export default function GalleryDataTable({ images }: GalleryDataTableProps) {
  const columns = [
    {
      id: "image",
      header: "Image",
      cell: ({ row }: { row: any }) => {
        const image = row.original
        if (!image) return null

        return (
          <div className="w-12 h-12 relative">
            <Image
              src={image.url || "/placeholder.svg?height=48&width=48"}
              alt={image.title || "Gallery image"}
              fill
              className="object-cover rounded"
            />
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: { row: any }) => {
        const image = row.original
        if (!image || !image.description) return null

        const description = image.description
        return description.length > 50 ? description.substring(0, 50) + "..." : description
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const image = row.original
        if (!image) return null

        return (
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <b>{image.title}</b>? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(image.id)}>
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  function handleDelete(imageId: string) {
    const formData = new FormData();
    formData.append("id", imageId);
    fetch("/api/gallery/delete", {
      method: "POST",
      body: formData,
    }).then(() => window.location.reload());
  }

  return <DataTable columns={columns} data={images} />
}
