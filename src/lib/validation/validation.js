const W3C_API_URL = 'https://validator.w3.org/nu/?out=json&doc=';
const REQUEST_DELAY_MS = 1000; 

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getValidationCounts = async (url) => {
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = `https://${url}`;
    }

    try {
        const response = await fetch(`${W3C_API_URL}${encodeURIComponent(fullUrl)}`);
        
        if (!response.ok) {
            console.error(`Validator API fetch failed for ${fullUrl}: Status ${response.status}`);
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
 * Main function to run the sequential validation and aggregate results.
 * This is the function called by the API Route Handler.
 * @param {Array<object>} urlItems - An array of objects, each containing a 'url' property.
 * @returns {Promise<{error_count: number, warning_count: number}>} The aggregated counts.
 */
export async function runW3CValidation(urlItems) {
    const urlsToValidate = urlItems
        .map(item => item.url)
        .filter(url => url && typeof url === 'string' && url.trim() !== '');

    let totalErrors = 0;
    let totalWarnings = 0;

    for (const url of urlsToValidate) {
        const counts = await getValidationCounts(url); 
        totalErrors += counts.errors;
        totalWarnings += counts.warnings;
        await delay(REQUEST_DELAY_MS);
    }

    return {
        error_count: totalErrors,
        warning_count: totalWarnings
    };
}