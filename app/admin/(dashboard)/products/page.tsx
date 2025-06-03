import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/data"
import { Plus } from "lucide-react"
import Link from "next/link"
import ProductsTableClient from "./products-table-client"

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>
      <ProductsTableClient products={products as any} />
    </div>
  )
}
