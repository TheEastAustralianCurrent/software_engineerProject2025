import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = '3539583bcadab931f58f5c2a0ddba30a';
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=PHL&flight_status=active`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("Aviationstack error:", text);
      throw new Error(`API request failed: ${res.status}`);
    }

    const data = await res.json();
    console.log("Flights data:", data); // Debug data structure
     console.log(JSON.stringify(data, null, 2));
    return NextResponse.json(data.data || []);
  } catch (err: any) {
    console.error("API route error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
