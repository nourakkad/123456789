import Image from "next/image"
import Link from "next/link"
import { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  lang: "en" | "ar"
  small?: boolean
  fromHardcodedPage?: boolean
}

// Helper function to get text from translation object or string
function getText(text: string | { en: string; ar: string }): string {
  if (typeof text === 'string') return text
  return text.en // Default to English
}

export default function ProductCard({ product, lang, small, fromHardcodedPage }: ProductCardProps) {
  // Use fromHardcodedPage to force the 'from' param when rendering from the hardcoded page
  const isHardcodedInfinity = fromHardcodedPage || product.subcategorySlug === 'infinity' || product.categorySlug === 'infinity';
  const fromParam = isHardcodedInfinity ? `&from=hardcoded-infinity&categorySlug=${product.categorySlug}` : '';
  const productUrl = `/products/${product.categorySlug}/${product.subcategorySlug || 'products'}/${product.slug}?lang=${lang}${fromParam}`;

  console.log('ProductCard URL:', productUrl)

  if (small) {
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group max-w-sm mx-auto">
        <Link href={productUrl} className="flex flex-col h-full">
          <div className="relative w-80 h-80 bg-gray-100">
            <Image
              src={product.thumbUrl ? `/api/images/${product.thumbUrl}` : (product.image ? `/api/images/${product.image}` : "/placeholder.svg?height=400&width=400")}
              alt={product.name[lang]}
              fill
              className="object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </div>
          <div className={`flex-1 flex flex-col justify-between p-3 ${lang === "ar" ? "text-right" : ""}`}>
            <h3 className="font-bold text-base mb-1 truncate" title={product.name[lang]}>{product.name[lang]}</h3>
            <p className="text-xs text-gray-500 mb-2 truncate">
              {product.category[lang]}
              {product.subcategory && ` / ${product.subcategory[lang]}`}
            </p>
            
          </div>
        </Link>
      </div>
    );
  }
  // Default (large) card
  return (
    <div className="border border-primary rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 bg-white/50 backdrop-blur-sm flex flex-col h-full">
      <Link href={productUrl} className="group flex-1 flex flex-col">
        <div className="relative aspect-square">
          <Image
            src={product.thumbUrl ? `/api/images/${product.thumbUrl}` : (product.image ? `/api/images/${product.image}` : "/placeholder.svg?height=400&width=400")}
            alt={product.name[lang]}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className={`p-4 ${lang === "ar" ? "text-right" : ""} text-black`}>
          <h3 className="font-semibold text-lg mb-2">{product.name[lang]}</h3>
          <p className="text-primary mb-2">
            {product.category[lang]}
            {product.subcategory && ` / ${product.subcategory[lang]}`}
          </p>
        </div>
      </Link>
    </div>
  )
}
