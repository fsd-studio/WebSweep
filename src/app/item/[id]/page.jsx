"use client";

import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import { useDataCollection } from "context/DataCollectionContext";
import dataset from "/public/data/dataset-websweep.json";
import { getGeo, getPerformance, getSeo } from "lib/universal/metricInitiators";
import { useEffect } from "react";

export default function ItemPage({ params }) {
  const idParam = params?.id;
  const id = Number(idParam);

  const { computedData, updateData } = useDataCollection();

  const item = dataset.find((entry) => entry.id === id);

  const geo = computedData[id]?.GLOBAL?.GEO || null;
  const seo = computedData[id]?.MOBILE?.SEO || null;
  const performance = computedData[id]?.DESKTOP?.PERFORMANCE || null;

  const href =
    item?.website && typeof item.website === "string"
      ? /^https?:\/\//i.test(item.website)
        ? item.website
        : `https://${item.website}`
      : undefined;

  useEffect(() => {
    if (!item || computedData[item.id]) return;

    getGeo([item]).then((result) => {
      if (result) {
        updateData(item.id, "GLOBAL", "GEO", result);
      }
    });

    if (href) {
      getSeo(href).then((result) => {
        if (result) {
          updateData(item.id, "MOBILE", "SEO", result);
        }
      });

      getPerformance(href).then((result) => {
        if (result) {
          updateData(item.id, "DESKTOP", "PERFORMANCE", result);
        }
      });
    }
  }, [item, href, computedData, updateData]);

  if (!item) {
    return (
      <div className="p-4 text-sm text-red-600">
        Could not find this item in the dataset.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-3 h-full">
        <LeftPanel item={item} geo={geo} seo={seo} performance={performance} />
        <RightPanel item={item} />
      </div>
    </div>
  );
}
