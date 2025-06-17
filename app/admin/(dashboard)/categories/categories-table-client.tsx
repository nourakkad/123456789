"use client"

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
import Image from "next/image"

interface Category {
  id?: string
  name: {
    en: string
    ar: string
  }
  slug: string
  subcategories?: {
    id: string
    name: {
      en: string
      ar: string
    }
    slug: string
    logo?: string
  }[]
}

export default function CategoriesTableClient({ categories }: { categories: Category[] }) {
  const router = useRouter();

  async function handleDelete(categoryId: string | undefined) {
    if (!categoryId) return;
    console.log('Deleting category with id:', categoryId);
    const formData = new FormData();
    formData.append("id", categoryId);
    await fetch("/api/categories/delete", {
      method: "POST",
      body: formData,
    });
    router.refresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (EN)</th>
            <th className="p-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (AR)</th>
            <th className="p-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
            <th className="p-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
            <th className="p-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="p-2 md:px-6 md:py-4 whitespace-nowrap">{category.name.en}</td>
              <td className="p-2 md:px-6 md:py-4 whitespace-nowrap">{category.name.ar}</td>
              <td className="p-2 md:px-6 md:py-4 whitespace-nowrap">{category.slug}</td>
              <td className="p-2 md:px-6 md:py-4 whitespace-nowrap">
                {Array.isArray(category.subcategories) 
                  ? category.subcategories.map(sub => (
                      <span key={sub.id} className="inline-flex items-center mr-2">
                        {sub.logo && (
                          <Image
                            src={`/api/images/${sub.logo}`}
                            alt={sub.name.en}
                            width={24}
                            height={24}
                            className="object-contain rounded-full border mr-1"
                          />
                        )}
                        {sub.name.en}
                      </span>
                    ))
                  : 0}
              </td>
              <td className="p-2 md:px-6 md:py-4 whitespace-nowrap flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/categories/${category.slug}/edit`)}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Category</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <b>{category.name.en}</b>? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                      {category.id ? (
                        <AlertDialogAction asChild>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id as string)}>
                            Delete
                          </Button>
                        </AlertDialogAction>
                      ) : null}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 