import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://health.gov/myhealthfinder/api/v3/topicsearch.json?lang=en&keyword=mental",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch health.gov API");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Error in /api/healthgov:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
