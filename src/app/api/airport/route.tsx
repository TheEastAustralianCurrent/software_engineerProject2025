import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=PHL&flight_status=active`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API request failed: ${res.status}`);
    const data = await res.json();
    
    console.log(data); // thêm để debug xem API trả gì
    return NextResponse.json(data.data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
