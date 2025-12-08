"use client";

import { createContext, useState, useContext, useEffect } from 'react';

const DataCollectionContext = createContext();

export function DataCollectionProvider({ children }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('');
  const [canton, setCanton] = useState('');
  const [city, setCity] = useState('');
  const [searchApplied, setSearchApplied] = useState(null);

  const [computedData, setComputedData] = useState({});

  const normalizeScore = (val) =>
    val == null || Number.isNaN(Number(val)) ? null : Number(val);

  // Blend GEO (0-100), SEO (0-1 => 0-100), and Performance (0-1 => 0-100) into a single 0-100 score.
  const computeGeneralScore = (geo, seo, performance) => {
    const g = normalizeScore(geo?.composite?.score);
    const s = normalizeScore(seo?.score != null ? seo.score * 100 : null);
    const p = normalizeScore(performance?.score != null ? performance.score * 100 : null);
    const weights = [0.35, 0.25, 0.4];
    const parts = [g, s, p];
    const contributions = parts.map((n, i) => (Number.isFinite(n) ? n * weights[i] : 0));
    const totalWeight = parts.reduce(
      (acc, n, i) => acc + (Number.isFinite(n) ? weights[i] : 0),
      0
    );
    if (!totalWeight) return null;
    return Math.round(contributions.reduce((acc, n) => acc + n, 0) / totalWeight);
  };

  const updateData = (id, strategy, categoryKey, resultObj) => {
    setComputedData((prev) => {
      const next = {
        ...prev,
        [id]: {
          ...prev[id],
          [strategy]: {
            ...(prev[id]?.[strategy] || {}),
            [categoryKey]: resultObj,
          },
        },
      };

      const geo = next[id]?.GLOBAL?.GEO;
      const seo = next[id]?.MOBILE?.SEO;
      const perf = next[id]?.DESKTOP?.PERFORMANCE;
      const generalScore = computeGeneralScore(geo, seo, perf);

      if (generalScore != null) {
        next[id] = {
          ...next[id],
          GENERAL: {
            SUMMARY: { score: generalScore },
          },
        };
      }

      return next;
    });
  };

  useEffect(() => {
    console.log("computedData changed:", computedData);
  }, [computedData]);

  const [geoDataCollection, setGeoDataCollection] = useState([]);
  const [HTMLValidationResults, setHTMLValidationResults] = useState([]);

  return (
    <DataCollectionContext.Provider value={{
      geoDataCollection,
      setGeoDataCollection,
      computedData,
      setComputedData,
      updateData,

      currentPage,
      setCurrentPage,
      category,
      setCategory,
      canton,
      setCanton,
      city,
      setCity,
      searchApplied,
      setSearchApplied,
      HTMLValidationResults,
      setHTMLValidationResults,
    }}>
      {children}
    </DataCollectionContext.Provider>
  );
}

export const useDataCollection = () => useContext(DataCollectionContext);
