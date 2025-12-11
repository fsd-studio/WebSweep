import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runGeo } from "lib/geo"; 
import { runW3CValidation } from "lib/validation/validation";
import { getPerformance } from "lib/universal/metricInitiators"; 
import { getSeo } from "lib/universal/metricInitiators"; 

// --- Prisma Setup (Keep as is) ---
const globalForPrisma = globalThis._prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis._prisma = globalForPrisma;
}

const prisma = globalForPrisma;

export const config = { maxDuration: 120 };

export async function GET(_req, { params }) {
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

    console.log(`DB CHECK: Company ${id} Metrics Status -> VAL:${!!company.validationMetrics} | SEO:${!!company.seoMetrics} | PERF:${!!company.performanceMetrics}`);

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    // --- Data Preparation ---
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

    if (mainHref && !mainHref.startsWith('http')) {
        console.log(`URL Fix: Adding 'https://' to ${mainHref}`);
        mainHref = `https://${mainHref}`;
    }

    let updates = {}; // Object to track computed metrics before saving

    // ***************************************************************
    // 2. W3C VALIDATION CHECK
    // ***************************************************************
    if (!company.validationMetrics) {
      console.log(`Validation metrics missing. Running W3C for ID ${id}...`);
      
      const validationSummary = await runW3CValidation(rawData); 
      
      updates.validationMetrics = validationSummary;
      company.validationMetrics = validationSummary; 
    }

    // ***************************************************************
    // 3. SEO & PERFORMANCE CHECKS 
    // ***************************************************************
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


    // ***************************************************************
    // 4. GEO CHECK
    // ***************************************************************
    // NOTE: We are skipping this entire block to avoid GEO issues.
      if (!company.geoMetrics) {
      console.log(`GEO metrics missing. Running for ID ${id}...`);
      
      const results = await runGeo(rawData);
      const item = Array.isArray(results) ? results[0] : null;

      if (item && item.success) {
        // SUCCESS: Add to the updates object for database commit
        updates.geoMetrics = item;
        company.geoMetrics = item; // Update in-memory for immediate response
      } else {
        // FAILURE: Log the error, but DO NOT add to the 'updates' object.
        // This leaves company.geoMetrics as null in the DB, ensuring re-run next time.
        const errorMsg = item?.error || "Failed to compute GEO metrics";
        console.error(`GEO Metric Failure for ID ${id}: ${errorMsg}`);
        
        // Set the error for the current response only
        company.geoMetrics = { success: false, error: errorMsg }; 
      }
    }
    


    // ***************************************************************
    // 5. DATABASE COMMIT (Save all new data at once)
    // ***************************************************************
    if (Object.keys(updates).length > 0) {
      // ADD THIS LOG: Check the exact data structure and the keys being saved
      console.log("FINAL SAVE DEBUG: Committing the following keys:", Object.keys(updates));
      console.log("FINAL SAVE DEBUG: Updates object contents (sample):", updates.performanceMetrics ? "Performance data present" : "Performance data MISSING");
      
      await prisma.company.update({
          where: { id },
          data: updates, 
      });
  } else {
      console.log(`FINAL SAVE DEBUG: No new metrics were computed for ID ${id}. Nothing saved.`);
  }


    // ***************************************************************
    // 6. FINAL RESPONSE (Send all collected metrics to the client)
    // ***************************************************************
    return NextResponse.json(
      {
        success: true,
        source: Object.keys(updates).length > 0 ? "computed" : "db",
        metrics: {
            geo: company.geoMetrics,
            validation: company.validationMetrics,
            seo: company.seoMetrics,
            performance: company.performanceMetrics,
        }
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