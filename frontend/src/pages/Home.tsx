import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

import logoMark from "../assets/logo-small-noback.png";

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
  const { t } = useTranslation(["home", "common"]);

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
      <div className="mb-1 text-xs font-medium text-muted-foreground">
        {label}
      </div>

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
            aria-label={t("home:stationPicker.clearAria")}
            title={t("home:stationPicker.clearAria")}
          >
            ✕
          </button>
        )}
      </div>

      {enabled && !value && (
        <div className="absolute z-30 mt-2 w-full">
          <Card className="overflow-hidden bg-background/95 backdrop-blur-xl border border-border/60 shadow-2xl">
            <div className="border-b border-border/60 px-3 py-2 text-xs text-muted-foreground">
              {isError
                ? t("home:stationPicker.status.error")
                : isFetching
                ? t("home:stationPicker.status.searching")
                : results.length
                ? t("home:stationPicker.status.stations")
                : t("home:stationPicker.status.noResults")}
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
                        <div className="truncate text-sm font-medium">
                          {s.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {s.lat && s.lon
                            ? `${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}`
                            : t("home:stationPicker.noCoordinates")}
                        </div>
                      </div>

                      <Badge variant={s.accessible ? "secondary" : "outline"}>
                        {s.accessible
                          ? t("home:stationPicker.accessible")
                          : t("home:stationPicker.limited")}
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
  const { t } = useTranslation(["home", "common"]);

  if (!plan.legs?.length) {
    return (
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t("home:journey.recommendedRoute")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t("home:journey.noRouteFound")}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {t("home:journey.recommendedRoute")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {t("home:journey.totalDuration", { minutes: plan.totalDurationMin })}
          </Badge>

          <Badge variant="outline">
            {t("home:journey.transfers", { count: plan.transfers })}
          </Badge>
        </div>

        <ol className="space-y-2">
          {plan.legs.map((leg, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-3 rounded-lg border border-border/50 bg-background/60 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="font-medium">
                  {leg.type === "WALK"
                    ? t("home:journey.leg.walk")
                    : t("home:journey.leg.metro", {
                        lineCode: leg.lineCode ?? "",
                      })}

                  {leg.direction ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · {leg.direction}
                    </span>
                  ) : null}
                </div>

                <div className="text-xs text-muted-foreground truncate">
                  {leg.fromName} → {leg.toName}
                </div>
              </div>

              <div className="whitespace-nowrap font-medium">
                {t("home:journey.leg.duration", { minutes: leg.durationMin })}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { t } = useTranslation(["home", "common"]);

  const tickets = t("home:ticketPrices.items", { returnObjects: true }) as Array<{
    name: string;
    price: string;
    note: string;
  }>;

  const promos = t("home:promotions.items", { returnObjects: true }) as Array<{
    title: string;
    badge: string;
    text: string;
  }>;

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
    // NOTE: OK for MVP; can improve timezone handling later if needed.
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
          <CardTitle className="text-base">{t("home:planner.title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <StationPicker
              label={t("home:planner.fromLabel")}
              value={from}
              onPick={setFrom}
              placeholder={t("home:planner.fromPlaceholder")}
            />
            <StationPicker
              label={t("home:planner.toLabel")}
              value={to}
              onPick={setTo}
              placeholder={t("home:planner.toPlaceholder")}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                {t("home:planner.dateLabel")}
              </div>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11"
              />
            </div>

            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                {t("home:planner.timeLabel")}
              </div>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="flex items-end">
              <Button
                className="h-11 w-full"
                disabled={!canPlan || journeyMutation.isPending}
                onClick={() => {
                  if (!from || !to) return;
                  journeyMutation.mutate({
                    fromId: from.id,
                    toId: to.id,
                    datetimeISO,
                  });
                }}
              >
                {journeyMutation.isPending
                  ? t("home:planner.planning")
                  : t("home:planner.getRoute")}
              </Button>
            </div>
          </div>

          {!canPlan && (
            <div className="text-xs text-muted-foreground">
              {t("home:planner.helper")}
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

      {/* About / Info */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Metro overview with watermark */}
        <Card className="relative overflow-hidden border border-border/60 lg:col-span-2">
          {/* Watermark glow */}
          <div
            aria-hidden
            className="
              pointer-events-none
              absolute right-[-140px] top-1/2 -translate-y-1/2
              h-[340px] w-[340px] rounded-full
              bg-gradient-to-br from-sky-500/15 via-cyan-500/10 to-blue-600/10
              blur-3xl
            "
          />
          {/* Watermark logo */}
          <img
            src={logoMark}
            alt=""
            aria-hidden
            className="
              pointer-events-none select-none
              absolute right-[-90px] top-1/2 -translate-y-1/2
              w-[360px] opacity-12
            "
            draggable={false}
          />

          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {t("home:aboutMetro.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="relative space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {t("home:aboutMetro.description")}
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                <div className="text-xs text-muted-foreground">
                  {t("home:aboutMetro.stats.service.label")}
                </div>
                <div className="mt-1 text-sm font-medium">
                  {t("home:aboutMetro.stats.service.value")}
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                <div className="text-xs text-muted-foreground">
                  {t("home:aboutMetro.stats.mainHub.label")}
                </div>
                <div className="mt-1 text-sm font-medium">
                  {t("home:aboutMetro.stats.mainHub.value")}
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                <div className="text-xs text-muted-foreground">
                  {t("home:aboutMetro.stats.interchanges.label")}
                </div>
                <div className="mt-1 text-sm font-medium">
                  {t("home:aboutMetro.stats.interchanges.value")}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {t("home:aboutMetro.badges.accessibleFirst")}
              </Badge>
              <Badge variant="outline">
                {t("home:aboutMetro.badges.liveAlerts")}
              </Badge>
              <Badge variant="outline">
                {t("home:aboutMetro.badges.journeyPlanner")}
              </Badge>
              <Badge variant="outline">
                {t("home:aboutMetro.badges.networkMap")}
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground">
              {t("home:aboutMetro.moreDetails")}
            </div>
          </CardContent>
        </Card>

        {/* City overview */}
        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("home:aboutCity.title")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("home:aboutCity.description")}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                <span className="text-sm font-medium">
                  {t("home:aboutCity.highlights.waterfront.title")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("home:aboutCity.highlights.waterfront.subtitle")}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                <span className="text-sm font-medium">
                  {t("home:aboutCity.highlights.beaches.title")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("home:aboutCity.highlights.beaches.subtitle")}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                <span className="text-sm font-medium">
                  {t("home:aboutCity.highlights.connections.title")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("home:aboutCity.highlights.connections.subtitle")}
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link to="/info">{t("home:actions.learnMore")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {t("home:ticketPrices.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tickets.map((it) => (
              <div
                key={it.name}
                className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-background/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.note}</div>
                </div>
                <div className="whitespace-nowrap font-semibold">{it.price}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {t("home:promotions.title")}
            </CardTitle>
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

            <Button variant="outline" className="w-full" asChild>
              <Link to="/info">{t("home:actions.learnMore")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
