import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import sharp from 'sharp';

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  // Generate thumbnail (300x300 JPEG)
  let thumbBuffer;
  try {
    thumbBuffer = await sharp(buffer)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate thumbnail' }, { status: 500 });
  }
  const { db } = await connectToDatabase();
  // Store original image
  const result = await db.collection('images').insertOne({
    filename: file.name,
    mimetype: file.type,
    image: buffer,
    createdAt: new Date(),
    isThumbnail: false,
  });
  // Store thumbnail
  const thumbResult = await db.collection('images').insertOne({
    filename: file.name + '_thumb.jpg',
    mimetype: 'image/jpeg',
    image: thumbBuffer,
    createdAt: new Date(),
    isThumbnail: true,
    originalId: result.insertedId,
  });
  return NextResponse.json({ id: result.insertedId, thumbId: thumbResult.insertedId });
}; 