import { NextResponse } from 'next/server';

export default async function GET() {

const url = 'https://api.api-ninjas.com/v1/airlines?name=aa';


 try {
    const response = await fetch(url, {
      headers: {"X-Api-Key": "t6P0C4B3VqmnfBUXOcPO8A==ov1zN3LpDwFcIMS8"}
    });
    const data = await response.json();
    console.log (data)
    return (data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}