"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface GalleryImage {
  id?: string;
  title: string | { en: string; ar: string };
  description: string | { en: string; ar: string };
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
        <div className="flex mb-8">
          <button
            onClick={() => { setSelectedCategory(null); setVisibleCount(getInitialVisibleCount()); }}
            className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            {lang === 'ar' ? 'العودة' : 'Back'}
          </button>
          <h1 className={`text-3xl font-bold text-primary w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{selectedCategory}</h1>
        </div>
        {filteredImages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">{lang === 'ar' ? 'لا توجد صور في هذا القسم' : 'No images in this category.'}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleImages.map((image) => (
                <Link
                  key={image.id}
                  href={{ pathname: `/gallery/${image.id}`, query: { lang } }}
                  className="group"
                >
                  <div className="border border-primary rounded-lg overflow-hidden bg-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 max-w-xs mx-auto">
                    <div className="relative w-full aspect-square min-h-[140px] max-h-[180px]">
                      <Image
                        src={`/api/images/${image.thumbUrl || image.url}`}
                        alt={typeof image.title === 'object' ? image.title[lang] : image.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                        sizes="180px"
                      />
                    </div>
                    <div className="p-2 md:p-3 text-black">
                      {lang === "ar" ? (
                        <>
                          <span dir="rtl" className="block text-lg font-semibold text-right text-primary">{typeof image.title === 'object' ? image.title.ar : image.title}</span>
                          <span dir="rtl" className="block text-sm text-black text-right">{typeof image.description === 'object' ? image.description.ar : image.description}</span>
                        </>
                      ) : (
                        <>
                          <span className="block text-lg font-semibold text-primary">{typeof image.title === 'object' ? image.title.en : image.title}</span>
                          <span className="block text-sm text-black">{typeof image.description === 'object' ? image.description.en : image.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {visibleCount < filteredImages.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount(c => c + 12)}
                  className="px-6 py-2 rounded-full bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
                >
                  {lang === 'ar' ? 'عرض المزيد' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Show category cards with mini images
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex mb-8">
        <h1 className={`text-3xl font-bold text-black w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'المعرض' : 'Gallery'}</h1>
      </div>
      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-12">{lang === 'ar' ? 'لا توجد أقسام للصور' : 'No gallery categories found.'}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catImages = categoryMap[cat].slice(0, 4); // up to 4 mini images
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setVisibleCount(getInitialVisibleCount()); }}
                className="w-full max-w-xs mx-auto text-left group border border-primary rounded-lg overflow-hidden bg-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 focus:outline-none"
              >
                <div className="p-2 border-b border-primary bg-primary/10">
                  <span className="text-base font-bold text-primary">{cat}</span>
                </div>
                <div className="grid grid-cols-2 gap-0.5 p-1 aspect-square bg-white min-h-[120px] max-h-[140px]">
                  {catImages.map((img) => (
                    <div key={img.id} className="relative w-full aspect-square rounded overflow-hidden">
                      <Image
                        src={`/api/images/${img.thumbUrl || img.url}`}
                        alt={typeof img.title === 'object' ? img.title[lang] : img.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="80px"
                      />
                    </div>
                  ))}
                  {/* Fill empty spots if less than 4 images */}
                  {Array.from({ length: 4 - catImages.length }).map((_, i) => (
                    <div key={i} className="bg-gray-100 w-full aspect-square rounded" />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 