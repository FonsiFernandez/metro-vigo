import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { getLine, getLines, type Line, type LineDetail } from "../lib/api";
import { buildInterchangeMap } from "../lib/interchanges";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

function StatusBadge({ status }: { status: Line["status"] }) {
  if (status === "OK") return <Badge className="bg-emerald-600 text-white">OK</Badge>;
  if (status === "DELAYED") return <Badge variant="secondary">Delayed</Badge>;
  if (status === "DOWN") return <Badge variant="destructive">Down</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

function LineSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 bg-muted" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="h-4 w-44 rounded bg-muted animate-pulse" />
            <div className="h-3 w-28 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-6 w-16 rounded bg-muted animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-3 w-56 rounded bg-muted animate-pulse" />
      </CardContent>
    </Card>
  );
}

export default function Home() {
  // 1) Load lines
  const linesQuery = useQuery({
    queryKey: ["lines"],
    queryFn: getLines,
    staleTime: 30_000,
  });

  const lineIds = (linesQuery.data ?? []).map((l) => l.id);

  // 2) Load line details (to compute interchanges)
  const detailsQuery = useQuery({
    queryKey: ["line-details", lineIds],
    queryFn: async () => {
      const details = await Promise.all(lineIds.map((id) => getLine(id)));
      return details as LineDetail[];
    },
    enabled: lineIds.length > 0,
    staleTime: 30_000,
  });

  // 3) Build interchange map
  const interchangeMap = useMemo(() => {
    return detailsQuery.data
      ? buildInterchangeMap(detailsQuery.data)
      : new Map<number, { count: number; lineCodes: string[] }>();
  }, [detailsQuery.data]);

  // Optional: count how many stations are interchanges
  const interchangeCount = useMemo(() => {
    let n = 0;
    for (const v of interchangeMap.values()) if (v.count > 1) n++;
    return n;
  }, [interchangeMap]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Metro de Vigo</h1>
        <p className="text-sm text-muted-foreground">
          Fictional network · React + Spring Boot + Postgres
          {detailsQuery.isSuccess && (
            <span className="ml-2">· Interchanges: {interchangeCount}</span>
          )}
        </p>
      </div>

      {linesQuery.isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LineSkeleton key={i} />
          ))}
        </div>
      )}

      {linesQuery.error && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load lines</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {(linesQuery.error as Error).message}
          </CardContent>
        </Card>
      )}

      {linesQuery.data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {linesQuery.data.map((line) => (
            <Link
              key={line.id}
              to={`/lines/${line.id}`}
              className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Card className="overflow-hidden transition hover:shadow-md">
                <div className="h-1.5" style={{ backgroundColor: line.colorHex }} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {line.code} · {line.name}
                      </CardTitle>
                    </div>
                    <StatusBadge status={line.status} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    View line details →
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
