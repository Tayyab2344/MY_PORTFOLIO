import { NextRequest, NextResponse } from "next/server";
import { addOrUpdateVisitor } from "@/lib/visitorStore";

export async function GET(req: NextRequest) {
  try {
    // 1. Try to read edge headers (Vercel / Cloudflare)
    const vercelCity = req.headers.get("x-vercel-ip-city");
    const vercelCountry = req.headers.get("x-vercel-ip-country");
    const vercelLat = req.headers.get("x-vercel-ip-latitude");
    const vercelLng = req.headers.get("x-vercel-ip-longitude");

    let city = vercelCity ? decodeURIComponent(vercelCity) : "";
    let country = vercelCountry || "";
    let lat = vercelLat ? parseFloat(vercelLat) : 0;
    let lng = vercelLng ? parseFloat(vercelLng) : 0;

    // 2. Fallback to client IP resolution if edge headers aren't present
    if (!city || !lat || !lng) {
      const forwarded = req.headers.get("x-forwarded-for");
      const rawIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "";

      // Check if IP is non-local/public
      if (rawIp && !rawIp.startsWith("127.") && !rawIp.startsWith("192.168.") && rawIp !== "::1") {
        try {
          const res = await fetch(`http://ip-api.com/json/${rawIp}?fields=status,country,countryCode,city,lat,lon`, {
            signal: AbortSignal.timeout(3000),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.status === "success") {
              city = data.city || "Unknown City";
              country = data.country || "Earth";
              lat = data.lat;
              lng = data.lon;
            }
          }
        } catch {
          // Ignore external lookup failure, fallback will trigger below
        }
      }
    }

    // 3. Fallback default for local development / unresolvable IP
    if (!city || (lat === 0 && lng === 0)) {
      city = "Developer Node";
      country = "Local Network";
      // Slight coordinate offset so multiple local tabs don't overlap exactly
      lat = 37.7749 + (Math.random() - 0.5) * 0.5;
      lng = -122.4194 + (Math.random() - 0.5) * 0.5;
    }

    // Add slight random coordinate fuzzing (+/- 0.05 deg ~ 5km) for strict privacy
    const fuzzedLat = Number((lat + (Math.random() - 0.5) * 0.08).toFixed(4));
    const fuzzedLng = Number((lng + (Math.random() - 0.5) * 0.08).toFixed(4));

    // Create session ID based on IP hash or random client token
    const sessionId = `visitor-${Math.random().toString(36).substring(2, 9)}`;

    const location = addOrUpdateVisitor({
      id: sessionId,
      city,
      country: country || "Earth",
      countryCode: country.substring(0, 2).toUpperCase() || "UN",
      lat: fuzzedLat,
      lng: fuzzedLng,
      isCurrentVisitor: true,
    });

    return NextResponse.json({
      success: true,
      sessionId: location.id,
      visitor: location,
    });
  } catch (error) {
    console.error("Geo API resolution error:", error);
    return NextResponse.json({ success: false, error: "Unable to resolve geolocation" }, { status: 500 });
  }
}
