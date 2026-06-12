import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    if (tripId === "1") {
      const items = [
        { id: "b1", category: "Flights", name: "Helicopter Transfer", amount: 1200, date: "2026-06-15" },
        { id: "b2", category: "Lodging", name: "Four Seasons George V", amount: 3500, date: "2026-06-15" },
        { id: "b3", category: "Food", name: "Dinner at Le Jules Verne", amount: 800, date: "2026-06-15" },
        { id: "b4", category: "Activities", name: "Louvre Tour & River Cruise", amount: 2450, date: "2026-06-16" },
      ];
      const totalSpent = items.reduce((sum, item) => sum + item.amount, 0);
      const totalBudget = 8500;
      
      return NextResponse.json({
        success: true,
        data: {
          items,
          summary: {
            tripId: "1",
            totalBudget,
            totalSpent,
            remaining: totalBudget - totalSpent,
            byCategory: items.reduce<Record<string, number>>((acc, item) => {
              acc[item.category] = (acc[item.category] || 0) + item.amount;
              return acc;
            }, {})
          }
        }
      }, { status: 200 });
    }

    if (!ObjectId.isValid(tripId)) {
      return NextResponse.json({ success: false, error: "Invalid trip id." }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const items = await db
      .collection("budgetItems")
      .find({ tripId })
      .sort({ date: 1 })
      .toArray();

    const trip = await db.collection("trips").findOne({ _id: new ObjectId(tripId) });
    const totalBudget = trip?.budget ? Number(trip.budget) : 0;
    const totalSpent = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const summary = {
      tripId,
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      byCategory: items.reduce<Record<string, number>>((acc, item) => {
        const category = String(item.category || "Other");
        acc[category] = (acc[category] || 0) + Number(item.amount || 0);
        return acc;
      }, {}),
    };

    return NextResponse.json({ success: true, data: { items: items.map(serializeDocument), summary } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to fetch budget items." }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    const item = {
      tripId,
      category: String(body.category || "Other").trim(),
      name: String(body.name || "").trim(),
      amount: Number(body.amount || 0),
      date: String(body.date || "").trim(),
      notes: String(body.notes || ""),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!item.name || !item.date) {
      return NextResponse.json({ success: false, error: "Budget item name and date are required." }, { status: 400 });
    }

    const result = await db.collection("budgetItems").insertOne(item);
    const createdItem = await db.collection("budgetItems").findOne({ _id: result.insertedId });

    if (!createdItem) {
      return NextResponse.json({ success: false, error: "Failed to create budget item." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: serializeDocument(createdItem), message: "Budget item added successfully." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to add budget item." }, { status: 500 });
  }
}
