import { getGalleryImageById, getGalleryImages } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"

function getLangField(field: any, lang: "en" | "ar" = "en") {
  if (typeof field === "string") return field;
  if (field && typeof field === "object" && (field.en || field.ar)) {
    return field[lang] || field.en || field.ar;
  }
  return "";
}

export default async function GalleryImagePage({ params, searchParams }: { params: { id: string }, searchParams: { lang?: string } }) {
  const image = await getGalleryImageById(params.id);
  const allImages = await getGalleryImages();

  if (!image) {
    return notFound();
  }

  const currentIndex = allImages.findIndex((img: any) => img.id === image.id);
  const prevImage = currentIndex > 0 ? allImages[currentIndex - 1] : null;
  const nextImage = currentIndex < allImages.length - 1 ? allImages[currentIndex + 1] : null;

  // Use the lang from the query, default to 'en'
  const lang = searchParams?.lang === "ar" ? "ar" : "en";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={{ pathname: "/gallery", query: { lang } }}>
          <Button variant="ghost" size="sm" className="text-primary">
            <ChevronLeft className="h-4 w-4 mr-2 text-primary" />
            {lang === 'ar' ? 'عودة إلى المعرض' : 'Back to Gallery'}
          </Button>
        </Link>
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
            {prevImage && (
              <Link href={{ pathname: `/gallery/${prevImage.id}`, query: { lang } }}>
                <Button variant="outline" className="border-primary text-primary">{lang === 'ar' ? 'السابق' : 'Previous'}</Button>
              </Link>
            )}

            {nextImage && (
              <Link href={{ pathname: `/gallery/${nextImage.id}`, query: { lang } }}>
                <Button className="bg-primary text-white hover:bg-primary/90">{lang === 'ar' ? 'التالي' : 'Next'}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
