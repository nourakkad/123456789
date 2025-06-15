import Image from "next/image"
import Link from "next/link"
import { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  lang: "en" | "ar"
}

// Helper function to get text from translation object or string
function getText(text: string | { en: string; ar: string }): string {
  if (typeof text === 'string') return text
  return text.en // Default to English
}

export default function ProductCard({ product, lang }: ProductCardProps) {
  // Use a consistent URL structure for all products
  const productUrl = `/products/${product.categorySlug}/${product.subcategorySlug || 'products'}/${product.slug}?lang=${lang}`

  console.log('ProductCard URL:', productUrl)

  return (
    <div className="border border-primary rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 bg-white flex flex-col h-full">
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
