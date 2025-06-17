import { getGalleryImageById, getGalleryImages } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import GalleryImageClient from "./GalleryImageClient"

function getLangField(field: any, lang: "en" | "ar" = "en") {
  if (typeof field === "string") return field;
  if (field && typeof field === "object" && (field.en || field.ar)) {
    return field[lang] || field.en || field.ar;
  }
  return "";
}

export default async function GalleryImagePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { lang?: string }
}) {
  const lang = searchParams.lang || "en"
  const image = await getGalleryImageById(params.id)
  const images = await getGalleryImages()

  if (!image) {
    notFound()
  }

  // Filter images by the same category
  const categoryImages = images.filter(img => img.category === image.category)

  const currentIndex = categoryImages.findIndex((img) => {
    const imgId = img._id?.toString() || img.id;
    return imgId === params.id;
  });

  if (currentIndex === -1) {
    notFound()
  }

  const prevImage = currentIndex > 0 ? categoryImages[currentIndex - 1] : null
  const nextImage = currentIndex < categoryImages.length - 1 ? categoryImages[currentIndex + 1] : null

  return (
    <GalleryImageClient 
      image={image}
      prevImage={prevImage}
      nextImage={nextImage}
      lang={lang as "en" | "ar"}
    />
  )
}
