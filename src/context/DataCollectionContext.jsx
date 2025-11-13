"use client"

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
        "city": "Zürich",
        "canton": "Zürich",
        "Category":"Education"
      },
      {
        "title": "pro lumerins",
        "website": "www.lumnezia.ch",
        "phone": "0041 79 508 35 33",
        "email": "prolumerins@gmail.com",
        "geo": "46.6824, 9.1443",
        "city": "Lumnezia",
        "canton": "Graubünden/Grischun/Grigioni",
        "Category":"Restaurant \/ Hospitality"
      },
      {
        "title": "evang ref kirchgemeinde ringgenberg",
        "website": "www.kircheringgenberg.ch",
        "phone": "0041 33 822 20 53",
        "email": "andreas.schiltknecht@kircheringgenberg.ch",
        "geo": "46.68473, 7.89413",
        "city": "Bönigen",
        "canton": "Bern/Berne",
        "Category":"Non-Profit \/ Charity"
      },
      {
        "title": "sos enfants de chez nous",
        "website": "www.sosenfantsdecheznous.ch",
        "phone": "0041 79 606 27 07",
        "email": "info@sosenfantsdecheznous.ch",
        "geo": "46.23224, 7.36284",
        "city": "Sion",
        "canton": "Valais/Wallis",
        "Category":"Commercial \/ Retail"
      },
      {
        "title": "schweizerische multiple sklerose gesellschaft",
        "website": "www.multiplesklerose.ch",
        "phone": null,
        "email": null,
        "geo": "47.3893, 8.5294",
        "city": "Zürich",
        "canton": "Zürich",
        "Category":"Education"
      },
      {
          "Title":"alzheimer schweiz",
          "Website":"www.alzheimer-schweiz.ch",
          "Phone":null,
          "Email":null,
          "geo": "47.3893, 8.5297",
          "City":"Bern",
          "Canton":"Bern\/Berne",
          "Category":"Restaurant \/ Hospitality"
        },
    ]
  );

  const [computedData, setComputedData] = useState({
    1: {geo: {score: 44}, seo: {score: 44}, performance: {score: 44}}
  });

  const updateScore = (id, type, scoreObj) => {
    setComputedData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: scoreObj,
      },
    }));
  };

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
      updateScore,
      HTMLValidationResults, 
      setHTMLValidationResults
    }}>
      {children}
    </DataCollectionContext.Provider>
  );
}

export const useDataCollection = () => useContext(DataCollectionContext);
