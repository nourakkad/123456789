"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { deleteCategory as originalDeleteCategory } from "@/lib/actions"
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

interface Category {
  id: string
  name: string
  slug: string
  subcategories?: {
    id: string
    name: string
    slug: string
  }[]
}

interface CategoriesDataTableProps {
  categories: Category[]
}

async function deleteCategory(formData: FormData) {
  await originalDeleteCategory(formData);
}

export default function CategoriesDataTable({ categories }: CategoriesDataTableProps) {
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      id: "subcategories",
      header: "Subcategories",
      cell: ({ row }: { row: any }) => {
        const category = row.original
        if (!category) return 0
        return Array.isArray(category.subcategories) ? category.subcategories.length : 0
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const category = row.original
        if (!category) return null

        return (
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <b>{category.name}</b>? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
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

  function handleDelete(categoryId: string) {
    const formData = new FormData();
    formData.append("id", categoryId);
    fetch("/api/categories/delete", {
      method: "POST",
      body: formData,
    }).then(() => window.location.reload());
  }

  return <DataTable columns={columns} data={categories} />
}
