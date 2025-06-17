import { Button } from "@/components/ui/button"
import { getCategories } from "@/lib/data"
import { Plus } from "lucide-react"
import Link from "next/link"
import CategoriesTableClient from "./categories-table-client"

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <CategoriesTableClient categories={categories as any} />
    </div>
  )
}
