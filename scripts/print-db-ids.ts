import { connectToDatabase, collections } from "../lib/mongodb";

async function printDbIds() {
  const { db } = await connectToDatabase();

  const categories = await db.collection(collections.categories).find({}).toArray();
  console.log("Categories:");
  categories.forEach(cat => {
    console.log({
      _id: cat._id,
      _idType: typeof cat._id,
      _idInstance: cat._id && cat._id.constructor ? cat._id.constructor.name : undefined,
      name: cat.name,
      slug: cat.slug,
    });
  });

  const gallery = await db.collection(collections.gallery).find({}).toArray();
  console.log("Gallery:");
  gallery.forEach(img => {
    console.log({
      _id: img._id,
      _idType: typeof img._id,
      _idInstance: img._id && img._id.constructor ? img._id.constructor.name : undefined,
      title: img.title,
    });
  });

  process.exit(0);
}

printDbIds(); 