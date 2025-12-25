import type { PropsWithChildren } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getActiveIncidents, type Incident } from "../lib/api";
import { AlertTriangle, CircleAlert, Info, Siren } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, type Theme } from "../lib/theme";
import { useTranslation } from "react-i18next";

import logo from "../assets/logo-small-noback.png";

// Footer partner logos
import logoSpain from "../assets/logos-spain.png";
import logoVigo from "../assets/logo-vigo.jpg";
import logoXunta from "../assets/logo-xunta.jpg";

import { Button } from "./ui/button";
import StationSearch from "./StationSearch";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "text-sm font-medium px-3 py-2 rounded-xl transition",
          isActive ? "bg-muted" : "hover:bg-muted/60",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

function SeverityPill({ severity }: { severity: string }) {
  const { t } = useTranslation(["common"]);
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border";

  if (severity === "CRITICAL") {
    return (
      <span className={`${base} bg-red-50 text-red-700 border-red-200`}>
        <Siren className="h-3.5 w-3.5" />
        {t("severity.critical")}
      </span>
    );
  }

  if (severity === "MAJOR") {
    return (
      <span className={`${base} bg-orange-50 text-orange-700 border-orange-200`}>
        <CircleAlert className="h-3.5 w-3.5" />
        {t("severity.major")}
      </span>
    );
  }

  if (severity === "MINOR") {
    return (
      <span className={`${base} bg-yellow-50 text-yellow-800 border-yellow-200`}>
        <AlertTriangle className="h-3.5 w-3.5" />
        {t("severity.minor")}
      </span>
    );
  }

  return (
    <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}>
      <Info className="h-3.5 w-3.5" />
      {t("severity.info")}
    </span>
  );
}

export default function AppShell({ children }: PropsWithChildren) {
  const incidentsQuery = useQuery({
    queryKey: ["incidents", "active"],
    queryFn: getActiveIncidents,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const { i18n, t } = useTranslation(["common"]);

  const incidents = incidentsQuery.data ?? [];

  const [theme, setTheme] = useState<Theme>(() => getStoredTheme() ?? "light");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b">
        <div
          aria-hidden
          className="
            absolute inset-0
            bg-background/80
            backdrop-blur
          "
        />
        <div className="relative">
          <div className="mx-auto max-w-5xl px-4 py-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Link to="/" className="group flex items-center gap-3">
                <div className="relative">
                  <div
                    className="
                      absolute -inset-2 rounded-2xl
                      bg-gradient-to-br from-sky-500/20 via-cyan-500/20 to-blue-600/20
                      blur-lg opacity-0
                      group-hover:opacity-100 transition
                    "
                  />

                  <img
                    src={logo}
                    alt={t("app.name")}
                    className={`
                      relative object-contain transition
                      ${isHome ? "h-12 w-12" : "h-10 w-10"}
                      group-hover:scale-105
                    `}
                    draggable={false}
                  />
                </div>

                <div className="leading-tight">
                  <div
                    className={[
                      "font-semibold tracking-tight",
                      isHome ? "text-lg" : "text-sm",
                    ].join(" ")}
                  >
                    {t("app.name")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("app.subtitle")}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="h-9 rounded-xl border bg-background px-3 text-sm"
                  aria-label={t("language.label")}
                >
                  <option value="es">ES</option>
                  <option value="gl">GL</option>
                  <option value="pt">PT</option>
                  <option value="eu">EU</option>
                  <option value="ca">CA</option>
                  <option value="en">EN</option>
                </select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme((tt) => (tt === "dark" ? "light" : "dark"))}
                  aria-label={t("theme.toggle")}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <Button variant="secondary" asChild>
                  <a
                    href={`${import.meta.env.VITE_API_URL ?? "http://localhost:8080"}/api/lines`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    API
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <nav className="flex items-center gap-1">
                <NavItem to="/" label={t("nav.home")} />
                <NavItem to="/lines" label={t("nav.lines")} />
                <NavItem to="/status" label={t("nav.status")} />
                <NavItem to="/map" label={t("nav.map")} />
                <NavItem to="/info" label={t("nav.info")} />
              </nav>

              <StationSearch />
            </div>
          </div>
        </div>
      </header>

      <div
        className="h-[3px] w-full opacity-80"
        style={{
          background: "linear-gradient(90deg, #38BDF8, #22D3EE, #2563EB)",
        }}
      />

      {incidents.length > 0 && (
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <span className="font-medium">{t("alerts.title")}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {t("alerts.active", { count: incidents.length })}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {incidents.slice(0, 3).map((i: Incident) => (
                  <span
                    key={i.id}
                    className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs"
                  >
                    <SeverityPill severity={i.severity} />

                    <span className="text-muted-foreground">
                      {i.lineCode ? `${i.lineCode}: ` : i.stationName ? `${i.stationName}: ` : ""}
                    </span>

                    <span className="truncate max-w-[40ch] font-medium">{i.title}</span>
                  </span>
                ))}

                {incidents.length > 3 && (
                  <span className="text-xs text-muted-foreground self-center">
                    {t("alerts.more", { count: incidents.length - 3 })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-3">
              <div className="text-sm font-semibold tracking-tight">
                {t("footer.aboutTitle")}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("footer.aboutText")}
              </p>

              <div className="text-xs text-muted-foreground">
                {t("footer.copyright", { year: new Date().getFullYear() })}
              </div>
            </div>

            <div className="flex md:justify-end">
              <div className="w-full max-w-[520px] rounded-2xl border bg-background/60 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-center rounded-xl p-3 bg-[#b60e27]">
                    <img
                      src={logoVigo}
                      alt="Concello de Vigo"
                      className="w-auto object-contain"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  <div className="flex items-center justify-center rounded-xl p-3 bg-[#00a6e0]">
                    <img
                      src={logoXunta}
                      alt="Xunta de Galicia"
                      className="w-auto object-contain"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-center rounded-xl p-3 bg-white">
                    <img
                      src={logoSpain}
                      alt="Gobierno de España"
                      className="w-auto object-contain"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="mt-3 text-[11px] leading-snug text-muted-foreground">
                  {t("footer.logosNote")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
