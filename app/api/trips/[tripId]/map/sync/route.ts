import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase, serializeDocument } from "@/lib/mongodb";

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  paris: { lat: 48.8566, lng: 2.3522 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
  "new york": { lat: 40.7128, lng: -74.006 },
  london: { lat: 51.5074, lng: -0.1278 },
  bali: { lat: -8.3405, lng: 115.092 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  rome: { lat: 41.9028, lng: 12.4964 },
  barcelona: { lat: 41.3851, lng: 2.1734 },
  amsterdam: { lat: 52.3676, lng: 4.9041 },
  istanbul: { lat: 41.0082, lng: 28.9784 },
  bangkok: { lat: 13.7563, lng: 100.5018 },
  sydney: { lat: -33.8688, lng: 151.2093 },
  cairo: { lat: 30.0444, lng: 31.2357 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  toronto: { lat: 43.6532, lng: -79.3832 },
  berlin: { lat: 52.52, lng: 13.405 },
  seoul: { lat: 37.5665, lng: 126.978 },
  maldives: { lat: 3.2028, lng: 73.2207 },
  santorini: { lat: 36.3932, lng: 25.4615 },
  "swiss alps": { lat: 46.8182, lng: 8.2275 },
  iceland: { lat: 64.9631, lng: -19.0208 },
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  try {
    const { db } = await connectToDatabase();

    // Fetch the trip
    const trip = await db.collection("trips").findOne({ _id: tripId.length === 24 ? new (await import("mongodb")).ObjectId(tripId) : { $eq: null as any } });
    if (!trip) {
      return NextResponse.json({ success: false, error: "Trip not found." }, { status: 404 });
    }

    const destinations = String(trip.destination || "").split(",").map((d: string) => d.trim()).filter(Boolean);
    const existingPoints = await db.collection("tripMapPoints").find({ tripId }).toArray();
    const existingNames = new Set(existingPoints.map((p: any) => p.name.toLowerCase()));

    const newPoints: any[] = [];
    let order = existingPoints.length;

    for (const dest of destinations) {
      const key = dest.toLowerCase();
      if (existingNames.has(key)) continue;

      const coords = cityCoordinates[key];
      if (coords) {
        newPoints.push({
          tripId,
          name: dest,
          description: `Destination: ${dest}`,
          lat: coords.lat,
          lng: coords.lng,
          type: "destination",
          order: order++,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    if (newPoints.length > 0) {
      await db.collection("tripMapPoints").insertMany(newPoints);
    }

    const allPoints = await db.collection("tripMapPoints").find({ tripId }).sort({ order: 1 }).toArray();

    return NextResponse.json({
      success: true,
      data: allPoints.map(serializeDocument),
      message: `Synced ${newPoints.length} new map points.`,
    }, { status: 200 });
  } catch (error) {
    console.error("Map sync error:", error);
    return NextResponse.json({ success: false, error: "Unable to sync map points." }, { status: 500 });
  }
}
