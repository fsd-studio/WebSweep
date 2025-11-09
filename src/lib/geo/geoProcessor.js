import { extractStructured } from "./extract.js";
import { evaluateExtraction } from "./evaluate.js";
import { positionAdjustedWordCount } from "./metrics/positionMetric.js";
import { regexChecks } from "./metrics/regexChecks.js";
import {
  evidenceCoverage,
  fieldCompleteness,
  evidenceLiteralMatchRate,
  avgEvidenceSpanChars,
} from "./metrics/evidenceMetrics.js";
import { sourceEntropy } from "./metrics/sourceDiversity.js";
import { typeTokenRatio } from "./metrics/textStats.js";
import { compositeScore } from "./metrics/compositeScore.js";

function evidences(ex) {
  const ev = [];
  ex.goal?.evidence?.forEach((s) => ev.push(s));
  ex.mission?.evidence?.forEach((s) => ev.push(s));
  ex.vision?.evidence?.forEach((s) => ev.push(s));
  if (ex.address)
    Object.values(ex.address).forEach((v) => v?.evidence?.forEach((s) => ev.push(s)));
  if (ex.contact)
    Object.values(ex.contact).forEach((v) => v?.evidence?.forEach((s) => ev.push(s)));
  ex.services?.forEach((s) => s.evidence?.forEach((x) => ev.push(x)));
  ex.faqs?.forEach((f) => {
    f.q.evidence?.forEach((x) => ev.push(x));
    f.a.evidence?.forEach((x) => ev.push(x));
  });
  return ev;
}

function validateEvidenceAppearInText(page, ex) {
  const text = page.text;
  const misses = evidences(ex).filter((span) => !text.toLowerCase().includes(span.toLowerCase()));
  return { total: evidences(ex).length, misses };
}

function synthesizeGEAnswer(page, ex) {
  const src = new URL(page.url).hostname;
  const out = [];
  if (ex.goal?.value)
    out.push(`Goal: ${ex.goal.value} [SOURCE: ${src}]`);
  if (ex.vision?.value)
    out.push(`Vision: ${ex.vision.value} [SOURCE: ${src}]`);
  if (ex.mission?.value)
    out.push(`Mission: ${ex.mission.value} [SOURCE: ${src}]`);
  if (ex.services?.length)
    out.push(`Services include ${ex.services
      .map((s) => s.value)
      .filter(Boolean)
      .join(", ")}. [SOURCE: ${src}]`);
  if (ex.address) {
    const a = ex.address;
    const addr = [
      a.street?.value,
      a.postal_code?.value,
      a.city?.value,
      a.country?.value,
    ]
      .filter(Boolean)
      .join(", ");
    if (addr)
      out.push(`Address: ${addr}. [SOURCE: ${src}]`);
  }
  if (ex.contact) {
    const c = ex.contact;
    const bits = [c.email?.value, c.phone?.value].filter(Boolean).join(" | ");
    if (bits)
      out.push(`Contact: ${bits}. [SOURCE: ${src}]`);
  }
  if (!out.length)
    out.push(`No structured fields extracted. [SOURCE: ${src}]`);
  return out.join(" ");
}

export function createGeoProcessor(opts) {
  const { chat, extractModel, evalModel, temperature = 0.2 } = opts;
  return {
    async process(page) {
      const extraction = await extractStructured(page, chat, extractModel, temperature);
      // Evidence sanity check
      const ev = validateEvidenceAppearInText(page, extraction);
      if (ev.total > 0 && ev.misses.length > 0) {
        console.warn("Evidence strings not found in PAGE_TEXT:", ev.misses.slice(0, 5));
      }
      const evaluation = await evaluateExtraction(page, extraction, chat, evalModel, temperature);
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
      const rc = regexChecks(
        page.text,
        extraction.contact?.email?.value ?? null,
        extraction.contact?.phone?.value ?? null,
        addrBlob
      );
      const geAnswer = synthesizeGEAnswer(page, extraction);
      const bySource = positionAdjustedWordCount(geAnswer);
      const host = new URL(page.url).hostname;
      // --- extra objective metrics
      const comp = fieldCompleteness(extraction);
      const cov = evidenceCoverage(extraction);
      const lit = evidenceLiteralMatchRate(page, extraction);
      const evLen = avgEvidenceSpanChars(extraction);
      const ttr = typeTokenRatio(page.text);
      const diversity = sourceEntropy(bySource);
      // --- composite
      const composite = compositeScore({
        llm: evaluation,
        evidenceCoverageRatio: cov.ratio,
        evidenceLiteralMatchRatio: lit.ratio,
        fieldCompletenessRatio: comp.ratio,
        positionAdjustedWC: bySource[host] ?? 0,
        sourceEntropyNorm: diversity.normalized,
        ttr: ttr.ratio,
      });
      // Attach diagnostics so the host app can log/visualize
      const diagnostics = {
        completeness: comp,
        evidenceCoverage: cov,
        evidenceLiteral: lit,
        evidenceAvgSpanChars: evLen,
        ttr,
        diversity,
      };
      const objective = {
        schema_ok: true,
        address_regex_match: rc.address_regex_match,
        email_regex_match: rc.email_regex_match,
        phone_regex_match: rc.phone_regex_match,
        position_adjusted_wc: bySource[host] ?? 0,
        position_adjusted_wc_by_source: bySource,
      };
      return {
        page,
        extraction,
        evaluation,
        objective,
        composite,
        diagnostics,
      };
    },
  };
}

