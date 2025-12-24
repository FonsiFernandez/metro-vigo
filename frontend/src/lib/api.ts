export type Line = {
  id: number;
  code: string;
  name: string;
  colorHex: string;
  status: "OK" | "DELAYED" | "DOWN" | string;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

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

export async function getStation(id: number): Promise<Station> {
  const res = await fetch(`${API_BASE}/api/stations/${id}`);
  if (!res.ok) throw new Error(`Station not found (HTTP ${res.status})`);
  return res.json();
}

export type LineDetail = Line & { stations: Station[] };

export async function getLine(id: number): Promise<LineDetail> {
  const res = await fetch(`${API_BASE}/api/lines/${id}`);
  if (!res.ok) throw new Error(`Line not found (HTTP ${res.status})`);
  return res.json();
}

export type Incident = {
  id: number;
  severity: "INFO" | "MINOR" | "MAJOR" | "CRITICAL" | string;
  scope: "NETWORK" | "LINE" | "STATION" | string;
  title: string;
  message: string;
  active: boolean;
  createdAt: string;
  lineId: number | null;
  lineCode: string | null;
  stationId: number | null;
  stationName: string | null;
};

export async function getActiveIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API_BASE}/api/incidents`);
  if (!res.ok) throw new Error(`Failed to fetch incidents (HTTP ${res.status})`);
  return res.json();
}

export type NextArrival = {
  lineId: number;
  lineCode: string;
  direction: string;
  minutes: number;
};

export async function getNextArrivals(stationId: number): Promise<NextArrival[]> {
  const res = await fetch(`${API_BASE}/api/stations/${stationId}/arrivals`);
  if (!res.ok) throw new Error("Failed to fetch arrivals");
  return res.json();
}

export async function getStationLines(stationId: number): Promise<Line[]> {
  const res = await fetch(`${API_BASE}/api/stations/${stationId}/lines`);
  if (!res.ok) throw new Error(`Failed to fetch station lines (HTTP ${res.status})`);
  return res.json();
}

export async function getLineStations(lineId: number): Promise<Station[]> {
  const line = await getLine(lineId);
  return line.stations ?? [];
}

export type JourneyLeg = {
  type: "WALK" | "METRO";
  lineCode?: string;
  fromName: string;
  toName: string;
  durationMin: number;
  direction?: string;
};

export type JourneyPlan = {
  totalDurationMin: number;
  transfers: number;
  legs: JourneyLeg[];
};

export async function planJourney(params: {
  fromStationId: number;
  toStationId: number;
  datetimeISO?: string;
}): Promise<JourneyPlan> {
  const url = new URL(`${API_BASE}/api/journey`);
  url.searchParams.set("from", String(params.fromStationId));
  url.searchParams.set("to", String(params.toStationId));
  if (params.datetimeISO) url.searchParams.set("datetime", params.datetimeISO);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to plan journey (HTTP ${res.status})`);
  return res.json();
}
