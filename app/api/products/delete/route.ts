import { NextRequest, NextResponse } from "next/server"
import { deleteProduct } from "@/lib/actions"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    await deleteProduct(formData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ success: false, error: error?.toString() }, { status: 500 })
  }
} 