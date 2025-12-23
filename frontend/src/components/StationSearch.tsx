import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchStations, type Station } from "../lib/api";
import { useDebouncedValue } from "../lib/useDebouncedValue";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

export default function StationSearch() {
  const [q, setQ] = useState("");
  const debounced = useDebouncedValue(q, 250);

  const enabled = debounced.trim().length >= 1; // show suggestions even with 1 char

  const { data, isFetching, error } = useQuery({
    queryKey: ["stations", debounced],
    queryFn: () => searchStations(debounced),
    enabled,
    staleTime: 30_000,
  });

  const results = useMemo(() => data ?? [], [data]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stations (e.g., Urzaiz, Teis, Coia...)"
          className="h-11"
        />
        {isFetching && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">Searching…</span>
        )}
      </div>

      {q.trim().length > 0 && (
        <div className="absolute z-30 mt-2 w-full">
          <Card className="overflow-hidden">
            <div className="border-b px-3 py-2 text-xs text-muted-foreground">
              {error ? "Error" : results.length ? "Stations" : "No results"}
            </div>

            {error && (
              <div className="px-3 py-3 text-sm text-destructive">
                {(error as Error).message}
              </div>
            )}

            {!error && results.length > 0 && (
              <ul className="max-h-72 overflow-auto">
                {results.map((s: Station) => (
                 <li key={s.id}>
                   <Link
                     to={`/stations/${s.id}`}
                     className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted/50"
                   >
                     <div className="min-w-0">
                       <div className="truncate text-sm font-medium">{s.name}</div>
                       <div className="text-xs text-muted-foreground">
                         {s.lat && s.lon ? `${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}` : "No coordinates"}
                       </div>
                     </div>
                     <Badge variant={s.accessible ? "secondary" : "outline"}>
                       {s.accessible ? "Accessible" : "Limited"}
                     </Badge>
                   </Link>
                 </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
