import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";
import { verifyJwtToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const { code, userId } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Join code is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const trip = await db.collection("trips").findOne({ _id: new ObjectId(tripId) });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (trip.joinCode !== code) {
      return NextResponse.json({ error: "Invalid join code" }, { status: 403 });
    }

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Valid user ID is required" }, { status: 400 });
    }

    const existingMember = await db.collection("tripMembers").findOne({
      tripId,
      userId,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingMember) {
      return NextResponse.json({ error: "Already a member of this trip" }, { status: 409 });
    }

    await db.collection("tripMembers").insertOne({
      tripId,
      userId,
      role: "member",
      permissions: "view",
      status: "accepted",
      invitedBy: userId,
      invitedAt: new Date(),
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.collection("collaborationActivities").insertOne({
      tripId,
      type: "member_joined",
      targetUserId: userId,
      message: "Joined the trip via join code",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Successfully joined the trip",
      data: { tripId: trip._id.toString(), title: trip.title },
    });
  } catch (error) {
    console.error("Join trip error:", error);
    return NextResponse.json({ error: "Failed to join trip" }, { status: 500 });
  }
}
