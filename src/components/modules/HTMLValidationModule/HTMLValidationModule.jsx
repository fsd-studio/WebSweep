import React, { useState, useEffect } from 'react';
import { useDataCollection } from 'context/DataCollectionContext';

const W3C_API_URL = 'https://validator.w3.org/nu/?out=json&doc=';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// Asynchronous function to fetch and process validation data for one URL.
// Returns aggregated errors and warnings for that URL.
const getValidationCounts = async (url) => {
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = `https://${url}`;
    }

    try {
        const response = await fetch(`${W3C_API_URL}${encodeURIComponent(fullUrl)}`);
        
        if (!response.ok) {
            console.error(`API Fetch Failed for ${fullUrl}: Status ${response.status}`);
            return { errors: 0, warnings: 0 }; 
        }

        const data = await response.json();
        
        let errors = 0;
        let warnings = 0;

        if (data.messages && Array.isArray(data.messages)) {
            data.messages.forEach(message => {
                if (message.type === 'error' || message.type === 'non-document-error') {
                    errors++;
                } else if (message.type === 'warning' || message.type === 'info') {
                    warnings++;
                }
            });
        }
        
        return { errors, warnings };
    } catch (error) {
        console.error('Validation fetch failed for', fullUrl, error);
        return { errors: 0, warnings: 0 };
    }
};

/**
 * The HTML Validation Module component.
 * @param {object} props - The component props.
 * @param {function} props.onValidationComplete - Callback to receive the final JSON object.
 */
function HTMLValidationModule({ onValidationComplete }) {
    const { computedData } = useDataCollection(); 

    const REQUEST_DELAY_MS = 1000; 

    useEffect(() => {
        const validateAllUrlsSequentially = async () => {
            if (!computedData || computedData.length === 0) {
                if (onValidationComplete) {
                    onValidationComplete({ error_count: 0, warning_count: 0 });
                }
                return;
            }

            setIsLoading(true);
            setProgressCount(0);
            
            // Filter out invalid/empty URLs
            const urlsToValidate = computedData
                .map(item => item.url)
                .filter(url => url && typeof url === 'string' && url.trim() !== '');

            let totalErrors = 0;
            let totalWarnings = 0;

            // Sequential loop with delay for rate limiting
            for (const url of urlsToValidate) {
                const result = await getValidationCounts(url); 
                
                totalErrors += result.errors;
                totalWarnings += result.warnings;
                
                setProgressCount(prevCount => prevCount + 1);
                
                await delay(REQUEST_DELAY_MS);
            }
            
            setIsLoading(false);

            const finalSummary = {
                error_count: totalErrors,
                warning_count: totalWarnings
            };
            
            if (onValidationComplete) {
                onValidationComplete(finalSummary);
            }
        };

        validateAllUrlsSequentially();
    }, [computedData, onValidationComplete]); 

    return null;
}

export default HTMLValidationModule;