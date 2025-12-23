import { useQuery } from "@tanstack/react-query";
import { getLines, type Line } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router-dom";

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
  const { data, isLoading, error } = useQuery({
    queryKey: ["lines"],
    queryFn: getLines,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Metro de Vigo</h1>
        <p className="text-sm text-muted-foreground">
          Fictional network · React + Spring Boot + Postgres
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LineSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load lines</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {(error as Error).message}
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
         {data.map((line) => (
           <Link key={line.id} to={`/lines/${line.id}`} className="block">
             <Card className="overflow-hidden transition hover:shadow-md">
               <div className="h-1.5" style={{ backgroundColor: line.colorHex }} />
               <CardHeader className="pb-3">
                 <div className="flex items-start justify-between gap-3">
                   <div>
                     <CardTitle className="text-base">
                       {line.code} · {line.name}
                     </CardTitle>
                     <p className="mt-1 text-sm text-muted-foreground">
                       Color {line.colorHex}
                     </p>
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
