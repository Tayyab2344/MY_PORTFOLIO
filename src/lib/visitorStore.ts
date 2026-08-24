export interface VisitorLocation {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  timestamp: number;
  isCurrentVisitor?: boolean;
}

// In-memory active visitor cache (ephemeral presence store)
const activeVisitorsMap = new Map<string, VisitorLocation>();

// Seed global visitor nodes for initial visual telemetry
const SEED_VISITORS: Omit<VisitorLocation, "timestamp">[] = [
  { id: "seed-sf", city: "San Francisco", country: "United States", countryCode: "US", lat: 37.7749, lng: -122.4194 },
  { id: "seed-nyc", city: "New York", country: "United States", countryCode: "US", lat: 40.7128, lng: -74.006 },
  { id: "seed-ldn", city: "London", country: "United Kingdom", countryCode: "GB", lat: 51.5074, lng: -0.1278 },
  { id: "seed-ber", city: "Berlin", country: "Germany", countryCode: "DE", lat: 52.52, lng: 13.405 },
  { id: "seed-tok", city: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6762, lng: 139.6503 },
  { id: "seed-syd", city: "Sydney", country: "Australia", countryCode: "AU", lat: -33.8688, lng: 151.2093 },
  { id: "seed-sao", city: "São Paulo", country: "Brazil", countryCode: "BR", lat: -23.5505, lng: -46.6333 },
  { id: "seed-sg", city: "Singapore", country: "Singapore", countryCode: "SG", lat: 1.3521, lng: 103.8198 },
  { id: "seed-tor", city: "Toronto", country: "Canada", countryCode: "CA", lat: 43.6532, lng: -79.3832 },
  { id: "seed-ams", city: "Amsterdam", country: "Netherlands", countryCode: "NL", lat: 52.3676, lng: 4.9041 },
  { id: "seed-blr", city: "Bengaluru", country: "India", countryCode: "IN", lat: 12.9716, lng: 77.5946 },
  { id: "seed-par", city: "Paris", country: "France", countryCode: "FR", lat: 48.8566, lng: 2.3522 },
  { id: "seed-seo", city: "Seoul", country: "South Korea", countryCode: "KR", lat: 37.5665, lng: 126.978 },
  { id: "seed-cpt", city: "Cape Town", country: "South Africa", countryCode: "ZA", lat: -33.9249, lng: 18.4241 },
];

const TTL_MS = 10 * 60 * 1000; // 10 minutes session TTL

export function addOrUpdateVisitor(visitor: Omit<VisitorLocation, "timestamp">): VisitorLocation {
  const fullVisitor: VisitorLocation = {
    ...visitor,
    timestamp: Date.now(),
  };
  activeVisitorsMap.set(visitor.id, fullVisitor);
  return fullVisitor;
}

export function getActiveVisitors(): VisitorLocation[] {
  const now = Date.now();
  
  // Clean up expired items
  for (const [id, item] of activeVisitorsMap.entries()) {
    if (now - item.timestamp > TTL_MS) {
      activeVisitorsMap.delete(id);
    }
  }

  const active = Array.from(activeVisitorsMap.values());
  
  // Combine real active visitors with seed visitors for ambient density
  const nowTs = Date.now();
  const seedList: VisitorLocation[] = SEED_VISITORS.map((seed) => ({
    ...seed,
    timestamp: nowTs,
  }));

  // Ensure current active visitors override seed nodes with same ID if any
  const combinedMap = new Map<string, VisitorLocation>();
  seedList.forEach((v) => combinedMap.set(v.id, v));
  active.forEach((v) => combinedMap.set(v.id, v));

  return Array.from(combinedMap.values());
}
