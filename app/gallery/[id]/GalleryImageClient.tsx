"use client";

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {(!nextImage || !(nextImage.id || nextImage._id)) ? (
          <Link
            href={{ pathname: "/gallery", query: { category: image.category, lang } }}
            className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronLeft className="h-5 w-5 mr-2 text-primary" />
            {lang === 'ar' ? 'العودة' : 'Back'}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => (typeof window !== 'undefined' ? window.history.back() : null)}
            className="hidden md:inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 mr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <ChevronLeft className="h-5 w-5 mr-2 text-primary" />
            {lang === 'ar' ? 'العودة' : 'Back'}
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="border border-primary rounded-lg overflow-hidden bg-white">
          <Image
            src={image.url ? `/api/images/${image.url}` : "/placeholder.svg?height=600&width=600"}
            alt={getLangField(image.title, lang)}
            width={600}
            height={600}
            className="w-full object-cover"
          />
        </div>

        <div className={`space-y-6 ${lang === 'ar' ? 'dir-rtl text-right' : ''}`}>
          <h1 className="text-3xl font-bold text-primary">{getLangField(image.title, lang)}</h1>

          <div className="space-y-4">
            <div className="border border-primary rounded-xl bg-white p-4">
              <p className="text-black whitespace-pre-line">{getLangField(image.description, lang)}</p>
            </div>
          </div>

          <div className={`pt-4 flex ${lang === 'ar' ? 'flex-row-reverse space-x-reverse space-x-0 space-x-reverse gap-4' : 'space-x-4'}`}>
            {prevImage && (prevImage.id || prevImage._id) && (
              <Link
                href={{ pathname: `/gallery/${prevImage.id || prevImage._id}`, query: { lang } }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {lang === 'ar' ? 'السابق' : 'Previous'}
              </Link>
            )}

            {nextImage && (nextImage.id || nextImage._id) && (
              <Link
                href={{ pathname: `/gallery/${nextImage.id || nextImage._id}`, query: { lang } }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary bg-white text-primary font-medium shadow-sm hover:bg-primary/10 hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                {lang === 'ar' ? 'التالي' : 'Next'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 