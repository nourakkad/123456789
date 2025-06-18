"use client"

import Link from "next/link"
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
import { deleteProduct as originalDeleteProduct } from "@/lib/actions"

interface Product {
  id?: string
  name: {
    en: string
    ar: string
  }
  slug: string
  description: {
    en: string
    ar: string
  }
  price?: number
  image?: string
  category: {
    en: string
    ar: string
  }
  categorySlug: string
  subcategory?: {
    en: string
    ar: string
  }
  subcategorySlug?: string
  createdAt: string
}

interface ProductsTableClientProps {
  products: Product[]
}

export default function ProductsTableClient({ products }: ProductsTableClientProps) {
  const router = useRouter();

  async function handleDelete(productId: string) {
    const formData = new FormData();
    formData.append("id", productId);
    await fetch("/api/products/delete", {
      method: "POST",
      body: formData,
    });
    router.refresh();
  }

  async function deleteProduct(formData: FormData) {
    await originalDeleteProduct(formData);
    return;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (EN)</th>
            <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (AR)</th>
            <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category (EN)</th>
            <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category (AR)</th>
            <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">{product.name.en}</td>
              <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">{product.name.ar}</td>
              <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">{product.category.en}</td>
              <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">{product.category.ar}</td>
              <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap flex gap-2">
                <Link href={`/admin/products/edit/${product.id}`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <b>{product.name.en}</b>? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id as string)}>
                          Delete
                        </Button>
                      </AlertDialogAction>
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