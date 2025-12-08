"use client";

import { createContext, useState, useContext, useEffect } from 'react';

const DataCollectionContext = createContext();

export function DataCollectionProvider({ children }) {
  const [companyData, setCompanyData] = useState([
    {
      "title": "marie meierhofer institut fur das kind",
      "website": "www.mmi.ch",
      "phone": "0041 44 205 52 20",
      "email": "info@mmi.ch",
      "geo": "47.3947, 8.5275",
      "city": "ZǬrich",
      "canton": "ZǬrich",
      "Category": "Education"
    },
    {
      "title": "pro lumerins",
      "website": "www.lumnezia.ch",
      "phone": "0041 79 508 35 33",
      "email": "prolumerins@gmail.com",
      "geo": "46.6824, 9.1443",
      "city": "Lumnezia",
      "canton": "GraubǬnden/Grischun/Grigioni",
      "Category": "Restaurant / Hospitality"
    },
    {
      "title": "evang ref kirchgemeinde ringgenberg",
      "website": "www.kircheringgenberg.ch",
      "phone": "0041 33 822 20 53",
      "email": "andreas.schiltknecht@kircheringgenberg.ch",
      "geo": "46.68473, 7.89413",
      "city": "B��nigen",
      "canton": "Bern/Berne",
      "Category": "Non-Profit / Charity"
    },
    {
      "title": "sos enfants de chez nous",
      "website": "www.sosenfantsdecheznous.ch",
      "phone": "0041 79 606 27 07",
      "email": "info@sosenfantsdecheznous.ch",
      "geo": "46.23224, 7.36284",
      "city": "Sion",
      "canton": "Valais/Wallis",
      "Category": "Commercial / Retail"
    },
    {
      "title": "schweizerische multiple sklerose gesellschaft",
      "website": "www.multiplesklerose.ch",
      "phone": null,
      "email": null,
      "geo": "47.3893, 8.5294",
      "city": "ZǬrich",
      "canton": "ZǬrich",
      "Category": "Education"
    },
    {
      "Title": "alzheimer schweiz",
      "Website": "www.alzheimer-schweiz.ch",
      "Phone": null,
      "Email": null,
      "geo": "47.3893, 8.5297",
      "City": "Bern",
      "Canton": "Bern/Berne",
      "Category": "Restaurant / Hospitality"
    },
  ]);

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
      companyData,
      setCompanyData,
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
