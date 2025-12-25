import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getStation } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getNextArrivals, type NextArrival } from "../lib/api";
import TrainTicker from "../components/TrainTicker";
import { getStationLines, type Line } from "../lib/api";
import { Link } from "react-router-dom";

import { BadgeCheck, BadgeX, Bike, Info, Toilet, ParkingSquare, ArrowUpDown } from "lucide-react";

export default function StationDetail() {
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

function FacilityPill({
  ok,
  label,
  Icon,
}: {
  ok: boolean | null | undefined;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const isOn = ok === true;

  return (
    <div
     title={`${label}`}
      className={`
        flex items-center gap-2 rounded-xl border px-3 py-2
        ${isOn ? "bg-background/70" : "bg-muted/30"}
      `}
      aria-label={`${label}: ${isOn ? "available" : "not available"}`}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />

      <span
        className={`
          ml-auto text-xs font-medium
          ${isOn ? "text-emerald-600" : "text-muted-foreground"}
        `}
      >
        {isOn ? "Sí" : "No"}
      </span>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {isLoading && <Card className="h-[160px] animate-pulse" />}

      {error && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Station not found</CardTitle>
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
            <p className="text-muted-foreground">Station details</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Accesibilidad y servicios</CardTitle>
              </CardHeader>

            <CardContent className="space-y-5">

              {/* ACCESIBILIDAD */}
              <div className="rounded-xl border border-border/50 bg-background/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Accesibilidad</div>
                    <div className="mt-1 text-base font-semibold">
                      {data.accessible ? "Acceso sin escalones" : "Acceso limitado"}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {data.accessible
                        ? "Apta para movilidad reducida en la mayor parte del recorrido."
                        : "Puede requerir escaleras o tramos sin rampa o ascensor."}
                    </div>
                  </div>

                  <Badge
                    variant={data.accessible ? "secondary" : "outline"}
                    className="shrink-0"
                  >
                    {data.accessible ? "Accessible" : "Limited"}
                  </Badge>
                </div>
              </div>

              {/* SERVICIOS */}
              <div>
                <div className="mb-2 text-xs font-medium text-muted-foreground">
                  Servicios en la estación
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <FacilityPill ok={(data as any).hasElevator} label="Ascensor" Icon={ArrowUpDown} />
                  <FacilityPill ok={(data as any).hasToilets} label="Baños" Icon={Toilet} />
                  <FacilityPill ok={(data as any).hasInfoPoint} label="Info" Icon={Info} />
                  <FacilityPill ok={(data as any).hasEBikes} label="e-Bikes" Icon={Bike} />
                  <FacilityPill ok={(data as any).hasBikeParking} label="Parking bicis" Icon={ParkingSquare} />
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Datos orientativos para el proyecto ficticio Metro Vigo.
              </div>
            </CardContent>

            </Card>

            <Card className="sm:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Coordinates</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {data.lat && data.lon ? `${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}` : "No coordinates yet"}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Next trains</CardTitle>

              <div className="text-xs text-muted-foreground">
                {arrivalsQuery.isFetching ? "Updating…" : "Updated"}
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
                    const soon = minutes <= 3;
                    const long = minutes >= 10;

                    const rightClass = isArriving
                      ? "text-emerald-700"
                      : long
                      ? "text-muted-foreground"
                      : soon
                      ? "text-amber-700"
                      : "text-foreground";

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

                        <div className={`tabular-nums font-semibold ${rightClass}`}>
                          {isArriving ? "Arriving" : `${minutes} min`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!arrivalsQuery.isLoading && !arrivalsQuery.data?.length && (
                <div className="text-sm text-muted-foreground">No upcoming trains.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lines serving this station</CardTitle>
            </CardHeader>

            <CardContent>
              {linesServingQuery.isLoading && (
                <div className="text-sm text-muted-foreground">Loading lines…</div>
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
                <div className="text-sm text-muted-foreground">No lines found.</div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
