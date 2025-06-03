import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get counts from all collections
    const counts = {
      products: await db.collection(collections.products).countDocuments(),
      categories: await db.collection(collections.categories).countDocuments(),
      gallery: await db.collection(collections.gallery).countDocuments(),
      messages: await db.collection(collections.messages).countDocuments(),
      users: await db.collection(collections.users).countDocuments(),
      settings: await db.collection(collections.settings).countDocuments(),
    }

    return NextResponse.json({
      success: true,
      message: "API working correctly",
      database: db.databaseName,
      counts,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
