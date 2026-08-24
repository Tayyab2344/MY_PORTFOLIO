import { NextRequest, NextResponse } from "next/server";
import { getActiveVisitors, addOrUpdateVisitor } from "@/lib/visitorStore";

export async function GET() {
  try {
    const visitors = getActiveVisitors();
    return NextResponse.json({
      success: true,
      activeCount: visitors.length,
      timestamp: Date.now(),
      visitors,
    });
  } catch (error) {
    console.error("Active visitors API fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve active visitors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.id || typeof body.lat !== "number" || typeof body.lng !== "number") {
      return NextResponse.json({ success: false, error: "Invalid visitor payload" }, { status: 400 });
    }

    const updated = addOrUpdateVisitor({
      id: body.id,
      city: body.city || "Active Node",
      country: body.country || "Earth",
      countryCode: body.countryCode || "UN",
      lat: body.lat,
      lng: body.lng,
      isCurrentVisitor: true,
    });

    return NextResponse.json({ success: true, visitor: updated });
  } catch (error) {
    console.error("Heartbeat error:", error);
    return NextResponse.json({ success: false, error: "Failed to update heartbeat" }, { status: 500 });
  }
}
