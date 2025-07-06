import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    // @ts-ignore
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type;
    const { db } = await connectToDatabase();
    const imageResult = await db.collection("images").insertOne({
      filename: file.name,
      mimetype: mimeType,
      image: buffer,
      createdAt: new Date(),
      isThumbnail: false,
    });
    const imageId = imageResult.insertedId;
    const imageUrl = `/api/images/${imageId}`;
    return NextResponse.json({ url: imageUrl, id: imageId, success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
} 