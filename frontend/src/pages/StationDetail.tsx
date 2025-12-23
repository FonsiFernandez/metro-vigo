import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getStation } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { getNextArrivals, type NextArrival } from "../lib/api";

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
            <CardHeader>
              <CardTitle className="text-base">Next trains</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {arrivalsQuery.data?.length ? (
                arrivalsQuery.data.map((a: NextArrival) => (
                  <div key={a.lineId} className="flex items-center justify-between text-sm">
                    <div className="font-medium">
                      {a.lineCode} <span className="text-muted-foreground">→ {a.direction}</span>
                    </div>
                    <div className="tabular-nums font-semibold">
                      {a.minutes} min
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No upcoming trains.</div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
