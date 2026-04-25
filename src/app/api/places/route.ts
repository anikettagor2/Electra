import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { lat, lng } = await request.json();
    const API_KEY = "AIzaSyAmvz5aTQ25Tf4_wYP1jdT55MSrPbaFkx8";

    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location",
      },
      body: JSON.stringify({
        textQuery: "government school OR gram panchayat OR municipal office",
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 5000.0,
          },
        },
        maxResultCount: 5,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}
