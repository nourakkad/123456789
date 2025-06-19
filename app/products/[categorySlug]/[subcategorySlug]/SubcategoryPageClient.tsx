"use client"

import { Category, Product } from "@/lib/data"
import { notFound, useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ReadMoreText from "@/components/ReadMoreText"

interface SubcategoryPageClientProps {
  category: Category
  subcategory: {
    id: string;
    name: { en: string; ar: string };
    slug: string;
    description?: { en: string; ar: string };
    logo?: string;
    slogan?: { en: string; ar: string };
    benefits?: { image?: string; description_en?: string; description_ar?: string }[];
    colors?: { image?: string }[];
  }
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
      <div className="mb-8">
  <div className="flex items-center">
    <Link
      href={`/products/${category.slug}?lang=${lang}`}
      className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white/50 backdrop-blur-sm text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
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

  {subcategory.description && (subcategory.description[lang] || subcategory.description.en) && (
    <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6 mt-6">
      {/* Mobile: ReadMoreText with 4 lines */}
      <div className="block md:hidden">
        <ReadMoreText text={subcategory.description[lang] || subcategory.description.en} maxLines={4} lang={lang} />
      </div>
      {/* Desktop: Full text */}
      <p className="hidden md:block text-black whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {subcategory.description[lang] || subcategory.description.en}
      </p>
    </div>
  )}

  {/* Benefits Section */}
{Array.isArray(subcategory.benefits) && subcategory.benefits.length > 0 && (() => {
  const fullRowCount = Math.floor(subcategory.benefits.length / 5) * 5;
  const fullRows = subcategory.benefits.slice(0, fullRowCount);
  const lastRow = subcategory.benefits.slice(fullRowCount);

  return (
    <div className="my-8">
        <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : ''}`}>
  {lang === 'ar' ? 'الفوائد' : 'Benefits'}
</h2>


      {/* 🔹 Mobile & Tablet (Default Grid) */}
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:hidden gap-6 justify-items-center">
        {subcategory.benefits.map((benefit, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            {benefit.image && (
              <img
                src={`/api/images/${benefit.image}`}
                alt="Benefit"
                className="w-24 h-24 object-contain mb-2"
              />
            )}
            <p className="text-black whitespace-pre-line">
              {lang === 'ar' ? benefit.description_ar : benefit.description_en}
            </p>
          </div>
        ))}
      </div>

      {/* 🔹 Desktop (Custom Centered Last Row) */}
      <div className="hidden lg:block">
        {/* Full 5-column rows */}
        {fullRows.length > 0 && (
          <div className="grid grid-cols-5 gap-6 justify-items-center">
            {fullRows.map((benefit, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                {benefit.image && (
                  <img
                    src={`/api/images/${benefit.image}`}
                    alt="Benefit"
                    className="w-24 h-24 object-contain mb-2"
                  />
                )}
                <p className="text-black whitespace-pre-line">
                  {lang === 'ar' ? benefit.description_ar : benefit.description_en}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Centered last row */}
        {lastRow.length > 0 && (
          <div
            className="grid gap-1 justify-center mt-6"
            style={{
              display: 'grid ',
              gridTemplateColumns: `repeat(${lastRow.length}, minmax(0, 1fr))`,
            }}
          >
            {lastRow.map((benefit, idx) => (
              <div key={idx + fullRowCount} className="flex flex-col items-center text-center">
                {benefit.image && (
                  <img
                    src={`/api/images/${benefit.image}`}
                    alt="Benefit"
                    className="w-24 h-24 object-contain mb-2"
                  />
                )}
                <p className="text-black whitespace-pre-line">
                  {lang === 'ar' ? benefit.description_ar : benefit.description_en}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
})()}
</div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
          key={product.id}
          product={product}
          lang={lang}
          small
        />))}
      </div>

      {/* Colors Section */}
      {Array.isArray(subcategory.colors) && subcategory.colors.length > 0 && (
        <div className="my-8">
          <h2 className={`text-2xl font-bold mb-4 text-primary ${lang === 'ar' ? 'text-right' : ''}`}>
  {lang === 'ar' ? 'الألوان' : 'Colors'}
</h2>

          <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-4  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
            {subcategory.colors.map((color, idx) => (
              color.image && (
                <img
                  key={idx}
                  src={`/api/images/${color.image}`}
                  alt="Color"
                  className="w-auto h-auto object-contain "
                />
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 