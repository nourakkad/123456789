// Test script to verify MongoDB connection
// Run with: npx tsx scripts/test-connection.ts

import { connectToDatabase } from "../lib/mongodb"

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...")
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set")

    const { db } = await connectToDatabase()
    console.log("✅ Successfully connected to MongoDB")

    // Test basic operations
    const collections = await db.listCollections().toArray()
    console.log(
      "📁 Available collections:",
      collections.map((c) => c.name),
    )

    // Test a simple query
    const productsCount = await db.collection("products").countDocuments()
    console.log("📦 Products in database:", productsCount)

    console.log("🎉 Database connection test completed successfully!")
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    console.log("\n🔧 Troubleshooting tips:")
    console.log("1. Make sure MongoDB is running")
    console.log("2. Check your MONGODB_URI in .env.local")
    console.log("3. Try: mongodb://localhost:27017 for local MongoDB")
    console.log("4. Run the seeding script: npm run seed")
  } finally {
    process.exit(0)
  }
}

testConnection()
