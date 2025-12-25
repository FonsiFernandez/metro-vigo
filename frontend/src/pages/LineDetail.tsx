import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getLine, getLines, type LineDetail as LineDetailType } from "../lib/api";
import { buildInterchangeMap } from "../lib/interchanges";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

import { ChevronDown, ChevronUp } from "lucide-react";

function LineDiagram({
  line,
  stations,
}: {
  line: { colorHex: string };
  stations: Array<{ id: number; name: string; interchangeCount: number }>;
}) {
  const { t } = useTranslation(["linesDetails", "common"]);

  const showAllLabels = stations.length <= 10;

  const W = 1000;
  const H = 140;
  const padding = 40;

  const n = stations.length;
  const step = n > 1 ? (W - padding * 2) / (n - 1) : 0;
  const yLine = 60;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Line */}
      {n > 1 ? (
        <line
          x1={padding}
          y1={yLine}
          x2={W - padding}
          y2={yLine}
          stroke={line.colorHex}
          strokeWidth={8}
          strokeLinecap="round"
        />
      ) : (
        <line
          x1={W / 2 - 60}
          y1={yLine}
          x2={W / 2 + 60}
          y2={yLine}
          stroke={line.colorHex}
          strokeWidth={8}
          strokeLinecap="round"
        />
      )}

      {stations.map((s, i) => {
        const x = n > 1 ? padding + i * step : W / 2;

        return (
          <g key={s.id} transform={`translate(${x}, ${yLine})`}>
            <circle
              r={s.interchangeCount > 1 ? 7 : 5}
              fill="#fff"
              stroke={line.colorHex}
              strokeWidth={3}
            />

            {s.interchangeCount > 1 && (
              <text y={-14} textAnchor="middle" fontSize={10} fill="#666">
                {t("linesDetails:diagram.lines", { count: s.interchangeCount })}
              </text>
            )}

            {(showAllLabels || s.interchangeCount > 1 || i === 0 || i === n - 1) && (
              <text y={26} textAnchor="middle" fontSize={12} fill="#111">
                {s.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function MobileDiagram({
  children,
  summary,
}: {
  children: React.ReactNode;
  summary: React.ReactNode;
}) {
  const { t } = useTranslation(["linesDetails", "common"]);
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 text-sm">{summary}</div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 inline-flex items-center justify-center rounded-md border px-2 py-1 text-muted-foreground hover:text-foreground"
          aria-label={
            open
              ? t("linesDetails:diagram.hide", { defaultValue: "Hide diagram" })
              : t("linesDetails:diagram.show", { defaultValue: "Show diagram" })
          }
        >
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}

          <span className="sr-only">
            {open
              ? t("linesDetails:diagram.hide", { defaultValue: "Hide diagram" })
              : t("linesDetails:diagram.show", { defaultValue: "Show diagram" })}
          </span>
        </button>
      </div>

      {open && (
        <div className="mt-3 -mx-3 px-3 overflow-x-auto">
          <div className="min-w-[900px]">{children}</div>
        </div>
      )}
    </div>
  );
}

export default function LineDetail() {
  const { t } = useTranslation(["linesDetails", "common"]);

  const params = useParams();
  const id = Number(params.id);

  // 1) Load this line detail
  const lineQuery = useQuery({
    queryKey: ["line", id],
    queryFn: () => getLine(id),
    enabled: Number.isFinite(id),
  });

  // 2) Load all lines (to compute interchanges)
  const allLinesQuery = useQuery({
    queryKey: ["lines"],
    queryFn: getLines,
    staleTime: 30_000,
  });

  const allLineIds = (allLinesQuery.data ?? []).map((l) => l.id);

  // 3) Load all line details
  const allDetailsQuery = useQuery({
    queryKey: ["line-details", allLineIds],
    queryFn: async () => {
      const details = await Promise.all(allLineIds.map((lineId) => getLine(lineId)));
      return details as LineDetailType[];
    },
    enabled: allLineIds.length > 0,
    staleTime: 30_000,
  });

  // 4) Build interchange map
  const interchangeMap = useMemo(() => {
    return allDetailsQuery.data
      ? buildInterchangeMap(allDetailsQuery.data)
      : new Map();
  }, [allDetailsQuery.data]);

  // Render states
  if (lineQuery.isLoading) {
    return <Card className="h-[180px] animate-pulse" />;
  }

  if (lineQuery.error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">
            {t("linesDetails:notFound")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {(lineQuery.error as Error).message}
        </CardContent>
      </Card>
    );
  }

  const data = lineQuery.data;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {data.code} · {data.name}
          </h1>
          <p className="text-muted-foreground">
            {t("linesDetails:subtitle")}
          </p>
        </div>
        <Badge variant="outline">{data.status}</Badge>
      </div>

      <Card className="overflow-hidden">
        <div className="h-1.5" style={{ backgroundColor: data.colorHex }} />
        <CardHeader>
          <CardTitle className="text-base">
            {t("linesDetails:stations.title")}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4 rounded-xl border p-3">
            {/* Mobile: resumen + desplegable */}
            <MobileDiagram
              summary={
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {data.stations[0]?.name}
                  </span>
                  <span className="mx-2">→</span>
                  <span className="font-medium text-foreground">
                    {data.stations[data.stations.length - 1]?.name}
                  </span>
                  <span className="ml-2">
                    • {data.stations.length} paradas
                  </span>
                </div>
              }
              labelShow={t("linesDetails:diagram.show")}
              labelHide={t("linesDetails:diagram.hide")}
            >
              <LineDiagram
                line={data}
                stations={data.stations.map((s) => ({
                  ...s,
                  interchangeCount: interchangeMap.get(s.id)?.count ?? 1,
                }))}
              />
            </MobileDiagram>

            {/* Desktop: siempre visible */}
            <div className="hidden sm:block">
              <LineDiagram
                line={data}
                stations={data.stations.map((s) => ({
                  ...s,
                  interchangeCount: interchangeMap.get(s.id)?.count ?? 1,
                }))}
              />
            </div>
          </div>

          <ol className="space-y-2">
            {data.stations.map((s, idx) => {
              const interchange = interchangeMap.get(s.id);

              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium flex items-center gap-2">
                      {idx + 1}. {s.name}

                      {interchange && interchange.count > 1 && (
                        <Badge variant="secondary">
                          {t("linesDetails:interchange.badge", {
                            count: interchange.count,
                          })}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {s.accessible
                        ? t("linesDetails:accessibility.accessible")
                        : t("linesDetails:accessibility.limited")}

                      {interchange && interchange.count > 1 && (
                        <span className="ml-2">
                          • {t("linesDetails:interchange.lines")}{" "}
                          {interchange.lineCodes.join(" · ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/stations/${s.id}`}
                    className="text-sm underline text-muted-foreground hover:text-foreground"
                  >
                    {t("linesDetails:actions.view")}
                  </Link>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
