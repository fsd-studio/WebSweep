import { useEffect, useState } from "react";
import { FiMonitor, FiTablet, FiSmartphone } from "react-icons/fi";
import Panel from "./Panel";

function RightPanel({ item }) {
  const [view, setView] = useState("desktop");
  const [iframeStatus, setIframeStatus] = useState("idle"); 
  const [iframeMessage, setIframeMessage] = useState("");
  const website = normalizeUrl(item?.website);

  const views = {
    desktop: { label: "Laptop", maxWidth: "max-w-5xl", aspect: "aspect-[16/10]", maxH: "max-h-[75vh]" },
    tablet: { label: "Tablet", maxWidth: "max-w-3xl", aspect: "aspect-[4/3]", maxH: "max-h-[65vh]" },
    mobile: { label: "Mobile", maxWidth: "max-w-[380px]", aspect: "aspect-[9/16]", maxH: "max-h-[70vh]" }, 
  };

  const currentView = views[view] || views.desktop;

  useEffect(() => {
    if (!website) {
      setIframeStatus("error");
      setIframeMessage("No website URL available for this item.");
      return;
    }
    setIframeStatus("loading");
    setIframeMessage("");
    const timer = setTimeout(() => {
      setIframeStatus((prev) => {
        if (prev === "loading") {
          setIframeMessage("This site may refuse to load in an iframe. Try opening it in a new tab.");
          return "error";
        }
        return prev;
      });
    }, 3500);
    return () => clearTimeout(timer);
  }, [website]);

  const handleLoad = () => {
    setIframeStatus("loaded");
    setIframeMessage("");
  };

  const handleError = () => {
    setIframeStatus("error");
    setIframeMessage("This site refused to load in an iframe. Open it in a new tab.");
  };

  return (
    <Panel>
      <div className="flex flex-col h-full gap-3 items-center justify-start text-center">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Live preview</div>
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {Object.entries(views).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  view === key
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {key === "desktop" && <FiMonitor />}
                {key === "tablet" && <FiTablet />}
                {key === "mobile" && <FiSmartphone />}
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
        {website ? (
          <div className={`relative w-full ${currentView.maxWidth} ${currentView.maxH} overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm`}>
            <div className={`${currentView.aspect} h-full`}>
              <iframe
                src={website}
                title={item?.title || "Website preview"}
                className="w-full h-full rounded-[10px]"
                onLoad={handleLoad}
                onError={handleError}
              />
            </div>
            {iframeStatus === "error" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 px-4 text-center">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-800">{iframeMessage || "This site refused to load in an iframe."}</div>
                  <div className="text-xs text-gray-600">Some sites block embedding. Open it directly below.</div>
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    Open in new tab
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-600">No website URL available for this item.</div>
        )}
        {website && iframeStatus !== "error" && (
          <div className="text-xs text-gray-600">
            If you see “refused to connect”, the site blocks iframes.{" "}
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open in a new tab
            </a>
            .
          </div>
        )}
      </div>
    </Panel>
  );
}

function normalizeUrl(url) {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default RightPanel;
