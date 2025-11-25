import GeoSummary from "./evaluations/GeoSummary";
import PerformanceSummary from "./evaluations/PerformanceSummary";
import SeoSummary from "./evaluations/SeoSummary";
import Panel from "./Panel";
import React, { useState } from "react";

function LeftPanel({ item, geo }) {
  const tabs = ["Overview", "GEO", "SEO", "Performance"];
  const [activeTab, setActiveTab] = useState("Overview");
  
  const website = normalizeUrl(item?.website);


  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="flex flex-col gap-4 h-full justify-start">
            
            {/* Title and Badges Section */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Overview</div>
              <div className="text-2xl font-bold text-gray-900 capitalize leading-tight">{item?.title || "Unknown organization"}</div>
              <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                {item?.category && <Badge>{item.category}</Badge>}
                {(item?.city || item?.canton) && (
                  <Badge tone="muted">{[item.city, item.canton].filter(Boolean).join(", ")}</Badge>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</div>
              <p className="whitespace-pre-line">{item?.purpose || "No description available."}</p>
            </div>

            {/* Contact Section */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</div>
              <div className="flex flex-col gap-1 text-sm text-gray-800">
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {website}
                  </a>
                )}
                {item?.email && <div className="break-all">{item.email}</div>}
                {item?.phone && <div>{item.phone}</div>}
                {!website && !item?.email && !item?.phone && (
                  <div className="text-gray-500 text-sm">No contact info available.</div>
                )}
              </div>
            </div>
            
            {/* GEO Summary */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">GEO summary</div>
              {geo ? (
                <div className="grid grid-cols-2 gap-3 max-w-md">
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

          </div>
        );

      case "GEO":
        return (
          <div className="text-sm text-gray-700">
            **GEO** analysis and metrics will be displayed here.
          </div>
        );

      case "SEO":
        return (
          <div className="text-sm text-gray-700">
            **SEO** analysis and metrics will be displayed here.
          </div>
        );

      case "Performance":
        return (
          <div className="text-sm text-gray-700">
            **Performance** statistics will be displayed here.
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Panel>
      <div className="flex flex-col h-full justify-start">
        {/* Tabs Navigation */}
        <div className="flex justify-evenly border-b border-gray-200 rounded-2xl mb-4 sticky top-0 bg-white z-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out
                ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600" 
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {/* Responsive Tab Text Logic */}
              {tab === "Overview" ? (
                <>
                  <span className="md:hidden">OV</span> 
                  <span className="hidden md:inline">Overview</span> 
                </>
              ) : tab === "Performance" ? (
                <>
                  <span className="md:hidden">Per.</span> 
                  <span className="hidden md:inline">Performance</span> 
                </>
              ) : (
                tab
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="pt-2 flex-grow overflow-y-auto">
          {renderContent()}
        </div>
        <GeoSummary item={item} geo={geo}></GeoSummary>
        <SeoSummary seo={seo}></SeoSummary>
        <PerformanceSummary></PerformanceSummary>
      </div>
    </Panel>
  );
}


export default LeftPanel;

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

function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-primary/10 text-primary", 
    muted: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tones[tone] || tones.default}`}>
      {children}
    </span>
  );
}

function normalizeUrl(url) {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
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


