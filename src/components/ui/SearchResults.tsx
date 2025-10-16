"use client";

import { useState, useMemo } from "react";

type Item = any;

type SearchResultsProps = {
  items: Item[];
  type: "event" | "flight" | "trail";
};

export function SearchResults({ items, type }: SearchResultsProps) {
  const [sortOption, setSortOption] = useState("name");
  const [descending, setDescending] = useState(false);

  const sortedItems = useMemo(() => {
    let sorted = [...items];

    if (type === "event") {
      if (sortOption === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
      if (sortOption === "date")
        sorted.sort(
          (a, b) =>
            new Date(a.dates?.start?.localDate).getTime() -
            new Date(b.dates?.start?.localDate).getTime()
        );
      if (sortOption === "city")
        sorted.sort((a, b) =>
          (a._embedded?.venues?.[0]?.city?.name || "").localeCompare(
            b._embedded?.venues?.[0]?.city?.name || ""
          )
        );
    }

    if (type === "flight") {
      if (sortOption === "airline")
        sorted.sort((a, b) => (a.airline?.name || "").localeCompare(b.airline?.name || ""));
      if (sortOption === "flightNumber")
        sorted.sort((a, b) => (a.flight?.number || "").localeCompare(b.flight?.number || ""));
      if (sortOption === "departure")
        sorted.sort(
          (a, b) =>
            new Date(a.departure?.scheduled).getTime() -
            new Date(b.departure?.scheduled).getTime()
        );
    }

    if (type === "trail") {
      if (sortOption === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
      if (sortOption === "length") sorted.sort((a, b) => a.lengthMiles - b.lengthMiles);
    }

    if (descending) sorted.reverse();
    return sorted;
  }, [items, sortOption, descending, type]);

  // Options for the select dropdown depending on type
  const sortOptions =
    type === "event"
      ? [
          { label: "Name", value: "name" },
          { label: "Date", value: "date" },
          { label: "City", value: "city" },
        ]
      : type === "flight"
      ? [
          { label: "Airline", value: "airline" },
          { label: "Flight Number", value: "flightNumber" },
          { label: "Departure", value: "departure" },
        ]
      : [
          { label: "Name", value: "name" },
          { label: "Length", value: "length" },
        ];

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded p-2 bg-gray-50 dark:bg-gray-700"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={descending}
            onChange={() => setDescending(!descending)}
            className="mr-2"
          />
          Descending
        </label>
      </div>

      <ul className="space-y-3 max-h-96 overflow-y-auto">
        {sortedItems.map((item: any, i) => {
          if (type === "event")
            return (
              <li
                key={item.id}
                className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900"
              >
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p>
                  📅 {item.dates?.start?.localDate || "N/A"}{" "}
                  {item.dates?.start?.localTime && `(${item.dates.start.localTime})`}
                </p>
                <p>
                  📍 {item._embedded?.venues?.[0]?.name},{" "}
                  {item._embedded?.venues?.[0]?.city?.name || "N/A"}
                </p>
              </li>
            );

          if (type === "flight")
            return (
              <li
                key={i}
                className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900"
              >
                ✈️ <strong>{item.airline?.name || "Unknown Airline"}</strong> — Flight{" "}
                {item.flight?.number || "N/A"} ({item.flight?.iata || "?"})
                <br />
                🛫 Depart: {item.departure?.scheduled || "N/A"} (Terminal:{" "}
                {item.departure?.terminal || "N/A"}, Gate: {item.departure?.gate || "N/A"})
                <br />
                🛬 Arrive: {item.arrival?.scheduled || "N/A"} at{" "}
                {item.arrival?.airport || "Unknown"} (Terminal: {item.arrival?.terminal || "N/A"}, Gate:{" "}
                {item.arrival?.gate || "N/A"})
              </li>
            );

          if (type === "trail")
            return (
              <li
                key={item.id}
                className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900"
              >
                {item.name} — {item.lengthMiles} miles
              </li>
            );

          return null;
        })}
      </ul>
    </section>
  );
}
