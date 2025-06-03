import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("GET /api/admin/stats - Starting...")
    const { db } = await connectToDatabase()
    console.log("Database connected, fetching stats...")

    const [totalProducts, totalCategories, totalGalleryImages, totalMessages, recentProducts, recentMessages] =
      await Promise.all([
        db.collection(collections.products).countDocuments(),
        db.collection(collections.categories).countDocuments(),
        db.collection(collections.gallery).countDocuments(),
        db.collection(collections.messages).countDocuments(),
        db.collection(collections.products).find({}).sort({ createdAt: -1 }).limit(3).toArray(),
        db.collection(collections.messages).find({}).sort({ createdAt: -1 }).limit(3).toArray(),
      ])

    console.log("Stats collected:", { totalProducts, totalCategories, totalGalleryImages, totalMessages })

    const unreadMessages = await db.collection(collections.messages).countDocuments({ read: false })

    // Convert MongoDB documents to plain objects
    const convertedRecentProducts = recentProducts.map((product) => ({
      id: product._id.toString(),
      name: typeof product.name === 'object' && product.name.en ? product.name.en : (product.name || "Unnamed Product"),
      createdAt: product.createdAt || new Date().toISOString(),
    }))

    const convertedRecentMessages = recentMessages.map((message) => ({
      id: message._id.toString(),
      name: message.name || "Anonymous",
      createdAt: message.createdAt || new Date().toISOString(),
    }))

    const stats = {
      totalProducts,
      totalCategories,
      totalGalleryImages,
      totalMessages,
      unreadMessages,
      newProducts: 3, // Could calculate this based on date
      recentProducts: convertedRecentProducts,
      recentMessages: convertedRecentMessages,
    }

    console.log("Returning stats:", stats)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error in GET /api/admin/stats:", error)

    // Return empty stats instead of error to prevent dashboard from breaking
    const emptyStats = {
      totalProducts: 0,
      totalCategories: 0,
      totalGalleryImages: 0,
      totalMessages: 0,
      unreadMessages: 0,
      newProducts: 0,
      recentProducts: [],
      recentMessages: [],
    }

    return NextResponse.json(emptyStats)
  }
}
