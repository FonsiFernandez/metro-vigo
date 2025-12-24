import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  searchStations,
  type Station,
  planJourney,
  type JourneyPlan,
} from "../lib/api";
import { useDebouncedValue } from "../lib/useDebouncedValue";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

function StationPicker({
  label,
  value,
  onPick,
  placeholder,
}: {
  label: string;
  value: Station | null;
  onPick: (s: Station | null) => void;
  placeholder: string;
}) {
  const [q, setQ] = useState(value?.name ?? "");
  const debounced = useDebouncedValue(q, 250);

  const enabled = debounced.trim().length >= 1;

  const { data, isFetching, isError } = useQuery({
    queryKey: ["stations", "search", debounced],
    queryFn: () => searchStations(debounced),
    enabled,
    staleTime: 30_000,
  });

  const results = useMemo(() => data ?? [], [data]);

  return (
    <div className="relative">
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>

      <div className="relative">
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            if (value) onPick(null);
          }}
          placeholder={placeholder}
          className="h-11 pr-10"
        />

        {q.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              onPick(null);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {enabled && !value && (
        <div className="absolute z-30 mt-2 w-full">
          <Card className="overflow-hidden bg-background/95 backdrop-blur-xl border border-border/60 shadow-2xl">
            <div className="border-b border-border/60 px-3 py-2 text-xs text-muted-foreground">
              {isError ? "Error" : isFetching ? "Searching…" : results.length ? "Stations" : "No results"}
            </div>

            {results.length > 0 && (
              <ul className="max-h-72 overflow-auto">
                {results.slice(0, 10).map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onPick(s);
                        setQ(s.name);
                      }}
                      className="w-full text-left flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted/80 transition-colors"
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
                    </button>
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

function JourneyCard({ plan }: { plan: JourneyPlan }) {
  if (!plan.legs?.length) {
    return (
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recommended route</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No route found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recommended route</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{plan.totalDurationMin} min</Badge>
          <Badge variant="outline">{plan.transfers} transfer{plan.transfers === 1 ? "" : "s"}</Badge>
        </div>

        <ol className="space-y-2">
          {plan.legs.map((leg, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-background/60 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="font-medium">
                  {leg.type === "WALK" ? "Walk" : `Metro ${leg.lineCode ?? ""}`}
                  {leg.direction ? <span className="text-muted-foreground"> · {leg.direction}</span> : null}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {leg.fromName} → {leg.toName}
                </div>
              </div>
              <div className="whitespace-nowrap font-medium">{leg.durationMin} min</div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const tickets = [
    { name: "Single ticket", price: "€1.45", note: "Valid for one trip (zone A)" },
    { name: "24h pass", price: "€4.50", note: "Unlimited rides for 24 hours" },
    { name: "10-trip bundle", price: "€11.00", note: "Best value for commuting" },
    { name: "Monthly pass", price: "€29.00", note: "Unlimited rides for 30 days" },
  ];

  const promos = [
    { title: "Tarjeta ciudadana", badge: "-20%", text: "Pay with the city card and get 20% off standard fares." },
    { title: "Student discount", badge: "-30%", text: "Reduced fares for students (under 26)." },
    { title: "Weekend promo", badge: "2×1", text: "Two-for-one tickets on weekends after 10:00." },
  ];

  const [from, setFrom] = useState<Station | null>(null);
  const [to, setTo] = useState<Station | null>(null);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(() => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  });

  const datetimeISO = useMemo(() => {
    // NOTE: this is OK for MVP; if you want timezone-correct later, we can improve.
    return new Date(`${date}T${time}:00`).toISOString();
  }, [date, time]);

  const canPlan = !!from && !!to && from.id !== to.id;

  const journeyMutation = useMutation({
    mutationFn: (vars: { fromId: number; toId: number; datetimeISO: string }) =>
      planJourney({
        fromStationId: vars.fromId,
        toStationId: vars.toId,
        datetimeISO: vars.datetimeISO,
      }),
  });

  return (
    <div className="space-y-8">
       <Card className="border border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Plan your trip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <StationPicker label="From" value={from} onPick={setFrom} placeholder="Start station (e.g., Urzaiz)" />
                  <StationPicker label="To" value={to} onPick={setTo} placeholder="Destination (e.g., Samil)" />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">Date</div>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11" />
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">Time</div>
                    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-11" />
                  </div>

                  <div className="flex items-end">
                    <Button
                      className="h-11 w-full"
                      disabled={!canPlan || journeyMutation.isPending}
                      onClick={() => {
                        if (!from || !to) return;
                        journeyMutation.mutate({ fromId: from.id, toId: to.id, datetimeISO });
                      }}
                    >
                      {journeyMutation.isPending ? "Planning…" : "Get route"}
                    </Button>
                  </div>
                </div>

                {!canPlan && (
                  <div className="text-xs text-muted-foreground">
                    Choose origin + destination (different stations), then date and time.
                  </div>
                )}

                {journeyMutation.isError && (
                  <div className="text-sm text-destructive">
                    {(journeyMutation.error as Error).message}
                  </div>
                )}

                {journeyMutation.data && <JourneyCard plan={journeyMutation.data} />}
              </CardContent>
            </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Ticket prices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.name}
                className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-background/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.note}</div>
                </div>
                <div className="whitespace-nowrap font-semibold">{t.price}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Promotions & Tarjeta ciudadana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {promos.map((p) => (
              <div
                key={p.title}
                className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-background/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.text}</div>
                </div>
                <Badge variant="secondary" className="whitespace-nowrap">
                  {p.badge}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Learn more
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
