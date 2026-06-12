import { NextRequest, NextResponse } from "next/server";
import { createJwtToken, verifyJwtToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = String(body.token || "").replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required." }, { status: 400 });
    }

    const payload = verifyJwtToken(token) as Record<string, unknown>;

    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ success: false, error: "Invalid token." }, { status: 401 });
    }

    const newToken = createJwtToken(payload);
    return NextResponse.json({ success: true, token: newToken, message: "Token refreshed successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to refresh token." }, { status: 401 });
  }
}
