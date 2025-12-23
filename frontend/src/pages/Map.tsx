import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from "react-router-dom";

import { getLine, getLines, type LineDetail } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

type FeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry>;

function buildGeo(lines: LineDetail[]) {
  const stationFeatures: GeoJSON.Feature[] = [];
  const lineFeatures: GeoJSON.Feature[] = [];

  const seenStations = new Set<number>();

  for (const line of lines) {
    const coords: [number, number][] = [];

    for (const s of line.stations) {
      if (typeof s.lon === "number" && typeof s.lat === "number") {
        coords.push([s.lon, s.lat]);

        if (!seenStations.has(s.id)) {
          seenStations.add(s.id);
          stationFeatures.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [s.lon, s.lat] },
            properties: {
              id: s.id,
              name: s.name,
              accessible: s.accessible,
            },
          });
        }
      }
    }

    if (coords.length >= 2) {
      lineFeatures.push({
        type: "Feature",
        geometry: { type: "LineString", coordinates: coords },
        properties: {
          id: line.id,
          code: line.code,
          name: line.name,
          colorHex: line.colorHex,
          status: line.status,
        },
      });
    }
  }

  const stations: FeatureCollection = {
    type: "FeatureCollection",
    features: stationFeatures,
  };

  const linesFc: FeatureCollection = {
    type: "FeatureCollection",
    features: lineFeatures,
  };

  return { stations, lines: linesFc };
}

export default function MapPage() {
    const navigate = useNavigate();

  const linesQuery = useQuery({
    queryKey: ["lines"],
    queryFn: getLines,
    staleTime: 30_000,
  });

  const lineIds = (linesQuery.data ?? []).map((l) => l.id);

  const detailsQuery = useQuery({
    queryKey: ["line-details", lineIds],
    queryFn: async () => {
      const details = await Promise.all(lineIds.map((id) => getLine(id)));
      return details as LineDetail[];
    },
    enabled: lineIds.length > 0,
    staleTime: 30_000,
  });

  const geo = useMemo(() => {
    return detailsQuery.data ? buildGeo(detailsQuery.data) : null;
  }, [detailsQuery.data]);

  // Center around Vigo-ish
  const initial = useMemo(
    () => ({ lng: -8.72, lat: 42.235, zoom: 12.2 }),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Network map</h1>
        <p className="text-muted-foreground">Stations and lines (fictional)</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[520px] w-full overflow-hidden rounded-xl border">
            <MapLibreView
              initial={initial}
              geo={geo}
              onStationClick={(stationId) => navigate(`/stations/${stationId}`)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MapLibreView({
  initial,
  geo,
  onStationClick,
}: {
  initial: { lng: number; lat: number; zoom: number };
  geo: { stations: FeatureCollection; lines: FeatureCollection } | null;
  onStationClick: (stationId: number) => void;
}) {

  // Simple imperative mount (no extra libs)
  return (
    <div
      id="metro-map"
      className="h-full w-full"
      ref={(el) => {
        if (!el) return;

        // prevent remount duplicates
        if ((el as any).__map) return;

        const map = new maplibregl.Map({
          container: el,
          style: "https://demotiles.maplibre.org/style.json",
          center: [initial.lng, initial.lat],
          zoom: initial.zoom,
        });

        (el as any).__map = map;

        map.addControl(new maplibregl.NavigationControl(), "top-right");

        map.on("load", () => {
          map.addSource("lines", {
            type: "geojson",
            data: geo?.lines ?? { type: "FeatureCollection", features: [] },
          });

          map.addSource("stations", {
            type: "geojson",
            data: geo?.stations ?? { type: "FeatureCollection", features: [] },
          });

          // Lines layer (colored per feature)
          map.addLayer({
            id: "lines-layer",
            type: "line",
            source: "lines",
            paint: {
              "line-width": 4,
              "line-opacity": 0.85,
              "line-color": ["get", "colorHex"],
            },
          });

          // Stations circles
          map.addLayer({
            id: "stations-layer",
            type: "circle",
            source: "stations",
            paint: {
              "circle-radius": 5,
              "circle-color": "#111827",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
            },
          });

          // Station labels
          map.addLayer({
            id: "stations-labels",
            type: "symbol",
            source: "stations",
            layout: {
              "text-field": ["get", "name"],
              "text-size": 12,
              "text-offset": [0, 1.1],
              "text-anchor": "top",
            },
            paint: {
              "text-color": "#111827",
              "text-halo-color": "#ffffff",
              "text-halo-width": 1,
            },
          });

          // Click station -> show popup (y luego lo conectamos a /stations/:id)
         map.on("click", "stations-layer", (e) => {
           const f = e.features?.[0];
           const rawId = (f?.properties as any)?.id;
           const stationId = Number(rawId);
           if (Number.isFinite(stationId)) onStationClick(stationId);
         });

          map.on("mouseenter", "stations-layer", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "stations-layer", () => {
            map.getCanvas().style.cursor = "";
          });
        });
      }}
    />
  );
}
