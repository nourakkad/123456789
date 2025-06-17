import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const mimeType = file.type

    // Store in images collection
    const { db } = await connectToDatabase()
    const imageResult = await db.collection("images").insertOne({
      filename: file.name,
      mimetype: mimeType,
      image: buffer,
      createdAt: new Date(),
      isThumbnail: false,
    })
    const imageId = imageResult.insertedId
    const imageUrl = `/api/images/${imageId}`

    // Store image URL in settings collection
    await db.collection(collections.settings).updateOne(
      {},
      { $set: { logo: imageUrl } },
      { upsert: true }
    )

    return NextResponse.json({ 
      url: imageUrl,
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