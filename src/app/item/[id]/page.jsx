"use client";

import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import { useDataCollection } from "context/DataCollectionContext";
import dataset from "/public/data/dataset-websweep.json";

export default function ItemPage({ params }) {
  const idParam = params?.id;
  const id = Number(idParam);

  const { computedData } = useDataCollection();

  const item = dataset.find((entry) => entry.id === id);
  const geo = computedData[id]?.GLOBAL?.GEO || null;

  return (
    <div className="flex gap-3 h-full">
      <LeftPanel item={item} geo={geo} />
      <RightPanel />
    </div>
  );
}
