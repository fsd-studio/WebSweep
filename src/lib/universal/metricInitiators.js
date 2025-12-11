import { geoMetrics } from "lib/geo/geoMetrics"; 
// NOTE: SCRAPER_API_URL is removed as its logic moved to the server orchestrator
const BASE_URL = 'http://localhost:3000';
// The GET GEO function is now the Master Initiator, calling the server orchestrator route.
export async function getGeo(listObject) {
    if (!Array.isArray(listObject) || listObject.length === 0) return;

    const first = listObject[0];
    if (first && typeof first.id === "number") {
        try {
            // This GET request hits your Master Orchestrator route on your local server
            const response = await fetch(`/api/company-geo/${first.id}`, {
                // THE CRITICAL FIX: Bypass the Next.js cache for this request
                cache: 'no-store' 
            });
            
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`API error! Status: ${response.status}. Message: ${errorBody.error || "Server error."}`);
            }

            const dbJson = await response.json();

            if (dbJson?.success && dbJson.metrics) {
                // The orchestrator returns the full 'metrics' object containing GEO, SEO, Validation, etc.
                return dbJson; // Return the entire successful response object
            }
        } catch (err) {
            console.error("Failed to fetch all metrics from Orchestrator:", err);
            // Return an object that the client component can handle as a failure
            return { success: false, error: err.message }; 
        }
    }
    return null;
}

// NOTE: These initiators are conceptually fine, as they call separate POST routes.
// Keep these as they are, but ensure your client component uses the data 
// from the main 'getGeo' orchestrator response instead of making separate calls.

export async function getPerformance(href, id) {
    // This is assumed to be called only if the main orchestrator (getGeo) is not run.
    try {
        const response = await fetch(`${BASE_URL}/api/lighthouse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                href,
                id,
                categories: ['PERFORMANCE'],
                strategies: ['DESKTOP']
            }),
        });

        if (!response.ok) {
            // THE CRITICAL ADDITION: READ THE ERROR BODY TO FIND THE ROOT CAUSE
            const errorBody = await response.json().catch(() => ({ error: "Unknown API Error" }));
            const apiError = errorBody.error || `HTTP error! status: ${response.status}`;
            console.error("Lighthouse API 400 Body:", errorBody); // <-- LOG THE BODY
            throw new Error(`HTTP error! status: ${response.status}. API Message: ${apiError}`);
        }

        const result = await response.json();
        return result.success ? result.data.DESKTOP.PERFORMANCE : { score: null, audits: {} };
    } catch (error) {
        console.error("Error fetching performance:", error);
        return { score: null, audits: {}, error: error.message };
    }
}

export async function getSeo(href, id) {
    // This is assumed to be called only if the main orchestrator (getGeo) is not run.
    try {
        const response = await fetch(`${BASE_URL}/api/lighthouse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                href,
                id,
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


export async function getValidationSummary(listObject) {
    // This function can be kept, but the client should prefer the 'getGeo' response
    // if it contains all metrics. This is useful for fetching *only* validation later.
    if (!Array.isArray(listObject) || listObject.length === 0) {
        return { error_count: 0, warning_count: 0 };
    }

    try {
        const response = await fetch('/api/validation', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(listObject),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`HTTP error! status: ${response.status}. Message: ${errorBody.error || "Server error."}`);
        }

        const result = await response.json();
        
        return result.success ? result.data : { error_count: 0, warning_count: 0 };

    } catch (error) {
        console.error("Error fetching W3C Validation summary:", error);
        return { error_count: 'API Failed', warning_count: 'API Failed', error: error.message };
    }
}