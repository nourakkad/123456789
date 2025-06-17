"use client"

import { Product } from "@/lib/data"
import { notFound, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link
          href={`/products/${product.categorySlug}/${product.subcategorySlug || ''}?lang=${lang}`}
          className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <ArrowLeft className="w-5 h-5" />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:max-w-[1000px] md:mx-auto">
        {/* Product Image */}
        <div className="relative aspect-square">
          {product.image ? (
            <Image
              src={`/api/images/${product.image}`}
              alt={lang === "ar" ? product.name.ar : product.name.en}
              fill
              className="object-cover rounded-lg border border-primary bg-white"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className={`space-y-6 ${lang === "ar" ? "text-right" : ""} text-black bg-white border border-primary rounded-xl shadow p-8 `}>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">
              {lang === "ar" ? product.name.ar : product.name.en}
            </h1>
            <p
              className="text-primary"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {lang === "ar" ? product.category.ar : product.category.en}
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              {lang === "ar" ? "الوصف" : "Description"}
            </h2>
            <p
              className="text-black whitespace-pre-line"
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {lang === "ar" ? product.description.ar : product.description.en}
            </p>
          </div>

          {/* Extra Images/Descriptions */}
          {Array.isArray(product.extraImages) && product.extraImages.length > 0 && (
            <div className="border border-primary rounded-lg bg-white p-4 mt-8">
              <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
                {product.extraImages.map((img, idx) => (
                  <div key={idx} className="flex flex-col items-center w-full md:w-64">
                    {img.url && (
                      <div className="relative w-full h-32">
                        <Image
                          src={`/api/images/${img.url}`}
                          alt={lang === "ar" ? img.description_ar : img.description_en}
                          fill
                          className="object-contain border border-primary bg-white"
                        />
                      </div>
                    )}
                    <div className="w-full mt-2">
                      <p
                        className={`text-black whitespace-pre-line ${lang === 'ar' ? 'text-right' : (idx < 2 ? 'text-left' : 'text-center')}`}
                        dir={lang === "ar" ? "rtl" : "ltr"}
                      >
                        {lang === "ar" ? img.description_ar : img.description_en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a
            href={`/contact?lang=${lang}`}
            className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors block text-center"
          >
            {lang === "ar" ? "اتصل بنا" : "Contact Us"}
          </a>
        </div>
      </div>
    </div>
  )
} 