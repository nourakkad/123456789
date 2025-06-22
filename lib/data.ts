import { ObjectId } from "mongodb"
import { connectToDatabase, collections } from "./mongodb"

// Types
export interface Product {
  _id?: string | ObjectId
  id?: string
  name: { en: string; ar: string }
  slug: string
  description: { en: string; ar: string }
  image?: string
  thumbUrl?: string
  category: { en: string; ar: string }
  categorySlug: string
  subcategory?: { en: string; ar: string }
  subcategorySlug?: string
  createdAt: string
  extraImages?: { url: string; description_en: string; description_ar: string }[]
}

export interface Category {
  _id?: string | ObjectId
  id?: string
  name: { en: string; ar: string }
  slug: string
  subcategories?: {
    id: string
    name: { en: string; ar: string }
    slug: string
  }[]
}

export interface GalleryImage {
  _id?: string | ObjectId
  id?: string
  title: string
  description: string
  url?: string
  createdAt: string
  category?: string
}

export interface Message {
  _id?: string | ObjectId
  id?: string
  name: string
  email: string
  message: string
  createdAt: string
  read: boolean
}

export interface User {
  _id?: string | ObjectId
  id?: string
  name: string
  email: string
  password: string
  isAdmin: boolean
  avatar?: string
  createdAt: string
}

export interface Settings {
  _id?: string | ObjectId
  id?: string
  siteName: { en: string; ar: string }
  siteDescription: { en: string; ar: string }
  contactEmail: string
  contactPhone: { en: string; ar: string }
  address: { en: string; ar: string }
  enableNotifications: boolean
  enableRegistration: boolean
  maintenanceMode: boolean
  theme: string
  itemsPerPage: string
  currency: string
  timezone: string
  updatedAt: string
  logo?: string
  ourStory?: { en: string; ar: string }
}

// Helper function to convert MongoDB _id to string id
function convertId<T>(item: T & { 
  _id?: ObjectId | string,
  subcategories?: { 
    id: ObjectId | string,
    name: { en: string; ar: string }
  }[] 
}): T & { id: string } {
  if (!item) return item as any

  const { _id, subcategories, ...rest } = item

  return {
    ...rest,
    id: _id ? _id.toString() : "",
    ...(subcategories && {
      subcategories: subcategories.map(sub => ({
        ...sub,
        id: sub.id ? sub.id.toString() : "",
      })),
    }),
  } as T & { id: string }
}

// Data access functions
export async function getProducts(): Promise<Product[]> {
  try {
    const { db } = await connectToDatabase()
    const products = await db.collection(collections.products).find({}).toArray()
    return products.map(doc => convertId(doc) as any)
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const { db } = await connectToDatabase()
    const products = await db.collection(collections.products).find({ categorySlug }).toArray()
    return products.map(doc => convertId(doc) as any)
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

export async function getProductsBySubcategory(categorySlug: string, subcategorySlug: string): Promise<Product[]> {
  try {
    const { db } = await connectToDatabase()
    const products = await db
      .collection(collections.products)
      .find({
        categorySlug,
        subcategorySlug,
      })
      .toArray()
    return products.map(doc => convertId(doc) as any)
  } catch (error) {
    console.error("Error fetching products by subcategory:", error)
    return []
  }
}

export async function getProductBySlug(slug: string, categorySlug?: string): Promise<Product | undefined> {
  try {
    const { db } = await connectToDatabase()
    const query = categorySlug 
      ? { slug, categorySlug }
      : { slug }
    
    console.log('getProductBySlug query:', query)
    
    const product = await db.collection(collections.products).findOne(query)
    
    console.log('getProductBySlug result:', product)
    
    return product ? (convertId(product) as any) : undefined
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    return undefined
  }
}

export async function getRelatedProducts(productId: string, categorySlug: string): Promise<Product[]> {
  try {
    const { db } = await connectToDatabase()
    const products = await db
      .collection(collections.products)
      .find({
        categorySlug,
        _id: { $ne: new ObjectId(productId) },
      })
      .limit(4)
      .toArray()
    return products.map(doc => convertId(doc) as any)
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection(collections.categories).find({}).sort({ order: 1 }).toArray()
    return categories.map(doc => convertId(doc) as any)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    const { db } = await connectToDatabase()
    const category = await db.collection(collections.categories).findOne({ slug })
    return category ? (convertId(category) as any) : undefined
  } catch (error) {
    console.error("Error fetching category by slug:", error)
    return undefined
  }
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  try {
    const { db } = await connectToDatabase()
    const category = await db.collection(collections.categories).findOne({ _id: new ObjectId(id) })
    return category ? (convertId(category) as any) : undefined
  } catch (error) {
    console.error("Error fetching category by id:", error)
    return undefined
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const { db } = await connectToDatabase()
    const images = await db.collection(collections.gallery).find({}).toArray()
    console.log('Raw gallery images:', images);
    const converted = images.map(doc => convertId(doc) as any)
    console.log('Converted gallery images:', converted);
    return converted
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return []
  }
}

export async function getGalleryImageById(id: string): Promise<GalleryImage | undefined> {
  try {
    const { db } = await connectToDatabase()
    const image = await db.collection(collections.gallery).findOne({ _id: new ObjectId(id) })
    return image ? (convertId(image) as any) : undefined
  } catch (error) {
    console.error("Error fetching gallery image by id:", error)
    return undefined
  }
}

export async function getMessages(): Promise<Message[]> {
  try {
    const { db } = await connectToDatabase()
    const messages = await db.collection(collections.messages).find({}).toArray()
    return messages.map(doc => convertId(doc) as any)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export async function getMessageById(id: string): Promise<Message | undefined> {
  try {
    const { db } = await connectToDatabase()
    const message = await db.collection(collections.messages).findOne({ _id: new ObjectId(id) })
    return message ? (convertId(message) as any) : undefined
  } catch (error) {
    console.error("Error fetching message by id:", error)
    return undefined
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection(collections.users).findOne({ email })
    return user ? (convertId(user) as any) : undefined
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return undefined
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection(collections.users).findOne({ _id: new ObjectId(id) })
    return user ? (convertId(user) as any) : undefined
  } catch (error) {
    console.error("Error fetching user by id:", error)
    return undefined
  }
}

export async function getSettings(): Promise<Settings | undefined> {
  try {
    const { db } = await connectToDatabase()
    const settings = await db.collection(collections.settings).findOne({})
    return settings ? (convertId(settings) as any) : undefined
  } catch (error) {
    console.error("Error fetching settings:", error)
    return undefined
  }
}

export async function updateSettings(settings: any): Promise<void> {
  try {
    const { db } = await connectToDatabase()
    await db.collection(collections.settings).updateOne(
      {},
      { $set: { ...settings, updatedAt: new Date().toISOString() } },
      { upsert: true }
    )
  } catch (error) {
    console.error("Error updating settings:", error)
    throw error
  }
}

export async function getStats() {
  try {
    const { db } = await connectToDatabase()
    const [products, categories, messages, users] = await Promise.all([
        db.collection(collections.products).countDocuments(),
        db.collection(collections.categories).countDocuments(),
        db.collection(collections.messages).countDocuments(),
      db.collection(collections.users).countDocuments(),
    ])
    return { products, categories, messages, users }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { products: 0, categories: 0, messages: 0, users: 0 }
  }
}

export async function getHomepageSettings(): Promise<any> {
  try {
    const { db } = await connectToDatabase()
    const doc = await db.collection('homepage_settings').findOne({})
    if (!doc) {
      return {
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
      }
    }
    const { _id, ...rest } = doc
    return rest
  } catch (error) {
    console.error("Error fetching homepage settings:", error)
    return {
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
    }
  }
}
