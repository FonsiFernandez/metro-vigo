import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getLine } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function LineDetail() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["line", id],
    queryFn: () => getLine(id),
    enabled: Number.isFinite(id),
  });

  return (
    <div className="space-y-6">
      {isLoading && <Card className="h-[180px] animate-pulse" />}

      {error && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Line not found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {(error as Error).message}
          </CardContent>
        </Card>
      )}

      {data && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {data.code} · {data.name}
              </h1>
              <p className="text-muted-foreground">Line details</p>
            </div>
            <Badge variant="outline">{data.status}</Badge>
          </div>

          <Card className="overflow-hidden">
            <div className="h-1.5" style={{ backgroundColor: data.colorHex }} />
            <CardHeader>
              <CardTitle className="text-base">Stations (ordered)</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {data.stations.map((s, idx) => (
                  <li key={s.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {idx + 1}. {s.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.accessible ? "Accessible" : "Limited accessibility"}
                      </div>
                    </div>
                    <Link to={`/stations/${s.id}`} className="text-sm underline text-muted-foreground hover:text-foreground">
                      View
                    </Link>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
