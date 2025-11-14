/**
 * Calls the Google PageSpeed Insights API and extracts useful performance metrics.
 * @param {string} url - The URL to analyze.
 * @param {string} category - Lighthouse category (e.g. "performance", "seo").
 * @param {string} strategy - Strategy ("desktop" or "mobile").
 * @returns {object} The extracted performance metrics including score and audits.
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
    } catch {}
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  const audits = data.lighthouseResult.audits;
  const normalizedCategory = category.toLowerCase();
  const score = data.lighthouseResult.categories?.[normalizedCategory]?.score ?? null;

  return {
    score,
    audits,
  };
}
