export function typeTokenRatio(text) {
  const tokens = text.toLowerCase().match(/\b[\p{L}\p{N}']+\b/gu) ?? [];
  const types = new Set(tokens);
  const ratio = tokens.length ? types.size / tokens.length : 0;
  return { tokens: tokens.length, types: types.size, ratio };
}

