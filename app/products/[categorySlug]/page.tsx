import { getCategoryBySlug, getProductsByCategory } from "@/lib/data"
import CategoryPageClient from "./CategoryPageClient"
import { notFound } from "next/navigation"

export default async function CategoryPage({
  params,
}: {
  params: { categorySlug: string }
}) {
  const category = await getCategoryBySlug(params.categorySlug)
  
  if (!category) {
    notFound()
  }

  // If category has subcategories, only fetch category
  if (category.subcategories && category.subcategories.length > 0) {
    return <CategoryPageClient category={category} />
  }

  // If no subcategories, fetch products
  const products = await getProductsByCategory(params.categorySlug)
  return <CategoryPageClient category={category} products={products} />
} 