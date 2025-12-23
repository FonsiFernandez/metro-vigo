import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* background decor */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-10rem] h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-foreground/10" />
            <div className="leading-tight">
              <p className="text-sm font-semibold">Metro de Vigo</p>
              <p className="text-xs text-muted-foreground">Fictional API</p>
            </div>
          </div>

          <span className="text-xs text-muted-foreground">
            React · Spring Boot · Postgres
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Home />
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Metro de Vigo (fictional)
        </div>
      </footer>
    </div>
  );
}
