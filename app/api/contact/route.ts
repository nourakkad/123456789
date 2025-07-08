import { NextResponse } from "next/server";
import { connectToDatabase, collections } from "@/lib/mongodb";
import nodemailer from "nodemailer";

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
    const { name, number, message } = data;
    if (!name || !message || !number) {
      console.error("Missing fields:", { name, number, message });
      return NextResponse.json({ error: "Missing fields", details: { name, number, message } }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const messageDoc = {
      name,
      number,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection(collections.messages).insertOne(messageDoc);

    // Send email to info@timbex.com
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `Website Contact <${process.env.SMTP_USER}>`,
      to: "info@timbex-sy.com",
      subject: number,
      text: `Name: ${name}\nPhone: ${number}\nMessage: ${message}`,
      html: `<p><b>Name:</b> ${name}</p><p><b>Phone:</b> ${number}</p><p><b>Message:</b><br/>${message.replace(/\n/g, '<br/>')}</p>`
    });

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