import Panel from "./Panel";

function LeftPanel({ item, geo }) {
  return (
    <Panel>
      <div className="flex flex-col gap-3 h-full justify-start">
        <div className="text-sm font-semibold text-gray-800">
          GEO summary{item?.title ? ` for ${item.title}` : ""}
        </div>

        {geo ? (
          <div className="grid grid-cols-2 gap-3 max-w-xs">
            {geo.evaluation?.overall?.score !== undefined && (
              <SummaryMetric
                label="LLM overall"
                value={geo.evaluation.overall.score}
                description={metricDescription("llm_overall")}
              />
            )}

            {geo.evaluation?.scores &&
              Object.entries(geo.evaluation.scores).map(([key, val]) => {
                if (val?.score === undefined || val.score === null) return null;
                return (
                  <SummaryMetric
                    key={key}
                    label={titleCase(key)}
                    value={val.score}
                    description={metricDescription(key)}
                  />
                );
              })}
          </div>
        ) : (
          <div className="text-xs text-gray-600 max-w-xs">
            GEO metrics are not available yet for this item. Return to the
            list, wait until the Geo score circle is filled, then open this
            detail view.
          </div>
        )}
      </div>
    </Panel>
  );
}

function SummaryMetric({ label, value, description }) {
  return (
    <button
      type="button"
      className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm"
      title={description || ""}
    >
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </button>
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

export default LeftPanel;
