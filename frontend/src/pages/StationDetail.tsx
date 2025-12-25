import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStation, getNextArrivals, getStationLines, type Line } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import TrainTicker from "../components/TrainTicker";

import { Bike, Info, Toilet, ParkingSquare, ArrowUpDown } from "lucide-react";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";

function StationMiniMap({
  lon,
  lat,
  name,
}: {
  lon: number;
  lat: number;
  name: string;
}) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!elRef.current) return;

    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: elRef.current,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [lon, lat],
        zoom: 14.5,
        interactive: true,
      });

      map.addControl(new maplibregl.NavigationControl({ showZoom: true }), "top-right");

      const marker = new maplibregl.Marker({ color: "#2563EB" })
        .setLngLat([lon, lat])
        .setPopup(new maplibregl.Popup({ offset: 16 }).setText(name))
        .addTo(map);

      mapRef.current = map;
      markerRef.current = marker;
    }

    mapRef.current.setCenter([lon, lat]);
    markerRef.current?.setLngLat([lon, lat]);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [lon, lat, name]);

  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <div ref={elRef} className="h-[220px] w-full" />
    </div>
  );
}

function FacilityPill({
  ok,
  label,
  Icon,
}: {
  ok: boolean | null | undefined;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const { t } = useTranslation(["stationDetail", "common"]);
  const isOn = ok === true;

  return (
    <div
      title={label}
      className={`
        flex items-center gap-2 rounded-xl border px-3 py-2
        ${isOn ? "bg-background/70" : "bg-muted/30"}
      `}
      aria-label={t("stationDetail:facilities.aria", {
        label,
        status: isOn ? t("stationDetail:facilities.available") : t("stationDetail:facilities.notAvailable"),
      })}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />

      <span
        className={`
          ml-auto text-xs font-medium
          ${isOn ? "text-emerald-600" : "text-muted-foreground"}
        `}
      >
        {isOn ? t("stationDetail:facilities.yes") : t("stationDetail:facilities.no")}
      </span>
    </div>
  );
}

export default function StationDetail() {
  const { t } = useTranslation(["stationDetail", "common"]);

  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["station", id],
    queryFn: () => getStation(id),
    enabled: Number.isFinite(id),
  });

  const arrivalsQuery = useQuery({
    queryKey: ["arrivals", data?.id],
    queryFn: () => getNextArrivals(data!.id),
    enabled: !!data,
    refetchInterval: 30_000,
  });

  const linesServingQuery = useQuery({
    queryKey: ["station-lines", data?.id],
    queryFn: () => getStationLines(data!.id),
    enabled: !!data,
    staleTime: 30_000,
  });

  return (
    <div className="space-y-6">
      {isLoading && <Card className="h-[160px] animate-pulse" />}

      {error && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">
              {t("stationDetail:notFound")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {(error as Error).message}
          </CardContent>
        </Card>
      )}

      {data && (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
            <p className="text-muted-foreground">{t("stationDetail:subtitle")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {t("stationDetail:accessAndServices.title")}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* ACCESSIBILITY */}
                <div className="rounded-xl border border-border/50 bg-background/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t("stationDetail:accessAndServices.accessibility.label")}
                      </div>

                      <div className="mt-1 text-base font-semibold">
                        {data.accessible
                          ? t("stationDetail:accessAndServices.accessibility.titleAccessible")
                          : t("stationDetail:accessAndServices.accessibility.titleLimited")}
                      </div>

                      <div className="mt-1 text-sm text-muted-foreground">
                        {data.accessible
                          ? t("stationDetail:accessAndServices.accessibility.descAccessible")
                          : t("stationDetail:accessAndServices.accessibility.descLimited")}
                      </div>
                    </div>

                    <Badge
                      variant={data.accessible ? "secondary" : "outline"}
                      className="shrink-0"
                    >
                      {data.accessible
                        ? t("stationDetail:accessAndServices.accessibility.badgeAccessible")
                        : t("stationDetail:accessAndServices.accessibility.badgeLimited")}
                    </Badge>
                  </div>
                </div>

                {/* FACILITIES */}
                <div>
                  <div className="mb-2 text-xs font-medium text-muted-foreground">
                    {t("stationDetail:accessAndServices.facilities.title")}
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <FacilityPill ok={(data as any).hasElevator} label={t("stationDetail:facilities.labels.elevator")} Icon={ArrowUpDown} />
                    <FacilityPill ok={(data as any).hasToilets} label={t("stationDetail:facilities.labels.toilets")} Icon={Toilet} />
                    <FacilityPill ok={(data as any).hasInfoPoint} label={t("stationDetail:facilities.labels.info")} Icon={Info} />
                    <FacilityPill ok={(data as any).hasEBikes} label={t("stationDetail:facilities.labels.ebikes")} Icon={Bike} />
                    <FacilityPill ok={(data as any).hasBikeParking} label={t("stationDetail:facilities.labels.bikeParking")} Icon={ParkingSquare} />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  {t("stationDetail:accessAndServices.disclaimer")}
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 border border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {t("stationDetail:location.title")}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {data.lat && data.lon ? (
                  <>
                    <div className="text-sm text-muted-foreground">
                      {data.lat.toFixed(5)}, {data.lon.toFixed(5)}
                    </div>

                    <StationMiniMap lat={data.lat} lon={data.lon} name={data.name} />

                    <div className="flex gap-2">
                      <a
                        className="text-xs underline text-muted-foreground hover:text-foreground"
                        href={`https://www.google.com/maps?q=${data.lat},${data.lon}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("stationDetail:location.openGoogleMaps")}
                      </a>

                      <span className="text-xs text-muted-foreground">·</span>

                      <a
                        className="text-xs underline text-muted-foreground hover:text-foreground"
                        href={`https://www.openstreetmap.org/?mlat=${data.lat}&mlon=${data.lon}#map=17/${data.lat}/${data.lon}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("stationDetail:location.openOSM")}
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t("stationDetail:location.noCoordinates")}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {t("stationDetail:nextTrains.title")}
              </CardTitle>

              <div className="text-xs text-muted-foreground">
                {arrivalsQuery.isFetching
                  ? t("stationDetail:nextTrains.updating")
                  : t("stationDetail:nextTrains.updated")}
              </div>
            </CardHeader>

            <div className="px-6 pb-4">
              <TrainTicker />
            </div>

            <CardContent className="space-y-2">
              {arrivalsQuery.isLoading && (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-14 rounded bg-muted animate-pulse" />
                    </div>
                  ))}
                </div>
              )}

              {arrivalsQuery.isError && (
                <div className="text-sm text-destructive">
                  {(arrivalsQuery.error as Error).message}
                </div>
              )}

              {!arrivalsQuery.isLoading && !!arrivalsQuery.data?.length && (
                <div className="divide-y rounded-xl border">
                  {arrivalsQuery.data.map((a) => {
                    const minutes = a.minutes;
                    const isArriving = minutes <= 1;

                    return (
                      <div
                        key={`${a.lineCode}-${a.direction}`}
                        className="flex items-center justify-between px-4 py-3 text-sm"
                      >
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {a.lineCode}{" "}
                            <span className="text-muted-foreground font-normal">
                              → {a.direction}
                            </span>
                          </div>
                        </div>

                        <div className="tabular-nums font-semibold">
                          {isArriving
                            ? t("stationDetail:nextTrains.arriving")
                            : t("stationDetail:nextTrains.inMinutes", { minutes })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!arrivalsQuery.isLoading && !arrivalsQuery.data?.length && (
                <div className="text-sm text-muted-foreground">
                  {t("stationDetail:nextTrains.none")}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("stationDetail:linesServing.title")}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {linesServingQuery.isLoading && (
                <div className="text-sm text-muted-foreground">
                  {t("stationDetail:linesServing.loading")}
                </div>
              )}

              {linesServingQuery.isError && (
                <div className="text-sm text-destructive">
                  {(linesServingQuery.error as Error).message}
                </div>
              )}

              {!!linesServingQuery.data?.length && (
                <div className="flex flex-wrap gap-2">
                  {linesServingQuery.data.map((l: Line) => (
                    <Link
                      key={l.id}
                      to={`/lines/${l.id}`}
                      className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm hover:bg-muted/50 transition"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: l.colorHex }}
                      />
                      <span className="font-medium">{l.code}</span>
                      <span className="text-muted-foreground truncate max-w-[26ch]">
                        {l.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {!linesServingQuery.isLoading && !linesServingQuery.data?.length && (
                <div className="text-sm text-muted-foreground">
                  {t("stationDetail:linesServing.none")}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
