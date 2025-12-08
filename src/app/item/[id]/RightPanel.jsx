import { useEffect, useMemo, useRef, useState } from "react";
import { FiMonitor, FiTablet, FiSmartphone } from "react-icons/fi";
import Panel from "./Panel";

function RightPanel({ item }) {
  const [view, setView] = useState("desktop");
  const [iframeStatus, setIframeStatus] = useState("idle"); 
  const [iframeMessage, setIframeMessage] = useState("");
  const website = normalizeUrl(item?.website);

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [scaledWidth, setScaledWidth] = useState(null);

  const views = useMemo(
    () => ({
      desktop: { label: "Laptop", width: 1440, height: 900, minHeight: 300, maxHeight: 300 },
      tablet: { label: "Tablet", width: 1024, height: 768, minHeight: 300, maxHeight: 300 },
      mobile: { label: "Mobile", width: 430, height: 720, minHeight: 300, maxHeight: 300 },
    }),
    []
  );

  const currentView = views[view] || views.desktop;

  useEffect(() => {
    const targetWidth = currentView.width;
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const parentWidth = el.parentElement?.clientWidth || targetWidth;
      const nextScale = Math.min(1, parentWidth / targetWidth);
      const nextWidth = targetWidth * nextScale;
      setScale((prev) => (Math.abs(prev - nextScale) < 0.001 ? prev : nextScale));
      setScaledWidth((prev) => (prev && Math.abs(prev - nextWidth) < 1 ? prev : nextWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [view, currentView.width]);

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
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg mx-auto"
            ref={containerRef}
            style={{
              width: scaledWidth ? `${scaledWidth}px` : "100%",
              maxWidth: "100%",
              minHeight: `${Math.max(currentView.minHeight, currentView.height * (scaledWidth ? scale : 1))}px`,
              maxHeight: `${currentView.maxHeight}px`,
            }}
          >
            <div className="relative" style={{
              width: `${currentView.width}px`,
              height: `${currentView.height}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}>
              <iframe
                src={website}
                title={item?.title || "Website preview"}
                className="w-full h-full rounded-[14px]"
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
