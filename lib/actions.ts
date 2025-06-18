"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import { connectToDatabase, collections, generateSlug } from "./mongodb"
import { createSession, clearSession } from "./auth"
import { unlink } from "fs/promises"
import { join } from "path"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Mock user data for demo
const DEMO_USER = {
  id: "1",
  name: "Admin User",
  email: "admin@example.com",
  password: "password",
  isAdmin: true,
  avatar: "/placeholder.svg?height=40&width=40",
}

// Validation schemas
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  isAdmin: z.boolean(),
})

const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(5, 'Message is too short'),
});

const ProductSchema = z.object({
  name: z.object({ en: z.string().min(2), ar: z.string().min(2) }),
  description: z.object({ en: z.string().min(5), ar: z.string().min(5) }),
  category: z.object({ en: z.string().min(2), ar: z.string().min(2) }),
  categorySlug: z.string().min(2),
  subcategory: z.object({ en: z.string().optional(), ar: z.string().optional() }).optional(),
  subcategorySlug: z.string().optional(),
  image: z.string().optional(),
  extraImages: z.array(z.object({ url: z.string(), description_en: z.string(), description_ar: z.string() })).optional(),
  price: z.number().optional(),
});

const CategorySchema = z.object({
  name: z.object({ en: z.string().min(2), ar: z.string().min(2) }),
  slug: z.string().min(2),
  subcategories: z.array(z.object({
    id: z.string(),
    name: z.object({ en: z.string().min(2), ar: z.string().min(2) }),
    slug: z.string().min(2),
    logo: z.string().optional(),
  })).optional(),
  description: z.object({ en: z.string().min(5), ar: z.string().min(5) }),
});

const GalleryImageSchema = z.object({
  title: z.object({ en: z.string().min(2), ar: z.string().min(2) }),
  description: z.object({ en: z.string().min(5), ar: z.string().min(5) }),
  url: z.string().min(2),
  thumbUrl: z.string().optional(),
});

// Admin authentication
export async function login(data: {
  email: string
  password: string
}) {
  // Validate input
  const parsed = LoginSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error("Invalid input")
  }
  // Find user in DB
  const { db } = await connectToDatabase()
  const user = await db.collection(collections.users).findOne({ email: data.email })
  if (!user) {
    throw new Error("Invalid credentials")
  }
  // Compare password hash
  const isMatch = await bcrypt.compare(data.password, user.password)
  if (!isMatch) {
    throw new Error("Invalid credentials")
  }
  // Remove password from user object and ensure correct typing
  const { password, _id, ...rest } = user;
  const userWithoutPassword = {
    id: _id ? _id.toString() : user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    avatar: user.avatar,
    ...rest,
  };
  await createSession(userWithoutPassword)
  redirect("/admin")
}

export async function logout() {
  // Clear session
  await clearSession()
  // Redirect to login page
  redirect("/admin/login")
}

// Contact form submission (mock)
export async function sendContactForm(data: {
  name: string
  email: string
  message: string
}) {
  // Validate input
  const parsed = ContactFormSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map(e => e.message).join(', '));
  }
  try {
    const { db } = await connectToDatabase()

    const messageDoc = {
      name: data.name,
      email: data.email,
      message: data.message,
      read: false,
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection(collections.messages).insertOne(messageDoc)

    revalidatePath("/admin/messages")

    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error sending contact form:", error)
    throw new Error("Failed to send message")
  }
}

// Product management
export async function createProduct(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const name = {
      en: formData.get("name_en")?.toString() || "",
      ar: formData.get("name_ar")?.toString() || "",
    };
    const description = {
      en: formData.get("description_en")?.toString() || "",
      ar: formData.get("description_ar")?.toString() || "",
    };
    const category = {
      en: formData.get("category_en")?.toString() || "",
      ar: formData.get("category_ar")?.toString() || "",
    };
    const subcategory = {
      en: formData.get("subcategory_en")?.toString() || "",
      ar: formData.get("subcategory_ar")?.toString() || "",
    };
    const image = formData.get("image")?.toString() || undefined;
    const price = formData.get("price") ? Number(formData.get("price")) : undefined;
    const slug = generateSlug(name.en)
    const categorySlug = generateSlug(category.en)
    const subcategorySlug = subcategory.en ? generateSlug(subcategory.en) : undefined
    const extraImagesRaw = formData.get("extraImages") as string | null
    let extraImages: { url: string; description_en: string; description_ar: string }[] = []
    if (extraImagesRaw) {
      try {
        const arr = JSON.parse(extraImagesRaw)
        if (Array.isArray(arr)) {
          extraImages = arr.filter(img => img.url)
        }
      } catch (e) {
        // ignore
      }
    }
    // Validate product
    const parsed = ProductSchema.safeParse({
      name, description, category, categorySlug, subcategory, subcategorySlug, image, extraImages, price
    });
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map(e => e.message).join(", "));
    }
    const product = {
      name,
      slug,
      description,
      category,
      categorySlug,
      subcategory: subcategory.en ? subcategory : undefined,
      subcategorySlug,
      image: image || undefined,
      extraImages,
      price,
      createdAt: new Date().toISOString(),
    }
    const result = await db.collection(collections.products).insertOne(product)
    revalidatePath("/admin/products")
    revalidatePath("/products")
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating product:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to create product")
  }
}

export async function updateProduct(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const id = formData.get("id") as string
    // Get multilingual fields
    const name = {
      en: formData.get("name_en")?.toString() || "",
      ar: formData.get("name_ar")?.toString() || "",
    };
    const description = {
      en: formData.get("description_en")?.toString() || "",
      ar: formData.get("description_ar")?.toString() || "",
    };
    const category = {
      en: formData.get("category_en")?.toString() || "",
      ar: formData.get("category_ar")?.toString() || "",
    };
    const subcategory = {
      en: formData.get("subcategory_en")?.toString() || "",
      ar: formData.get("subcategory_ar")?.toString() || "",
    };
    const slug = generateSlug(name.en || "")
    const categorySlug = generateSlug(category.en || "")
    const subcategorySlug = subcategory.en ? generateSlug(subcategory.en) : undefined
    // Validate update
    const parsed = ProductSchema.partial().safeParse({
      name, description, category, categorySlug, subcategory, subcategorySlug,
    });
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map(e => e.message).join(", "));
    }
    const updateData = {
      name,
      slug,
      description,
      category,
      categorySlug,
      subcategory: subcategory.en ? subcategory : undefined,
      subcategorySlug,
      updatedAt: new Date().toISOString(),
    }
    await db.collection(collections.products).updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    revalidatePath("/admin/products")
    revalidatePath("/products")
    return { success: true }
  } catch (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product")
  }
}

export async function deleteProduct(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    const id = formData.get("id") as string
    const product = await db.collection(collections.products).findOne({ _id: new ObjectId(id) })

    // Delete main image from images collection
    if (product?.image) {
      await db.collection("images").deleteOne({ _id: new ObjectId(product.image) })
    }

    // Delete extra images from images collection
    if (Array.isArray(product?.extraImages)) {
      for (const img of product.extraImages) {
        if (img.url) {
          await db.collection("images").deleteOne({ _id: new ObjectId(img.url) })
        }
      }
    }

    await db.collection(collections.products).deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/admin/products")
    revalidatePath("/products")

    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product")
  }
}

// Category management
export async function createCategory(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const name = {
      en: formData.get("name_en")?.toString() || "",
      ar: formData.get("name_ar")?.toString() || "",
    };
    const description = {
      en: formData.get("description_en")?.toString() || "",
      ar: formData.get("description_ar")?.toString() || "",
    };
    const slug = generateSlug(name.en)
    let subcategories: { id: string; name: { en: string; ar: string }; slug: string; logo?: string; description: { en: string; ar: string }; slogan: { en: string; ar: string } }[] = []
    const subcategoriesRaw = formData.get("subcategories") as string | null
    if (subcategoriesRaw) {
      try {
        const names: { en: string; ar: string; logo?: string; description_en?: string; description_ar?: string; slogan_en?: string; slogan_ar?: string }[] = JSON.parse(subcategoriesRaw)
        if (Array.isArray(names)) {
          subcategories = names
            .filter((n) => n && n.en && n.ar)
            .map((n) => ({
              id: new ObjectId().toString(),
              name: { en: n.en, ar: n.ar },
              slug: generateSlug(n.en),
              logo: n.logo,
              description: {
                en: n.description_en || "",
                ar: n.description_ar || ""
              },
              slogan: {
                en: n.slogan_en || "",
                ar: n.slogan_ar || ""
              }
            }))
        }
      } catch (e) {
        // ignore, fallback to empty array
      }
    }
    // Validate category
    const parsed = CategorySchema.safeParse({ name, slug, subcategories, description });
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map(e => e.message).join(", "));
    }
    const category = {
      name,
      slug,
      description,
      subcategories,
      createdAt: new Date().toISOString(),
    }
    const result = await db.collection(collections.categories).insertOne(category)
    revalidatePath("/admin/categories")
    revalidatePath("/products")
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating category:", error)
    throw new Error("Failed to create category")
  }
}

export async function updateCategory(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const id = formData.get("id") as string
    const name = {
      en: formData.get("name_en")?.toString() || "",
      ar: formData.get("name_ar")?.toString() || "",
    };
    const description = {
      en: formData.get("description_en")?.toString() || "",
      ar: formData.get("description_ar")?.toString() || "",
    };
    const slug = generateSlug(name.en)
    let subcategories: { id: string; name: { en: string; ar: string }; slug: string; logo?: string; description: { en: string; ar: string }; slogan: { en: string; ar: string } }[] = [];
    const subcategoriesRaw = formData.get("subcategories") as string | null;
    if (subcategoriesRaw) {
      try {
        const names: { id?: string; en: string; ar: string; logo?: string; description_en?: string; description_ar?: string; slogan_en?: string; slogan_ar?: string }[] = JSON.parse(subcategoriesRaw);
        if (Array.isArray(names)) {
          subcategories = names
            .filter((n) => n && n.en && n.ar)
            .map((n) => ({
              id: n.id || new ObjectId().toString(),
              name: { en: n.en, ar: n.ar },
              slug: generateSlug(n.en),
              logo: n.logo,
              description: {
                en: n.description_en || "",
                ar: n.description_ar || ""
              },
              slogan: {
                en: n.slogan_en || "",
                ar: n.slogan_ar || ""
              }
            }))
        }
      } catch (e) {
        // ignore, fallback to empty array
      }
    }
    // Validate update
    const parsed = CategorySchema.partial().safeParse({ name, slug, description, subcategories });
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map(e => e.message).join(", "));
    }
    const updateData = {
      name,
      slug,
      description,
      subcategories,
      updatedAt: new Date().toISOString(),
    }
    await db.collection(collections.categories).updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    revalidatePath("/admin/categories")
    revalidatePath("/products")
    return { success: true }
  } catch (error) {
    console.error("Error updating category:", error)
    throw new Error("Failed to update category")
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    const id = formData.get("id") as string
    const category = await db.collection(collections.categories).findOne({ _id: new ObjectId(id) })

    // Delete all subcategory logos from images collection
    if (Array.isArray(category?.subcategories)) {
      for (const sub of category.subcategories) {
        if (sub.logo) {
          await db.collection("images").deleteOne({ _id: new ObjectId(sub.logo) })
        }
      }
    }

    await db.collection(collections.categories).deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/admin/categories")
    revalidatePath("/products")

    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    throw new Error("Failed to delete category")
  }
}

export async function addSubcategory(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    const categoryId = formData.get("categoryId") as string
    const name = formData.get("name") as string
    const slug = generateSlug(name)

    // Generate a unique ID for the subcategory
    const subcategoryId = new ObjectId().toString()

    // Add subcategory to category
    await db.collection(collections.categories).updateOne(
      { _id: new ObjectId(categoryId) },
      {
        $push: {
          subcategories: { id: subcategoryId, name, slug },
        },
      } as any,
    )

    revalidatePath("/admin/categories")
    revalidatePath("/products")

    return { success: true, id: subcategoryId }
  } catch (error) {
    console.error("Error adding subcategory:", error)
    throw new Error("Failed to add subcategory")
  }
}

export async function deleteSubcategory(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    const categoryId = formData.get("categoryId") as string
    const subcategoryId = formData.get("subcategoryId") as string

    // Find the category and subcategory
    const category = await db.collection(collections.categories).findOne({ _id: new ObjectId(categoryId) })
    let logoToDelete = null
    if (category && Array.isArray(category.subcategories)) {
      const sub = category.subcategories.find((s: any) => s.id === subcategoryId)
      if (sub && sub.logo) {
        logoToDelete = sub.logo
      }
    }
    // Remove subcategory from category
    await db
      .collection(collections.categories)
      .updateOne({ _id: new ObjectId(categoryId) }, { $pull: { subcategories: { id: subcategoryId } } } as any)

    // Delete logo image from images collection
    if (logoToDelete) {
      await db.collection("images").deleteOne({ _id: new ObjectId(logoToDelete) })
    }

    revalidatePath("/admin/categories")
    revalidatePath("/products")

    return { success: true }
  } catch (error) {
    console.error("Error deleting subcategory:", error)
    throw new Error("Failed to delete subcategory")
  }
}

// Gallery management
export async function createGalleryImage(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const title_en = formData.get("title_en")?.toString() || "";
    const title_ar = formData.get("title_ar")?.toString() || "";
    const description_en = formData.get("description_en")?.toString() || "";
    const description_ar = formData.get("description_ar")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const title = { en: title_en, ar: title_ar };
    const description = { en: description_en, ar: description_ar };
    const url = (formData.get("url") as string) || "/placeholder.svg?height=600&width=600&text=" + encodeURIComponent(title.en)
    const thumbUrl = (formData.get("thumbUrl") as string) || null;
    // Validate gallery image
    const parsed = GalleryImageSchema.safeParse({ title, description, url });
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map(e => e.message).join(", "));
    }
    const image = {
      title,
      description,
      url,
      thumbUrl,
      createdAt: new Date().toISOString(),
      category,
    }
    const result = await db.collection(collections.gallery).insertOne(image)
    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating gallery image:", error)
    throw new Error("Failed to create gallery image")
  }
}

export async function updateGalleryImage(formData: FormData) {
  try {
    const { db } = await connectToDatabase()
    const id = formData.get("id") as string
    const title = {
      en: formData.get("title_en")?.toString() || "",
      ar: formData.get("title_ar")?.toString() || "",
    };
    const description = {
      en: formData.get("description_en")?.toString() || "",
      ar: formData.get("description_ar")?.toString() || "",
    };
    // Validate update
    const parsed = GalleryImageSchema.partial().safeParse({ title, description });
    if (!parsed.success) {
      throw new Error(parsed.error.errors.map(e => e.message).join(", "));
    }
    const updateData = {
      title,
      description,
      updatedAt: new Date().toISOString(),
    }
    await db.collection(collections.gallery).updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    console.error("Error updating gallery image:", error)
    throw new Error("Failed to update gallery image")
  }
}

export async function deleteGalleryImage(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    const id = formData.get("id") as string
    const image = await db.collection(collections.gallery).findOne({ _id: new ObjectId(id) })

    // Delete image from images collection if url is a valid ObjectId
    if (image?.url) {
      try {
        // Try to delete from images collection (if it's an ObjectId)
        await db.collection("images").deleteOne({ _id: new ObjectId(image.url) })
      } catch (e) {
        // Not a valid ObjectId, ignore
      }
    }

    await db.collection(collections.gallery).deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/admin/gallery")
    revalidatePath("/gallery")

    return { success: true }
  } catch (error) {
    console.error("Error deleting gallery image:", error)
    throw new Error("Failed to delete gallery image")
  }
}

// Message management
export async function markMessageAsRead(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    const id = formData.get("id") as string
    const read = formData.get("read") === "true"

    await db
      .collection(collections.messages)
      .updateOne({ _id: new ObjectId(id) }, { $set: { read, updatedAt: new Date().toISOString() } })

    revalidatePath("/admin/messages")

    return { success: true }
  } catch (error) {
    console.error("Error updating message:", error)
    throw new Error("Failed to update message")
  }
}

export async function deleteMessage(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    const id = formData.get("id") as string
    await db.collection(collections.messages).deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/admin/messages")

    return { success: true }
  } catch (error) {
    console.error("Error deleting message:", error)
    throw new Error("Failed to delete message")
  }
}

// User management
export async function createUser(userData: {
  name: string
  email: string
  password: string
  isAdmin: boolean
}) {
  // Validate input
  const parsed = CreateUserSchema.safeParse(userData)
  if (!parsed.success) {
    throw new Error("Invalid input")
  }
  try {
    const { db } = await connectToDatabase()
    // Check if user already exists
    const existingUser = await db.collection(collections.users).findOne({ email: userData.email })
    if (existingUser) {
      throw new Error("User with this email already exists")
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    // Create new user document
    const result = await db.collection(collections.users).insertOne({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      isAdmin: userData.isAdmin,
      createdAt: new Date().toISOString(),
    })
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function createSubcategory(formData: FormData) {
  try {
    const { db } = await connectToDatabase()

    const name = {
      en: formData.get("name_en")?.toString() || "",
      ar: formData.get("name_ar")?.toString() || "",
    }
    const categorySlug = formData.get("categorySlug") as string
    const logo = formData.get("logo") as string

    if (!name.en || !name.ar || !categorySlug) {
      throw new Error("Missing required fields")
    }

    const slug = generateSlug(name.en)

    const subcategory = {
      id: new ObjectId().toString(),
      name,
      slug,
      logo: logo || undefined
    }

    // First get the category
    const category = await db.collection(collections.categories).findOne({ slug: categorySlug })
    if (!category) {
      throw new Error("Category not found")
    }

    // Add the subcategory to the array
    const subcategories = [...(category.subcategories || []), subcategory]

    // Update the category with the new subcategories array
    await db.collection(collections.categories).updateOne(
      { slug: categorySlug },
      { $set: { subcategories } }
    )

    revalidatePath("/admin/categories")
    revalidatePath("/products")

    return { success: true, subcategory }
  } catch (error) {
    console.error("Error creating subcategory:", error)
    throw new Error("Failed to create subcategory")
  }
}
