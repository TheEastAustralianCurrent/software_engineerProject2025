"use client";

import React, { useEffect, useState } from "react";
import ticketmaster_API from "../../lib/ticketmasterDiscoveryEndpoint";
import usgsTrails_API from "../../lib/USGSTrailEndpoint";

export default function Home() {
  const [eventData, setEventData] = useState<any>(null);
  const [trails, setTrails] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTrails, setLoadingTrails] = useState(true);

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

    fetchEvents();
    fetchTrails();
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
            <strong>Date:</strong> {event?.dates?.start?.localDate} at {event?.dates?.start?.localTime}
          </p>
          {venue && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Venue</h2>
              <p>{venue.name}</p>
              <p>
                {venue.address?.line1}, {venue.city?.name}, {venue.state?.stateCode}
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
      </main>
    </div>
  );
}
