import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const otp = String(body.otp || "").trim();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP are required." }, { status: 400 });
    }

    const record = await db.collection("passwordResets").findOne({ email });

    if (!record) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP." }, { status: 400 });
    }

    if (record.used) {
      return NextResponse.json({ success: false, error: "OTP has already been used." }, { status: 400 });
    }

    if (new Date() > new Date(record.expiresAt)) {
      return NextResponse.json({ success: false, error: "OTP has expired." }, { status: 400 });
    }

    if (record.otp !== otp) {
      return NextResponse.json({ success: false, error: "Invalid OTP." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "OTP verified successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to verify OTP." }, { status: 500 });
  }
}
