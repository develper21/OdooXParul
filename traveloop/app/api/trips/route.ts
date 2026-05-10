import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const filter: Record<string, unknown> = {};

    const status = searchParams.get("status");
    const destination = searchParams.get("destination");
    const search = searchParams.get("search");
    const minBudget = searchParams.get("minBudget");
    const maxBudget = searchParams.get("maxBudget");

    if (status) {
      filter.status = status;
    }

    if (destination) {
      filter.destination = { $regex: destination, $options: "i" };
    }

    if (minBudget || maxBudget) {
      filter.budget = {} as Record<string, unknown>;
      if (minBudget) {
        (filter.budget as Record<string, unknown>).$gte = Number(minBudget);
      }
      if (maxBudget) {
        (filter.budget as Record<string, unknown>).$lte = Number(maxBudget);
      }
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const trips = await db
      .collection("trips")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: trips.map(serializeDocument) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to fetch trips." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    const title = String(body.title || "").trim();
    const destination = String(body.destination || "").trim() || (Array.isArray(body.cities) ? body.cities.join(", ") : "");
    const startDate = String(body.startDate || "").trim();
    const endDate = String(body.endDate || "").trim();
    const travelers = Number(body.travelers || 1);
    const budget = Number(body.budget || 0);

    if (!title || !destination || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Trip title, destination, dates, and budget are required." }, { status: 400 });
    }

    const trip = {
      title,
      destination,
      startDate,
      endDate,
      travelers: Number.isNaN(travelers) ? 1 : travelers,
      budget: Number.isNaN(budget) ? 0 : budget,
      status: String(body.status || "planning"),
      description: String(body.description || ""),
      imageUrl: String(body.imageUrl || ""),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("trips").insertOne(trip);
    const createdTrip = await db.collection("trips").findOne({ _id: result.insertedId });

    if (!createdTrip) {
      return NextResponse.json({ success: false, error: "Failed to create trip." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: serializeDocument(createdTrip), message: "Trip created successfully." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Unable to create trip." }, { status: 500 });
  }
}
