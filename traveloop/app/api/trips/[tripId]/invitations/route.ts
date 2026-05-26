import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET /api/trips/[tripId]/invitations - Get all invitations for a trip
export async function GET(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const { db } = await connectToDatabase();

    const invitations = await db
      .collection("invitations")
      .find({ tripId, status: "pending" })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: invitations.map(serializeDocument),
    });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
  }
}

// DELETE /api/trips/[tripId]/invitations?invitationId=... - Cancel invitation
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("invitationId");

    if (!invitationId) {
      return NextResponse.json({ error: "Invitation ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    await db.collection("invitations").updateOne(
      { _id: new ObjectId(invitationId), tripId },
      { $set: { status: "cancelled", updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: "Invitation cancelled",
    });
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return NextResponse.json({ error: "Failed to cancel invitation" }, { status: 500 });
  }
}
