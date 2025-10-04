import { useState } from "react";
import ticketmaster_API from "../../lib/ticketmasterDiscoveryEndpoint";
import usgsTrails_API from "../../lib/USGSTrailEndpoint";
import airport_API from "../../lib/AirportEndpoint";

export default function Home() {
  const [airport, setAirport] = useState<any>(null);
  const [code, setCode] = useState("PHL");

  const fetchAirport = async () => {
    const res = await fetch(`/api/airport?code=${code}`);
    const data = await res.json();
    setAirport(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Airport API Demo</h1>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Enter airport code (e.g., HAN, SGN, JFK)"
      />
      <button onClick={fetchAirport}>Fetch Data</button>

      {airport && (
        <div style={{ marginTop: "20px" }}>
          <h2>{airport.name}</h2>
          <p><b>City:</b> {airport.municipality}</p>
          <p><b>Country:</b> {airport.iso_country}</p>
          <p><b>Latitude:</b> {airport.latitude}</p>
          <p><b>Longitude:</b> {airport.longitude}</p>
        </div>
      )}
    </div>
  );
}