"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      // Use your style JSON URL here with the API key
      style: `https://api.maptiler.com/maps/streets/style.json?key=7o03ssUQYlzGmehxkpai`,
      center: [-75.1652, 39.9526], // PHL
      zoom: 10,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => map.resize());

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-96 rounded-lg overflow-hidden"
    />
  );
}
