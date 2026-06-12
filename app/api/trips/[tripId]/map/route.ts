import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

// GET all map points for a trip
export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const { db } = await connectToDatabase();

    const points = await db
      .collection("tripMapPoints")
      .find({ tripId })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: points.map(serializeDocument) }, { status: 200 });
  } catch (error) {
    console.error("Map points GET error:", error);
    return NextResponse.json({ success: false, error: "Unable to fetch map points." }, { status: 500 });
  }
}

// POST create a new map point
export async function POST(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    const point = {
      tripId,
      name: String(body.name || "").trim() || "Untitled",
      description: String(body.description || ""),
      lat: Number(body.lat) || 0,
      lng: Number(body.lng) || 0,
      type: String(body.type || "custom"),
      day: body.day ? Number(body.day) : null,
      order: Number(body.order) || 0,
      activityId: body.activityId ? String(body.activityId) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("tripMapPoints").insertOne(point);
    const created = await db.collection("tripMapPoints").findOne({ _id: result.insertedId });

    if (!created) {
      return NextResponse.json({ success: false, error: "Failed to retrieve created map point." }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: serializeDocument(created), message: "Map point added." }, { status: 201 });
  } catch (error) {
    console.error("Map point POST error:", error);
    return NextResponse.json({ success: false, error: "Unable to add map point." }, { status: 500 });
  }
}
