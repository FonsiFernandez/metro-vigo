export type Line = {
  id: number;
  code: string;
  name: string;
  colorHex: string;
  status: "OK" | "DELAYED" | "DOWN" | string;
};

const API_BASE = "http://localhost:8080";

export async function getLines(): Promise<Line[]> {
  const res = await fetch(`${API_BASE}/api/lines`);
  if (!res.ok) throw new Error(`Failed to fetch lines (HTTP ${res.status})`);
  return res.json();
}
