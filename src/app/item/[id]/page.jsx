"use client";

import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import { useDataCollection } from "context/DataCollectionContext";
import dataset from "/public/data/dataset-websweep.json";
import { getGeo, getPerformance, getSeo } from "lib/universal/metricInitiators";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ItemPage({ params }) {
  const idParam = params?.id;
  const id = Number(idParam);

  const { computedData } = useDataCollection();
  const router = useRouter();

  const item = dataset.find((entry) => entry.id === id);
  const geo = computedData[id]?.GLOBAL?.GEO || null;
  const seo = computedData[id]?.MOBILE?.SEO || null;
  const performance = computedData[id]?.PERFORMANCE?.DESKTOP || null;
  const href = item.website ? (/^https?:\/\//i.test(item.website) ? item.website : `https://${item.website}`) : undefined;

  useEffect(() => {
    if (computedData[item.id]) return;

    console.log("the item", item)

    getGeo([item]).then(result => {
        updateData(item.id, "GLOBAL", "GEO", result);

        console.log("result = ", result)
        console.log(computedData)
    });

    getSeo(href).then(result => {
        console.log("seo result ", result)

        updateData(item.id, "MOBILE", "SEO", result);
    });

    getPerformance(href).then(result => {
        updateData(item.id, "DESKTOP", "PERFORMANCE", result);
    });
  }, [])

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div>
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
        >
          <span aria-hidden="true">←</span>
          Back to results
        </button>
      </div>
      <div className="flex gap-3 h-full">
        <LeftPanel item={item} geo={geo} />
        <RightPanel item={item} />
      </div>
    </div>
  );
}
