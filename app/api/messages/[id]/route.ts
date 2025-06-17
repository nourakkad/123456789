import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, collections } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const message = await db.collection(collections.messages).findOne({ _id: new ObjectId(id) });
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    // Convert _id to id for the client
    const { _id, ...rest } = message;
    return NextResponse.json({ ...rest, id: _id.toString() });
  } catch (error) {
    return NextResponse.json({ error: error?.toString() }, { status: 500 });
  }
} 