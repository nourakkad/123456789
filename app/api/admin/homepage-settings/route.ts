import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

const HOMEPAGE_SETTINGS_COLLECTION = "homepage_settings"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const doc = await db.collection(HOMEPAGE_SETTINGS_COLLECTION).findOne({})
    if (!doc) {
      // Return default structure if not found
      return NextResponse.json({
        ourCompany: { en: "", ar: "" },
        ourVision: { en: "", ar: "" },
        ourValues: [
          { title: { en: "", ar: "" }, description: { en: "", ar: "" } },
        ],
        whyChooseUs: { en: "", ar: "" },
        foundersQuote: { en: "", ar: "" },
        ourMissions: { en: "", ar: "" },
        ourStory: { en: "", ar: "" },
        accreditations: { en: "", ar: "" },
        buildSomething: { en: "", ar: "" },
      })
    }
    // Remove _id
    const { _id, ...rest } = doc
    return NextResponse.json(rest)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load homepage settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { db } = await connectToDatabase()
    // Upsert (replace or insert) the settings
    await db.collection(HOMEPAGE_SETTINGS_COLLECTION).updateOne(
      {},
      { $set: data },
      { upsert: true }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save homepage settings" }, { status: 500 })
  }
} 