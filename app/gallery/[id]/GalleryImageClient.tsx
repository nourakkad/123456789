"use client";

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

function getLangField(field: any, lang: "en" | "ar" = "en") {
  if (!field) return ""
  return field[lang] || field.en || field.ar || ""
}

interface GalleryImageClientProps {
  image: any
  prevImage: any
  nextImage: any
  lang: "en" | "ar"
}

export default function GalleryImageClient({ image, prevImage, nextImage, lang }: GalleryImageClientProps) {
  const router = useRouter();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && prevImage && (prevImage.id || prevImage._id)) {
        router.push(`/gallery/${prevImage.id || prevImage._id}?lang=${lang}`);
      } else if (event.key === 'ArrowRight' && nextImage && (nextImage.id || nextImage._id)) {
        router.push(`/gallery/${nextImage.id || nextImage._id}?lang=${lang}`);
      } else if (event.key === 'Escape') {
        router.push(`/gallery?category=${image.category}&lang=${lang}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevImage, nextImage, lang, router, image.category]);

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={{ pathname: "/gallery", query: { category: image.category, lang } }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary bg-white/20 backdrop-blur-sm text-primary font-medium shadow-sm hover:bg-white/30 hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronLeft className="h-5 w-5" />
            {lang === 'ar' ? 'العودة إلى المعرض' : 'Back to Gallery'}
          </Link>
        </div>
      </div>

      {/* Main Image Display */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative max-w-4xl mx-auto">
          {/* Centered Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={image.url ? `/api/images/${image.url}` : "/placeholder.svg?height=600&width=600"}
              alt="Gallery image"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
            {/* Previous Button */}
            {prevImage && (prevImage.id || prevImage._id) && (
              <Link
                href={{ pathname: `/gallery/${prevImage.id || prevImage._id}`, query: { lang } }}
                className="pointer-events-auto ml-4 p-3 rounded-full bg-white/30 backdrop-blur-sm shadow-lg hover:bg-white/50 hover:shadow-xl transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-white group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            )}

            {/* Next Button */}
            {nextImage && (nextImage.id || nextImage._id) && (
              <Link
                href={{ pathname: `/gallery/${nextImage.id || nextImage._id}`, query: { lang } }}
                className="pointer-events-auto mr-4 p-3 rounded-full bg-white/30 backdrop-blur-sm shadow-lg hover:bg-white/50 hover:shadow-xl transition-all duration-300 group"
              >
                <svg className="w-6 h-6 text-white group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {prevImage ? '2' : '1'} of {prevImage && nextImage ? '3' : prevImage || nextImage ? '2' : '1'}
            </div>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="absolute top-4 right-4">
            <div className="bg-black/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs opacity-60 hover:opacity-100 transition-opacity">
              <span className="hidden sm:inline">← → to navigate, Esc to go back</span>
              <span className="sm:hidden">Swipe to navigate</span>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  )
} 