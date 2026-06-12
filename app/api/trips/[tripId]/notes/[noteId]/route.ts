import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ tripId: string; noteId: string }> }) {
  try {
    const { tripId, noteId } = await params;
    const updates = await request.json();
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection("trip_notes").updateOne(
      { _id: new ObjectId(noteId), tripId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Notes PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ tripId: string; noteId: string }> }) {
  try {
    const { tripId, noteId } = await params;
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection("trip_notes").deleteOne({
      _id: new ObjectId(noteId),
      tripId,
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Notes DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
