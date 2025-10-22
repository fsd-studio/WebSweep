/**
 * Calls the Google PageSpeed Insights API and extracts useful performance metrics.
 * @param {string} url - The URL to analyze.
 * @returns {object} The extracted performance metrics.
 * @throws {Error} If the API call fails or returns an error status.
 */

export async function lighthouse(url, category = "performance", strategy = "desktop") {
  const apiKey = process.env.PAGESPEED_API_KEY;

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=${category}${apiKey ? `&key=${apiKey}` : ''}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    let errorMessage = `PageSpeed API error: ${response.status} - ${response.statusText}`;
    
    try {
        const errorData = await response.json();
        if (errorData.error?.message) {
            errorMessage = errorData.error.message;
        }
    } catch (e) {
        // Ignore JSON parsing errors if the response wasn't JSON
    }
    
    // Throw a specific error based on the status code for better handling in the handler
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const audits = data.lighthouseResult.audits;
  
  console.log(audits)
  return audits;
}