"use client"

import { Category, Product } from "@/lib/data"
import { notFound, useSearchParams } from "next/navigation"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import Image from "next/image"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface SubcategoryWithLogo {
  id: string
  name: { en: string; ar: string }
  slug: string
  logo?: string
  description?: { en?: string; ar?: string }
  slogan?: { en?: string; ar?: string }
  hardcodedPageSlug?: string
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

// ReadMoreText component for mobile
function ReadMoreText({ text, lang }: { text: string, lang: string }) {
  const [expanded, setExpanded] = useState(false);
  const maxLines = 3;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [expanded]);

  return (
    <div className="mb-6" ref={ref}>
      <div
        className={`transition-all duration-300 overflow-hidden ${expanded ? '' : 'max-h-20'}`}
        style={!expanded ? { display: '-webkit-box', WebkitLineClamp: maxLines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}}
      >
        <p
          className={`text-black text-base whitespace-pre-line ${expanded ? '' : 'line-clamp-3'}`}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {text}
        </p>
      </div>
      {!expanded && (
        <button
          className="mt-1 text-primary underline text-sm font-medium flex items-center gap-1 focus:outline-none hover:text-green-700 transition-colors"
          aria-expanded="false"
          onClick={e => { e.stopPropagation(); e.preventDefault(); setExpanded(true); }}
        >
          {lang === 'ar' ? 'اقرأ المزيد' : 'Read more'}
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
      {expanded && (
        <button
          className="mt-1 text-primary underline text-sm font-medium flex items-center gap-1 focus:outline-none hover:text-green-700 transition-colors"
          aria-expanded="true"
          onClick={e => { e.stopPropagation(); e.preventDefault(); setExpanded(false); }}
        >
          {lang === 'ar' ? 'إخفاء' : 'Show less'}
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
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
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white/50 backdrop-blur-sm text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ArrowLeft className="w-5 h-5" />
            {lang === 'ar' ? 'العودة' : 'Back'}
          </Link>
          <h1 className={`text-3xl font-bold text-black w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === "ar" ? category.name.ar : category.name.en}</h1>
        </div>
        
        {category.description && (category.description.en || category.description.ar) && (
          <div className="mb-8">
            <div className="bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow p-6">
              <p className="text-black whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {lang === 'ar' ? category.description.ar : category.description.en}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-8">
          {category.subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={
                subcategory.hardcodedPageSlug
                  ? `/hardcoded-pages/${subcategory.hardcodedPageSlug}?categorySlug=${category.slug}&lang=${lang}`
                  : `/products/${category.slug}/${subcategory.slug}?lang=${lang}`
              }
              className="w-full bg-white/50 backdrop-blur-sm border border-primary rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none min-h-[320px] group"
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
                  <>
                    {/* Mobile: Read More toggle */}
                    <div className="block md:hidden">
                      <ReadMoreText text={lang === 'ar' ? subcategory.description.ar || '' : subcategory.description.en || ''} lang={lang} />
                    </div>
                    {/* Desktop: Full text */}
                    <p className="hidden md:block text-black text-lg mb-6 whitespace-pre-line" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      {lang === 'ar' ? subcategory.description.ar : subcategory.description.en}
                    </p>
                  </>
                )}
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
      <div className="flex items-center mb-8">
        <Link
          href="/products"
          className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white/50 backdrop-blur-sm text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <ArrowLeft className="w-5 h-5" />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </Link>
        <h1 className={`text-3xl font-bold text-black w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === "ar" ? category.name.ar : category.name.en}</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(products || []).map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
    </div>
  )
} 