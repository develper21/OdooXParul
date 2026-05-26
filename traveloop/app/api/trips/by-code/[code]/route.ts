import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const { db } = await connectToDatabase();

    const trip = await db.collection("trips").findOne({ joinCode: code });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: trip._id.toString(),
        title: trip.title,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        joinCode: trip.joinCode,
        imageUrl: trip.imageUrl,
      },
    });
  } catch (error) {
    console.error("Find trip by code error:", error);
    return NextResponse.json({ error: "Failed to find trip" }, { status: 500 });
  }
}
