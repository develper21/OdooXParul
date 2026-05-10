import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: "Missing or invalid userId." }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const { passwordHash, ...serialized } = user as any;
    return NextResponse.json({ success: true, data: serializeDocument(serialized) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to fetch user profile." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: "Missing or invalid userId." }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const body = await req.json();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.name === "string") updateData.name = body.name.trim();
    if (typeof body.avatar === "string") updateData.avatar = body.avatar.trim();
    if (typeof body.preferences === "object" && body.preferences !== null) {
      updateData.preferences = body.preferences;
    }

    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const { passwordHash, ...serialized } = result as any;
    return NextResponse.json({ success: true, data: serializeDocument(serialized), message: "Profile updated successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to update user profile." }, { status: 500 });
  }
}
