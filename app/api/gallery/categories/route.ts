import { NextResponse } from "next/server";
import { getGalleryImages } from "@/lib/data";

export async function GET() {
  const images = await getGalleryImages();
  const categories = Array.from(new Set(images.map(img => img.category).filter((cat): cat is string => Boolean(cat))));
  return NextResponse.json({ categories });
} 