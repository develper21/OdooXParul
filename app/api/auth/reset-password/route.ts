import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const otp = String(body.otp || "").trim();
    const password = String(body.password || "");

    if (!email || !otp || !password) {
      return NextResponse.json({ success: false, error: "Email, OTP, and new password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const record = await db.collection("passwordResets").findOne({ email });

    if (!record || record.used || new Date() > new Date(record.expiresAt) || record.otp !== otp) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await db.collection("users").updateOne(
      { email },
      { $set: { passwordHash, updatedAt: new Date() } }
    );

    await db.collection("passwordResets").updateOne(
      { email },
      { $set: { used: true } }
    );

    return NextResponse.json({ success: true, message: "Password reset successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to reset password." }, { status: 500 });
  }
}
