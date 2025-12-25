import { PropsWithChildren } from "react";
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
import logoVigo from "../assets/logo-vigo.JPG";
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
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border";

  if (severity === "CRITICAL") {
    return (
      <span className={`${base} bg-red-50 text-red-700 border-red-200`}>
        <Siren className="h-3.5 w-3.5" />
        CRITICAL
      </span>
    );
  }

  if (severity === "MAJOR") {
    return (
      <span className={`${base} bg-orange-50 text-orange-700 border-orange-200`}>
        <CircleAlert className="h-3.5 w-3.5" />
        MAJOR
      </span>
    );
  }

  if (severity === "MINOR") {
    return (
      <span className={`${base} bg-yellow-50 text-yellow-800 border-yellow-200`}>
        <AlertTriangle className="h-3.5 w-3.5" />
        MINOR
      </span>
    );
  }

  // INFO (default)
  return (
    <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}>
      <Info className="h-3.5 w-3.5" />
      INFO
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

  const { i18n, t } = useTranslation();

  const incidents = incidentsQuery.data ?? [];

  const [theme, setTheme] = useState<Theme>(() => getStoredTheme() ?? "light");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative">
                {/* Accent background */}
                <div
                  className="
                    absolute -inset-2 rounded-2xl
                    bg-gradient-to-br from-sky-500/20 via-cyan-500/20 to-blue-600/20
                    blur-lg opacity-0
                    group-hover:opacity-100 transition
                  "
                />

                {/* Logo */}
                <img
                  src={logo}
                  alt="Metro de Vigo"
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
                  Metro de Vigo
                </div>
                <div className="text-xs text-muted-foreground">
                  {isHome ? "Rede urbana · ficticia" : "fictional"}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="h-9 rounded-xl border bg-background px-3 text-sm"
                aria-label="Language"
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
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button variant="secondary" asChild>
                <a href="http://localhost:8080/api/lines" target="_blank" rel="noreferrer">
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
                <span className="font-medium">Service alerts</span>
                <span className="text-muted-foreground"> · {incidents.length} active</span>
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
                    +{incidents.length - 3} more
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
      {/* Left: developer note */}
      <div className="space-y-3">
        <div className="text-sm font-semibold tracking-tight">Sobre este proyecto</div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Soy Alfonso, desarrollador de esta aplicación. <span className="font-medium text-foreground">Metro Vigo</span>{" "}
          es un proyecto <span className="font-medium text-foreground">ficticio</span> con fines lúdicos y demostrativos:
          una forma de explorar ideas de movilidad y ofrecer una imagen más moderna de la ciudad de Vigo, sin
          vinculación institucional.
        </p>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Metro Vigo (fictional) · UI/UX demo · Datos simulados
        </div>
      </div>

      {/* Right: logos block */}
      <div className="flex md:justify-end">
        <div className="w-full max-w-[520px] rounded-2xl border bg-background/60 p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Top row: Concello (usa el rojo del propio logo) */}
            <div className="flex items-center justify-center rounded-xl p-3 bg-[#b60e27]">
              <img
                src={logoVigo}
                alt="Concello de Vigo"
                className="w-auto object-contain"
                loading="lazy"
                draggable={false}
              />
            </div>

            {/* Top row: Xunta (usa el beige/crema del propio logo) */}
            <div className="flex items-center justify-center rounded-xl p-3 bg-[#00a6e0]">
              <img
                src={logoXunta}
                alt="Xunta de Galicia"
                className="w-auto object-contain"
                loading="lazy"
                draggable={false}
              />
            </div>

            {/* Bottom row: Spain logo spans both columns (fondo blanco para legibilidad) */}
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
            Logos usados únicamente con fines ilustrativos dentro de un proyecto ficticio (no oficial).
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}
