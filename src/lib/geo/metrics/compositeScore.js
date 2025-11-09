// Default weights (tweak to taste / calibrate later)
const W = {
  llm_overall: 0.45, // main qualitative signal
  completeness: 0.15,
  evidence_coverage: 0.15,
  evidence_literal: 0.1,
  pos_adjusted_wc: 0.1,
  source_diversity: 0.03,
  ttr: 0.02,
};

export function compositeScore(x) {
  const o = Math.max(0, Math.min(100, x.llm.overall.score)); // clamp
  const score =
    W.llm_overall * (o / 100) +
    W.completeness * x.fieldCompletenessRatio +
    W.evidence_coverage * x.evidenceCoverageRatio +
    W.evidence_literal * x.evidenceLiteralMatchRatio +
    W.pos_adjusted_wc * x.positionAdjustedWC +
    W.source_diversity * (x.sourceEntropyNorm ?? 0) +
    W.ttr * (x.ttr ?? 0);

  return {
    score: Math.round(score * 100), // 0..100
    weights: W,
  };
}

