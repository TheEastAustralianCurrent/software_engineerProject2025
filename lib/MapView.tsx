"use client";
import type { MapGeoJSONFeature } from "maplibre-gl";
import type { Point } from "geojson";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Format a short event list for the popup (name + date, link if available)
function formatEventList(events: any[]) {
  // show up to 5, then “+N more”
  const shown = events.slice(0, 5);
  const items = shown.map((e: any) => {
    const name = e?.name ?? "Event";
    const date = e?.dates?.start?.localDate ?? "";
    const time = e?.dates?.start?.localTime ?? "";
    const when = [date, time].filter(Boolean).join(" ");
    const linkOpen = e?.url ? `<a href="${e.url}" target="_blank" rel="noreferrer">` : "";
    const linkClose = e?.url ? `</a>` : "";
    return `<li>${linkOpen}${name}${linkClose}${when ? ` — <span>${when}</span>` : ""}</li>`;
  });

  const more = events.length > shown.length ? `<li>+${events.length - shown.length} more…</li>` : "";
  return `<ul style="margin:0; padding-left:1rem;">${items.join("")}${more}</ul>`;
}

export default function MapView({ ticketmasterData }: any) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Gather events and group by venue (bucket)
    const eventsTicketmaster: Array<any> = ticketmasterData?._embedded?.events ?? [];
    const buckets = new Map<string, { venue: any; events: any[] }>();

    for (let i = 0; i < eventsTicketmaster.length; i++) {
      const event = eventsTicketmaster[i];
      const venues = event?._embedded?.venues ?? [];
      for (let j = 0; j < venues.length; j++) {
        const venue = venues[j];
        const venueLoc = venue?.location;
        if (!venueLoc || venueLoc.latitude == null || venueLoc.longitude == null) continue;

        const vid = venue.id || `${venueLoc.longitude},${venueLoc.latitude}`; // fallback key
        const bucket = buckets.get(vid) ?? { venue, events: [] };
        bucket.events.push(event);
        buckets.set(vid, bucket);
      }
    }

    // Build GeoJSON features from buckets
    const features = Array.from(buckets.values()).map(({ venue, events }) => ({
      type: "Feature" as const,
      properties: {
          description:
                `<strong>${venue.name ?? "Venue"}</strong>
                <p>${events.length} event(s) here</p>
                ${formatEventList(events)}`,      
      },
      geometry: {
        type: "Point" as const,
        coordinates: [Number(venue.location?.longitude), Number(venue.location?.latitude)],
      },
    })) as import("geojson").Feature<import("geojson").Point, import("geojson").GeoJsonProperties>[];

    const [lng, lat] = (features[0]?.geometry?.coordinates as [number, number]) || [0, 0];

    const map = new maplibregl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      style: "https://api.maptiler.com/maps/streets/style.json?key=7o03ssUQYlzGmehxkpai",
      center: [lng || 0, lat || 0],
      zoom: 11.15,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("places", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features,
        },
      });

      // add a layer showing the places
      map.addLayer({
        id: "places",
        type: "circle",
        source: "places",
        paint: {
          "circle-radius": 6,
          "circle-color": "#3b82f6",
        },
      });

      // When a click event occurs on a feature in the places layer, open a popup.
      map.on("click", "places", (e) => {
        const f = e.features?.[0] as MapGeoJSONFeature | undefined;
        if (!f || f.geometry.type !== "Point") return;

        const coords = (f.geometry as Point).coordinates.slice() as [number, number];
        const props = f.properties as { description?: string; title?: string; url?: string };

        new maplibregl.Popup()
          .setLngLat(coords)
          .setHTML(props.description ?? props.title ?? "")
          .addTo(map);
      });

      map.on("mouseenter", "places", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    // Clean up map on re-render/unmount
    return () => {
      map.remove();
    };
  }, [ticketmasterData]); // rebuild when ticketmasterData changes

  return <div ref={mapContainerRef} className="w-full h-96 rounded-lg overflow-hidden" />;
}
