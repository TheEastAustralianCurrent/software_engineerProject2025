// No NextResponse import
/*
This fetch is for the search bar inside of the file inputHomePage.tsx
It is called when the user submits a search query.
returns 20 events(number might chaange or data pulled might change) 
with the address of the events for the map.
*/
export default async function GET(search: string) {


  const url = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&keyword=${encodeURIComponent(search)}&apikey=AxXbvSaSd0AFFgqMUj0HpY9aMp1HIrTx`;

  try {
    const r = await fetch(url, { cache: "no-store" });
    const data = r.ok ? await r.json() : null;

    return data
  } catch (e: any) {
    const body = JSON.stringify({
      ok: false,
      keyword: search,
      url,
      error: e?.message || "fetch failed",
      data: { _embedded: { events: [] } }, // placeholder on error
    });
    return new Response(body, {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
}
