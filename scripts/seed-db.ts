// This script seeds the MongoDB database with initial data
// Run with: npm run seed

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { connectToDatabase, collections } from "../lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...")
    console.log("Connecting to local MongoDB...")

    const { db } = await connectToDatabase()
    console.log("✅ Connected to database:", db.databaseName)

    // Clear existing collections
    console.log("🧹 Clearing existing data...")
    await Promise.all([
      db.collection(collections.products).deleteMany({}),
      db.collection(collections.categories).deleteMany({}),
      db.collection(collections.gallery).deleteMany({}),
      db.collection(collections.messages).deleteMany({}),
      db.collection(collections.users).deleteMany({}),
      db.collection(collections.settings).deleteMany({}),
    ])

    console.log("📂 Creating categories...")
    // Create categories
    const categories = [
      {
        _id: new ObjectId(),
        name: { en: "Furniture", ar: "أثاث" },
        slug: "furniture",
        subcategories: [
          { id: new ObjectId(), name: { en: "Office", ar: "مكتب" }, slug: "office" },
          { id: new ObjectId(), name: { en: "Living Room", ar: "غرفة المعيشة" }, slug: "living-room" },
          { id: new ObjectId(), name: { en: "Lighting", ar: "إضاءة" }, slug: "lighting" },
        ],
      },
      {
        _id: new ObjectId(),
        name: { en: "Electronics", ar: "إلكترونيات" },
        slug: "electronics",
        subcategories: [
          { id: new ObjectId(), name: { en: "Audio", ar: "صوتيات" }, slug: "audio" },
          { id: new ObjectId(), name: { en: "Wearables", ar: "أجهزة قابلة للارتداء" }, slug: "wearables" },
          { id: new ObjectId(), name: { en: "Computers", ar: "حواسيب" }, slug: "computers" },
        ],
      },
      {
        _id: new ObjectId(),
        name: { en: "Kitchen", ar: "مطبخ" },
        slug: "kitchen",
        subcategories: [
          { id: new ObjectId(), name: { en: "Drinkware", ar: "أواني الشرب" }, slug: "drinkware" },
          { id: new ObjectId(), name: { en: "Cookware", ar: "أواني الطبخ" }, slug: "cookware" },
          { id: new ObjectId(), name: { en: "Appliances", ar: "أجهزة" }, slug: "appliances" },
        ],
      },
      {
        _id: new ObjectId(),
        name: { en: "Accessories", ar: "إكسسوارات" },
        slug: "accessories",
      },
    ]

    const categoryResult = await db.collection(collections.categories).insertMany(categories)
    console.log(`✅ Inserted ${categoryResult.insertedCount} categories`)

    console.log("📦 Creating products...")
    // Create products
    const products = [
      {
        name: { en: "Premium Desk Chair", ar: "كرسي مكتب فاخر" },
        slug: "premium-desk-chair",
        description: { en: "Ergonomic office chair with lumbar support and adjustable height.", ar: "كرسي مكتب مريح مع دعم للظهر وإمكانية تعديل الارتفاع." },
        price: 299.99,
        category: { en: "Furniture", ar: "أثاث" },
        categorySlug: "furniture",
        subcategory: { en: "Office", ar: "مكتب" },
        subcategorySlug: "office",
        createdAt: new Date().toISOString(),
      },
      {
        name: { en: "Wireless Headphones", ar: "سماعات لاسلكية" },
        slug: "wireless-headphones",
        description: { en: "Noise-cancelling headphones with 30-hour battery life.", ar: "سماعات تلغي الضوضاء مع عمر بطارية 30 ساعة." },
        price: 199.99,
        category: { en: "Electronics", ar: "إلكترونيات" },
        categorySlug: "electronics",
        subcategory: { en: "Audio", ar: "صوتيات" },
        subcategorySlug: "audio",
        createdAt: new Date().toISOString(),
      },
      {
        name: { en: "Ceramic Coffee Mug", ar: "كوب قهوة سيراميك" },
        slug: "ceramic-coffee-mug",
        description: { en: "Handcrafted ceramic mug with unique design.", ar: "كوب قهوة سيراميك مصنوع يدويًا بتصميم فريد." },
        price: 24.99,
        category: { en: "Kitchen", ar: "مطبخ" },
        categorySlug: "kitchen",
        subcategory: { en: "Drinkware", ar: "أواني الشرب" },
        subcategorySlug: "drinkware",
        createdAt: new Date().toISOString(),
      },
      {
        name: { en: "Leather Wallet", ar: "محفظة جلدية" },
        slug: "leather-wallet",
        description: { en: "Genuine leather wallet with multiple card slots.", ar: "محفظة جلدية أصلية مع عدة فتحات للبطاقات." },
        price: 49.99,
        category: { en: "Accessories", ar: "إكسسوارات" },
        categorySlug: "accessories",
        createdAt: new Date().toISOString(),
      },
      {
        name: { en: "Smart Watch", ar: "ساعة ذكية" },
        slug: "smart-watch",
        description: { en: "Fitness tracker with heart rate monitor and sleep tracking.", ar: "ساعة ذكية لمتابعة اللياقة مع مراقبة معدل ضربات القلب وتتبع النوم." },
        price: 149.99,
        category: { en: "Electronics", ar: "إلكترونيات" },
        categorySlug: "electronics",
        subcategory: { en: "Wearables", ar: "أجهزة قابلة للارتداء" },
        subcategorySlug: "wearables",
        createdAt: new Date().toISOString(),
      },
      {
        name: { en: "Desk Lamp", ar: "مصباح مكتب" },
        slug: "desk-lamp",
        description: { en: "Adjustable LED desk lamp with multiple brightness levels.", ar: "مصباح مكتب LED قابل للتعديل مع مستويات سطوع متعددة." },
        price: 79.99,
        category: { en: "Furniture", ar: "أثاث" },
        categorySlug: "furniture",
        subcategory: { en: "Lighting", ar: "إضاءة" },
        subcategorySlug: "lighting",
        createdAt: new Date().toISOString(),
      },
    ]

    const productResult = await db.collection(collections.products).insertMany(products)
    console.log(`✅ Inserted ${productResult.insertedCount} products`)

    console.log("🖼️ Creating gallery images...")
    // Create gallery images
    const galleryImages = [
      {
        _id: new ObjectId(),
        title: { en: "Office Setup", ar: "إعداد المكتب" },
        description: { en: "Modern office setup with ergonomic furniture and natural lighting.", ar: "إعداد مكتب حديث مع أثاث مريح وإضاءة طبيعية." },
        url: "/placeholder.svg?height=600&width=600&text=Office+Setup",
        createdAt: new Date().toISOString(),
      },
      {
        _id: new ObjectId(),
        title: { en: "Product Showcase", ar: "عرض المنتجات" },
        description: { en: "Our latest product line displayed at the annual trade show.", ar: "أحدث خط إنتاج لدينا معروض في المعرض السنوي." },
        url: "/placeholder.svg?height=600&width=600&text=Product+Showcase",
        createdAt: new Date().toISOString(),
      },
      {
        _id: new ObjectId(),
        title: { en: "Manufacturing Process", ar: "عملية التصنيع" },
        description: { en: "Behind the scenes look at our quality-focused manufacturing process.", ar: "نظرة خلف الكواليس على عملية التصنيع التي تركز على الجودة." },
        url: "/placeholder.svg?height=600&width=600&text=Manufacturing",
        createdAt: new Date().toISOString(),
      },
    ]

    const galleryResult = await db.collection(collections.gallery).insertMany(galleryImages)
    console.log(`✅ Inserted ${galleryResult.insertedCount} gallery images`)

    console.log("💬 Creating messages...")
    // Create messages
    const messages = [
      {
        name: "John Smith",
        email: "john@example.com",
        message: "I'm interested in your premium desk chair. Do you offer bulk discounts?",
        createdAt: new Date().toISOString(),
        read: false,
      },
      {
        name: "Emily Johnson",
        email: "emily@example.com",
        message: "When will the ceramic coffee mugs be back in stock?",
        createdAt: new Date().toISOString(),
        read: false,
      },
    ]

    const messageResult = await db.collection(collections.messages).insertMany(messages)
    console.log(`✅ Inserted ${messageResult.insertedCount} messages`)

    console.log("👤 Creating admin user...")
    // Create admin user
    const adminUser = {
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("password", 12),
      isAdmin: true,
      createdAt: new Date().toISOString(),
    }

    const userResult = await db.collection(collections.users).insertOne(adminUser)
    console.log(`✅ Inserted admin user`)

    console.log("⚙️ Creating settings...")
    // Create settings
    const settings = {
      siteName: { en: "Company Name", ar: "اسم الشركة" },
      siteDescription: { en: "Your company description", ar: "وصف الشركة" },
      contactEmail: "info@company.com",
      contactPhone: "+1 (123) 456-7890",
      address: "123 Business Street, City, State 12345",
      enableNotifications: true,
      enableRegistration: false,
      maintenanceMode: false,
      theme: "light",
      itemsPerPage: "10",
      currency: "USD",
      timezone: "UTC",
      updatedAt: new Date().toISOString(),
    }

    const settingsResult = await db.collection(collections.settings).insertOne(settings)
    console.log(`✅ Inserted settings`)

    console.log("🎉 Database seeded successfully!")

    // Show final counts
    const finalCounts: Record<string, number> = {}
    for (const collectionName of Object.values(collections)) {
      finalCounts[collectionName] = await db.collection(collectionName).countDocuments()
    }
    console.log("📊 Final document counts:", finalCounts)

    // Print all _id values in categories and gallery
    const allCategories = await db.collection(collections.categories).find({}).toArray();
    console.log("All category _id values:", allCategories.map(cat => cat._id.toString()));
    const allGallery = await db.collection(collections.gallery).find({}).toArray();
    console.log("All gallery _id values:", allGallery.map(img => img._id.toString()));
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message)
    }
  } finally {
    process.exit(0)
  }
}

seedDatabase()
