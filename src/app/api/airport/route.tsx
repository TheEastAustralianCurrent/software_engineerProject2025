import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Example: fetching flights from an external API
    const externalRes = await fetch("https://api.example.com/flights?airport=PHL", {
      headers: {
        "Authorization": `Bearer ${process.env.AIRPORT_API_KEY}`,
      },
    });

    if (!externalRes.ok) {
      const text = await externalRes.text();
      console.error("External API failed:", externalRes.status, text);
      return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 });
    }

    const data = await externalRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
