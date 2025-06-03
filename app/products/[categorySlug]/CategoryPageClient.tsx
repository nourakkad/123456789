"use client"

import { Category, Product } from "@/lib/data"
import { notFound, useSearchParams } from "next/navigation"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import Image from "next/image"

interface SubcategoryWithLogo {
  id: string
  name: { en: string; ar: string }
  slug: string
  logo?: string
}

interface CategoryPageClientProps {
  category: {
    name: { en: string; ar: string }
    slug: string
    subcategories?: SubcategoryWithLogo[]
  }
  products?: Product[]
}

export default function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  if (!category) {
    notFound()
  }

  // If category has subcategories, show them
  if (category.subcategories && category.subcategories.length > 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold text-primary ${lang === 'ar' ? 'text-right w-full' : ''}`}>
            {lang === "ar" ? category.name.ar : category.name.en}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subcategories.map((subcategory) => (
            <Link
              href={`/products/${category.slug}/${subcategory.slug}?lang=${lang}`}
              key={subcategory.id}
              className="group"
            >
              <div className="bg-white border border-primary rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105 flex flex-col items-center p-4 md:p-6">
                {subcategory.logo && (
                  <div className="w-full h-24 md:h-32 mb-4 flex items-center justify-center">
                    <Image
                      src={`/api/images/${subcategory.logo}`}
                      alt={subcategory.name[lang]}
                      fill={false}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-center mt-2 text-primary">
                  {lang === "ar" ? subcategory.name.ar : subcategory.name.en}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // If no subcategories, show products
  if (!products) return null
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl font-bold text-primary ${lang === 'ar' ? 'text-right w-full' : ''}`}>
          {lang === "ar" ? category.name.ar : category.name.en}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
    </div>
  )
} 