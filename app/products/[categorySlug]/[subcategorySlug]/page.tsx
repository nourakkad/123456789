import { getCategoryBySlug, getProductsBySubcategory } from "@/lib/data"
import SubcategoryPageClient from "./SubcategoryPageClient"
import { notFound } from "next/navigation"

export default async function SubcategoryPage({
  params,
}: {
  params: { categorySlug: string; subcategorySlug: string }
}) {
  const category = await getCategoryBySlug(params.categorySlug)
  
  if (!category) {
    notFound()
  }

  const subcategory = category.subcategories?.find(
    (sub) => sub.slug === params.subcategorySlug
  )

  if (!subcategory) {
    notFound()
  }

  const products = await getProductsBySubcategory(params.categorySlug, params.subcategorySlug)
  
  return (
    <SubcategoryPageClient 
      category={category} 
      subcategory={subcategory} 
      products={products} 
    />
  )
} 