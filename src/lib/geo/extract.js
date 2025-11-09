// src/extract.ts
import { ExtractionSchema } from "./types.js";

const system =
  "Extract structured data and return STRICT JSON only. " +
  "Output a SINGLE JSON object that matches the schema EXACTLY. " +
  "Do NOT include any extra top-level keys, language tags, comments, code fences or prose. " +
  "If a field is unknown, set its value to null and evidence to []. " +
  "Evidence MUST be exact substrings copied from PAGE_TEXT (no paraphrasing).";

const prompt = (page) => `
You are given PAGE_TEXT. Extract fields.
For every field return:
- value: the answer (string or null)
- evidence: array of EXACT substrings from PAGE_TEXT that support the value. Do NOT paraphrase. 
- If unsure or not found, set value=null and evidence=[].

Return STRICT JSON matching this schema (include ALL keys exactly):
{
  "faqs": [{"q":{"value":"...","evidence":["..."]},"a":{"value":"...","evidence":["..."]}}],
  "goal": {"value":"...","evidence":["..."]},
  "mission": {"value":"...","evidence":["..."]},
  "vision": {"value":"...","evidence":["..."]},
  "address": {
    "street": {"value":"...","evidence":["..."]},
    "postal_code": {"value":"...","evidence":["..."]},
    "city": {"value":"...","evidence":["..."]},
    "country": {"value":"...","evidence":["..."]}
  },
  "contact": {
    "email": {"value":"...","evidence":["..."]},
    "phone": {"value":"...","evidence":["..."]}
  },
  "services": [{"value":"...","evidence":["..."]}]
}

For "services", return an array of atomic items (e.g., ["consulting","training"]).
Split phrases like "consulting and training services" into separate items.

PAGE_TEXT:
<<<${page.text}>>>
`.trim();

function toEvidence(x) {
  return typeof x === "string" ? { value: x, evidence: [] } : x;
}

/** Coerce any plain strings into { value, evidence: [] } before schema validation. */
function sanitizeExtraction(obj) {
  if (!obj || typeof obj !== "object") return obj;

  // services
  if (Array.isArray(obj.services)) {
    obj.services = obj.services.map(toEvidence);
  }

  // address
  if (obj.address && typeof obj.address === "object") {
    for (const k of ["street", "postal_code", "city", "country"]) {
      if (k in obj.address) obj.address[k] = toEvidence(obj.address[k]);
    }
  }

  // contact
  if (obj.contact && typeof obj.contact === "object") {
    for (const k of ["email", "phone"]) {
      if (k in obj.contact) obj.contact[k] = toEvidence(obj.contact[k]);
    }
  }

  // faqs
  if (Array.isArray(obj.faqs)) {
    obj.faqs = obj.faqs.map((f) => ({
      q: toEvidence(f?.q),
      a: toEvidence(f?.a),
    }));
  }

  // singletons
  for (const k of ["goal", "mission", "vision"]) {
    if (k in obj) obj[k] = toEvidence(obj[k]);
  }

  return obj;
}

/** Ensure required object/keys exist so schema validation can succeed. */
function ensureSkeleton(obj) {
  if (!obj || typeof obj !== "object") obj = {};

  const evNull = { value: null, evidence: [] };

  // singletons
  for (const k of ["goal", "mission", "vision"]) {
    if (!obj[k]) obj[k] = { ...evNull };
  }

  // address
  if (!obj.address || typeof obj.address !== "object") obj.address = {};
  for (const k of ["street", "postal_code", "city", "country"]) {
    if (!obj.address[k]) obj.address[k] = { ...evNull };
  }

  // contact
  if (!obj.contact || typeof obj.contact !== "object") obj.contact = {};
  for (const k of ["email", "phone"]) {
    if (!obj.contact[k]) obj.contact[k] = { ...evNull };
  }

  // arrays
  if (!Array.isArray(obj.faqs)) obj.faqs = [];
  if (!Array.isArray(obj.services)) obj.services = [];

  return obj;
}

/** Try to robustly parse model output into JSON. */
function parseModelJson(content) {
  // first try raw
  try { return JSON.parse(content); } catch {}

  // extract fenced code block
  const fence = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence && fence[1]) {
    try { return JSON.parse(fence[1]); } catch {}
  }

  // attempt substring between first { and last }
  const first = content.indexOf("{");
  const last = content.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    const slice = content.slice(first, last + 1);
    try { return JSON.parse(slice); } catch {}
  }
  throw new Error("Extraction JSON parse failed.");
}

/** Split compound service phrases into atomic items (consulting, training, etc.). */
function splitServicesAtomic(items = []) {
  const out = [];

  const push = (val, ev) => {
    const clean = val.trim();
    if (!clean) return;
    // de-noise trailing "service(s)"
    const base = clean.replace(/\bservices?\b/gi, "").trim();
    if (!base) return;
    // dedupe case-insensitively
    if (!out.some((x) => (x.value ?? "").toLowerCase() === base.toLowerCase())) {
      out.push({ value: base, evidence: ev });
    }
  };

  for (const s of items) {
    const v = (s.value ?? "").trim();
    if (!v) continue;

    // split on common separators (comma, slash, ampersand, "and", dashes)
    const parts = v
      .split(/[,/]|(?:\s*&\s*)|(?:\s+and\s+)|[\u2013\u2014]/gi)
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length <= 1) {
      push(v, s.evidence);
    } else {
      for (const p of parts) push(p, s.evidence);
    }
  }

  return out;
}

// --- main ------------------------------------------------------------------

export async function extractStructured(page, chat, model, temperature = 0.2) {
  const content = await chat({
    model,
    temperature,
    response_format: "json",
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt(page) },
    ],
  });

  // Parse raw JSON
  let parsed;
  try {
    parsed = parseModelJson(content);
  } catch (e) {
    console.error("LLM #1 non-JSON content:\n", content);
    throw e;
  }

  // Coerce any string fields → { value, evidence: [] }
  parsed = sanitizeExtraction(parsed);

  // Fill in missing required fields with null/evidence[] so schema can validate
  parsed = ensureSkeleton(parsed);

  // Validate against schema
  const res = ExtractionSchema.safeParse(parsed);
  if (!res.success) {
    console.error("Extraction schema errors:", res.error.flatten());
    throw new Error("Extraction schema validation failed.");
  }

  // Normalize services into atomic items
  const data = res.data;
  data.services = splitServicesAtomic(data.services);

  // geoProcessor will validate that every evidence span appears in PAGE_TEXT
  return data;
}
