import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function GET(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const { db } = await connectToDatabase();

    const activities = await db
      .collection("collaborationActivities")
      .find({ tripId })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({
      success: true,
      data: activities.map(serializeDocument),
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
