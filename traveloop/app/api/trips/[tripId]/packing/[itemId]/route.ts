import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ tripId: string; itemId: string }> }) {
  try {
    const { tripId, itemId } = await params;
    const updates = await request.json();
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection("packing_items").updateOne(
      { _id: new ObjectId(itemId), tripId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Packing item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Packing item updated successfully",
    });
  } catch (error) {
    console.error("Packing PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update packing item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ tripId: string; itemId: string }> }) {
  try {
    const { tripId, itemId } = await params;
    
    const { db } = await connectToDatabase();
    
    const result = await db.collection("packing_items").deleteOne({
      _id: new ObjectId(itemId),
      tripId,
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Packing item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Packing item deleted successfully",
    });
  } catch (error) {
    console.error("Packing DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete packing item" },
      { status: 500 }
    );
  }
}
