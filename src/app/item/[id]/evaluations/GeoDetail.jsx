import React from "react";
import {
  FiBarChart2,
  FiAward,
  FiCpu,
  FiTarget,
  FiLifeBuoy,
  FiCheckSquare,
  FiBookOpen,
  FiFramer,
  FiLayers,
  FiFileText,
  FiActivity,
} from "react-icons/fi";

function iconForLabel(label) {
  const key = String(label || "").toLowerCase();

  if (key.includes("composite")) return FiAward;
  if (key.includes("llm overall") || key === "overall") return FiCpu;
  if (key.includes("relevance")) return FiTarget;
  if (key.includes("support")) return FiLifeBuoy;
  if (key.includes("completeness")) return FiCheckSquare;
  if (key.includes("citation")) return FiBookOpen;
  if (key.includes("uniqueness")) return FiFramer;
  if (key.includes("evidence coverage")) return FiLayers;
  if (key.includes("evidence literal")) return FiFileText;
  if (key === "ttr") return FiActivity;

  return FiBarChart2;
}

function SummaryMetric({ label, value, description }) {
  const Icon = iconForLabel(label);

  return (
    <button
      type="button"
      className="group w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-transform transition-shadow duration-150 ease-out hover:scale-[1.04] hover:shadow-md"
      title={description || ""}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-primary group-hover:text-primary" />
          <span className="text-xs text-gray-500 group-hover:text-primary">
            {label}
          </span>
        </div>
        <div className="text-lg font-semibold text-gray-900 group-hover:text-primary">
          {value}
        </div>
      </div>
    </button>
  );
}

function MetricBar({ label, value, max = 1, asPercent = false }) {
  if (value == null || !Number.isFinite(value)) return null;
  const clampedMax = max > 0 ? max : 1;
  const ratio = Math.max(0, Math.min(1, value / clampedMax));
  const widthPercent = `${Math.round(ratio * 100)}%`;
  const displayValue = asPercent ? `${Math.round(value * 100)}%` : value;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] text-gray-600">
        <span>{label}</span>
        <span className="font-medium">{displayValue}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: widthPercent }}
        />
      </div>
    </div>
  );
}

function percent(x) {
  if (x == null) return "–";
  return `${Math.round(x * 100)}%`;
}

function titleCase(s) {
  return String(s)
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
    );
}

function metricDescription(id) {
  const key = String(id || "").toLowerCase();
  switch (key) {
    case "composite":
      return "Overall 0–100 GEO quality combining LLM judgment with evidence and structure signals.";
    case "llm_overall":
    case "overall":
      return "Model’s holistic 0–100 view of the extraction quality.";
    case "relevance":
      return "How on‑topic the extracted description is for this organization and its mission.";
    case "support":
      return "How strongly the extracted statements are supported by evidence in the page text.";
    case "completeness":
      return "How fully key fields (goal, mission, contact, address, etc.) are covered.";
    case "citation_quality":
      return "How precise and faithful the quoted evidence spans are.";
    case "uniqueness":
      return "How specific and non‑generic the extracted description is.";
    default:
      return "";
  }
}

export default function GeoDetail({ geo }) {
  if (!geo) return null;

  return (
    <>
      {/* High-level scores */}
      <div className="grid grid-cols-2 gap-3">
        {geo.composite?.score != null && (
          <SummaryMetric
            label="Composite"
            value={geo.composite.score}
            description={metricDescription("composite")}
          />
        )}
        {geo.evaluation?.overall?.score != null && (
          <SummaryMetric
            label="LLM overall"
            value={geo.evaluation.overall.score}
            description={metricDescription("llm_overall")}
          />
        )}
      </div>

      {/* LLM subscores */}
      {geo.evaluation?.scores && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            LLM subscores
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(geo.evaluation.scores).map(([key, val]) => {
              if (val?.score == null) return null;
              return (
                <div key={key} className="space-y-1">
                  <SummaryMetric
                    label={titleCase(key)}
                    value={val.score}
                    description={metricDescription(key)}
                  />
                  <details className="text-[11px] text-gray-600">
                    <summary className="cursor-pointer text-xs text-primary font-medium">
                      See JSON
                    </summary>
                    <pre className="mt-1 text-[10px] whitespace-pre-wrap bg-gray-50 rounded-lg p-2">
                      {JSON.stringify(val, null, 2)}
                    </pre>
                  </details>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Diagnostics */}
      {geo.diagnostics && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Evidence & structure
          </div>
          <div className="grid grid-cols-2 gap-3">
            {geo.diagnostics.completeness && (
              <SummaryMetric
                label="Completeness"
                value={percent(geo.diagnostics.completeness.ratio)}
                description="Filled fields out of expected fields."
              />
            )}
            {geo.diagnostics.evidenceCoverage && (
              <SummaryMetric
                label="Evidence coverage"
                value={percent(geo.diagnostics.evidenceCoverage.ratio)}
                description="Fields that include at least one exact quote."
              />
            )}
            {geo.diagnostics.evidenceLiteral && (
              <SummaryMetric
                label="Evidence literal"
                value={percent(geo.diagnostics.evidenceLiteral.ratio)}
                description="Fraction of quotes that literally occur in the page text."
              />
            )}
            {geo.diagnostics.ttr && (
              <SummaryMetric
                label="TTR"
                value={geo.diagnostics.ttr.ratio?.toFixed(2)}
                description="Type-token ratio: unique words divided by total words. Higher = more varied wording; lower = more repetition."
              />
            )}
          </div>
        </div>
      )}

      {/* Visual plot-style breakdown */}
      {(geo.evaluation?.scores || geo.diagnostics) && (
        <div className="mt-2 space-y-2">
          <div className="space-y-2">
            {geo.evaluation?.scores &&
              Object.entries(geo.evaluation.scores).map(
                ([key, scoreObj]) => {
                  const numericScore = scoreObj?.score;
                  if (numericScore == null) return null;
                  return (
                    <MetricBar
                      key={key}
                      label={titleCase(key)}
                      value={numericScore}
                      max={10}
                    />
                  );
                }
              )}

            {geo.diagnostics?.completeness && (
              <MetricBar
                label="Completeness ratio"
                value={geo.diagnostics.completeness.ratio}
                max={1}
                asPercent
              />
            )}
            {geo.diagnostics?.evidenceCoverage && (
              <MetricBar
                label="Evidence coverage ratio"
                value={geo.diagnostics.evidenceCoverage.ratio}
                max={1}
                asPercent
              />
            )}
            {geo.diagnostics?.evidenceLiteral && (
              <MetricBar
                label="Evidence literal ratio"
                value={geo.diagnostics.evidenceLiteral.ratio}
                max={1}
                asPercent
              />
            )}
            {geo.diagnostics?.ttr && (
              <MetricBar
                label="TTR"
                value={geo.diagnostics.ttr.ratio}
                max={1}
                asPercent
              />
            )}
          </div>
        </div>
      )}

      {/* Extracted fields (inline text only) */}
      {geo.extraction && (
        <div className="text-sm text-gray-700 space-y-1">
          {geo.extraction.goal?.value && (
            <p>
              <span className="font-semibold">Goal: </span>
              {geo.extraction.goal.value}
            </p>
          )}
          {geo.extraction.mission?.value && (
            <p>
              <span className="font-semibold">Mission: </span>
              {geo.extraction.mission.value}
            </p>
          )}
          {geo.extraction.vision?.value && (
            <p>
              <span className="font-semibold">Vision: </span>
              {geo.extraction.vision.value}
            </p>
          )}
        </div>
      )}

      {/* Methodology flow */}
      <div className="pt-4 mt-3 text-sm text-gray-700">
        <div className="font-semibold uppercase tracking-wide text-gray-500 mb-2">
          How this GEO score is computed
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
          {/* Step 1: Extract structure */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-transform transition-shadow duration-150 ease-out hover:scale-[1.03] hover:shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                1
              </div>
              <div className="font-semibold text-xs uppercase tracking-wide">
                Extract structure
              </div>
            </div>
            <div className="space-y-1">
              <div>
                Model:{" "}
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                  mistralai/Mixtral-8x7B-Instruct-v0.1
                </code>
              </div>
              <p className="mt-1">
                We use this model to answer questions about the goal, mission,
                vision, services and FAQs of the website, each with exact
                evidence snippets.
              </p>
              <details className="mt-2 border-t border-dashed border-gray-200 pt-2">
                <summary className="cursor-pointer text-xs text-primary font-medium">
                  See extraction prompt & JSON shape
                </summary>
                <div className="mt-2 space-y-2">
                  <p>
                    System:{" "}
                    <span className="italic">
                      "Extract structured data and return STRICT JSON only."
                    </span>
                  </p>
                  <pre className="text-xs whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                    {`{
  "goal": {"value": "...", "evidence": ["..."]},
  "mission": {"value": "...", "evidence": ["..."]},
  "vision": {"value": "...", "evidence": ["..."]},
  "address": { "street": {...}, "postal_code": {...}, "city": {...}, "country": {...} },
  "contact": { "email": {...}, "phone": {...} },
  "services": [{ "value": "...", "evidence": ["..."] }]
}`}
                  </pre>
                </div>
              </details>
            </div>
          </div>

          {/* Arrow (desktop) */}
          <div className="hidden md:flex items-center justify-center px-1 text-gray-400">
            <span className="text-lg">➜</span>
          </div>

          {/* Step 2: Evaluate extraction */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-transform transition-shadow duration-150 ease-out hover:scale-[1.03] hover:shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                2
              </div>
              <div className="font-semibold text-xs uppercase tracking-wide">
                Evaluate extraction
              </div>
            </div>
            <div className="space-y-1">
              <div>
                Model:{" "}
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                  meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo
                </code>
              </div>
              <p className="mt-1">
                This model reads the scraped website text plus the JSON answer
                and returns 1–10 subscores (relevance, support, etc.) and a
                single 0–100 overall judgment of extraction quality.
              </p>
              <details className="mt-2 border-t border-dashed border-gray-200 pt-2">
                <summary className="cursor-pointer text-xs text-primary font-medium">
                  See evaluation JSON example
                </summary>
                <pre className="mt-2 text-xs whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                  {`{
  "scores": {
    "relevance": {"score": 8, "reason": "..."},
    "support": {"score": 9, "reason": "..."},
    "completeness": {"score": 7, "reason": "..."},
    "citation_quality": {"score": 8, "reason": "..."},
    "uniqueness": {"score": 6, "reason": "..."}
  },
  "overall": {"score": 82, "reason": "..."}
}`}
                </pre>
              </details>
            </div>
          </div>

          {/* Arrow (desktop) */}
          <div className="hidden md:flex items-center justify-center px-1 text-gray-400">
            <span className="text-lg">➜</span>
          </div>

          {/* Step 3: Manual metrics + composite */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-transform transition-shadow duration-150 ease-out hover:scale-[1.03] hover:shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                3
              </div>
              <div className="font-semibold text-xs uppercase tracking-wide">
                Manual metrics & composite
              </div>
            </div>
            <div className="space-y-1">
              <p>
                We calculate completeness, evidence coverage, literal match,
                evidence length, text diversity and source entropy, then blend
                them with the LLM&apos;s overall score into the composite GEO
                score.
              </p>
              <details className="mt-2 border-t border-dashed border-gray-200 pt-2">
                <summary className="cursor-pointer text-xs text-primary font-medium">
                  See composite score formula
                </summary>
                <pre className="mt-2 text-xs whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
                  {`score =
  0.45 * (LLM_overall / 100)
+ 0.15 * field_completeness_ratio
+ 0.15 * evidence_coverage_ratio
+ 0.10 * evidence_literal_match_ratio
+ 0.10 * position_adjusted_word_share
+ 0.03 * source_entropy_normalized
+ 0.02 * text_ttr`}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

