import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    if (tripId === "1") {
      return NextResponse.json({
        success: true,
        data: {
          id: "1",
          title: "Luxury Retreat in Paris",
          destination: "Paris, France",
          startDate: "2026-06-15",
          endDate: "2026-06-18",
          travelers: 2,
          budget: 8500,
          description: "An exclusive curated experience through the heart of Paris.",
          status: "upcoming"
        }
      }, { status: 200 });
    }

    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(tripId)) {
      return NextResponse.json({ success: false, error: "Invalid trip id." }, { status: 400 });
    }

    const trip = await db.collection("trips").findOne({ _id: new ObjectId(tripId) });

    if (!trip) {
      return NextResponse.json({ success: false, error: "Trip not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeDocument(trip) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to fetch trip." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    if (!ObjectId.isValid(tripId)) {
      return NextResponse.json({ success: false, error: "Invalid trip id." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.title === "string") updateData.title = body.title.trim();
    if (typeof body.destination === "string") updateData.destination = body.destination.trim();
    if (typeof body.startDate === "string") updateData.startDate = body.startDate;
    if (typeof body.endDate === "string") updateData.endDate = body.endDate;
    if (typeof body.description === "string") updateData.description = body.description;
    if (typeof body.imageUrl === "string") updateData.imageUrl = body.imageUrl;
    if (typeof body.status === "string") updateData.status = body.status;
    if (typeof body.travelers !== "undefined") updateData.travelers = Number(body.travelers);
    if (typeof body.budget !== "undefined") updateData.budget = Number(body.budget);

    const result = await db.collection("trips").findOneAndUpdate(
      { _id: new ObjectId(tripId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ success: false, error: "Trip not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeDocument(result), message: "Trip updated successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to update trip." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(tripId)) {
      return NextResponse.json({ success: false, error: "Invalid trip id." }, { status: 400 });
    }

    const result = await db.collection("trips").deleteOne({ _id: new ObjectId(tripId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Trip not found." }, { status: 404 });
    }

    await Promise.all([
      db.collection("activities").deleteMany({ tripId }),
      db.collection("budgetItems").deleteMany({ tripId }),
    ]);

    return NextResponse.json({ success: true, message: "Trip deleted successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to delete trip." }, { status: 500 });
  }
}
