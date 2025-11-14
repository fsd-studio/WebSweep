/**
 * Pure function to process geoDataCollection sequentially
 * @param {Array} geoDataCollection - Array of geo data objects
 * @param {Function} ensureUrl - Function to normalize URLs
 * @returns {Promise<Array>} - Resolves to an array of results
 */

function ensureUrl(u) {
  if (!u) return null;
  let s = (u || "").trim();
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try { return new URL(s).toString(); } catch { return null; }
}

export async function geoMetrics(geoDataCollection) {
  const src = Array.isArray(geoDataCollection) ? geoDataCollection : [];
  const payload = src
    .map((it) => ({
      url: ensureUrl(it?.website || it?.url),
      text: it?.text || it?.page_text,
      email: it?.email,
      phone: it?.phone,
      city: it?.city,
      canton: it?.canton,
      address: it?.address,
      postal_code: it?.postal_code,
      country: it?.country,
      street: it?.street,
    }))
    .filter((x) => x.url);

  if (!payload.length) {
    return []; // nothing to process
  }

  const results = [];
  for (let i = 0; i < payload.length; i++) {
    try {
      const resp = await fetch("/api/geo-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([payload[i]]),
      });

      const json = await resp.json();
      const r =
        json?.items?.[0] || {
          url: payload[i].url,
          success: false,
          error: json?.error || `HTTP ${resp.status}`,
        };
      results.push(r);
    } catch (e) {
      results.push({
        url: payload[i].url,
        success: false,
        error: e.message || "Failed",
      });
    }
  }

  console.log(results)
  return results;
}
