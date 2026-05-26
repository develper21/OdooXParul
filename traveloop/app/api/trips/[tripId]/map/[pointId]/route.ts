import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

// PATCH update a map point
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tripId: string; pointId: string }> }) {
  const { pointId } = await params;
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    if (!ObjectId.isValid(pointId)) {
      return NextResponse.json({ success: false, error: "Invalid point id." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.name === "string") updateData.name = body.name.trim();
    if (typeof body.description === "string") updateData.description = body.description;
    if (typeof body.lat === "number") updateData.lat = body.lat;
    if (typeof body.lng === "number") updateData.lng = body.lng;
    if (typeof body.type === "string") updateData.type = body.type;
    if (typeof body.day === "number") updateData.day = body.day;
    if (typeof body.order === "number") updateData.order = body.order;

    const result = await db.collection("tripMapPoints").findOneAndUpdate(
      { _id: new ObjectId(pointId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ success: false, error: "Map point not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeDocument(result), message: "Map point updated." }, { status: 200 });
  } catch (error) {
    console.error("Map point PATCH error:", error);
    return NextResponse.json({ success: false, error: "Unable to update map point." }, { status: 500 });
  }
}

// DELETE a map point
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ tripId: string; pointId: string }> }) {
  const { pointId } = await params;
  try {
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(pointId)) {
      return NextResponse.json({ success: false, error: "Invalid point id." }, { status: 400 });
    }

    const result = await db.collection("tripMapPoints").deleteOne({ _id: new ObjectId(pointId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Map point not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Map point deleted." }, { status: 200 });
  } catch (error) {
    console.error("Map point DELETE error:", error);
    return NextResponse.json({ success: false, error: "Unable to delete map point." }, { status: 500 });
  }
}
