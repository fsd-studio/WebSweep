import { lighthouse } from "services/lighthouse.services";

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { url } = req.body;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, error: 'URL is required' });
  }
  
  if (!isValidUrl(url)) {
    return res.status(400).json({ success: false, error: 'Invalid URL format' });
  }

  try {
    const strategies = ["DESKTOP", "MOBILE"]
    const categories = ["PERFORMANCE", "SEO", "BEST_PRACTICES", "ACCESSIBILITY"]

    let metricOutput = {}

    for (const s of strategies) {
      metricOutput[s] = {};

      for (const c of categories) {
        try {
            const audits = await lighthouse(url, c, s); 
            
            metricOutput[s][c] = audits;

        } catch (error) {
            console.error(`Error analyzing ${url} for ${s}/${c}:`, error);
            metricOutput[s][c] = { error: error.message };
        }
      }
    }
    
    return res.status(200).json({
      success: true,  
      data: metricOutput
    });

  } catch (error) {
    console.error('PageSpeed API error:', error.message, 'Status:', error.status || 500);

    const statusCode = error.status || 500;
    
    const clientMessage = statusCode >= 500
        ? 'Internal Server Error during PageSpeed analysis.'
        : error.message;

    return res.status(statusCode).json({
      success: false,
      error: clientMessage
    });
  }
}

export const config = {
  maxDuration: 30, 
};