import { getProductBySlug, getRelatedProducts } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import ProductCard from "@/components/product-card"
import { useSearchParams } from "next/navigation"

export default async function ProductDirectPage({ params, searchParams }: { params: { productSlug: string }, searchParams?: { lang?: string } }) {
  const product = await getProductBySlug(params.productSlug)
  const lang = searchParams?.lang === 'ar' ? 'ar' : 'en';
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts((product.id ?? '').toString(), product.categorySlug)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href={{ pathname: "/products", query: lang === "ar" ? { lang } : undefined }}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Products
        </Link>
        {" / "}
        <Link
          href={{ pathname: `/products/${product.categorySlug}`, query: lang === "ar" ? { lang } : undefined }}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {typeof product.category === 'string' ? product.category : product.category?.[lang]}
        </Link>
        {product.subcategory && (
          <>
            {" / "}
            <Link
              href={{ pathname: `/products/${product.categorySlug}/${product.subcategorySlug}`, query: lang === "ar" ? { lang } : undefined }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?.[lang]}
            </Link>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg?height=600&width=600"}
              alt={typeof product.name === 'string' ? product.name : product.name?.[lang]}
              width={600}
              height={600}
              className="w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden cursor-pointer">
                <Image
                  src={`/placeholder.svg?height=150&width=150&text=Image+${i}`}
                  alt={`Product image ${i}`}
                  width={150}
                  height={150}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{typeof product.name === 'string' ? product.name : product.name?.[lang]}</h1>
          <p className="text-2xl font-semibold">{'price' in product && typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : ''}</p>

          <div className="space-y-4">
            <h3 className="font-medium">Description</h3>
            <p className="text-gray-600 dark:text-gray-400">{typeof product.description === 'string' ? product.description : product.description?.[lang]}</p>
          </div>

          <div className="pt-4">
            <Button size="lg" className="w-full md:w-auto">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
