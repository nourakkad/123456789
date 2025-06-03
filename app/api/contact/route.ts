import { NextResponse } from "next/server";
import { connectToDatabase, collections } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    let data;
    try {
      data = JSON.parse(body);
    } catch (parseError) {
      console.error("Failed to parse JSON body:", body, parseError);
      return NextResponse.json({ error: "Invalid JSON", details: String(parseError) }, { status: 400 });
    }
    const { name, email, message } = data;
    if (!name || !email || !message) {
      console.error("Missing fields:", { name, email, message });
      return NextResponse.json({ error: "Missing fields", details: { name, email, message } }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const messageDoc = {
      name,
      email,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection(collections.messages).insertOne(messageDoc);
    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    let stack = undefined;
    if (typeof error === 'object' && error !== null && 'stack' in error) {
      stack = (error as any).stack;
    }
    console.error("Error in POST /api/contact:", error, stack);
    return NextResponse.json({ error: "Failed to send message", details: String(error), stack }, { status: 500 });
  }
} 