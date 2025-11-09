// Use your positionAdjustedWordCount() output to compute entropy (diversity)
export function sourceEntropy(distribution) {
  const probs = Object.values(distribution).filter((p) => p > 0);
  if (!probs.length) return { H: 0, normalized: 0 };
  const H = -probs.reduce((acc, p) => acc + p * Math.log2(p), 0);
  const maxH = Math.log2(probs.length);
  return { H, normalized: maxH ? H / maxH : 0 };
}

