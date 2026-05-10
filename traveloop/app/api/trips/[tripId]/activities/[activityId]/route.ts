import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tripId: string; activityId: string }> }) {
  const { tripId, activityId } = await params;
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    if (!ObjectId.isValid(activityId)) {
      return NextResponse.json({ success: false, error: "Invalid activity id." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.title === "string") updateData.title = body.title.trim();
    if (typeof body.location === "string") updateData.location = body.location.trim();
    if (typeof body.date === "string") updateData.date = body.date;
    if (typeof body.time === "string") updateData.time = body.time;
    if (typeof body.category === "string") updateData.category = body.category.trim();
    if (typeof body.cost !== "undefined") updateData.cost = Number(body.cost);
    if (typeof body.duration !== "undefined") updateData.duration = Number(body.duration);
    if (typeof body.description === "string") updateData.description = body.description;
    if (typeof body.notes === "string") updateData.notes = body.notes;

    const result = await db.collection("activities").findOneAndUpdate(
      { _id: new ObjectId(activityId), tripId },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ success: false, error: "Activity not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeDocument(result), message: "Activity updated successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to update activity." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ tripId: string; activityId: string }> }) {
  const { tripId, activityId } = await params;
  try {
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(activityId)) {
      return NextResponse.json({ success: false, error: "Invalid activity id." }, { status: 400 });
    }

    const result = await db.collection("activities").deleteOne({ _id: new ObjectId(activityId), tripId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Activity not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Activity deleted successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to delete activity." }, { status: 500 });
  }
}
