import { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
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

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-slate-900" />
              <div className="leading-tight">
                <div className="text-sm font-semibold">Metro de Vigo</div>
                <div className="text-xs text-muted-foreground">fictional</div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="secondary" asChild>
                <a href="http://localhost:8080/api/lines" target="_blank" rel="noreferrer">
                  API
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex items-center gap-1">
              <NavItem to="/" label="Home" />
              <NavItem to="/lines" label="Lines" />
              <NavItem to="/status" label="Status" />
            </nav>

            <StationSearch />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Metro de Vigo (fictional)
        </div>
      </footer>
    </div>
  );
}
