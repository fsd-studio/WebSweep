import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Panel from "./Panel";
import GeoSummary from "./evaluations/GeoSummary";
import GeoDetail from "./evaluations/GeoDetail";
import SeoSummary from "./evaluations/SeoSummary";
import PerformanceSummary from "./evaluations/PerformanceSummary";
import ScoreRing from "../../../components/modules/dataCollectionModule/ScoreRing";

function LeftPanel({ item, geo, seo, performance, general }) {
  const tabs = ["Overview", "GEO", "SEO", "Performance"];
  const [activeTab, setActiveTab] = useState("Overview");

  const website = normalizeUrl(item?.website);
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const renderOverview = () => (
    <div className="flex flex-col gap-4 h-full justify-start">
      {/* Title and Badges */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Overview
        </div>
        <div className="text-2xl font-bold text-gray-900 capitalize leading-tight">
          {item?.title || "Unknown organization"}
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-700">
          {item?.category && <Badge>{item.category}</Badge>}
          {(item?.city || item?.canton) && (
            <Badge tone="muted">
              {[item.city, item.canton].filter(Boolean).join(", ")}
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Description
        </div>
        <p className="whitespace-pre-line">
          {item?.purpose || "No description available."}
        </p>
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Contact
        </div>
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
            <div className="text-gray-500 text-sm">
              No contact info available.
            </div>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="space-y-2">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex items-center gap-3">
          <div className="w-16">
            {general?.score != null ? (
              <ScoreRing score={general.score} />
            ) : (
              <div className="text-sm text-gray-500">Loading...</div>
            )}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              General
            </div>
            <div className="text-sm text-gray-700">
              Combined GEO, SEO, and Performance score.
            </div>
          </div>
        </div>
        <GeoSummary item={item} geo={geo} />
        <SeoSummary seo={seo} />
        <PerformanceSummary performance={performance} />
      </div>
    </div>
  );

  const renderGeo = () => (
    <div className="flex flex-col gap-4">
      {!geo && (
        <div className="text-sm text-gray-500">
          GEO metrics are still loading for this item.
        </div>
      )}
      {geo && <GeoDetail geo={geo} />}
    </div>
  );

  const renderSeo = () => (
    <div className="text-sm text-gray-700">
      SEO analysis and metrics will be displayed here.
    </div>
  );

  const renderPerformance = () => (
    <div className="text-sm text-gray-700">
      Performance statistics will be displayed here.
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return renderOverview();
      case "GEO":
        return renderGeo();
      case "SEO":
        return renderSeo();
      case "Performance":
        return renderPerformance();
      default:
        return null;
    }
  };

  return (
    <Panel>
      <div className="flex flex-col h-full justify-start">
        {/* Tabs & back button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
          >
            <span aria-hidden="true">←</span>
            Back to results
          </button>

          <div className="flex justify-evenly border-b border-gray-200 rounded-full bg-white z-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-2"
              >
                <span
                  className={`px-3 py-1 text-xs rounded-2xl font-medium ${
                    activeTab === tab
                      ? "text-white border-b-2 bg-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
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
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pt-2 flex-grow overflow-y-auto">{renderContent()}</div>
      </div>
    </Panel>
  );
}

export default LeftPanel;

function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-primary/10 text-primary",
    muted: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        tones[tone] || tones.default
      }`}
    >
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

