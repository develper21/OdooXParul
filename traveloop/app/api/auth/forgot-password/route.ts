import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sendEmail, generateOTPEmail } from "@/lib/email";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
    }

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "No account found with this email." }, { status: 404 });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.collection("passwordResets").updateOne(
      { email },
      { $set: { email, otp, expiresAt, used: false, createdAt: new Date() } },
      { upsert: true }
    );

    // Send OTP email
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Traveloop';
    const emailContent = generateOTPEmail(otp, appName);
    
    const emailResult = await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      // Fallback: show OTP in console for development
      console.log(`[OTP] Password reset OTP for ${email}: ${otp}`);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "OTP sent to your email address.",
        emailSent: emailResult.success,
        // Only show OTP in development if email failed
        otp: (!emailResult.success && process.env.NODE_ENV === "development") ? otp : undefined 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: "Unable to process request." }, { status: 500 });
  }
}
