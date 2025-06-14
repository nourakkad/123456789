import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Store in database
    const { db } = await connectToDatabase()
    const result = await db.collection(collections.settings).updateOne(
      {},
      { $set: { logo: dataUrl } },
      { upsert: true }
    )

    return NextResponse.json({ 
      url: dataUrl,
      success: true 
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
} 