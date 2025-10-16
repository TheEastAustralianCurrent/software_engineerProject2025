const tmKey = "AxXbvSaSd0AFFgqMUj0HpY9aMp1HIrTx";
const baseUrl = "https://app.ticketmaster.com/discovery/v2/events.json";
const commonParams =  `countryCode=US&size=100&sort=relevance,desc&apikey=${tmKey}`;

//currently nor using this functino but might use it later
//Function to search isFiveDigitZip searches by zip code if the input is a 5 digit zip code
//const isFiveDigitZip = (s: string) => /^\d{5}$/.test((s ?? "").trim());

// Parse: "City, ST [ZIP]" or "City ST [ZIP]" or just "ZIP" or just "City"
function parseCityStateZip(raw: string) {
  const s = (raw ?? "").trim();

  // find a ZIP anywhere
  const zipMatch = s.match(/\b\d{5}\b/);
  const postalCode = zipMatch ? zipMatch[0] : undefined;

  // if it has a comma, assume "City, ST ..."
  const parts = s.split(",").map(p => p.trim());
  let city: string | undefined;
  let stateCode: string | undefined;

  if (parts.length >= 2) {
    city = parts[0] || undefined;
    const right = parts.slice(1).join(" "); // ST [ZIP...]
    const st = right.match(/\b[A-Za-z]{2}\b/);
    stateCode = st ? st[0].toUpperCase() : undefined;
  } else {
    // no comma → maybe "City ST" or just "City" or just "ZIP"
    const tokens = s.split(/\s+/);
    const maybeST = tokens[tokens.length - 1];
    if (/^[A-Za-z]{2}$/.test(maybeST)) {
      stateCode = maybeST.toUpperCase();
      city = tokens.slice(0, -1).join(" ").replace(/\b\d{5}\b/g, "").trim() || undefined;
    } else if (!postalCode) {
      city = s || undefined;
    }
  }

  // clean any stray zip from city
  if (city) city = city.replace(/\b\d{5}\b/g, "").trim() || undefined;

  return { city, stateCode, postalCode };
}

// Build the URL by appending ONLY params the user provided.
function buildEventsUrl(params: { city?: string; stateCode?: string; postalCode?: string; size?: number; page?: number }) {
  const size = Math.max(1, Math.min(params.size ?? 100, 500));
  const page = Math.max(0, params.page ?? 0);

  let url = `${baseUrl}?countryCode=US&size=${size}&page=${page}&sort=relevance,desc&apikey=${tmKey}`;
  if (params.postalCode) url += `&postalCode=${encodeURIComponent(params.postalCode)}`;
  if (params.city) url += `&city=${encodeURIComponent(params.city)}`;
  if (params.stateCode) url += `&stateCode=${encodeURIComponent(params.stateCode)}`;
  return url;
}

// small helper to fetch one page safely
async function fetchPage(url: string) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) return null;
  try {
    return await r.json();
  } catch {
    return null;
  }
}

// --- public function (same signature); now with pagination + aggregation ---
export default async function GET_area(input: string) {
  // parse the input string into city/state/postalCode params
  const params = parseCityStateZip(input);

  // you can tweak these two to stress-test:
  const pageSize = 100;   // TM often caps at ~100 per page even if you ask for 500
  const maxPages = 5;     // hard stop so you don’t overfetch (100 * 5 = ~500 events)

  // first page
  const firstUrl = buildEventsUrl({ ...params, size: pageSize, page: 0 });

  try {
    const first = await fetchPage(firstUrl);
    if (!first) {
      // keep your Response-on-error shape
      const body = JSON.stringify({
        ok: false,
        keyword: input,
        url: firstUrl,
        error: "fetch failed",
        data: { _embedded: { events: [] } },
      });
      return new Response(body, {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    const totalPages = Math.max(1, first?.page?.totalPages ?? 1);
    const events: any[] = first?._embedded?.events ?? [];

    // pull subsequent pages up to maxPages or server-reported total
    const pagesToGet = Math.min(maxPages, totalPages) - 1; // we already fetched page 0
    for (let p = 1; p <= pagesToGet; p++) {
      const url = buildEventsUrl({ ...params, size: pageSize, page: p });
      const data = await fetchPage(url);
      const batch = data?._embedded?.events ?? [];
      if (batch.length === 0) break;
      events.push(...batch);
    }

    // build a single, stable TM-like payload with all collected events
    const combined = {
      //use the same shape as Ticketmaster’s response and use ...first to copy other metadata
      //but overwrite _embedded.events with our combined list
      //and adjust page info to reflect what we actually collected
      ...first,
      _embedded: { events },
      page: {
        // reflect what we actually collected so your logs make sense
        size: pageSize,
        number: 0,
        totalElements: first?.page?.totalElements ?? events.length,
        totalPages: first?.page?.totalPages ?? 1,
      },
    };

    return combined;

  } catch (e: any) {
    const body = JSON.stringify({
      ok: false,
      keyword: input,
      url: buildEventsUrl({ ...params, size: pageSize, page: 0 }),
      error: e?.message || "fetch failed",
      data: { _embedded: { events: [] } }, // placeholder on error
    });
    return new Response(body, {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
}
