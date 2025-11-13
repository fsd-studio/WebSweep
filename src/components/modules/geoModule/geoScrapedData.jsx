import React, { useState, useEffect } from "react";
import { useDataCollection } from "context/DataCollectionContext"; 

// Update the API URL to the new single-scrape endpoint
const SCRAPER_API_URL = "http://localhost:5000/api/scrape_single";

// Utility function to introduce a delay for sequential processing
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function GeoData() {
    // Get the final data state and setter from Context
    const { companyData, geoDataCollection, setGeoDataCollection } = useDataCollection(); 
    
    // State to manage the API call's lifecycle
    const [isLoading, setIsLoading] = useState(false); 
    
    // State to temporarily hold the *partially* loaded data count for the loading message
    const [tempResultsCount, setTempResultsCount] = useState(0); 

    // Set a delay of 100ms between requests to prevent overwhelming the local server
    const REQUEST_DELAY_MS = 100; 

    useEffect(() => {
        if (Array.isArray(companyData) && companyData.length > 0) {
            
            setIsLoading(true);
            setGeoDataCollection([]); // Clear previous results before starting
            setTempResultsCount(0); // Reset temp counter

            const fetchScrapedDataSequentially = async () => {
                const results = [];
                
                // 1. Loop through each company object one-by-one
                for (const companyObject of companyData) {
                    try {
                        // 2. Send only the current companyObject in the request body
                        const response = await fetch(SCRAPER_API_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(companyObject), 
                        });

                        if (!response.ok) {
                            const errorBody = await response.json();
                            throw new Error(`API error! Status: ${response.status}. Message: ${errorBody.error || 'Server error.'}`);
                        }

                        // 3. Get the single result object
                        const singleGeoData = await response.json(); 
                        results.push(singleGeoData);

                        // Update the temporary counter for progress (Progressive UX)
                        setTempResultsCount(prevCount => prevCount + 1);
                        
                        // 4. Wait for a moment to prevent overwhelming the server
                        await delay(REQUEST_DELAY_MS);

                    } catch (error) {
                        console.error(`Failed to fetch scraped data for URL: ${companyObject.website || 'N/A'}`, error);
                        
                        // Add a structured error object to the results for the failed item
                        results.push({ 
                            url: companyObject.website || 'N/A', 
                            title: 'CLIENT_ERROR', 
                            text: `Failed: ${error.message.substring(0, 100)}...`,
                            tags: [companyObject.city || 'N/A', companyObject.canton || 'N/A']
                        });
                        // Update the temporary counter for progress on failure too
                        setTempResultsCount(prevCount => prevCount + 1);
                    }
                }
                
                // 5. FILTER STEP: Remove items that did not pass the URL/robots.txt check
                // This assumes failed sites have null or 'N/A' in the url field.
                const finalFilteredResults = results.filter(item => {
                    const url = item.url;
                    // Only keep items with a valid string URL that is not 'N/A'
                    return url && typeof url === 'string' && url.trim().toUpperCase() !== 'N/A';
                });
                
                // 6. Only update the FINAL context state AFTER filtering and the loop finishes
                setGeoDataCollection(finalFilteredResults); 
                setIsLoading(false);
            };

            fetchScrapedDataSequentially();
            
        } else {
            setGeoDataCollection([]);
            setIsLoading(false);
            setTempResultsCount(0);
        }
    }, [companyData, setGeoDataCollection]); 

    // --- RENDER LOGIC (Optimized to prevent jumping) ---
    const totalCompanies = companyData.length;
    
    if (isLoading) {
        // Use tempResultsCount for the loading progress message
        return <p>Contacting Python scraper API and processing item **{tempResultsCount + 1} of {totalCompanies}**...</p>;
    }
    
    if (geoDataCollection.length === 0 && totalCompanies > 0 && !isLoading) {
         // Show this if process finished with no *valid* results
        return <p>Scraping complete. No valid URLs found to process further.</p>;
    }
    
    if (geoDataCollection.length === 0 && totalCompanies === 0) {
        return <p>No company data available for scraping.</p>;
    }

    
    //return (
    //    <div className="geo-data-module">
    //        <h3>Scraped & Filtered Data Output (Total Valid Items: {geoDataCollection.length})</h3>
    //        {/* Display the Context data for debugging */}
    //        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8em', backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
    //            {JSON.stringify(geoDataCollection, null, 2)}
    //        </pre>
    //    </div>
    //);
}

export default GeoData;