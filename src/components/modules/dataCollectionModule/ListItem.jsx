import { useDataCollection } from "context/DataCollectionContext";
import Link from "next/link";
import { useEffect } from "react";
import Loading from "./Loading";
import ScoreRing from "./ScoreRing";
import { getGeo, getPerformance, getSeo, getValidationSummary } from "lib/universal/metricInitiators";

function ListItem({ item, href }) {


  const { computedData, updateData } = useDataCollection();
  const id = item.id
  const mobileSeo = computedData[item.id]?.MOBILE?.SEO;
  const desktopPerformance = computedData[item.id]?.DESKTOP?.PERFORMANCE;
  const geo = computedData[item.id]?.GLOBAL?.GEO;
  const general = computedData[item.id]?.GENERAL?.SUMMARY;
  const validationData = computedData[item.id]?.GLOBAL?.VALIDATION;

  useEffect(() => {
    
      getGeo([item]).then((result) => {
        
          // New Logic: Check for the success and extract individual metrics
        if (result?.success && result.metrics) {

            // 1. GEO Metric (The key we were missing before)
            if (result.metrics.geo) {
              console.log("Geo Score Check:", geo?.composite?.score);
              updateData(item.id, "GLOBAL", "GEO", result.metrics.geo);
              console.log("Update sent for GEO:", result.metrics.geo?.composite?.score);
}
            
            // 2. SEO Metric (Extracted from orchestrator response)
            if (result.metrics.seo) {
              updateData(item.id, "MOBILE", "SEO", result.metrics.seo);
            }

            // 3. Performance Metric (Extracted from orchestrator response)
            if (result.metrics.performance) {
              updateData(item.id, "DESKTOP", "PERFORMANCE", result.metrics.performance);
            }

            // 4. Validation Metric (Extracted from orchestrator response)
            if (result.metrics.validation) {
              updateData(item.id, "GLOBAL", "VALIDATION", result.metrics.validation);
            }
            
        } else {
            console.error("Orchestrator returned an error or no metrics:", result?.error);
        }
      });
    

  }, []);

  return (
    <Link href={`/item/${item.id}`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-lg truncate w-90 font-semibold capitalize">
              {item.title || "Untitled"}
            </div>
            <div className="mt-0.5 text-sm text-gray-600">
              {item.city || "�?"}
              {item.canton ? `, ${item.canton}` : ""}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 me-2 w-[360px]">
            <div className="w-16 flex justify-center">
              {geo?.composite?.score != null ? (
                <ScoreRing score={geo?.composite?.score} />
              ) : (
                <Loading />
              )}
            </div>

            <div className="w-16 flex justify-center">
              {mobileSeo?.score != null ? (
                <ScoreRing score={mobileSeo.score * 100} />
              ) : (
                <Loading />
              )}
            </div>

            <div className="w-28 flex justify-center">
              {desktopPerformance?.score != null ? (
                <ScoreRing score={desktopPerformance.score * 100} />
              ) : (
                <Loading />
              )}
            </div>

            <div className="w-20 flex justify-center">
              {general?.score != null ? (
                <ScoreRing score={general.score} />
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ListItem;
