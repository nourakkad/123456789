import { NextRequest, NextResponse } from "next/server";
import { getCategoryBySlug } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(category);
} 