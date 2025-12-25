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

  const enabled = debounced.trim().length >= 1;

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["stations", "search", debounced],
    queryFn: () => searchStations(debounced),
    enabled,
    staleTime: 30_000,
  });

  const results = useMemo(() => data ?? [], [data]);

  // Igual que el planner: solo mostramos sugerencias si:
  // - enabled (>= 1 char)
  // - hay query
  // - y NO hay una estación "seleccionada" (aquí no hay selection, así que: enabled && q.trim().length > 0)
  const showSuggestions = enabled && q.trim().length > 0;

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative flex-1">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stations (e.g., Urzaiz, Teis, Coia...)"
          className="h-11 pr-10"
        />

        {q.length > 0 && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute z-30 mt-2 w-full">
          {/* MISMO estilo que StationPicker */}
          <Card className="overflow-hidden bg-background/95 backdrop-blur-xl border border-border/60 shadow-2xl">
            <div className="border-b border-border/60 px-3 py-2 text-xs text-muted-foreground">
              {isError
                ? "Error"
                : isFetching
                ? "Searching…"
                : results.length
                ? "Stations"
                : "No results"}
            </div>

            {isError && (
              <div className="px-3 py-3 text-sm text-destructive">
                {(error as Error)?.message ?? "Something went wrong"}
              </div>
            )}

            {!isError && results.length > 0 && (
              <ul className="max-h-72 overflow-auto">
                {results.slice(0, 10).map((s: Station) => (
                  <li key={s.id}>
                    <Link
                      to={`/stations/${s.id}`}
                      onClick={() => setQ("")}
                      className="w-full text-left flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted/80 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.lat && s.lon
                            ? `${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}`
                            : "No coordinates"}
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
