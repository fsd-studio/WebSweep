import { NextResponse } from "next/server";
import { runW3CValidation } from "lib/validation/validation";


export const maxDuration = 300;

/**
 * Handles POST requests to run W3C validation on a list of URLs.
 * Expects a body that is either an array of URL objects or an object containing an 'items' array.
 * * @param {Request} req - The incoming Next.js request object.
 * @returns {Response} A Next.js response containing the aggregated error/warning counts.
 */
export async function POST(req) {
  try {
    const body = await req.json();

    const urlItems = Array.isArray(body)
      ? body
      : Array.isArray(body?.items)
      ? body.items
      : body;

    // --- Input Validation ---
    if (!Array.isArray(urlItems) || urlItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "No URL items provided in the request body." },
        { status: 400 }
      );
    }

    const aggregatedCounts = await runW3CValidation(urlItems);

    // Returns the singular JSON object: { error_count: N, warning_count: M }
    return NextResponse.json(
      { success: true, data: aggregatedCounts },
      { status: 200 }
    );
  } catch (e) {

    console.error("W3C Validation API Route Error:", e);
    return NextResponse.json(
      { success: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}