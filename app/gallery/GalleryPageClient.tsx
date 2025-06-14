"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface GalleryImage {
  id?: string;
  title: string | { en: string; ar: string };
  description: string | { en: string; ar: string };
  url?: string;
  createdAt: string;
}

export default function GalleryPageClient({ images }: { images: GalleryImage[] }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex mb-8">
        <h1 className={`text-3xl font-bold text-primary w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{lang === 'ar' ? 'المعرض' : 'Gallery'}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Link
            key={image.id}
            href={{ pathname: `/gallery/${image.id}`, query: { lang } }}
            className="group"
          >
            <div className="border border-primary rounded-lg overflow-hidden bg-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/30">
              <div className="aspect-square relative">
                <Image
                  src={`/api/images/${image.url}`}
                  alt={typeof image.title === 'object' ? image.title[lang] : image.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-2 md:p-4 text-black">
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
    </div>
  );
} 