import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  getLines,
  type Line,
  type Station,
  type Incident,
  type NextArrival,
  getLineStations,
  getActiveIncidents,
  getNextArrivals,
} from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";

function StatusBadge({ status }: { status: Line["status"] }) {
  const { t } = useTranslation(["lines", "common"]);

  if (status === "OK")
    return <Badge className="bg-emerald-600 text-white">{t("lines:status.ok")}</Badge>;
  if (status === "DELAYED")
    return <Badge variant="secondary">{t("lines:status.delayed")}</Badge>;
  if (status === "DOWN")
    return <Badge variant="destructive">{t("lines:status.down")}</Badge>;

  // fallback por si aparece un estado nuevo
  return <Badge variant="outline">{status}</Badge>;
}

function IncidentBadge({ count }: { count: number | undefined }) {
  const { t } = useTranslation(["lines", "common"]);

  if (count === undefined) return <Badge variant="outline">{t("lines:incidents.loading")}</Badge>;
  if (count === 0) return <Badge variant="outline">{t("lines:incidents.none")}</Badge>;
  return (
    <Badge variant="destructive">
      {t("lines:incidents.count", { count })}
    </Badge>
  );
}

function StationsPreview({
  stations,
  isError,
}: {
  stations?: Station[];
  isError?: boolean;
}) {
  const { t } = useTranslation(["lines", "common"]);

  if (isError) return <div className="text-xs text-destructive">{t("lines:stations.failed")}</div>;
  if (!stations) return <div className="text-xs text-muted-foreground">{t("lines:stations.loading")}</div>;
  if (stations.length === 0) return <div className="text-xs text-muted-foreground">{t("lines:stations.empty")}</div>;

  const shown = stations.slice(0, 4);
  const remaining = Math.max(0, stations.length - shown.length);

  return (
    <div className="text-xs">
      <span className="text-muted-foreground">{t("lines:stations.label")} </span>
      {shown.map((s, idx) => (
        <span key={s.id}>
          <span className="font-medium">{s.name}</span>
          {idx < shown.length - 1 ? <span className="text-muted-foreground"> → </span> : null}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-muted-foreground">
          {t("lines:stations.more", { count: remaining })}
        </span>
      )}
    </div>
  );
}

function ArrivalsPreview({
  arrivals,
  isError,
}: {
  arrivals?: NextArrival[];
  isError?: boolean;
}) {
  const { t } = useTranslation(["lines", "common"]);

  if (isError) return <div className="text-xs text-destructive">{t("lines:arrivals.failed")}</div>;
  if (!arrivals) return <div className="text-xs text-muted-foreground">{t("lines:arrivals.loading")}</div>;
  if (arrivals.length === 0) return <div className="text-xs text-muted-foreground">{t("lines:arrivals.empty")}</div>;

  return (
    <div className="text-xs">
      <span className="text-muted-foreground">{t("lines:arrivals.label")} </span>
      <div className="mt-1 flex flex-col gap-1">
        {arrivals.slice(0, 3).map((a, idx) => (
          <div
            key={`${a.lineId}-${a.direction}-${idx}`}
            className="flex items-center justify-between gap-2"
          >
            <span className="truncate">
              <span className="font-medium">{a.direction}</span>
            </span>
            <span className="whitespace-nowrap font-medium">
              {t("lines:arrivals.minutes", { minutes: a.minutes })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Lines() {
  const { t } = useTranslation(["lines", "common"]);

  const { data: lines, isLoading, error } = useQuery({
    queryKey: ["lines"],
    queryFn: getLines,
  });

  // Incidents globales (una sola request) y luego filtramos por lineId
  const { data: incidents } = useQuery({
    queryKey: ["incidents", "active"],
    queryFn: getActiveIncidents,
    staleTime: 15_000,
  });

  // Estaciones por línea (1 request por línea)
  const stationsQueries = useQueries({
    queries:
      lines?.map((line) => ({
        queryKey: ["lineStations", line.id],
        queryFn: () => getLineStations(line.id),
        staleTime: 60_000,
        enabled: !!lines,
      })) ?? [],
  });

  // Map: lineId -> {data, isError}
  const stationsStateByLineId = useMemo(() => {
    const m = new Map<number, { data?: Station[]; isError: boolean }>();
    (lines ?? []).forEach((line, idx) => {
      m.set(line.id, {
        data: stationsQueries[idx]?.data as Station[] | undefined,
        isError: !!stationsQueries[idx]?.isError,
      });
    });
    return m;
  }, [lines, stationsQueries]);

  // Arrivals: tu endpoint es por estación -> usamos la 1ª estación de la línea
  const arrivalStationIds = useMemo(() => {
    return (lines ?? []).map((line) => {
      const st = stationsStateByLineId.get(line.id)?.data;
      return st && st.length ? st[0].id : null;
    });
  }, [lines, stationsStateByLineId]);

  const arrivalsQueries = useQueries({
    queries:
      (lines ?? []).map((line, idx) => {
        const stationId = arrivalStationIds[idx];
        return {
          queryKey: ["arrivals", "line", line.id, "station", stationId],
          queryFn: () => getNextArrivals(stationId as number),
          enabled: typeof stationId === "number",
          refetchInterval: 15_000,
          staleTime: 5_000,
        };
      }) ?? [],
  });

  // Map: lineId -> {data(filtered), isError}
  const arrivalsStateByLineId = useMemo(() => {
    const m = new Map<number, { data?: NextArrival[]; isError: boolean }>();
    (lines ?? []).forEach((line, idx) => {
      const raw = arrivalsQueries[idx]?.data as NextArrival[] | undefined;
      const filtered = raw?.filter((a) => a.lineId === line.id) ?? [];
      m.set(line.id, {
        data: raw ? filtered : undefined,
        isError: !!arrivalsQueries[idx]?.isError,
      });
    });
    return m;
  }, [lines, arrivalsQueries]);

  const incidentCountByLineId = useMemo(() => {
    const m = new Map<number, number>();
    (lines ?? []).forEach((l) => m.set(l.id, 0));

    (incidents ?? []).forEach((i: Incident) => {
      if (i.active && typeof i.lineId === "number") {
        m.set(i.lineId, (m.get(i.lineId) ?? 0) + 1);
      }
    });

    return m;
  }, [lines, incidents]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("lines:title")}</h1>
        <p className="text-muted-foreground">{t("lines:subtitle")}</p>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-[190px] animate-pulse" />
          ))}
        </div>
      )}

      {error && <div className="text-destructive">{(error as Error).message}</div>}

      {lines && (
        <div className="grid gap-4 sm:grid-cols-2">
          {lines.map((line) => {
            const st = stationsStateByLineId.get(line.id);
            const ar = arrivalsStateByLineId.get(line.id);
            const incidentCount = incidents ? incidentCountByLineId.get(line.id) ?? 0 : undefined;

            return (
              <Card key={line.id} className="overflow-hidden">
                <div className="h-1.5" style={{ backgroundColor: line.colorHex }} />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">
                        <Link to={`/lines/${line.id}`} className="hover:underline">
                          {line.code} · {line.name}
                        </Link>
                      </CardTitle>

                      <div className="mt-2 flex items-center gap-2">
                        <StatusBadge status={line.status} />
                        <IncidentBadge count={incidentCount} />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-2">
                  <StationsPreview stations={st?.data} isError={st?.isError} />
                  <ArrivalsPreview arrivals={ar?.data} isError={ar?.isError} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
