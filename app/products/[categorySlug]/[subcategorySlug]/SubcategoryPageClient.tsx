"use client"

import { Category, Product } from "@/lib/data"
import { notFound, useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface SubcategoryPageClientProps {
  category: Category
  subcategory: Category
  products: Product[]
}

export default function SubcategoryPageClient({ 
  category, 
  subcategory, 
  products 
}: SubcategoryPageClientProps) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  if (!category || !subcategory) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link
          href={`/products/${category.slug}?lang=${lang}`}
          className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <ArrowLeft className="w-5 h-5" />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {lang === "ar" ? subcategory.name.ar : subcategory.name.en}
          </h1>
          <p className={`text-gray-600 mt-2 ${lang === "ar" ? "text-right" : ""}`}>
            {lang === "ar" ? category.name.ar : category.name.en}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} small />
        ))}
      </div>
    </div>
  )
} 