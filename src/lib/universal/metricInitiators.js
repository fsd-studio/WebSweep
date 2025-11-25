import { geoMetrics } from "lib/geo/geoMetrics";

const SCRAPER_API_URL = "http://localhost:5001/api/scrape";

export async function getGeo(listObject) {
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

        console.log("test1", result)

        return result['0'].data
    } catch (error) {
        console.error("Failed to fetch geo data:", error);
    }
  };
}

export async function getPerformance(href) {
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

export async function getSeo(href) {
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

    const t0 = performance.now();
    const result = await response.json();
    const t1 = performance.now();

    console.log("JSON parsing took", (t1 - t0).toFixed(2), "ms");
    
    return result.success ? result.data.MOBILE.SEO : { score: null, audits: {} };
  } catch (error) {
    console.error("Error fetching SEO:", error);
    return { score: null, audits: {}, error: error.message };
  }
}