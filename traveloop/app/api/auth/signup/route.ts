import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";
import { createJwtToken, hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || body.pass || "");

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required." }, { status: 400 });
    }

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "A user with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userPayload = {
      name,
      email,
      avatar: String(body.avatar || ""),
      joinedDate: new Date(),
      preferences: {
        theme: "dark",
        language: "en",
        currency: "USD",
        notifications: true,
        ...(body.preferences || {}),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      passwordHash,
    };

    const result = await db.collection("users").insertOne(userPayload);
    const createdUser = await db.collection("users").findOne({ _id: result.insertedId });

    if (!createdUser) {
      return NextResponse.json({ success: false, error: "Unable to create user." }, { status: 500 });
    }

    const token = createJwtToken({ userId: String(result.insertedId), email });
    const { passwordHash: removed, ...safeUser } = createdUser as any;

    // Set HTTP-only cookie for persistent session
    const response = NextResponse.json(
      { success: true, data: serializeDocument(safeUser), message: "Account created successfully." }, 
      { status: 201 }
    );

    // Set secure cookie with 30-day expiration
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to create account." }, { status: 500 });
  }
}
