import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import { getLine, getLines, type LineDetail as LineDetailType } from "../lib/api";
import { buildInterchangeMap } from "../lib/interchanges";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function LineDetail() {
  const params = useParams();
  const id = Number(params.id);

  // 1) Load this line detail
  const lineQuery = useQuery({
    queryKey: ["line", id],
    queryFn: () => getLine(id),
    enabled: Number.isFinite(id),
  });

  // 2) Load all lines (to compute interchanges)
  const allLinesQuery = useQuery({
    queryKey: ["lines"],
    queryFn: getLines,
    staleTime: 30_000,
  });

  const allLineIds = (allLinesQuery.data ?? []).map((l) => l.id);

  // 3) Load all line details (small dataset → ok)
  const allDetailsQuery = useQuery({
    queryKey: ["line-details", allLineIds],
    queryFn: async () => {
      const details = await Promise.all(allLineIds.map((lineId) => getLine(lineId)));
      return details as LineDetailType[];
    },
    enabled: allLineIds.length > 0,
    staleTime: 30_000,
  });

  // 4) Build interchange map: stationId -> { count, lineCodes }
  const interchangeMap = useMemo(() => {
    return allDetailsQuery.data ? buildInterchangeMap(allDetailsQuery.data) : new Map();
  }, [allDetailsQuery.data]);

  // Render states
  if (lineQuery.isLoading) {
    return <Card className="h-[180px] animate-pulse" />;
  }

  if (lineQuery.error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Line not found</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {(lineQuery.error as Error).message}
        </CardContent>
      </Card>
    );
  }

  const data = lineQuery.data;
  if (!data) return null;

  return (
    <div className="space-y-6">
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
            {data.stations.map((s, idx) => {
              const interchange = interchangeMap.get(s.id); // may be undefined

              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium flex items-center gap-2">
                      {idx + 1}. {s.name}

                      {interchange && interchange.count > 1 && (
                        <Badge variant="secondary">
                          Interchange · {interchange.count}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {s.accessible ? "Accessible" : "Limited accessibility"}
                      {interchange && interchange.count > 1 && (
                        <span className="ml-2">
                          • Lines: {interchange.lineCodes.join(" · ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/stations/${s.id}`}
                    className="text-sm underline text-muted-foreground hover:text-foreground"
                  >
                    View
                  </Link>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
