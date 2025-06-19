"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Category } from "@/lib/data"
import { ArrowLeft } from "lucide-react"

export default function ProductsPageClient({ categories = [] }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        
        <h1 className={`text-3xl font-bold text-black w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === "ar" ? "فئاتنا" : "Our Categories"}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Link 
            href={`/products/${category.slug}?lang=${lang}`} 
            key={category.id}
            className="group"
          >
            <div className="flex flex-col items-center justify-center min-h-[140px] bg-white/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl shadow-lg shadow-primary/10 transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-105">
              <div className="flex flex-col items-center justify-center w-full p-4 md:p-8">
                {lang === "ar" ? (
                  <h2 dir="rtl" className="text-2xl font-bold mb-2 text-center text-primary">{category.name.ar}</h2>
                ) : (
                  <h2 className="text-2xl font-bold mb-2 text-center text-primary">{category.name.en}</h2>
                )}
                {category.subcategories && category.subcategories.length > 0 && (
                  <p className="text-gray-700 text-base text-center">
                    {lang === 'ar'
                      ? `${category.subcategories.length} علامات تجارية`
                      : `${category.subcategories.length} Brands`}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 