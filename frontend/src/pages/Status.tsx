import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLines, getActiveIncidents, type Incident } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { AlertTriangle, CircleAlert, Info, Siren } from "lucide-react";

function SeverityPill({ severity }: { severity: Incident["severity"] | string }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border";

  if (severity === "CRITICAL") {
    return (
      <span className={`${base} bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-200 dark:border-red-900/40`}>
        <Siren className="h-3.5 w-3.5" />
        CRITICAL
      </span>
    );
  }

  if (severity === "MAJOR") {
    return (
      <span className={`${base} bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/25 dark:text-orange-200 dark:border-orange-900/40`}>
        <CircleAlert className="h-3.5 w-3.5" />
        MAJOR
      </span>
    );
  }

  if (severity === "MINOR") {
    return (
      <span className={`${base} bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/25 dark:text-yellow-200 dark:border-yellow-900/40`}>
        <AlertTriangle className="h-3.5 w-3.5" />
        MINOR
      </span>
    );
  }

  return (
    <span className={`${base} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/25 dark:text-blue-200 dark:border-blue-900/40`}>
      <Info className="h-3.5 w-3.5" />
      INFO
    </span>
  );
}

function StatusStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <Card className="border border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}

export default function Status() {
  const linesQuery = useQuery({ queryKey: ["lines"], queryFn: getLines, staleTime: 30_000 });
  const incidentsQuery = useQuery({
    queryKey: ["incidents", "active"],
    queryFn: getActiveIncidents,
    staleTime: 10_000,
    refetchInterval: 30_000,
  });

  const summary = useMemo(() => {
    const lines = linesQuery.data ?? [];
    const ok = lines.filter((l) => l.status === "OK").length;
    const delayed = lines.filter((l) => l.status === "DELAYED").length;
    const down = lines.filter((l) => l.status === "DOWN").length;
    return { total: lines.length, ok, delayed, down };
  }, [linesQuery.data]);

  const incidents = incidentsQuery.data ?? [];

  const grouped = useMemo(() => {
    const byScope = {
      NETWORK: [] as Incident[],
      LINE: [] as Incident[],
      STATION: [] as Incident[],
    };

    for (const i of incidents) {
      // en tu backend tienes scope: NETWORK/LINE/STATION (si no, esto sigue funcionando por fallback)
      const scope = (i as any).scope as "NETWORK" | "LINE" | "STATION" | undefined;
      if (scope && byScope[scope]) byScope[scope].push(i);
      else byScope.NETWORK.push(i);
    }

    // ordena por severidad (CRITICAL > MAJOR > MINOR > INFO)
    const rank = (s: any) =>
      s === "CRITICAL" ? 0 : s === "MAJOR" ? 1 : s === "MINOR" ? 2 : 3;

    (Object.keys(byScope) as (keyof typeof byScope)[]).forEach((k) => {
      byScope[k].sort((a: any, b: any) => rank(a.severity) - rank(b.severity));
    });

    return byScope;
  }, [incidents]);

  const topSummary = useMemo(() => {
    const rank = (s: any) =>
      s === "CRITICAL" ? 0 : s === "MAJOR" ? 1 : s === "MINOR" ? 2 : 3;

    const worst = incidents.reduce<any | null>((acc, cur: any) => {
      if (!acc) return cur;
      return rank(cur.severity) < rank(acc.severity) ? cur : acc;
    }, null);

    return worst;
  }, [incidents]);

  const networkState =
    summary.down > 0
      ? { label: "Disrupted", badge: "DOWN", variant: "destructive" as const }
      : summary.delayed > 0
      ? { label: "Delays", badge: "DELAYED", variant: "secondary" as const }
      : { label: "Good service", badge: "OK", variant: "outline" as const };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Network Status</h1>
          <p className="text-muted-foreground">
            A clearer view of service and incidents.
          </p>
        </div>

        <Badge variant={networkState.variant} className="h-7">
          {networkState.badge}
        </Badge>
      </div>

      {/* Top banner: “what matters now” */}
      <Card className="border border-border/60">
        <CardContent className="py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{networkState.label}</span>
                <span className="text-xs text-muted-foreground">
                  · {incidents.length} active alert{incidents.length === 1 ? "" : "s"}
                </span>
              </div>

              {topSummary ? (
                <div className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{topSummary.title}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    —{" "}
                    {(topSummary as any).lineCode
                      ? `Line ${(topSummary as any).lineCode}`
                      : (topSummary as any).stationName
                      ? (topSummary as any).stationName
                      : "Network"}
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-sm text-muted-foreground">
                  No active incidents. Service is running normally.
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.scrollTo({ top: 99999, behavior: "smooth" })}
                disabled={!incidents.length}
              >
                View incidents
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatusStat label="Total lines" value={summary.total} />
        <StatusStat label="OK" value={summary.ok} hint="Normal service" />
        <StatusStat label="Delayed" value={summary.delayed} hint="Minor disruptions" />
        <StatusStat label="Down" value={summary.down} hint="Severe disruption" />
      </div>

      {/* Incidents */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Active incidents</CardTitle>
            <Badge variant="outline">{incidents.length}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {incidentsQuery.isLoading ? (
            <div className="text-sm text-muted-foreground">Loading incidents…</div>
          ) : incidentsQuery.isError ? (
            <div className="text-sm text-destructive">
              {(incidentsQuery.error as Error).message}
            </div>
          ) : incidents.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-background/60 p-4 text-sm text-muted-foreground">
              No active incidents.
            </div>
          ) : (
            <>
              {/* Grouped sections for easier scanning */}
              {(
                [
                  ["NETWORK", "Network-wide"],
                  ["LINE", "By line"],
                  ["STATION", "By station"],
                ] as const
              ).map(([key, label]) => {
                const list = grouped[key];
                if (!list?.length) return null;

                return (
                  <section key={key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">{label}</div>
                      <div className="text-xs text-muted-foreground">
                        {list.length} item{list.length === 1 ? "" : "s"}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {list.map((i: any) => (
                        <div
                          key={i.id}
                          className="
                            rounded-2xl border border-border/50
                            bg-background/60 p-4
                          "
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <SeverityPill severity={i.severity} />
                                <div className="text-sm font-semibold">{i.title}</div>
                              </div>

                              <div className="mt-1 text-xs text-muted-foreground">
                                {i.lineCode
                                  ? `Line ${i.lineCode}`
                                  : i.stationName
                                  ? i.stationName
                                  : "Network"}
                              </div>
                            </div>

                            {/* Optional: show a short “chip” for where it applies */}
                            <Badge variant="secondary" className="self-start">
                              {i.lineCode ? i.lineCode : i.stationName ? "Station" : "Network"}
                            </Badge>
                          </div>

                          <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            {i.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
