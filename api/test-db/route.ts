import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing database connection...")
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI)

    const { db } = await connectToDatabase()
    console.log("Connected to database successfully")

    // Test basic operations
    const collectionsResult = await db.listCollections().toArray()
    const collectionNames = collectionsResult.map((c) => c.name)

    console.log("Available collections:", collectionNames)

    // Test document counts
    const counts: Record<string, number> = {}
    for (const collectionName of Object.values(collections)) {
      try {
        counts[collectionName] = await db.collection(collectionName).countDocuments()
      } catch (error) {
        counts[collectionName] = 0
      }
    }

    const result = {
      success: true,
      message: "Database connection successful",
      database: db.databaseName,
      collections: collectionNames,
      documentCounts: counts,
      timestamp: new Date().toISOString(),
    }

    console.log("Database test result:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Database test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        mongoUri: process.env.MONGODB_URI ? "Set" : "Not set",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
