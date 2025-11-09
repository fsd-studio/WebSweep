import { createGeoProcessor } from "./geoProcessor";
import { togetherClientFactory } from "./adapters/llm";
import { regexChecks as regexChecksVendored } from "./metrics/regexChecks";
import { extractStructured } from "./extract";
import { positionAdjustedWordCount } from "./metrics/positionMetric";
import { evidenceCoverage, fieldCompleteness, evidenceLiteralMatchRate, avgEvidenceSpanChars } from "./metrics/evidenceMetrics";
import { sourceEntropy } from "./metrics/sourceDiversity";
import { typeTokenRatio } from "./metrics/textStats";

function normalizeUrl(input) {
  if (!input || typeof input !== "string") return null;
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try { return new URL(u).toString(); } catch { return null; }
}

function htmlToText(html) {
  if (!html) return "";
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return stripped.replace(/\s+/g, " ").trim();
}

async function fetchPageText(url) {
  try {
    const resp = await fetch(url, { headers: { "User-Agent": "WebSweep-GEO/1.0" } });
    const html = await resp.text();
    return htmlToText(html).slice(0, 20000);
  } catch (e) { return ""; }
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

export async function runGeo(items, opts = {}) {
  const { apiKey = process.env.TOGETHER_API_KEY, extractModel = process.env.GEO_EXTRACT_MODEL || "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", evalModel = process.env.GEO_EVAL_MODEL || "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", qpm = Number(process.env.GEO_QPM || 5), retries = Number(process.env.GEO_RETRIES || 2), maxTextChars = Number(process.env.GEO_MAX_TEXT_CHARS || 8000), mode = (process.env.GEO_MODE || "full").toLowerCase() } = opts;

  const results = [];

  const haveLLM = !!apiKey;
  let processor = null;
  if (haveLLM) {
    const baseChat = togetherClientFactory(apiKey);
    const minInterval = Math.max(0, Math.floor(60000 / Math.max(1, qpm)));
    let last = 0;

    const rlChat = async (args) => {
      const now = Date.now();
      const elapsed = now - last;
      if (elapsed < minInterval) await sleep(minInterval - elapsed);
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const out = await baseChat(args);
          last = Date.now();
          return out;
        } catch (e) {
          const msg = String(e?.message ?? e);
          // Retry on rate limits and transient 5xx errors (e.g., 503 Service Unavailable)
          if (/(\b429\b|rate limit|\b5\d{2}\b|service unavailable)/i.test(msg) && attempt < retries) {
            const jitter = Math.floor(Math.random() * 400);
            const backoff = minInterval * (attempt + 1) + 600 + jitter;
            await sleep(backoff);
            continue;
          }
          throw e;
        }
      }
    };

    processor = createGeoProcessor({
      chat: rlChat,
      extractModel,
      evalModel,
      temperature: 0.2,
    });
  }

  for (const item of Array.isArray(items) ? items : []) {
    const url = normalizeUrl(item?.url || item?.website);
    if (!url) {
      results.push({ input: item, success: false, error: "Invalid or missing URL" });
      continue;
    }

    let text = item?.text || item?.page_text || "";
    if (!text) text = await fetchPageText(url);
    if (maxTextChars && typeof text === "string") text = text.slice(0, maxTextChars);

    if (processor && mode !== "objective-only") {
      try {
        const page = {
          url,
          text,
          title: item?.title || undefined,
          tags: Array.isArray(item?.tags) ? item.tags : undefined,
          domain: (() => { try { return new URL(url).hostname; } catch { return undefined; } })(),
        };
        if (mode === "extract-only") {
          // Only extraction + objective diagnostics (no LLM evaluation)
          const extraction = await extractStructured(page, processor.chat ?? togetherClientFactory(apiKey), extractModel, 0.2);

          const addrBlob = extraction.address
            ? [
                extraction.address.street?.value,
                extraction.address.postal_code?.value,
                extraction.address.city?.value,
                extraction.address.country?.value,
              ]
                .filter(Boolean)
                .join(" ")
            : undefined;

          const rc = regexChecksVendored(
            page.text,
            extraction.contact?.email?.value ?? null,
            extraction.contact?.phone?.value ?? null,
            addrBlob
          );

          const geAnswer = synthesizeGEAnswer(page, extraction);
          const bySource = positionAdjustedWordCount(geAnswer);
          const host = new URL(page.url).hostname;

          const comp = fieldCompleteness(extraction);
          const cov = evidenceCoverage(extraction);
          const lit = evidenceLiteralMatchRate(page, extraction);
          const evLen = avgEvidenceSpanChars(extraction);
          const ttr = typeTokenRatio(page.text);
          const diversity = sourceEntropy(bySource);

          const diagnostics = { completeness: comp, evidenceCoverage: cov, evidenceLiteral: lit, evidenceAvgSpanChars: evLen, ttr, diversity };
          const objective = {
            schema_ok: true,
            address_regex_match: rc.address_regex_match,
            email_regex_match: rc.email_regex_match,
            phone_regex_match: rc.phone_regex_match,
            position_adjusted_wc: bySource[host] ?? 0,
            position_adjusted_wc_by_source: bySource,
          };

          results.push({ url, success: true, data: { page, extraction, objective, diagnostics, note: "GEO_MODE=extract-only (no LLM evaluation)" } });
        } else {
          const geoRes = await processor.process(page);
          results.push({ url, success: true, data: geoRes });
        }
      } catch (err) {
        results.push({ url, success: false, error: err?.message || "GEO processing failed" });
      }
    } else {
      // Objective-only fallback
      const email = item?.email ?? null;
      const phone = item?.phone ?? null;
      const addrBlob = [item?.street, item?.postal_code, item?.city, item?.canton, item?.country, item?.address]
        .filter(Boolean)
        .join(" ");

      const rc = regexChecksVendored(text || "", email, phone, addrBlob);
      const checks = [rc.email_regex_match, rc.phone_regex_match, rc.address_regex_match].filter((v) => typeof v === "boolean");
      const objectiveScore = checks.length ? Math.round((checks.reduce((a, b) => a + (b ? 1 : 0), 0) / checks.length) * 100) : 0;
      let reason = !haveLLM ? "TOGETHER_API_KEY not configured" : "GEO processor unavailable";
      if (mode === "objective-only") reason = "GEO_MODE=objective-only";
      results.push({
        url,
        success: true,
        data: {
          page: { url, text: (text || "").slice(0, 200) + (text?.length > 200 ? "…" : "") },
          objective: rc,
          objective_score: objectiveScore,
          note: `${reason}: returning objective regex checks only.`,
        },
      });
  }
}

function synthesizeGEAnswer(page, ex) {
  const src = new URL(page.url).hostname;
  const out = [];
  if (ex.goal?.value) out.push(`Goal: ${ex.goal.value} [SOURCE: ${src}]`);
  if (ex.vision?.value) out.push(`Vision: ${ex.vision.value} [SOURCE: ${src}]`);
  if (ex.mission?.value) out.push(`Mission: ${ex.mission.value} [SOURCE: ${src}]`);
  if (ex.services?.length)
    out.push(
      `Services include ${ex.services
        .map((s) => s.value)
        .filter(Boolean)
        .join(", ")}. [SOURCE: ${src}]`
    );
  if (ex.address) {
    const a = ex.address;
    const addr = [a.street?.value, a.postal_code?.value, a.city?.value, a.country?.value]
      .filter(Boolean)
      .join(", ");
    if (addr) out.push(`Address: ${addr}. [SOURCE: ${src}]`);
  }
  if (ex.contact) {
    const c = ex.contact;
    const bits = [c.email?.value, c.phone?.value].filter(Boolean).join(" | ");
    if (bits) out.push(`Contact: ${bits}. [SOURCE: ${src}]`);
  }
  if (!out.length) out.push(`No structured fields extracted. [SOURCE: ${src}]`);
  return out.join(" ");
}

  return results;
}

export default runGeo;
