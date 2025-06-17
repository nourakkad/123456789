import { getCategories, getCategoryBySlug, getProducts, getProductsByCategory, getProductsBySubcategory, getProductBySlug, getRelatedProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import ProductCard from "@/components/product-card";
import CategorySidebar from "@/components/category-sidebar";
import { Suspense } from "react";

export default async function ProductsCatchAllPage({ params, searchParams }: { params: { slugs?: string[] }, searchParams?: { lang?: string } }) {
  const slugs = params.slugs || [];
  const lang = searchParams?.lang === 'ar' ? 'ar' : 'en';

  // 0 segments: /products -> all products
  if (slugs.length === 0) {
    const categories = await getCategories();
    const products = await getProducts();
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <CategorySidebar categories={categories} />
          </div>
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id ?? ''} product={product} lang={lang} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 1 segment: /products/[categorySlug] -> category listing
  if (slugs.length === 1) {
    const category = await getCategoryBySlug(slugs[0]);
    if (!category) notFound();
    const products = await getProductsByCategory(slugs[0]);
    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <h1 className="text-3xl font-bold mb-8">{typeof category.name === 'string' ? category.name : (category.name?.[lang] || '')}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => <ProductCard key={product.id ?? ''} product={product} lang={lang} />)
            ) : (
              <p>No products found in this category.</p>
            )}
          </div>
        </Suspense>
      </div>
    );
  }

  // 2 segments: /products/[categorySlug]/[maybeSubcategoryOrProductSlug]
  if (slugs.length === 2) {
    const category = await getCategoryBySlug(slugs[0]);
    if (!category) notFound();
    // Check if the second slug is a real subcategory
    const subcategories = Array.isArray(category.subcategories) ? category.subcategories : [];
    const isSubcategory = subcategories.some((sub: any) => sub.slug === slugs[1]);
    if (isSubcategory) {
      // Subcategory listing
      const products = await getProductsBySubcategory(slugs[0], slugs[1]);
      const subcategory = subcategories.find((sub: any) => sub.slug === slugs[1]);
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">{typeof subcategory?.name === 'string' ? subcategory?.name : (subcategory?.name?.[lang] || slugs[1])}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => <ProductCard key={(product.id ?? product._id)?.toString() ?? ''} product={product} lang={lang} />)
            ) : (
              <p>No products found in this subcategory.</p>
            )}
          </div>
        </div>
      );
    }
    // Product detail
    const product = await getProductBySlug(slugs[1]);
    if (!product || !(product.id || product._id)) notFound();
    const productId = (product.id ?? product._id)?.toString() ?? '';
    const relatedProducts = await getRelatedProducts(productId, product.categorySlug);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href={{ pathname: "/products", query: lang === "ar" ? { lang } : undefined }} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Products</Link>
          {" / "}
          <Link href={{ pathname: `/products/${product.categorySlug}`, query: lang === "ar" ? { lang } : undefined }} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">{typeof product.category === 'string' ? product.category : product.category?.[lang]}</Link>
        </div>
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <Image src={product.image || "/placeholder.svg?height=600&width=600"} alt={typeof product.name === 'string' ? product.name : product.name?.[lang]} width={600} height={600} className="w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden cursor-pointer">
                <Image src={`/placeholder.svg?height=150&width=150&text=Image+${i}`} alt={`Product image ${i}`} width={150} height={150} className="w-full object-cover" />
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
            <Button size="lg" className="w-full md:w-auto">Add to Cart</Button>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={(relatedProduct.id ?? relatedProduct._id)?.toString() ?? ''} product={relatedProduct} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3 segments: /products/[categorySlug]/[subcategorySlug]/[productSlug] -> product detail
  if (slugs.length === 3) {
    const product = await getProductBySlug(slugs[2]);
    if (!product || !(product.id || product._id)) notFound();
    const productId = (product.id ?? product._id)?.toString() ?? '';
    const relatedProducts = await getRelatedProducts(productId, product.categorySlug);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href={{ pathname: "/products", query: lang === "ar" ? { lang } : undefined }} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Products</Link>
          {" / "}
          <Link href={{ pathname: `/products/${product.categorySlug}`, query: lang === "ar" ? { lang } : undefined }} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">{typeof product.category === 'string' ? product.category : product.category?.[lang]}</Link>
          {product.subcategory && (
            <>
              {" / "}
              <Link href={{ pathname: `/products/${product.categorySlug}/${product.subcategorySlug}`, query: lang === "ar" ? { lang } : undefined }} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">{typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?.[lang]}</Link>
            </>
          )}
        </div>
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <Image src={product.image || "/placeholder.svg?height=600&width=600"} alt={typeof product.name === 'string' ? product.name : product.name?.[lang]} width={600} height={600} className="w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden cursor-pointer">
                <Image src={`/placeholder.svg?height=150&width=150&text=Image+${i}`} alt={`Product image ${i}`} width={150} height={150} className="w-full object-cover" />
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
            <Button size="lg" className="w-full md:w-auto">Add to Cart</Button>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={(relatedProduct.id ?? relatedProduct._id)?.toString() ?? ''} product={relatedProduct} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return notFound();
} 