import { getProductBySlug } from "@/lib/data"
import ProductPageClient from "./ProductPageClient"
import { notFound } from "next/navigation"

export default async function ProductPage({
  params,
}: {
  params: { categorySlug: string; subcategorySlug: string; productSlug: string }
}) {
  console.log('Fetching product:', {
    productSlug: params.productSlug,
    categorySlug: params.categorySlug,
    subcategorySlug: params.subcategorySlug
  })
  
  const product = await getProductBySlug(params.productSlug, params.categorySlug)
  
  console.log('Found product:', product)
  
  if (!product) {
    console.log('Product not found, showing 404')
    notFound()
  }

  return <ProductPageClient product={product} />
} 