import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runGeo } from "lib/geo";

const globalForPrisma = globalThis._prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis._prisma = globalForPrisma;
}

const prisma = globalForPrisma;

export const config = { maxDuration: 120 };

export async function GET(_req, { params }) {
  const id = Number(params?.id);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { success: false, error: "Valid numeric id is required" },
      { status: 400 }
    );
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    if (company.geoMetrics) {
      const stored = company.geoMetrics;
      const data =
        stored && typeof stored === "object" && "data" in stored
          ? stored.data
          : stored;

      return NextResponse.json(
        { success: true, source: "db", data },
        { status: 200 }
      );
    }

    const raw = [
      {
        url: company.website,
        email: company.email,
        phone: company.phone,
        city: company.city,
        canton: company.canton,
      },
    ];

    const results = await runGeo(raw);
    const item = Array.isArray(results) ? results[0] : null;

    if (!item || !item.success) {
      return NextResponse.json(
        {
          success: false,
          error: item?.error || "Failed to compute GEO metrics",
        },
        { status: 500 }
      );
    }

    await prisma.company.update({
      where: { id },
      data: { geoMetrics: item },
    });

    return NextResponse.json(
      { success: true, source: "computed", data: item.data ?? null },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}

