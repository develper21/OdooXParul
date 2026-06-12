import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const { db } = await connectToDatabase();
    
    const packingItems = await db
      .collection("packing_items")
      .find({ tripId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: packingItems,
    });
  } catch (error) {
    console.error("Packing GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packing items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    const { tripId } = await params;
    const { name, category, quantity, packed, notes } = await request.json();
    
    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: "Name and category are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const newItem = {
      tripId,
      name,
      category,
      quantity: quantity || 1,
      packed: packed || false,
      notes: notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection("packing_items").insertOne(newItem);
    
    return NextResponse.json({
      success: true,
      data: { ...newItem, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Packing POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create packing item" },
      { status: 500 }
    );
  }
}
