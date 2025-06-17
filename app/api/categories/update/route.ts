import { NextRequest, NextResponse } from "next/server";
import { updateCategory } from "@/lib/actions";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    await updateCategory(formData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
} 