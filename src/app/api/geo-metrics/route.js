import { NextResponse } from "next/server";
import { runGeo } from "lib/geo";

export const maxDuration = 120 

export async function POST(req) {
  try {
    const body = await req.json();

    const raw = Array.isArray(body)
      ? body
      : Array.isArray(body?.items)
      ? body.items
      : body;

    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items provided" },
        { status: 400 }
      );
    }

    const results = await runGeo(raw);

    return NextResponse.json(
      { success: true, items: results },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}
