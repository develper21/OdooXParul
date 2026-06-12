import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";
import { TripMember } from "@/lib/types";
import { ObjectId } from "mongodb";

// GET /api/trips/[tripId]/members - Get trip members
export async function GET(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    
    const { db } = await connectToDatabase();
    
    const members = await db
      .collection("tripMembers")
      .find({ tripId })
      .sort({ createdAt: 1 })
      .toArray();

    // Get user details for each member
    const userIds = members.map(member => member.userId).filter(id => id);
    const userObjectIds = userIds.map(id => new ObjectId(id));
    const users = userIds.length > 0 ? await db
      .collection("users")
      .find({ _id: { $in: userObjectIds } })
      .toArray()
      .then(users => users.reduce((acc, user) => {
        acc[user._id.toString()] = user;
        return acc;
      }, {} as Record<string, any>)) : {};

    const membersWithUsers = members.map(member => ({
      ...serializeDocument(member),
      user: member.userId ? users[member.userId] : null,
    }));

    return NextResponse.json({
      success: true,
      data: membersWithUsers,
    });
  } catch (error) {
    console.error("Error fetching trip members:", error);
    return NextResponse.json(
      { error: "Failed to fetch trip members" },
      { status: 500 }
    );
  }
}

// DELETE /api/trips/[tripId]/members/[memberId] - Remove member
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    
    if (!memberId) {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    // Check if member exists
    const member = await db.collection("tripMembers").findOne({
      _id: new ObjectId(memberId),
      tripId,
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Don't allow removing the owner
    if (member.role === "owner") {
      return NextResponse.json({ error: "Cannot remove trip owner" }, { status: 403 });
    }

    await db.collection("tripMembers").deleteOne({
      _id: new ObjectId(memberId),
      tripId,
    });

    return NextResponse.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
