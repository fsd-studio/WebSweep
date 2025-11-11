"use client"

import React, { useEffect, useState } from "react";
import { useDataCollection } from "context/DataCollectionContext";

function ensureUrl(u) {
  if (!u) return null;
  let s = (u || "").trim();
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try { return new URL(s).toString(); } catch { return null; }
}

export default function GeoMetrics() {
  const { geoDataCollection } = useDataCollection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]); // parallel to items; each slot fills as ready
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  useEffect(() => {
    const src = Array.isArray(geoDataCollection) ? geoDataCollection : [];
    const payload = src
      .map((it) => ({
        url: ensureUrl(it?.website || it?.url),
        text: it?.text || it?.page_text,
        email: it?.email,
        phone: it?.phone,
        city: it?.city,
        canton: it?.canton,
        address: it?.address,
        postal_code: it?.postal_code,
        country: it?.country,
        street: it?.street,
      }))
      .filter((x) => x.url);

    if (!payload.length) {
      setItems([]);
      setResults([]);
      setProgress({ done: 0, total: 0 });
      setError(null);
      setLoading(false);
      return;
    }

    setItems(payload);
    setResults(Array(payload.length).fill(null));
    setProgress({ done: 0, total: payload.length });

    let cancelled = false;
    const runSequential = async () => {
      setLoading(true);
      setError(null);
      for (let i = 0; i < payload.length; i++) {
        if (cancelled) break;
        try {
          const resp = await fetch("/api/geo-metrics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([payload[i]]),
          });
          const json = await resp.json();
          const r = json?.items?.[0] || { url: payload[i].url, success: false, error: json?.error || `HTTP ${resp.status}` };
          if (!cancelled) {
            setResults((prev) => {
              const arr = [...prev];
              arr[i] = r;
              return arr;
            });
          }
        } catch (e) {
          if (!cancelled) {
            setResults((prev) => {
              const arr = [...prev];
              arr[i] = { url: payload[i].url, success: false, error: e.message || "Failed" };
              return arr;
            });
          }
        } finally {
          if (!cancelled) setProgress((p) => ({ done: p.done + 1, total: payload.length }));
        }
      }
      if (!cancelled) setLoading(false);
    };

    runSequential();
    return () => {
      cancelled = true;
    };
  }, [geoDataCollection]);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-3">GEO Metrics</h3>
      <details className="mb-4">
        <summary className="cursor-pointer underline text-sm">What these metrics mean</summary>
        <div className="mt-2 text-sm space-y-1">
          <p><b>Composite Score</b>: overall 0–100 quality combining LLM judgment with evidence/structure signals.</p>
          <p><b>LLM Overall</b>: model's holistic 0–100 view of the extraction quality.</p>
          <p><b>Relevance/Support/Completeness/Citation Quality/Uniqueness</b>: five 1–10 subscores that capture on‑topicness, evidence strength, coverage, quote precision, and specificity.</p>
          <p><b>Completeness</b> (ratio): filled fields out of expected fields.</p>
          <p><b>Evidence Coverage</b> (ratio): non‑null fields that include at least one exact quote.</p>
          <p><b>Evidence Literal</b> (ratio): fraction of quotes that literally occur in the page text.</p>
          <p><b>Avg Evidence Chars</b>: average length of quoted snippets (proxy for specificity).</p>
          <p><b>TTR</b>: type‑token ratio, a rough measure of lexical diversity.</p>
          <p><b>Source Entropy</b>: diversity of sources cited (0 one source, 1 evenly balanced).</p>
          <p><b>Pos‑Adjusted WC</b>: position‑weighted share of words from the main source (earlier sentences weigh more).</p>
        </div>
      </details>
      <div className="space-y-4">
        <div className="text-sm text-gray-600">Processed {progress.done}/{progress.total}</div>
        {(items.length ? items : []).map((_, idx) => {
          const r = results[idx];
          if (!r) {
            return (
              <div key={idx} className="border rounded-2xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="font-mono text-sm break-all">{items[idx]?.url}</div>
                  <div className="text-gray-500">Processing…</div>
                </div>
              </div>
            );
          }
          return (
          <div key={idx} className="border rounded-2xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="font-mono text-sm break-all">{r.url || r.input?.website || "(no url)"}</div>
              {r.success && r.data?.composite?.score !== undefined ? (
                <div className="text-2xl font-bold">Score: {r.data.composite.score}</div>
              ) : null}
            </div>

            {r.success ? (
              <div className="mt-2 grid md:grid-cols-3 gap-3 text-sm">
                {r.data?.evaluation?.overall?.score !== undefined && (
                  <Metric label="LLM Overall" value={r.data.evaluation.overall.score} />
                )}
                {r.data?.objective && (
                  <>
                    {r.data.objective.position_adjusted_wc !== undefined && (
                      <Metric label="Pos-Adjusted WC" value={Number(r.data.objective.position_adjusted_wc).toFixed(3)} />
                    )}
                  </>
                )}

                {/* Evaluation subscores */}
                {r.data?.evaluation?.scores && (
                  <div className="md:col-span-3">
                    <SectionTitle>Evaluation</SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                      {Object.entries(r.data.evaluation.scores).map(([k, v]) => (
                        <Metric key={k} label={titleCase(k)} value={v?.score} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Diagnostics */}
                {r.data?.diagnostics && (
                  <div className="md:col-span-3">
                    <SectionTitle>Diagnostics</SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {r.data.diagnostics.completeness && (
                        <Metric label="Completeness" value={percent(r.data.diagnostics.completeness.ratio)} />
                      )}
                      {r.data.diagnostics.evidenceCoverage && (
                        <Metric label="Evidence Coverage" value={percent(r.data.diagnostics.evidenceCoverage.ratio)} />
                      )}
                      {r.data.diagnostics.evidenceLiteral && (
                        <Metric label="Evidence Literal" value={percent(r.data.diagnostics.evidenceLiteral.ratio)} />
                      )}
                      {r.data.diagnostics.evidenceAvgSpanChars && (
                        <Metric label="Avg Evidence Chars" value={r.data.diagnostics.evidenceAvgSpanChars.avgChars?.toFixed(1)} />
                      )}
                      {r.data.diagnostics.ttr && (
                        <Metric label="TTR" value={r.data.diagnostics.ttr.ratio?.toFixed(3)} />
                      )}
                      {r.data.diagnostics.diversity && (
                        <Metric label="Source Entropy" value={r.data.diagnostics.diversity.normalized?.toFixed(3)} />
                      )}
                    </div>
                  </div>
                )}

                {/* Position shares by source */}
                {r.data?.objective?.position_adjusted_wc_by_source && (
                  <div className="md:col-span-3">
                    <SectionTitle>Source Shares</SectionTitle>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {Object.entries(r.data.objective.position_adjusted_wc_by_source).map(([host, share]) => (
                        <Metric key={host} label={host} value={Number(share).toFixed(3)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Extraction summary */}
                {r.data?.extraction && (
                  <div className="md:col-span-3">
                    <SectionTitle>Extraction</SectionTitle>
                    <p className="text-xs text-gray-600 mb-2">
                      LLM‑extracted fields with verbatim evidence. If a value is not
                      present in the provided page text, it appears as "—". Use the
                      evidence expander to audit exact quotes.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      <KV label="Goal" item={r.data.extraction.goal} />
                      <KV label="Vision" item={r.data.extraction.vision} />
                      <KV label="Mission" item={r.data.extraction.mission} />
                      <KV label="Email" item={r.data.extraction.contact?.email} />
                      <KV label="Phone" item={r.data.extraction.contact?.phone} />
                      <KV label="Address.Street" item={r.data.extraction.address?.street} />
                      <KV label="Address.Postal" item={r.data.extraction.address?.postal_code} />
                      <KV label="Address.City" item={r.data.extraction.address?.city} />
                      <KV label="Address.Country" item={r.data.extraction.address?.country} />
                    </div>
                    {!!(r.data.extraction.services || []).length && (
                      <div className="mt-2">
                        <SectionTitle small>Services</SectionTitle>
                        <ul className="list-disc ms-6">
                          {(r.data.extraction.services || []).map((s, i) => (
                            <li key={i}>{s?.value}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {r.data?.note && (
                  <div className="md:col-span-3 text-yellow-700">{r.data.note}</div>
                )}
              </div>
            ) : (
              <div className="text-red-600 mt-2">{r.error || "Failed"}</div>
            )}

            <details className="mt-3">
              <summary className="cursor-pointer text-sm underline">Raw</summary>
              <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-3 rounded-xl overflow-x-auto">
                {JSON.stringify(r, null, 2)}
              </pre>
            </details>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="border rounded-xl p-3 bg-white shadow-sm">
      <div className="text-gray-600 text-xs">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function KV({ label, item }) {
  const value = item?.value ?? null;
  const ev = Array.isArray(item?.evidence) ? item.evidence : [];
  return (
    <div className="border rounded-xl p-3 bg-white shadow-sm">
      <div className="text-gray-600 text-xs">{label}</div>
      <div className="text-sm font-medium break-words">{value || "—"}</div>
      {!!ev.length && (
        <details className="mt-1">
          <summary className="text-xs underline cursor-pointer">evidence</summary>
          <ul className="list-disc ms-5 text-[11px] space-y-1">
            {ev.slice(0, 5).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
            {ev.length > 5 && <li>…+{ev.length - 5} more</li>}
          </ul>
        </details>
      )}
    </div>
  );
}

function SectionTitle({ children, small }) {
  return (
    <div className={`font-semibold ${small ? "text-xs" : "text-sm"} mb-2`}>{children}</div>
  );
}

function percent(x) {
  if (x == null) return "—";
  return `${Math.round(x * 100)}%`;
}

function titleCase(s) {
  return String(s)
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
}
