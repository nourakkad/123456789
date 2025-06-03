import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing local MongoDB connection...")

    const { db } = await connectToDatabase()
    console.log("Connected to database:", db.databaseName)

    // Test basic operations
    const collections = await db.listCollections().toArray()
    console.log(
      "Available collections:",
      collections.map((c) => c.name),
    )

    // Test document counts
    const counts = {
      products: await db.collection("products").countDocuments(),
      categories: await db.collection("categories").countDocuments(),
      gallery: await db.collection("gallery").countDocuments(),
      messages: await db.collection("messages").countDocuments(),
    }

    return NextResponse.json({
      success: true,
      message: "Local MongoDB connection successful",
      database: db.databaseName,
      collections: collections.map((c) => c.name),
      documentCounts: counts,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Local MongoDB connection failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Local MongoDB connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        suggestions: [
          "Make sure MongoDB is running locally",
          "Check if MongoDB is running on port 27017",
          "Try: brew services start mongodb/brew/mongodb-community (macOS)",
          "Try: sudo systemctl start mongod (Linux)",
          "Try: net start MongoDB (Windows)",
        ],
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
