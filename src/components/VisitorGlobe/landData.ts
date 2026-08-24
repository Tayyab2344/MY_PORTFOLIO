// Compact bounding box definitions for major world landmasses
// Used to procedurally generate a clean dot-matrix land pattern over Earth sphere

interface LandRegion {
  name: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  densityMultiplier?: number;
}

const LAND_REGIONS: LandRegion[] = [
  // North America
  { name: "North America West", minLat: 25, maxLat: 70, minLng: -168, maxLng: -100 },
  { name: "North America East", minLat: 25, maxLat: 55, minLng: -100, maxLng: -52 },
  { name: "Central America", minLat: 7, maxLat: 25, minLng: -118, maxLng: -77 },
  { name: "Greenland", minLat: 60, maxLat: 83, minLng: -73, maxLng: -12 },
  // South America
  { name: "South America North", minLat: -15, maxLat: 12, minLng: -81, maxLng: -34 },
  { name: "South America South", minLat: -56, maxLat: -15, minLng: -76, maxLng: -50 },
  // Europe
  { name: "Western Europe", minLat: 36, maxLat: 71, minLng: -10, maxLng: 30 },
  { name: "Eastern Europe", minLat: 40, maxLat: 70, minLng: 30, maxLng: 60 },
  { name: "Scandinavia", minLat: 55, maxLat: 71, minLng: 4, maxLng: 32 },
  { name: "UK & Ireland", minLat: 50, maxLat: 59, minLng: -10, maxLng: 2 },
  // Africa
  { name: "North Africa", minLat: 15, maxLat: 37, minLng: -17, maxLng: 35 },
  { name: "Central Africa", minLat: -15, maxLat: 15, minLng: 8, maxLng: 42 },
  { name: "Southern Africa", minLat: -35, maxLat: -15, minLng: 11, maxLng: 33 },
  { name: "Madagascar", minLat: -26, maxLat: -12, minLng: 43, maxLng: 51 },
  // Asia
  { name: "Middle East", minLat: 12, maxLat: 42, minLng: 34, maxLng: 63 },
  { name: "Central Asia", minLat: 35, maxLat: 55, minLng: 46, maxLng: 87 },
  { name: "Siberia & Northern Asia", minLat: 50, maxLat: 75, minLng: 60, maxLng: 175 },
  { name: "South Asia / India", minLat: 6, maxLat: 36, minLng: 68, maxLng: 92 },
  { name: "East Asia / China", minLat: 18, maxLat: 53, minLng: 92, maxLng: 135 },
  { name: "Japan & Korea", minLat: 31, maxLat: 46, minLng: 124, maxLng: 146 },
  { name: "Southeast Asia", minLat: -10, maxLat: 22, minLng: 95, maxLng: 141 },
  // Oceania & Antarctica
  { name: "Australia West", minLat: -35, maxLat: -11, minLng: 112, maxLng: 135 },
  { name: "Australia East", minLat: -39, maxLat: -11, minLng: 135, maxLng: 154 },
  { name: "New Zealand", minLat: -47, maxLat: -34, minLng: 165, maxLng: 179 },
];

/**
 * Generate regular grid of lat/lon points matching continental landmasses
 */
export function generateLandDotCoordinates(latStep = 3.5, lngStep = 3.5): Array<[number, number]> {
  const dots: Array<[number, number]> = [];

  for (let lat = -80; lat <= 80; lat += latStep) {
    // Adjust longitude step at higher latitudes to maintain uniform spatial dot density
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const adjustedLngStep = cosLat > 0.15 ? lngStep / cosLat : lngStep * 4;

    for (let lng = -180; lng < 180; lng += adjustedLngStep) {
      // Check if point falls within land region bounds
      const isLand = LAND_REGIONS.some((r) => lat >= r.minLat && lat <= r.maxLat && lng >= r.minLng && lng <= r.maxLng);

      if (isLand) {
        dots.push([lat, lng]);
      }
    }
  }

  return dots;
}
