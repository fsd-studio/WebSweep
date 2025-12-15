import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../../generated/prisma/client.js";
import { runGeo } from "lib/geo";
import { runW3CValidation } from "lib/validation/validation";
import { getPerformance, getSeo } from "lib/universal/metricInitiators";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Prisma client with simple global caching for dev
const globalForPrisma = globalThis._prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") {
  globalThis._prisma = globalForPrisma;
}
const prisma = globalForPrisma;

export const config = { maxDuration: 120 };

export async function GET(_req, { params }) {
  // In Next.js 15 dynamic routes, params is async
  const resolvedParams = await params;
  const id = Number(resolvedParams?.id);

  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { success: false, error: "Valid numeric id is required" },
      { status: 400 }
    );
  }

  try {
    // 1. FETCH COMPANY RECORD
    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    console.log(
      `DB CHECK: Company ${id} Metrics Status -> VAL:${!!company.validationMetrics} | SEO:${!!company.seoMetrics} | PERF:${!!company.performanceMetrics} | GEO:${!!company.geoMetrics}`
    );

    // 2. DATA PREPARATION
    const rawData = [
      {
        url: company.website,
        email: company.email,
        phone: company.phone,
        city: company.city,
        canton: company.canton,
      },
    ];

    let mainHref = company.website;
    if (mainHref && !/^https?:\/\//i.test(mainHref)) {
      console.log(`URL Fix: Adding 'https://' to ${mainHref}`);
      mainHref = `https://${mainHref}`;
    }

    const updates = {};

    // Normalize legacy GEO shape: unwrap { data: {...} } into plain payload
    if (company.geoMetrics && company.geoMetrics.data && !company.geoMetrics.composite) {
      console.log(`GEO metrics legacy wrapper detected for ID ${id}, normalizing shape...`);
      const geoPayload = company.geoMetrics.data;
      updates.geoMetrics = geoPayload;
      company.geoMetrics = geoPayload;
    }

    // 3. W3C VALIDATION
    if (!company.validationMetrics) {
      console.log(`Validation metrics missing. Running W3C for ID ${id}...`);
      const validationSummary = await runW3CValidation(rawData);
      updates.validationMetrics = validationSummary;
      company.validationMetrics = validationSummary;
    }

    // 4. SEO & PERFORMANCE
    if (mainHref && !company.seoMetrics) {
      console.log(`SEO metrics missing. Running for ID ${id}...`);
      const seoData = await getSeo(mainHref, id);
      updates.seoMetrics = seoData;
      company.seoMetrics = seoData;
    }

    if (mainHref && !company.performanceMetrics) {
      console.log(`Performance metrics missing. Running for ID ${id}...`);
      const performanceData = await getPerformance(mainHref, id);
      updates.performanceMetrics = performanceData;
      company.performanceMetrics = performanceData;
    }

    // 5. GEO METRICS
    if (!company.geoMetrics) {
      console.log(`GEO metrics missing. Running for ID ${id}...`);

      const results = await runGeo(rawData);
      const item = Array.isArray(results) ? results[0] : null;

      if (item && item.success) {
        // Persist only the inner GEO payload (data), not the wrapper
        const geoPayload = item.data || item;
        updates.geoMetrics = geoPayload;
        company.geoMetrics = geoPayload;
      } else {
        const errorMsg = item?.error || "Failed to compute GEO metrics";
        console.error(`GEO Metric Failure for ID ${id}: ${errorMsg}`);
        // Only affect this response; leave DB null so it can retry later
        company.geoMetrics = { success: false, error: errorMsg };
      }
    }

    // 6. DATABASE COMMIT
    const updateKeys = Object.keys(updates);
    if (updateKeys.length > 0) {
      console.log("FINAL SAVE DEBUG: Committing the following keys:", updateKeys);
      console.log(
        "FINAL SAVE DEBUG: Updates object contents (sample):",
        updates.performanceMetrics ? "Performance data present" : "Performance data MISSING"
      );

      await prisma.company.update({
        where: { id },
        data: updates,
      });
    } else {
      console.log(
        `FINAL SAVE DEBUG: No new metrics were computed for ID ${id}. Nothing saved.`
      );
    }

    // 7. RESPONSE
    return NextResponse.json(
      {
        success: true,
        source: updateKeys.length > 0 ? "computed" : "db",
        metrics: {
          geo: company.geoMetrics,
          validation: company.validationMetrics,
          seo: company.seoMetrics,
          performance: company.performanceMetrics,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Master Metric Orchestrator Error:", e);
    return NextResponse.json(
      {
        success: false,
        error: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}
