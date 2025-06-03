import { NextRequest, NextResponse } from "next/server";
import { deleteGalleryImage } from "@/lib/actions";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    await deleteGalleryImage(formData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE GALLERY ERROR", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
} 