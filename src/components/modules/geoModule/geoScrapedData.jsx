"use client"

import React, { useState, useEffect } from "react";
import { useDataCollection } from "context/DataCollectionContext"; 

// Define the URL of your Python Flask server
const SCRAPER_API_URL = "http://localhost:5001/api/scrape";


// Component to fetch geo-tagged data and save the result to Context.

function GeoData() {
    // Get the final data state and setter from Context
    const { companyData, geoDataCollection, setGeoDataCollection } = useDataCollection(); 
    
    // const [geoData, setGeoData] = useState([]); // REMOVED
    
    // State to manage the API call's lifecycle
    const [isLoading, setIsLoading] = useState(false); 

    useEffect(() => {
        // Only run the effect if companyData is a non-empty array
        if (Array.isArray(companyData) && companyData.length > 0) {
            
            setIsLoading(true);
            
            const fetchScrapedData = async () => {
                try {
                    // Send the companyData array directly in the request body
                    const response = await fetch(SCRAPER_API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(companyData), 
                    });

                    if (!response.ok) {
                        const errorBody = await response.json();
                        throw new Error(`API error! Status: ${response.status}. Message: ${errorBody.error || 'Server error.'}`);
                    }

                    const finalGeoData = await response.json(); 
                    
                    // Use the Context setter to save the final data
                    setGeoDataCollection(finalGeoData); 
                    
                } catch (error) {
                    console.error("Failed to fetch scraped data:", error);
                    // Set a descriptive error state in the Context
                    setGeoDataCollection([{ error: true, text: `Error fetching data: ${error.message}` }]);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchScrapedData();
            
        } else {
            // Reset state in Context if input data is empty
            setGeoDataCollection([]);
            setIsLoading(false);
        }
    }, [companyData, setGeoDataCollection]); // Add setGeoDataCollection to dependency array

    // --- RENDER LOGIC ---
    if (isLoading) {
        return <p>Contacting Python scraper API and processing {companyData.length} items...</p>;
    }
    
    // Read the data from Context for display/checks
    if (geoDataCollection.length === 0) {
        return <p>No data available for scraping.</p>;
    }

    return (
        <div className="geo-data-module">
            <h3>Scraped & Cleaned Data Output (Saved to Context)</h3>
            {/* Displaying the Context data for debugging */}
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8em', backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
                {JSON.stringify(geoDataCollection, null, 2)}
            </pre>
            {/* Your friend can now access geoDataCollection in her component! */}
        </div>
    );
}

export default GeoData;