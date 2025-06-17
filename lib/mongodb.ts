const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
import { MongoClient, type Db } from "mongodb"

// For local MongoDB with default configuration
// IMPORTANT: For production, set MONGODB_URI in your .env.local file
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that thze value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Collection names
export const collections = {
  products: "products",
  categories: "categories",
  gallery: "gallery",
  messages: "messages",
  users: "users",
  settings: "settings",
}

// Utility function to generate slugs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim()
}

// Database connection cache
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    console.log("Connecting to MongoDB at:", uri)
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("companydb") // Using a clear database name

    // Test the connection
    await db.admin().ping()
    console.log("✅ MongoDB connection successful")

    // Cache the connection
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error)
    throw error
  }
}

// Export a MongoClient promise
export default clientPromise

// Fetch settings from the database
export async function getSettings() {
  const { db } = await connectToDatabase();
  const settings = await db.collection(collections.settings).findOne({});
  if (settings) {
    // Convert MongoDB _id to id and remove _id
    const { _id, ...settingsData } = settings
    // Ensure all fields are in the correct format
    const result = {
      ...settingsData,
      siteName: typeof settingsData.siteName === 'object' ? settingsData.siteName : { en: settingsData.siteName, ar: '' },
      siteDescription: typeof settingsData.siteDescription === 'object' ? settingsData.siteDescription : { en: settingsData.siteDescription, ar: '' },
      contactEmail: settingsData.contactEmail || 'info@company.com',
      contactPhone: typeof settingsData.contactPhone === 'object' ? settingsData.contactPhone : { en: settingsData.contactPhone || '', ar: '' },
      address: typeof settingsData.address === 'object' ? settingsData.address : { en: settingsData.address || '', ar: '' },
      ourStory: typeof settingsData.ourStory === 'object' ? settingsData.ourStory : { en: settingsData.ourStory || '', ar: '' },
      logo: settingsData.logo || '',
      id: _id.toString(),
    }
    console.log("Returning settings:", Object.keys(result))
    return result
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
    ourStory: { en: "", ar: "" },
    logo: "",
  }
  return defaultSettings;
}
