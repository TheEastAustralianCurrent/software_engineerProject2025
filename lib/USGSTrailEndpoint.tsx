// /lib/USGSTrailEndpoint.ts

export default async function usgsTrails_API() {
  const response = await fetch(
    'https://partnerships.nationalmap.gov/arcgis/rest/services/USGSTrails/MapServer/0/query?where=1=1&outFields=*&f=json'
  );

  const data = await response.json();

  const trails = data.features?.map((feature: any) => {
    const attr = feature.attributes;
    return {
      id: attr.objectid,
      name: attr.name || "Unknown Trail",
      lengthMiles: attr.lengthmiles ?? "N/A",
    };
  }) ?? [];

  return trails;
}
