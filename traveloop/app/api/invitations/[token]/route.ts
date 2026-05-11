import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";
import { Invitation, TripMember } from "@/lib/types";

// GET /api/invitations/[token] - Get invitation details
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    
    const { db } = await connectToDatabase();
    
    const invitation = await db.collection("invitations").findOne({ token });
    
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      await db.collection("invitations").updateOne(
        { _id: invitation._id },
        { $set: { status: "expired", updatedAt: new Date() } }
      );
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
    }

    // Check if invitation is no longer pending
    if (invitation.status !== "pending") {
      return NextResponse.json({ error: `Invitation ${invitation.status}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: serializeDocument(invitation),
    });
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation" },
      { status: 500 }
    );
  }
}

// POST /api/invitations/[token] - Accept or decline invitation
export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const { action, userId } = await request.json(); // action: "accept" or "decline"

    if (!action || !["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (action === "accept" && !userId) {
      return NextResponse.json({ error: "User ID is required to accept invitation" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const invitation = await db.collection("invitations").findOne({ token });
    
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Check if invitation has expired
    if (new Date() > invitation.expiresAt) {
      await db.collection("invitations").updateOne(
        { _id: invitation._id },
        { $set: { status: "expired", updatedAt: new Date() } }
      );
      return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
    }

    // Check if invitation is still pending
    if (invitation.status !== "pending") {
      return NextResponse.json({ error: `Invitation ${invitation.status}` }, { status: 400 });
    }

    const newStatus = action === "accept" ? "accepted" : "declined";
    
    // Update invitation status
    await db.collection("invitations").updateOne(
      { _id: invitation._id },
      { 
        $set: { 
          status: newStatus,
          updatedAt: new Date(),
          ...(action === "accept" && { invitedUserId: userId })
        }
      }
    );

    // If accepting, add user as trip member
    if (action === "accept") {
      // Check if user is already a member
      const existingMember = await db.collection("tripMembers").findOne({
        tripId: invitation.tripId,
        userId: userId,
      });

      if (!existingMember) {
        const member: Omit<TripMember, "id"> = {
          tripId: invitation.tripId,
          userId: userId,
          role: "member",
          status: "accepted",
          invitedBy: invitation.invitedBy,
          invitedAt: invitation.createdAt,
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection("tripMembers").insertOne(member);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Invitation ${newStatus} successfully`,
    });
  } catch (error) {
    console.error("Error processing invitation:", error);
    return NextResponse.json(
      { error: "Failed to process invitation" },
      { status: 500 }
    );
  }
}
