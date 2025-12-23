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

export type Station = {
  id: number;
  name: string;
  lat: number | null;
  lon: number | null;
  accessible: boolean;
};

export async function searchStations(query: string): Promise<Station[]> {
  const url = new URL(`${API_BASE}/api/stations`);
  if (query.trim().length > 0) url.searchParams.set("query", query.trim());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch stations (HTTP ${res.status})`);
  return res.json();
}
