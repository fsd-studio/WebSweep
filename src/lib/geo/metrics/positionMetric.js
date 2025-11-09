export const wordCount = (s) => (s.trim().match(/\S+/g) ?? []).length;

const splitSentencesWithSources = (answer) =>
  answer
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .map((s) => {
      const m = s.match(/\[SOURCE:\s*([^\]]+)\]/i);
      return { sentence: s.trim(), source: m ? m[1].trim() : null };
    });

export function positionAdjustedWordCount(geAnswer) {
  const parts = splitSentencesWithSources(geAnswer);
  const N = parts.length || 1;
  const totals = {};
  let sum = 0;
  parts.forEach((p, i) => {
    const wc = wordCount(p.sentence);
    const weight = Math.exp(-i / N);
    if (p.source) {
      totals[p.source] = (totals[p.source] ?? 0) + wc * weight;
      sum += wc * weight;
    }
  });
  const normalized = {};
  if (!sum) return normalized;
  for (const [k, v] of Object.entries(totals)) normalized[k] = v / sum;
  return normalized;
}

