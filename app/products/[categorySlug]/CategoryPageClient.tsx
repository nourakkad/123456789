"use client"

import { Category, Product } from "@/lib/data"
import { notFound, useSearchParams } from "next/navigation"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

interface SubcategoryWithLogo {
  id: string
  name: { en: string; ar: string }
  slug: string
  logo?: string
  description?: { en?: string; ar?: string }
  slogan?: { en?: string; ar?: string }
}

interface CategoryPageClientProps {
  category: {
    name: { en: string; ar: string }
    slug: string
    subcategories?: SubcategoryWithLogo[]
    description?: { en?: string; ar?: string }
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
        <div className="flex items-center mb-8">
          <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-primary hover:underline font-medium mr-4">
            <ArrowLeft className="w-5 h-5" />
            {lang === 'ar' ? 'العودة' : 'Back'}
          </Link>
          <h1 className={`text-3xl font-bold text-black w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === "ar" ? category.name.ar : category.name.en}</h1>
        </div>
        
        {category.description && (category.description.en || category.description.ar) && (
          <div className="mb-8">
            <div className="bg-white border border-primary rounded-lg shadow p-6">
              <p className="text-black whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {lang === 'ar' ? category.description.ar : category.description.en}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-8">
          {category.subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className="w-full bg-white border border-primary rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-transform duration-300 group-hover:scale-105 min-h-[320px]"
            >
              {/* Left: Image */}
              <div className="md:w-[30%] w-full flex items-center justify-center bg-gray-100 p-6 md:p-0">
                {subcategory.logo && (
                  <Image
                    src={`/api/images/${subcategory.logo}`}
                    alt={subcategory.name[lang]}
                    width={220}
                    height={160}
                    className="object-contain w-full h-32 md:h-48"
                  />
                )}
              </div>
              {/* Right: Details */}
              <div className="md:w-[70%] w-full flex flex-col justify-center p-8 gap-2">
                <h2 className="text-3xl font-extrabold text-black mb-2 uppercase">{lang === "ar" ? subcategory.name.ar : subcategory.name.en}</h2>
                {subcategory.slogan && (subcategory.slogan.en || subcategory.slogan.ar) && (
                  <div className="text-xl font-semibold text-primary mb-2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? subcategory.slogan.ar : subcategory.slogan.en}
                  </div>
                )}
                {subcategory.description && (subcategory.description.en || subcategory.description.ar) && (
                  <p className="text-black text-lg mb-6 whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? subcategory.description.ar : subcategory.description.en}
                  </p>
                )}
                <div className="flex justify-start">
                  <a
                      href={`/products/${category.slug}/${subcategory.slug}?lang=${lang}`}
                      className="inline-block px-3 py-1 border border-primary font-semibold text-primary text-xs rounded hover:bg-primary hover:text-white transition-colors duration-150 whitespace-nowrap">
                      
                        {lang === 'ar' ? 'عرض المنتجات' : 'View Products'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // If no subcategories, show products
  if (!products) return null
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-primary hover:underline font-medium mr-4">
          <ArrowLeft className="w-5 h-5" />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </Link>
        <h1 className={`text-3xl font-bold text-black w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === "ar" ? category.name.ar : category.name.en}</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
    </div>
  )
} 