import { runGeo } from "lib/geo";

export const config = { maxDuration: 120 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const raw = Array.isArray(req.body)
    ? req.body
    : Array.isArray(req.body?.items)
    ? req.body.items
    : req.body;

  if (!Array.isArray(raw) || raw.length === 0) {
    return res.status(400).json({ success: false, error: "No items provided" });
  }

  try {
    const results = await runGeo(raw);
    return res.status(200).json({ success: true, items: results });
  } catch (e) {
    return res.status(500).json({ success: false, error: String(e?.message || e) });
  }
}

