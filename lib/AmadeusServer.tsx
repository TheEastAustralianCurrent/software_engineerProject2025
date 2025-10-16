/*
const isProd = process.env.AMADEUS_ENV === "production";
const BASE = isProd ? "https://api.amadeus.com" : "https://test.api.amadeus.com";

let cached: { token: string; exp: number } | null = null;

export default async function getAmadeusToken() {
  const data = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'rhBeLHGcQPPZ5AJteZGr0qHmGw3kC1rT',
        client_secret: 'EqTMmNYdfjY1cW4A'
      }).toString(),
    }
  )

  if (!data.ok) throw new Error(`Auth failed: ${data.status} ${await data.text()}`);
  const { access_token, expires_in } = await data.json();
  cached = { token: access_token, exp: Date.now() + expires_in * 1000 };
  return <data value="" className="access_token"></data>;
}
*/

export async function getAmadeusToken(): Promise<{ access_token: string }> {
  const data = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'rhBeLHGcQPPZ5AJteZGr0qHmGw3kC1rT',
        client_secret: 'EqTMmNYdfjY1cW4A'
      }).toString(),
    }
  )
  

  const posts = await data.json()
  return posts.access_token
  
}

export default async function amadeusGet() {
  const token = await getAmadeusToken();
  const base = 'https://test.api.amadeus.com';
  const path = '/v1/reference-data/locations/hotels/by-city';
  const cityCode: string = 'cityCode=NYC';
  const radius: number = 5;                
  const radiusParam = `radius=${radius}`;
  const res = await fetch(`${base}${path}?${cityCode}&${radiusParam}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = await res.json();
  console.log(payload);
  return payload;
}