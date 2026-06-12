import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tripId: string; itemId: string }> }) {
  const { tripId, itemId } = await params;
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    if (!ObjectId.isValid(itemId)) {
      return NextResponse.json({ success: false, error: "Invalid budget item id." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.category === "string") updateData.category = body.category.trim();
    if (typeof body.name === "string") updateData.name = body.name.trim();
    if (typeof body.amount !== "undefined") updateData.amount = Number(body.amount);
    if (typeof body.date === "string") updateData.date = body.date;
    if (typeof body.notes === "string") updateData.notes = body.notes;

    const result = await db.collection("budgetItems").findOneAndUpdate(
      { _id: new ObjectId(itemId), tripId },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ success: false, error: "Budget item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeDocument(result), message: "Budget item updated successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to update budget item." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ tripId: string; itemId: string }> }) {
  const { tripId, itemId } = await params;
  try {
    const { db } = await connectToDatabase();

    if (!ObjectId.isValid(itemId)) {
      return NextResponse.json({ success: false, error: "Invalid budget item id." }, { status: 400 });
    }

    const result = await db.collection("budgetItems").deleteOne({ _id: new ObjectId(itemId), tripId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Budget item not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Budget item deleted successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to delete budget item." }, { status: 500 });
  }
}
