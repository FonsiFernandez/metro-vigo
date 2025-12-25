import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getStation } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getNextArrivals, type NextArrival } from "../lib/api";
import TrainTicker from "../components/TrainTicker";
import { getStationLines, type Line } from "../lib/api";
import { Link } from "react-router-dom";

import { BadgeCheck, BadgeX, Bike, Info, Toilet, Elevator, ParkingSquare } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

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
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={data.accessible ? "secondary" : "outline"}>
                  {data.accessible ? "Accessible" : "Limited"}
                </Badge>
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
