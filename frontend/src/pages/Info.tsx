import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Github, Linkedin } from "lucide-react";
import profilePhoto from "../assets/foto.jpg";

type KV = { title: string; text: string };
type Fine = { label: string; amount: string; note: string };

export default function InfoPage() {
  const { t } = useTranslation(["info", "common"]);

  const values = useMemo(
    () => (t("info:values.items", { returnObjects: true }) as KV[]) ?? [],
    [t]
  );

  const rules = useMemo(
    () => (t("info:rules.items", { returnObjects: true }) as KV[]) ?? [],
    [t]
  );

  const fines = useMemo(
    () => (t("info:fines.items", { returnObjects: true }) as Fine[]) ?? [],
    [t]
  );

  const vigo = useMemo(
    () => (t("info:vigo.items", { returnObjects: true }) as KV[]) ?? [],
    [t]
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t("info:page.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("info:page.subtitle")}</p>
      </div>

      {/* Values */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">{t("info:values.title")}</CardTitle>
            <Badge variant="secondary">{t("info:values.badge")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-border/50 bg-background/60 p-3">
              <div className="font-medium">{v.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{v.text}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rules + Fines */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">{t("info:rules.title")}</CardTitle>
              <Badge variant="outline">{t("info:rules.badge")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.map((r) => (
              <div key={r.title} className="rounded-xl border border-border/50 bg-background/60 px-3 py-2">
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.text}</div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground">{t("info:rules.disclaimer")}</div>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">{t("info:fines.title")}</CardTitle>
              <Badge variant="outline">{t("info:fines.badge")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {fines.map((f) => (
              <div
                key={f.label}
                className="flex items-start justify-between gap-3 rounded-xl border border-border/50 bg-background/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.note}</div>
                </div>
                <div className="whitespace-nowrap font-semibold">{f.amount}</div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground">{t("info:fines.disclaimer")}</div>
          </CardContent>
        </Card>
      </div>

      {/* City */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">{t("info:vigo.title")}</CardTitle>
            <Badge variant="secondary">{t("info:vigo.badge")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {vigo.map((x) => (
              <div key={x.title} className="rounded-xl border border-border/50 bg-background/60 p-3">
                <div className="font-medium">{x.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{x.text}</div>
              </div>
            ))}
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">{t("info:vigo.nextText")}</div>
            <Button variant="outline">{t("info:vigo.comingSoon")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* About the developer */}
      <Card className="border border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">{t("info:about.title")}</CardTitle>
            <Badge variant="outline">{t("info:about.badge")}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {/* Photo */}
            <div className="flex-shrink-0">
              <img
                src={profilePhoto}
                alt={t("info:about.photoAlt")}
                className="
                  h-28 w-28 rounded-2xl object-cover
                  border border-border/60
                  shadow-sm
                "
                draggable={false}
              />
            </div>

            {/* Text */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("info:about.paragraph1", { name: "Alfonso" })}
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("info:about.paragraph2")}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button variant="outline" asChild className="gap-2">
              <a href="https://github.com/FonsiFernandez" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>

            <Button variant="outline" asChild className="gap-2">
              <a href="https://www.linkedin.com/in/fonsifernandez/" target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">{t("info:about.footer")}</div>
        </CardContent>
      </Card>
    </div>
  );
}
