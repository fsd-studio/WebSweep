// pages/api/lighthouse.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }

  try {
    const apiKey = process.env.PAGESPEED_API_KEY; // will be undefined if not set, create an API key if you want to test this API -> https://developers.google.com/speed/docs/insights/v5/get-started
    
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance${apiKey ? `&key=${apiKey}` : ''}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`);
    }
    
    const data = await response.json();
    const audits = data.lighthouseResult.audits;
    
    const metrics = {
      // Page load time (in milliseconds)
      pageLoadTime: audits['speed-index']?.numericValue || 0,
      
      // Response time (server response time)
      responseTime: audits['server-response-time']?.numericValue || 0,
      
      // Server response codes (from network requests)
      serverResponseCodes: audits['network-requests']?.details?.items?.map(item => ({
        url: item.url,
        statusCode: item.statusCode
      })) || [],
      
      // Number of HTTP requests
      numberOfRequests: audits['network-requests']?.details?.items?.length || 0,
      
      // Total page size (in bytes)
      totalPageSize: audits['total-byte-weight']?.numericValue || 0,
      
      // Time to Interactive (TTI) in milliseconds
      timeToInteractive: audits['interactive']?.numericValue || 0,
      
      // First Contentful Paint (FCP) in milliseconds
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      
      // Largest Contentful Paint (LCP) in milliseconds
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
      
      // Cumulative Layout Shift (CLS) - score
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      
      // Performance score (0-100)
      performanceScore: data.lighthouseResult.categories.performance.score * 100,
    };
    
    return res.status(200).json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('PageSpeed API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export const config = {
  maxDuration: 30,
};