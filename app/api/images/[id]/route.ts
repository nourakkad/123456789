import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const GET = async (_req: Request, { params }: { params: { id: string } }) => {
  const { db } = await connectToDatabase();
  const img = await db.collection('images').findOne({ _id: new ObjectId(params.id) });
  if (!img) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(img.image.buffer, {
    headers: { 'Content-Type': img.mimetype },
  });
}; 