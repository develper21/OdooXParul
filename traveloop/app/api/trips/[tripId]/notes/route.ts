import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const { db } = await connectToDatabase();
    
    const notes = await db
      .collection("trip_notes")
      .find({ tripId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error("Notes GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const { title, content, category } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const newNote = {
      tripId,
      title,
      content,
      category: category || "general",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection("trip_notes").insertOne(newNote);
    
    return NextResponse.json({
      success: true,
      data: { ...newNote, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Notes POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create note" },
      { status: 500 }
    );
  }
}
