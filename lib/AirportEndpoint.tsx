import { NextResponse } from 'next/server';

export default async function airportGET() {

const url = 'https://api.api-ninjas.com/v1/airlines?name=AA';

 try {
    const response = await fetch(url, {
      headers: {"X-Api-Key": "3ZIqlcCPAb1Hk5UuWFhgbw==aNQOSNofDa2l5gRX"}
    });
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
