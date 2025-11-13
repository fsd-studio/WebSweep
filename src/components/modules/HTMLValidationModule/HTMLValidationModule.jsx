import React, { useState, useEffect } from 'react';
import { useDataCollection } from 'context/DataCollectionContext';

// Base URL for the W3C HTML Checker API
const W3C_API_URL = 'https://validator.w3.org/nu/?out=json&doc=';

// Utility function to wait for a specific duration
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function HTMLValidationModule() {
    const { geoDataCollection } = useDataCollection();
    const [HTMLValidationResults, setHTMLValidationResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // State to track progress for the loading message (without triggering main render)
    const [progressCount, setProgressCount] = useState(0); 

    // Set a delay of 1 second (1000ms) between requests to avoid rate limits
    const REQUEST_DELAY_MS = 1000; 

    // Asynchronous function to fetch and process validation data for one URL
    const getValidationCounts = async (url) => {
        // 1. Ensure the URL has a protocol (e.g., https://)
        let fullUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            fullUrl = `https://${url}`;
        }

        try {
            // Fetch the validation report from W3C
            const response = await fetch(`${W3C_API_URL}${encodeURIComponent(fullUrl)}`);
            
            if (!response.ok) {
                console.error(`API Fetch Failed for ${fullUrl}: Status ${response.status}`);
                return { 
                    url: fullUrl, 
                    errors: `API Error ${response.status}`, 
                    warnings: 'N/A' 
                };
            }

            const data = await response.json();
            
            // ... (Logging is kept for debugging)
            // console.log(`--- W3C Data for: ${fullUrl} ---`);
            // console.log('Raw API Response Data:', data); 
            
            let errors = 0;
            let warnings = 0;

            // Loop through the messages array to count types
            if (data.messages && Array.isArray(data.messages)) {
                data.messages.forEach(message => {
                    if (message.type === 'error' || message.type === 'non-document-error') {
                        errors++;
                    } else if (message.type === 'warning' || message.type === 'info') {
                        warnings++;
                    }
                });
            }

            // console.log(`Final Counts for ${fullUrl}: Errors: ${errors}, Warnings: ${warnings}`);
            // console.log('-----------------------------------');
            
            return { url: fullUrl, errors, warnings };
        } catch (error) {
            console.error('Validation fetch failed for', fullUrl, error);
            return { url: fullUrl, errors: 'Network Failed', warnings: 'N/A' };
        }
    };

    useEffect(() => {
        const validateAllUrlsSequentially = async () => {
            if (geoDataCollection.length === 0) return;

            setIsLoading(true);
            setProgressCount(0); // Reset progress counter
            
            // Filter out invalid/empty URLs
            const urlsToValidate = geoDataCollection
                .map(item => item.url)
                .filter(url => url && typeof url === 'string' && url.trim() !== '');

            const results = [];

            // Sequential loop with delay for rate limiting and progressive UX
            for (const url of urlsToValidate) {
                const result = await getValidationCounts(url); 
                results.push(result);
                
                // *** MODIFICATION 1: Use progressCount for intermediate re-renders ***
                setProgressCount(prevCount => prevCount + 1);
                
                // *** MODIFICATION 2: REMOVE THE IMMEDIATE STATE UPDATE ***
                // setHTMLValidationResults([...results]); // <--- THIS CAUSED THE ONE-BY-ONE RENDER!
                
                // Pause before the next request
                await delay(REQUEST_DELAY_MS);
            }
            
            // *** MODIFICATION 3: Set the FINAL state outside the loop ***
            setHTMLValidationResults(results); 
            setIsLoading(false);
        };

        validateAllUrlsSequentially();
    }, [geoDataCollection]); // Depend on the data collection

    // Calculate total URLs available for the status message
    const totalValidUrls = geoDataCollection
        .map(item => item.url)
        .filter(url => url && typeof url === 'string' && url.trim() !== '')
        .length;


    return (
        <div>
            <h2>W3C Validation Results</h2>
            <hr/>
            
            {/* 1. PROGRESS COUNTER AND STATUS */}
            <p style={{ fontWeight: 'bold' }}>
                {isLoading 
                    // Use the dedicated progressCount state for the status message
                    ? `🔍 Validating URL ${progressCount + 1} of ${totalValidUrls}...` 
                    : `✅ Validation Complete for all ${totalValidUrls} URLs.`
                }
            </p>
            <hr/>

            {/* 2. RESULTS TABLE - Only show the table if NOT loading AND there are results */}
            {/* The condition ensures the table only appears after isLoading is false and data is ready */}
            {!isLoading && HTMLValidationResults.length > 0 && (
                <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ccc' }}>
                            <th style={{ textAlign: 'left', padding: '10px 20px 10px 0' }}>URL</th>
                            <th style={{ textAlign: 'center', padding: '10px 20px' }}>Errors</th>
                            <th style={{ textAlign: 'center', padding: '10px 0 10px 20px' }}>Warnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {HTMLValidationResults.map((result, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                {/* URL Cell with Padding */}
                                <td style={{ padding: '8px 20px 8px 0', fontSize: '0.9em' }}>
                                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                                        {result.url}
                                    </a>
                                </td>
                                
                                {/* ERRORS Cell with Padding and Color */}
                                <td style={{ padding: '8px 20px', textAlign: 'center' }}>
                                    <strong style={{ color: result.errors > 0 ? 'red' : 'green' }}>
                                        {result.errors}
                                    </strong>
                                </td>
                                
                                {/* WARNINGS Cell with Padding and Color */}
                                <td style={{ padding: '8px 0 8px 20px', textAlign: 'center' }}>
                                    <span style={{ color: result.warnings > 0 ? 'orange' : 'inherit' }}>
                                        {result.warnings}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            {/* 3. Initial Empty State Message */}
            {!isLoading && HTMLValidationResults.length === 0 && totalValidUrls > 0 && (
                <p>Waiting to start validation...</p>
            )}
            
            {/* 4. If geoDataCollection is empty */}
            {geoDataCollection.length === 0 && (
                <p>No URLs loaded for validation.</p>
            )}

        </div>
    );
}

export default HTMLValidationModule;