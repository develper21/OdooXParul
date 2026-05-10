import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    if (tripId === "1") {
      return NextResponse.json({
        success: true,
        data: [
          { id: "a1", tripId: "1", title: "Helicopter Transfer from CDG", date: "2026-06-15", time: "10:00", category: "Transportation", duration: 1, location: "CDG Airport", cost: 1200 },
          { id: "a2", tripId: "1", title: "Check-in at Four Seasons George V", date: "2026-06-15", time: "12:00", category: "Hotel", duration: 1, location: "8th Arrondissement", cost: 3500 },
          { id: "a3", tripId: "1", title: "Exclusive Dinner at Le Jules Verne", date: "2026-06-15", time: "19:30", category: "Food", duration: 3, location: "Eiffel Tower", cost: 800 },
          { id: "a4", tripId: "1", title: "Private Louvre Tour Before Hours", date: "2026-06-16", time: "07:30", category: "Sightseeing", duration: 3, location: "Louvre Museum", cost: 1500 },
          { id: "a5", tripId: "1", title: "Private Seine River Yacht Cruise", date: "2026-06-16", time: "17:00", category: "Activities", duration: 2, location: "Port de la Bourdonnais", cost: 950 },
          { id: "a6", tripId: "1", title: "Spa Day at Dior Institut", date: "2026-06-17", time: "11:00", category: "General", duration: 4, location: "Plaza Athénée", cost: 600 }
        ]
      }, { status: 200 });
    }

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
