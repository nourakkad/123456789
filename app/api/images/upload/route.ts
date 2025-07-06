import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const { db } = await connectToDatabase();
  const result = await db.collection('images').insertOne({
    filename: file.name,
    mimetype: file.type,
    image: buffer,
    createdAt: new Date(),
    isThumbnail: false,
  });
  return NextResponse.json({ id: result.insertedId });
}; 