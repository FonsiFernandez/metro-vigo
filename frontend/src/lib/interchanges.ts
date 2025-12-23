import type { LineDetail } from "./api";

/**
 * Returns a map stationId -> { count, lineCodes }
 */
export function buildInterchangeMap(lines: LineDetail[]) {
  const map = new Map<number, { count: number; lineCodes: string[] }>();

  for (const line of lines) {
    for (const s of line.stations) {
      const prev = map.get(s.id);
      if (!prev) {
        map.set(s.id, { count: 1, lineCodes: [line.code] });
      } else {
        // avoid duplicates just in case
        if (!prev.lineCodes.includes(line.code)) {
          prev.lineCodes.push(line.code);
          prev.count += 1;
        }
      }
    }
  }

  // Sort line codes for stable UI
  for (const v of map.values()) v.lineCodes.sort();

  return map;
}
