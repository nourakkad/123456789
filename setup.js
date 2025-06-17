// Connect to the gallerydb database
const gallerydb = db.getSiblingDB('gallerydb');

// Clear existing collections (optional - only if you want to start fresh)
gallerydb.products.deleteMany({});
gallerydb.categories.deleteMany({});
gallerydb.gallery.deleteMany({});
gallerydb.messages.deleteMany({});
gallerydb.users.deleteMany({});
gallerydb.settings.deleteMany({});

const db = gallerydb;

print("Cleared existing collections");

// Insert Categories
db.categories.insertMany([
  {
    name: "Furniture",
    slug: "furniture",
    subcategories: [
      { id: "1-1", name: "Office", slug: "office" },
      { id: "1-2", name: "Living Room", slug: "living-room" },
      { id: "1-3", name: "Lighting", slug: "lighting" }
    ]
  },
  {
    name: "Electronics",
    slug: "electronics",
    subcategories: [
      { id: "2-1", name: "Audio", slug: "audio" },
      { id: "2-2", name: "Wearables", slug: "wearables" },
      { id: "2-3", name: "Computers", slug: "computers" }
    ]
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    subcategories: [
      { id: "3-1", name: "Drinkware", slug: "drinkware" },
      { id: "3-2", name: "Cookware", slug: "cookware" },
      { id: "3-3", name: "Appliances", slug: "appliances" }
    ]
  },
  {
    name: "Accessories",
    slug: "accessories"
  }
]);

print("Inserted categories");

// Insert Products
db.products.insertMany([
  {
    name: "Premium Desk Chair",
    slug: "premium-desk-chair",
    description: "Ergonomic office chair with lumbar support and adjustable height.",
    price: 299.99,
    category: "Furniture",
    categorySlug: "furniture",
    subcategory: "Office",
    subcategorySlug: "office",
    createdAt: new Date().toISOString()
  },
  {
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    description: "Noise-cancelling headphones with 30-hour battery life.",
    price: 199.99,
    category: "Electronics",
    categorySlug: "electronics",
    subcategory: "Audio",
    subcategorySlug: "audio",
    createdAt: new Date().toISOString()
  },
  {
    name: "Ceramic Coffee Mug",
    slug: "ceramic-coffee-mug",
    description: "Handcrafted ceramic mug with unique design.",
    price: 24.99,
    category: "Kitchen",
    categorySlug: "kitchen",
    subcategory: "Drinkware",
    subcategorySlug: "drinkware",
    createdAt: new Date().toISOString()
  },
  {
    name: "Leather Wallet",
    slug: "leather-wallet",
    description: "Genuine leather wallet with multiple card slots.",
    price: 49.99,
    category: "Accessories",
    categorySlug: "accessories",
    createdAt: new Date().toISOString()
  },
  {
    name: "Smart Watch",
    slug: "smart-watch",
    description: "Fitness tracker with heart rate monitor and sleep tracking.",
    price: 149.99,
    category: "Electronics",
    categorySlug: "electronics",
    subcategory: "Wearables",
    subcategorySlug: "wearables",
    createdAt: new Date().toISOString()
  },
  {
    name: "Desk Lamp",
    slug: "desk-lamp",
    description: "Adjustable LED desk lamp with multiple brightness levels.",
    price: 79.99,
    category: "Furniture",
    categorySlug: "furniture",
    subcategory: "Lighting",
    subcategorySlug: "lighting",
    createdAt: new Date().toISOString()
  }
]);

print("Inserted products");

// Insert Gallery Images
db.gallery.insertMany([
  {
    title: "Office Setup",
    description: "Modern office setup with ergonomic furniture and natural lighting.",
    url: "/placeholder.svg?height=600&width=600&text=Office+Setup",
    createdAt: new Date().toISOString()
  },
  {
    title: "Product Showcase",
    description: "Our latest product line displayed at the annual trade show.",
    url: "/placeholder.svg?height=600&width=600&text=Product+Showcase",
    createdAt: new Date().toISOString()
  },
  {
    title: "Manufacturing Process",
    description: "Behind the scenes look at our quality-focused manufacturing process.",
    url: "/placeholder.svg?height=600&width=600&text=Manufacturing",
    createdAt: new Date().toISOString()
  },
  {
    title: "Team Building",
    description: "Our team participating in the annual retreat activities.",
    url: "/placeholder.svg?height=600&width=600&text=Team+Building",
    createdAt: new Date().toISOString()
  },
  {
    title: "Customer Testimonial",
    description: "Happy customers sharing their experience with our products.",
    url: "/placeholder.svg?height=600&width=600&text=Testimonials",
    createdAt: new Date().toISOString()
  },
  {
    title: "Sustainability Efforts",
    description: "Our ongoing initiatives to reduce environmental impact.",
    url: "/placeholder.svg?height=600&width=600&text=Sustainability",
    createdAt: new Date().toISOString()
  }
]);

print("Inserted gallery images");

// Insert Messages
db.messages.insertMany([
  {
    name: "John Smith",
    email: "john@example.com",
    message: "I'm interested in your premium desk chair. Do you offer bulk discounts for office purchases?",
    createdAt: new Date().toISOString(),
    read: true
  },
  {
    name: "Emily Johnson",
    email: "emily@example.com",
    message: "When will the ceramic coffee mugs be back in stock? I'd like to order a set of 6.",
    createdAt: new Date().toISOString(),
    read: false
  },
  {
    name: "Michael Brown",
    email: "michael@example.com",
    message: "Do you ship internationally? I'm located in Canada and interested in several of your products.",
    createdAt: new Date().toISOString(),
    read: false
  },
  {
    name: "Sarah Davis",
    email: "sarah@example.com",
    message: "I received my order yesterday and I'm very happy with the quality. Thank you for the excellent service!",
    createdAt: new Date().toISOString(),
    read: true
  },
  {
    name: "David Wilson",
    email: "david@example.com",
    message: "I'm having trouble with the checkout process. The payment page keeps timing out. Can you help?",
    createdAt: new Date().toISOString(),
    read: false
  }
]);

print("Inserted messages");

// Insert Admin User
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "password", // In production, this should be hashed
  isAdmin: true,
  avatar: "/placeholder.svg?height=40&width=40",
  createdAt: new Date().toISOString()
});

print("Inserted admin user");

// Insert Settings
db.settings.insertOne({
  siteName: "Company Name",
  siteDescription: "Your company description",
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
  updatedAt: new Date().toISOString()
});

print("Inserted settings");

// Verify the data was inserted
print("=== Database Setup Complete ===");
print("Categories:", db.categories.countDocuments());
print("Products:", db.products.countDocuments());
print("Gallery Images:", db.gallery.countDocuments());
print("Messages:", db.messages.countDocuments());
print("Users:", db.users.countDocuments());
print("Settings:", db.settings.countDocuments());

print("\n=== Setup completed successfully! ===");