import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";
import { comparePasswords, createJwtToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || body.pass || "");

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    const passwordHash = (user as any).passwordHash;
    const isMatch = await comparePasswords(password, passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    const { passwordHash: removed, ...safeUser } = user as any;
    const token = createJwtToken({ userId: String(user._id), email });

    // Set HTTP-only cookie for persistent session
    const response = NextResponse.json(
      { success: true, data: serializeDocument(safeUser), message: "Logged in successfully." }, 
      { status: 200 }
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
    return NextResponse.json({ success: false, error: "Unable to login." }, { status: 500 });
  }
}
