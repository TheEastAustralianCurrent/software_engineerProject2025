"use client"; // must be first line for client-side rendering

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import ticketmaster_API from "../../lib/ticketmasterDiscoveryEndpoint";
import usgsTrails_API from "../../lib/USGSTrailEndpoint";

export default function Home() {
  const [eventData, setEventData] = useState<any>(null);
  const [trails, setTrails] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTrails, setLoadingTrails] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(true);

  // Map container reference
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Fetch events, trails, flights
  useEffect(() => {
    async function fetchEvents() {
      const data = await ticketmaster_API();
      setEventData(data);
      setLoadingEvents(false);
    }

    async function fetchTrails() {
      const data = await usgsTrails_API();
      setTrails(data);
      setLoadingTrails(false);
    }

    async function fetchFlights() {
      try {
        const res = await fetch("/api/flights");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setFlights(data);
      } catch (err) {
        console.error("Failed to fetch flights:", err);
        setFlights([]);
      } finally {
        setLoadingFlights(false);
      }
    }

    fetchFlights();
    fetchEvents();
    fetchTrails();
  }, []);

  // Initialize MapLibre map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
      center: [-75.1652, 39.9526], // Philadelphia
      zoom: 10,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => console.log("Map loaded!"));

    return () => map.remove();
  }, []);

  if (loadingEvents || loadingTrails) return <div>Loading data...</div>;

  const event = eventData;
  const venue = event?._embedded?.venues?.[0];

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="max-w-4xl mx-auto space-y-12">
        {/* Ticketmaster Event */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-4">{event?.name}</h1>
          <p className="mt-4">{event?.info}</p>
          <p className="mt-4">
            <strong>Date:</strong> {event?.dates?.start?.localDate} at{" "}
            {event?.dates?.start?.localTime}
          </p>
          {venue && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Venue</h2>
              <p>{venue.name}</p>
              <p>
                {venue.address?.line1}, {venue.city?.name},{" "}
                {venue.state?.stateCode}
              </p>
              <a
                href={venue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Venue Info
              </a>
            </div>
          )}
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Buy Tickets
          </a>
        </section>

        {/* USGS Trails */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">USGS Trails</h2>
          <ul className="list-disc list-inside space-y-1 max-h-96 overflow-y-auto">
            {trails.map((trail) => (
              <li key={trail.id}>
                {trail.name} — {trail.lengthMiles} miles
              </li>
            ))}
          </ul>
        </section>

        {/* Airport Flights */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Flights departing PHL</h2>

          {loadingFlights ? (
            <div>Loading flights...</div>
          ) : flights.length === 0 ? (
            <div>No flights found.</div>
          ) : (
            <ul className="list-disc list-inside space-y-2 max-h-96 overflow-y-auto">
              {flights.map((f: any, i: number) => (
                <li key={i}>
                  ✈️ <strong>{f.airline?.name || "Unknown Airline"}</strong> —{" "}
                  Flight {f.flight?.number || "N/A"} ({f.flight?.iata || "?"}) →{" "}
                  {f.arrival?.iata || "?"} ({f.arrival?.airport || "Unknown"})
                  <br />
                  🕒 Depart: {f.departure?.scheduled || "N/A"} | Arrive:{" "}
                  {f.arrival?.scheduled || "N/A"}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* MapLibre Map */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Map View (PHL Area)</h2>
          <div
            ref={mapContainerRef}
            className="w-full h-96 rounded-lg"
            style={{ overflow: "hidden" }}
          />
        </section>
      </main>
    </div>
  );
}
