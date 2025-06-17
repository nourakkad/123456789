import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("GET /api/admin/settings - Starting...")
    const { db } = await connectToDatabase()
    console.log("Database connected, fetching settings...")

    const settings = await db.collection(collections.settings).findOne({})
    console.log("Settings found:", !!settings)

    if (settings) {
      // Convert MongoDB _id to id and remove _id
      const { _id, ...settingsData } = settings
      // Ensure siteName and siteDescription are objects
      const result = {
        ...settingsData,
        siteName: typeof settingsData.siteName === 'object' ? settingsData.siteName : { en: settingsData.siteName, ar: '' },
        siteDescription: typeof settingsData.siteDescription === 'object' ? settingsData.siteDescription : { en: settingsData.siteDescription, ar: '' },
        contactPhone: typeof settingsData.contactPhone === 'object' ? settingsData.contactPhone : { en: settingsData.contactPhone || '', ar: '' },
        address: typeof settingsData.address === 'object' ? settingsData.address : { en: settingsData.address || '', ar: '' },
        id: _id.toString(),
      }
      console.log("Returning settings:", Object.keys(result))
      return NextResponse.json(result)
    }

    // Return default settings if none exist
    const defaultSettings = {
      siteName: { en: "Company Name", ar: "اسم الشركة" },
      siteDescription: { en: "Your company description", ar: "وصف الشركة" },
      contactEmail: "info@company.com",
      contactPhone: { en: "+1 (123) 456-7890", ar: "" },
      address: { en: "123 Business Street, City, State 12345", ar: "" },
      enableNotifications: true,
      enableRegistration: false,
      maintenanceMode: false,
      theme: "light",
      itemsPerPage: "10",
      currency: "USD",
      timezone: "UTC",
    }

    console.log("Returning default settings")
    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error("Error in GET /api/admin/settings:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/admin/settings - Starting...")
    const settings = await request.json()
    console.log("Received settings:", Object.keys(settings))

    const { db } = await connectToDatabase()
    console.log("Database connected, updating settings...")

    const updateData = {
      ...settings,
      updatedAt: new Date().toISOString(),
    }

    // Remove id field if it exists to avoid conflicts
    delete updateData.id

    // Use upsert to create if doesn't exist, update if it does
    const result = await db.collection(collections.settings).replaceOne({}, updateData, { upsert: true })
    console.log("Settings update result:", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in POST /api/admin/settings:", error)
    return NextResponse.json(
      {
        error: "Failed to update settings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
