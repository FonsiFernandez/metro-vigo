import { useQuery } from "@tanstack/react-query";
import { getLines, type Line } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";

function StatusBadge({ status }: { status: Line["status"] }) {
  if (status === "OK") return <Badge className="bg-emerald-600">OK</Badge>;
  if (status === "DELAYED") return <Badge variant="secondary">Delayed</Badge>;
  if (status === "DOWN") return <Badge variant="destructive">Down</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default function Lines() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["lines"],
    queryFn: getLines,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lines</h1>
        <p className="text-muted-foreground">All metro lines and their current status.</p>
      </div>

      {isLoading && <div className="grid gap-4 sm:grid-cols-2">{Array.from({length:4}).map((_,i)=><Card key={i} className="h-[110px] animate-pulse" />)}</div>}
      {error && <div className="text-destructive">{(error as Error).message}</div>}

      {data && (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((line) => (
            <Card key={line.id} className="overflow-hidden">
              <div className="h-1.5" style={{ backgroundColor: line.colorHex }} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">
                      <Link to={`/lines/${line.id}`} className="hover:underline">
                        {line.code} · {line.name}
                      </Link>
                    </CardTitle>
                  </div>
                  <StatusBadge status={line.status} />
                </div>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                Future: stations list per line, arrivals, incidents.
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
