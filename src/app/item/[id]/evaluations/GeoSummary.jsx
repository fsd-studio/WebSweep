import SummaryMetric from "./SummaryMetric";
import {
  FiCpu,
  FiTarget,
  FiLifeBuoy,
  FiCheckSquare,
  FiBookOpen,
  FiFramer,
} from "react-icons/fi";

const { default: Loading } = require("./Loading");

function iconForKey(key) {
  const k = String(key || "").toLowerCase();
  if (k === "llm_overall" || k === "overall") return FiCpu;
  if (k === "relevance") return FiTarget;
  if (k === "support") return FiLifeBuoy;
  if (k === "completeness") return FiCheckSquare;
  if (k === "citation_quality") return FiBookOpen;
  if (k === "uniqueness") return FiFramer;
  return null;
}

function GeoSummary({ item, geo }) {
  return (
    <div className="flex flex-col gap-3 justify-start">
      <div className="text-sm font-semibold text-gray-800">
        GEO summary{item?.title ? ` for ${item.title}` : ""}
      </div>

      {geo ? (
        <div className="grid grid-cols-2 gap-3">
          {geo.evaluation?.overall?.score !== undefined && (
            <div className="space-y-1">
              <SummaryMetric
                label="LLM overall"
                value={geo.evaluation.overall.score}
                description={metricDescription("llm_overall")}
                icon={FiCpu}
              />
              <details className="text-[11px] text-gray-600">
                <summary className="cursor-pointer text-xs text-primary font-medium">
                  See JSON
                </summary>
                <pre className="mt-1 text-[10px] whitespace-pre-wrap bg-gray-50 rounded-lg p-2">
                  {JSON.stringify(geo.evaluation.overall, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {geo.evaluation?.scores &&
            Object.entries(geo.evaluation.scores).map(([key, val]) => {
              if (val?.score === undefined || val.score === null) return null;
              const Icon = iconForKey(key);
              return (
                <div key={key} className="space-y-1">
                  <SummaryMetric
                    label={titleCase(key)}
                    value={val.score}
                    description={metricDescription(key)}
                    icon={Icon}
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
      ) : (
        <Loading>GEO is loading</Loading>
      )}
    </div>
  );
}

function titleCase(s) {
  return String(s)
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
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

export default GeoSummary;
