"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface GalleryImage {
  id?: string;
  url?: string;
  createdAt: string;
  category: string;
  thumbUrl?: string;
}

export default function GalleryPageClient({ images }: { images: GalleryImage[] }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";
  const initialCategory = searchParams.get("category");

  // Group images by category
  const categoryMap: Record<string, GalleryImage[]> = {};
  images.forEach(img => {
    if (!img.category) return;
    if (!categoryMap[img.category]) categoryMap[img.category] = [];
    categoryMap[img.category].push(img);
  });
  const categories = Object.keys(categoryMap);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  // For pagination, responsive to screen size
  const getInitialVisibleCount = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 6;
    }
    return 12;
  };
  const [visibleCount, setVisibleCount] = useState(getInitialVisibleCount());

  // Update visibleCount on resize (for SPA navigation)
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getInitialVisibleCount());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If a category is selected, show only that category's images (paginated)
  if (selectedCategory) {
    const filteredImages = categoryMap[selectedCategory] || [];
    const visibleImages = filteredImages.slice(0, visibleCount);
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button and category info */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => { setSelectedCategory(null); setVisibleCount(getInitialVisibleCount()); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary bg-white/50 backdrop-blur-sm text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            {lang === 'ar' ? 'العودة' : 'Back to Gallery'}
          </button>
          <div className={`text-center ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-3xl font-bold text-primary mb-2">{selectedCategory}</h1>
            <p className="text-gray-600">
              {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">{lang === 'ar' ? 'لا توجد صور في هذا القسم' : 'No images in this category.'}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleImages.map((image) => (
                <Link
                  key={image.id}
                  href={{ pathname: `/gallery/${image.id}`, query: { lang } }}
                  className="group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 border border-gray-200">
                    <Image
                      src={`/api/images/${image.thumbUrl || image.url}`}
                      alt="Gallery image"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    
                    {/* View icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {visibleCount < filteredImages.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount(c => c + 12)}
                  className="px-8 py-3 rounded-full bg-primary text-white font-semibold shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {lang === 'ar' ? 'عرض المزيد' : 'Load More Images'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Show category cards with modern design
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex mb-8">
        <h1 className={`text-3xl font-bold text-black w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'المعرض' : 'Gallery'}</h1>
      </div>
      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-12">{lang === 'ar' ? 'لا توجد أقسام للصور' : 'No gallery categories found.'}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((cat) => {
            const catImages = categoryMap[cat];
            const imageCount = catImages.length;
            const featuredImage = catImages[0]; // Use first image as featured
            
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setVisibleCount(getInitialVisibleCount()); }}
                className="group relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                {/* Featured Image Background */}
                {featuredImage && (
                  <div className="absolute inset-0">
                    <Image
                      src={`/api/images/${featuredImage.thumbUrl || featuredImage.url}`}
                      alt={`${cat} gallery`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                )}
                
                {/* Category Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {cat}
                      </h3>
                      <p className="text-sm opacity-90">
                        {imageCount} {imageCount === 1 ? 'image' : 'images'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm opacity-80">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 