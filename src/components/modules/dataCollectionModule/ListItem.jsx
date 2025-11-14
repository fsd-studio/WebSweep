import { useEffect } from "react";
import Loading from "./Loading";
import ScoreRing from "./ScoreRing";
import { useDataCollection } from "context/DataCollectionContext";
import { geoMetrics } from "lib/geo/geoMetrics";

const SCRAPER_API_URL = "http://localhost:5001/api/scrape";

function ListItem({ item, href}) {
    const { computedData, updateData } = useDataCollection();
    const mobileSeo = computedData[item.id]?.MOBILE?.SEO;
    const desktopPerformance = computedData[item.id]?.DESKTOP?.PERFORMANCE;
    const geo = computedData[item.id]?.GLOBAL?.GEO; 

    async function getGeo(listObject) {
      if (Array.isArray(listObject) && listObject.length > 0) {
        try {
            const response = await fetch(SCRAPER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(listObject), 
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`API error! Status: ${response.status}. Message: ${errorBody.error || 'Server error.'}`);
            }

            const finalGeoData = await response.json(); 
            
            const result = await geoMetrics(finalGeoData);

            return result['0'].data
        } catch (error) {
            console.error("Failed to fetch geo data:", error);
        }
      };
    }

    async function getPerformance(href) {
      try {
        const response = await fetch('/api/lighthouse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            href,
            categories: ['PERFORMANCE'],
            strategies: ['DESKTOP']
          }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        return result.success ? result.data.DESKTOP.PERFORMANCE : { score: null, audits: {} };
      } catch (error) {
        console.error("Error fetching performance:", error);
        return { score: null, audits: {}, error: error.message };
      }
    }

    async function getSeo(href) {
      try {
        const response = await fetch('/api/lighthouse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            href,
            categories: ['SEO'],
            strategies: ['MOBILE']
          }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        return result.success ? result.data.MOBILE.SEO : { score: null, audits: {} };
      } catch (error) {
        console.error("Error fetching SEO:", error);
        return { score: null, audits: {}, error: error.message };
      }
    }





    useEffect(() => {
        if (computedData[item.id]) return;

        getGeo([item]).then(result => {
            updateData(item.id, "GLOBAL", "GEO", result);

            console.log("result = ", result)
            console.log(computedData)
        });

        getSeo(href).then(result => {
            console.log(result)

            updateData(item.id, "MOBILE", "SEO", result);
        });

        getPerformance(href).then(result => {
            updateData(item.id, "DESKTOP", "PERFORMANCE", result);
        });
      
    }
    , [])
  
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-lg truncate w-90 font-semibold capitalize">{item.title || 'Untitled'}</div>
                    <div className="mt-0.5 text-sm text-gray-600">{item.city || '—'}{item.canton ? `, ${item.canton}` : ''}</div>
                </div>

                <div className="flex">
                    <div className="flex me-11.5">
                        <div className="w-20">
                            {geo?.composite?.score != null ? <ScoreRing score={geo?.composite?.score} /> : <Loading />}
                        </div>

                        <div className="w-20">
                            {mobileSeo?.score != null ? <ScoreRing score={mobileSeo.score * 100} /> : <Loading />}
                        </div>

                        <div className="w-20">
                            {desktopPerformance?.score != null ? <ScoreRing score={desktopPerformance.score * 100} /> : <Loading />}
                        </div>

                    </div>
                </div>


                {href && (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                >
                    Visit site
                </a>
                )}
            </div>
        </div>
    );
}

export default ListItem;