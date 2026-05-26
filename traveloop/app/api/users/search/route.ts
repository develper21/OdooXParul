import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase();
    const excludeTripId = searchParams.get("excludeTripId");

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const { db } = await connectToDatabase();

    const users = await db
      .collection("users")
      .find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ],
      })
      .project({ passwordHash: 0 })
      .limit(8)
      .toArray();

    let result = users.map(serializeDocument);

    if (excludeTripId) {
      const existingMembers = await db
        .collection("tripMembers")
        .find({ tripId: excludeTripId, status: { $in: ["pending", "accepted"] } })
        .toArray();

      const existingUserIds = new Set(existingMembers.map((m) => m.userId?.toString()));
      result = result.filter((u) => !existingUserIds.has(u.id));
    }

    return NextResponse.json({
      success: true,
      data: result.map((u) => ({ id: u.id, name: u.name, email: u.email, avatar: u.avatar })),
    });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}
