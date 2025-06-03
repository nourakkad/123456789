import { NextRequest, NextResponse } from "next/server";
import { deleteCategory } from "@/lib/actions";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    await deleteCategory(formData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
} 