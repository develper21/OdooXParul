import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// Mock city data - in production, this would come from a real database or API
const cities = [
  { name: "Paris", country: "France", region: "Europe", popularity: 95, coordinates: { lat: 48.8566, lng: 2.3522 } },
  { name: "Tokyo", country: "Japan", region: "Asia", popularity: 92, coordinates: { lat: 35.6762, lng: 139.6503 } },
  { name: "New York", country: "USA", region: "North America", popularity: 98, coordinates: { lat: 40.7128, lng: -74.0060 } },
  { name: "London", country: "UK", region: "Europe", popularity: 94, coordinates: { lat: 51.5074, lng: -0.1278 } },
  { name: "Bali", country: "Indonesia", region: "Asia", popularity: 88, coordinates: { lat: -8.3405, lng: 115.0920 } },
  { name: "Dubai", country: "UAE", region: "Middle East", popularity: 90, coordinates: { lat: 25.2048, lng: 55.2708 } },
  { name: "Singapore", country: "Singapore", region: "Asia", popularity: 85, coordinates: { lat: 1.3521, lng: 103.8198 } },
  { name: "Rome", country: "Italy", region: "Europe", popularity: 91, coordinates: { lat: 41.9028, lng: 12.4964 } },
  { name: "Barcelona", country: "Spain", region: "Europe", popularity: 87, coordinates: { lat: 41.3851, lng: 2.1734 } },
  { name: "Amsterdam", country: "Netherlands", region: "Europe", popularity: 86, coordinates: { lat: 52.3676, lng: 4.9041 } },
  { name: "Istanbul", country: "Turkey", region: "Europe/Asia", popularity: 89, coordinates: { lat: 41.0082, lng: 28.9784 } },
  { name: "Bangkok", country: "Thailand", region: "Asia", popularity: 84, coordinates: { lat: 13.7563, lng: 100.5018 } },
  { name: "Sydney", country: "Australia", region: "Oceania", popularity: 83, coordinates: { lat: -33.8688, lng: 151.2093 } },
  { name: "Cairo", country: "Egypt", region: "Africa", popularity: 82, coordinates: { lat: 30.0444, lng: 31.2357 } },
  { name: "Mumbai", country: "India", region: "Asia", popularity: 96, coordinates: { lat: 19.0760, lng: 72.8777 } },
  { name: "Los Angeles", country: "USA", region: "North America", popularity: 91, coordinates: { lat: 34.0522, lng: -118.2437 } },
  { name: "Toronto", country: "Canada", region: "North America", popularity: 85, coordinates: { lat: 43.6532, lng: -79.3832 } },
  { name: "Berlin", country: "Germany", region: "Europe", popularity: 88, coordinates: { lat: 52.5200, lng: 13.4050 } },
  { name: "Seoul", country: "South Korea", region: "Asia", popularity: 87, coordinates: { lat: 37.5665, lng: 126.9780 } },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const region = searchParams.get("region")?.toLowerCase() || "";

    let filteredCities = cities;

    // Filter by search query
    if (query) {
      filteredCities = cities.filter(city => 
        city.name.toLowerCase().includes(query) ||
        city.country.toLowerCase().includes(query) ||
        city.region.toLowerCase().includes(query)
      );
    }

    // Filter by region
    if (region) {
      filteredCities = filteredCities.filter(city => 
        city.region.toLowerCase().includes(region)
      );
    }

    // Sort by popularity
    filteredCities.sort((a, b) => b.popularity - a.popularity);

    // Limit results
    const limitedCities = filteredCities.slice(0, 20);

    return NextResponse.json({
      success: true,
      data: limitedCities,
      total: filteredCities.length,
    });
  } catch (error) {
    console.error("Cities API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
