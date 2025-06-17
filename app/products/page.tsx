export const dynamic = "force-dynamic";
import { getCategories } from "@/lib/data"
import ProductsPageClient from "./ProductsPageClient"
import { Suspense } from "react"

export default async function ProductsPage() {
  const categories = await getCategories()
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsPageClient categories={categories} />
      </Suspense>
    </div>
  )
}
