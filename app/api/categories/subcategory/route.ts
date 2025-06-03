import { NextResponse } from "next/server"
import { createSubcategory } from "@/lib/actions"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    await createSubcategory(formData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating subcategory:", error)
    return NextResponse.json(
      { error: "Error creating subcategory" },
      { status: 500 }
    )
  }
} 