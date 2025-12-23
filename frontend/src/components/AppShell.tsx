import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
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
