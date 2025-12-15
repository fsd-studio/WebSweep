"use client";

import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";
import { useDataCollection } from "context/DataCollectionContext";
import { getGeo, getPerformance, getSeo } from "lib/universal/metricInitiators";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import { getCompanyById } from "app/actions/getCompany";


export default function ItemPage() {
  const params = useParams();
  const idParam = params?.id;
  
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const id = useMemo(() => {
    if (Array.isArray(idParam)) return Number(idParam[0]);
    return Number(idParam);
  }, [idParam]);

  const { computedData, updateData } = useDataCollection();

  const fetchItem = useCallback(async () => {
    if (isNaN(id)) {
        setError("Invalid company ID in URL.");
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
        const companyData = await getCompanyById(id);
        
        if (companyData) {
            setItem(companyData);
        } else {
            setError(`Company with ID ${id} not found.`);
        }
    } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load company details.");
    } finally {
        setIsLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    fetchItem();
  }, [fetchItem]);
  
  const geo = computedData[id]?.GLOBAL?.GEO || null;
  const seo = computedData[id]?.MOBILE?.SEO || null;
  const performance = computedData[id]?.DESKTOP?.PERFORMANCE || null;
  const general = computedData[id]?.GENERAL?.SUMMARY || null;

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

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Loading company details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-4 text-sm text-red-600">
        Could not find this item in the database.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex gap-6 h-full w-full">
        <div className="flex-[1.5] min-w-0">
          <LeftPanel item={item} geo={geo} seo={seo} performance={performance} general={general} />
        </div>
        <div className="flex-[1.5] min-w-0">
          <RightPanel item={item} />
        </div>
      </div>
    </div>
  );
}