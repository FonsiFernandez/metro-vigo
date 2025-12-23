import { useQuery } from "@tanstack/react-query";
import { getLines } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getActiveIncidents } from "../lib/api";

export default function Status() {
  const { data } = useQuery({ queryKey: ["lines"], queryFn: getLines });

const incidentsQuery = useQuery({ queryKey: ["incidents", "active"], queryFn: getActiveIncidents });

  const summary = (() => {
    const lines = data ?? [];
    const ok = lines.filter(l => l.status === "OK").length;
    const delayed = lines.filter(l => l.status === "DELAYED").length;
    const down = lines.filter(l => l.status === "DOWN").length;
    return { total: lines.length, ok, delayed, down };
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Network Status</h1>
        <p className="text-muted-foreground">High-level overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total lines</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{summary.total}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">OK</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{summary.ok}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Delayed</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{summary.delayed}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Down</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{summary.down}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Next</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add incidents endpoint and show banners + details here.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active incidents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {incidentsQuery.data?.length ? (
            incidentsQuery.data.map((i) => (
              <div key={i.id} className="rounded-xl border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{i.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.lineCode ? `Line ${i.lineCode}` : i.stationName ? i.stationName : "Network"} · {i.severity}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{i.message}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No active incidents.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
