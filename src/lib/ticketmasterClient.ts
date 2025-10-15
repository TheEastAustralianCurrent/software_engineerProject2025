// areaEvents.ts
// Build a Ticketmaster events URL from free-text input (postal/city/state only)
// and fetch it using your exact try/catch pattern.

const tmKey = "AxXbvSaSd0AFFgqMUj0HpY9aMp1HIrTx";
const baseUrl = "https://app.ticketmaster.com/discovery/v2/events.json";
const commonParams = `countryCode=US&size=20&sort=relevance,desc&apikey=${tmKey}`;

// helpers
const isFiveDigitZip = (s: string) => /^\d{5}$/.test((s ?? "").trim());

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
function buildAreaEventsUrl(input: string) {
  const { city, stateCode, postalCode } = parseCityStateZip(input);

  let url = `${baseUrl}?${commonParams}`;
  if (postalCode && isFiveDigitZip(postalCode)) {
    url += `&postalCode=${encodeURIComponent(postalCode)}`;
  }
  if (city) {
    url += `&city=${encodeURIComponent(city)}`;
  }
  if (stateCode) {
    url += `&stateCode=${encodeURIComponent(stateCode)}`;
  }
  return url;
}

// --- public function (uses your fetch block exactly) ---
export default async function GET_area(input: string) {
  const url = buildAreaEventsUrl(input);

  try {
    const r = await fetch(url, { cache: "no-store" });
    const data = r.ok ? await r.json() : null;

    return data;
  } catch (e: any) {
    const body = JSON.stringify({
      ok: false,
      keyword: input,
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
