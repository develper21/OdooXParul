import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const { db } = await connectToDatabase();
    const activities = await db
      .collection("activities")
      .find({ tripId })
      .sort({ date: 1, time: 1 })
      .toArray();

    return NextResponse.json({ success: true, data: activities.map(serializeDocument) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to fetch activities." }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    const activity = {
      tripId,
      title: String(body.title || "").trim(),
      location: String(body.location || "").trim(),
      date: String(body.date || "").trim(),
      time: String(body.time || "").trim(),
      category: String(body.category || "General").trim(),
      cost: Number(body.cost || 0),
      duration: Number(body.duration || 0),
      description: String(body.description || ""),
      notes: String(body.notes || ""),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!activity.title || !activity.date || !activity.time) {
      return NextResponse.json({ success: false, error: "Activity title, date and time are required." }, { status: 400 });
    }

    const result = await db.collection("activities").insertOne(activity);
    const createdActivity = await db.collection("activities").findOne({ _id: result.insertedId });

    if (!createdActivity) {
      return NextResponse.json({ success: false, error: "Failed to create activity." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: serializeDocument(createdActivity), message: "Activity created successfully." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to create activity." }, { status: 500 });
  }
}
