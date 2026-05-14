import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";
import { Invitation, TripMember } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { sendEmail, generateInvitationEmail } from "@/lib/email";
import { ObjectId } from "mongodb";

// GET /api/invitations - Get user's invitations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const tripId = searchParams.get('tripId');
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    let query: any = { invitedEmail: email, status: "pending" };
    if (tripId) {
      query.tripId = tripId;
    }

    const invitations = await db
      .collection("invitations")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: invitations.map(serializeDocument),
    });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

// POST /api/invitations - Send new invitation
export async function POST(request: NextRequest) {
  try {
    const { tripId, invitedEmail, invitedBy, invitedUserId, inviteMethod = "email" } = await request.json();

    if (!tripId || !invitedBy) {
      return NextResponse.json(
        { error: "Trip ID and inviter name are required" },
        { status: 400 }
      );
    }

    if (inviteMethod !== "link" && !invitedEmail) {
      return NextResponse.json(
        { error: "Invited email is required for email/search invites" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if trip exists
    const trip = await db.collection("trips").findOne({ _id: new ObjectId(tripId) });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Prevent inviting a user who is already a member.
    let existingMember = null;
    if (invitedUserId) {
      existingMember = await db.collection("tripMembers").findOne({ tripId, userId: invitedUserId });
    } else if (invitedEmail) {
      const normalizedEmail = invitedEmail.trim().toLowerCase();
      const invitedUser = await db.collection("users").findOne({ email: normalizedEmail });
      if (invitedUser) {
        existingMember = await db.collection("tripMembers").findOne({ tripId, userId: invitedUser._id.toString() });
      }
    }

    if (existingMember) {
      return NextResponse.json(
        { error: "The user is already a member of this trip" },
        { status: 409 }
      );
    }

    // Check if invitation already exists and is pending for non-link invites
    if (inviteMethod !== "link" && invitedEmail) {
      const normalizedEmail = invitedEmail.trim().toLowerCase();
      const existingInvitation = await db.collection("invitations").findOne({
        tripId,
        invitedEmail: normalizedEmail,
        status: "pending",
      });

      if (existingInvitation) {
        return NextResponse.json(
          { error: "Invitation already sent to this email" },
          { status: 409 }
        );
      }
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation: Omit<Invitation, "id"> = {
      tripId,
      tripTitle: trip.title,
      tripDestination: trip.destination,
      invitedEmail: invitedEmail ? invitedEmail.trim().toLowerCase() : "",
      invitedUserId,
      invitedBy,
      inviteMethod,
      token,
      status: "pending",
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("invitations").insertOne(invitation);

    if (inviteMethod !== "link" && invitedEmail) {
      const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`;
      const emailTemplate = generateInvitationEmail({
        tripTitle: trip.title,
        tripDestination: trip.destination,
        invitedBy,
        inviteUrl,
        expiresAt: expiresAt.toDateString(),
      });

      await sendEmail({
        to: invitation.invitedEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    }

    return NextResponse.json({
      success: true,
      data: serializeDocument({ ...invitation, _id: result.insertedId }),
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
