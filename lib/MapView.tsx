"use client";
import type { MapGeoJSONFeature } from "maplibre-gl";
import type { Point } from "geojson";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";


export default function MapView({ ticketmasterData }: any) {
  /*
  The venue address data is brought in through the main page.tsx by using the inputHomePage component
  This should hold the data for the addedress of the venues. Right now the data grabs the first element of the list
  It needs to be able to parse all venues in a list and plot them on the map
  I am logging the venues to see what data is being passed in
  The data should be an array of venue objects with address information
  */

  const eventsTicketmaster: Array<any> = ticketmasterData?._embedded?.events ?? [];
  const features: Array<any> = [];


  for (let i = 0; i < eventsTicketmaster.length; i++) {
    // Process each event here
    const event = eventsTicketmaster[i];

    const venues = event?._embedded?.venues ?? [];
    for (let j = 0; j < venues.length; j++) {
      const venueLoc = venues[j]?.location;
      if (!venueLoc || venueLoc.latitude == null || venueLoc.longitude == null)
        continue;

      // keep your feature shape; just use event + this venue
      const feature = {
        type: "Feature",
        properties: {
          description: `<strong>${event?.name ?? "Event"}</strong>` +
            (event?.url ? `<p><a href="${event.url}" target="_blank" rel="noreferrer">View details</a></p>` : ""),
          icon: "theatre"
        },
        geometry: {
          type: "Point",
          coordinates: [Number(venueLoc.longitude), Number(venueLoc.latitude)]
        }
      };
      features.push(feature);
      
    }
    
  }
  console.log(features)

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    /*
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      // Use your style JSON URL here with the API key
      style: `https://api.maptiler.com/maps/streets/style.json?key=7o03ssUQYlzGmehxkpai`,
      center: [-75.1652, 39.9526], // PHL
      zoom: 10,
    });
    */
    
    const map = new maplibregl.Map({
      container: mapContainerRef.current,     
      style: "https://api.maptiler.com/maps/streets/style.json?key=7o03ssUQYlzGmehxkpai",
      center: [Number(eventsTicketmaster[0]?._embedded?.venues[0]?.location.longitude) || -118.23365, Number(eventsTicketmaster[0]?._embedded?.venues[0]?.location.latitude) || 34.04898],
      zoom: 11.15,
    });
    // Add navigation control (the +/- zoom buttons)
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on('load', () => {
        map.addSource('places', {
            //CODE below needs to be changed to uses the venues data passed in from ticketmaster.
            //Also needs to be changed for other dat we bring in here like weather, airports, trails etc
            //Right now it is hard coded data for testing purposes
            //Once I get the data from ticketmaster and other sources I will need to parse the data into geojson format
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': features
            }
        });

        //add a layer showing the plac
        map.addLayer({
          id: "places",
          type: "circle",
          source: "places",
          paint: {
            "circle-radius": 6,
            "circle-color": "#3b82f6"
          }
      });

        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on("click", "places", (e) => {
          const f = (e.features?.[0] as MapGeoJSONFeature | undefined);
          if (!f || f.geometry.type !== "Point") return;

          const coords = (f.geometry as Point).coordinates.slice() as [number, number];
          const props = f.properties as { description?: string; title?: string; url?: string };

          new maplibregl.Popup()
            .setLngLat(coords)
            .setHTML(props.description ?? props.title ?? "")
            .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', () => {
            map.getCanvas().style.cursor = '';
        });
    });

    return () => map.remove();
  }, [ticketmasterData]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-96 rounded-lg overflow-hidden"
    />
  );
}
