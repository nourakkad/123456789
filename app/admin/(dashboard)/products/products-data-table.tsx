"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { deleteProduct as originalDeleteProduct } from "@/lib/actions"
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

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image?: string
  category: string
  categorySlug: string
  subcategory?: string
  subcategorySlug?: string
  createdAt: string
}

interface ProductsDataTableProps {
  products: Product[]
}

async function deleteProduct(formData: FormData) {
  await originalDeleteProduct(formData);
}

export default function ProductsDataTable({ products }: ProductsDataTableProps) {
  const columns = [
    {
      id: "image",
      header: "Image",
      cell: ({ row }: { row: any }) => {
        const product = row.original
        if (!product) return null

        return (
          <div className="w-12 h-12 relative">
            <Image
              src={product.image || "/placeholder.svg?height=48&width=48"}
              alt={product.name || "Product"}
              fill
              className="object-cover rounded"
            />
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }: { row: any }) => {
        const product = row.original
        if (!product || typeof product.price !== "number") return "N/A"
        return `$${product.price.toFixed(2)}`
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const product = row.original
        if (!product) return null

        return (
          <div className="flex items-center gap-2">
            <span style={{color: 'red', fontWeight: 'bold'}}>DEBUG ACTIONS CELL</span>
            <Link href={`/admin/products/edit/${product.id}`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <b>{product.name}</b>? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button variant="destructive" size="sm" type="submit">Delete</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={products} />
}
