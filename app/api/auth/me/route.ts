import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";
import { verifyJwtToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("auth-token")?.value;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    let payload: any;
    try {
      payload = verifyJwtToken(token);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid or expired token." }, { status: 401 });
    }

    const userId = payload?.userId;
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: "Invalid token payload." }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const { passwordHash, ...safeUser } = user as any;
    return NextResponse.json({ success: true, data: serializeDocument(safeUser) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to fetch user profile." }, { status: 500 });
  }
}
