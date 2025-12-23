import { useEffect, useState } from "react";
import "./App.css";

type Line = {
  id: number;
  code: string;
  name: string;
  colorHex: string;
  status: string;
};

export default function App() {
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/lines");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Line[];
        setLines(data);
      } catch (e: any) {
        setError(e.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Metro de Vigo</h1>
      <p style={{ opacity: 0.7, marginTop: 0 }}>Proyecto ficticio · Front React + API Java</p>

      {loading && <p>Cargando líneas…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {lines.map((l) => (
          <div
            key={l.id}
            style={{
              border: "1px solid #e5e7eb",
              borderLeft: `10px solid ${l.colorHex}`,
              borderRadius: 12,
              padding: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "white",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: "black" }}>{l.code} · {l.name}</div>
              <div style={{ opacity: 0.7, fontSize: 14 , color: "black" }}>{l.status}</div>
            </div>
            <span style={{ fontSize: 12, opacity: 0.6 , color: "black" }}>{l.colorHex}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
