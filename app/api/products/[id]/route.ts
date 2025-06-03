import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { collections } from "@/lib/mongodb"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }
    const product = await db.collection(collections.products).findOne({ _id: new ObjectId(id) })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    // Convert _id to id for the client
    const { _id, ...rest } = product
    return NextResponse.json({ ...rest, id: _id.toString() })
  } catch (error) {
    return NextResponse.json({ error: error?.toString() }, { status: 500 })
  }
} 