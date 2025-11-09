// % of fields that have a non-empty value
export function fieldCompleteness(ex) {
  const slots = [
    ex.goal?.value,
    ex.mission?.value,
    ex.vision?.value,
    ex.address?.street?.value,
    ex.address?.postal_code?.value,
    ex.address?.city?.value,
    ex.address?.country?.value,
    ex.contact?.email?.value,
    ex.contact?.phone?.value,
    ...(ex.services ?? []).map((s) => s.value),
  ];
  const total = slots.length;
  const filled = slots.filter(
    (v) => v !== null && v !== undefined && String(v).trim() !== ""
  ).length;
  return { total, filled, ratio: total ? filled / total : 0 };
}

// % of non-null values that also include at least one evidence span
export function evidenceCoverage(ex) {
  const valuesWithEvidence = [];
  const push = (v) => {
    if (v)
      valuesWithEvidence.push({ v: v.value ?? null, ev: v.evidence ?? [] });
  };

  push(ex.goal);
  push(ex.mission);
  push(ex.vision);
  push(ex.address?.street);
  push(ex.address?.postal_code);
  push(ex.address?.city);
  push(ex.address?.country);
  push(ex.contact?.email);
  push(ex.contact?.phone);
  (ex.services ?? []).forEach((s) =>
    valuesWithEvidence.push({ v: s.value ?? null, ev: s.evidence ?? [] })
  );

  const nonNull = valuesWithEvidence.filter(
    (x) => x.v && String(x.v).trim() !== ""
  );
  const withEv = nonNull.filter((x) => (x.ev ?? []).length > 0);
  return {
    total: nonNull.length,
    withEvidence: withEv.length,
    ratio: nonNull.length ? withEv.length / nonNull.length : 0,
  };
}

// Evidence literal-match rate: every evidence span must appear in PAGE_TEXT
export function evidenceLiteralMatchRate(page, ex) {
  const spans = [];
  const collect = (v) => (v?.evidence ?? []).forEach((s) => spans.push(s));
  collect(ex.goal);
  collect(ex.mission);
  collect(ex.vision);
  collect(ex.address?.street);
  collect(ex.address?.postal_code);
  collect(ex.address?.city);
  collect(ex.address?.country);
  collect(ex.contact?.email);
  collect(ex.contact?.phone);
  (ex.services ?? []).forEach((s) => (s.evidence ?? []).forEach((e) => spans.push(e)));

  const textLower = page.text.toLowerCase();
  let hits = 0;
  spans.forEach((s) => {
    if (s && textLower.includes(s.toLowerCase())) hits++;
  });

  return {
    total: spans.length,
    hits,
    ratio: spans.length ? hits / spans.length : 1,
  };
}

// Average evidence span length (proxy for specificity)
export function avgEvidenceSpanChars(ex) {
  const all = [];
  const collect = (v) => (v?.evidence ?? []).forEach((s) => all.push(s));
  collect(ex.goal);
  collect(ex.mission);
  collect(ex.vision);
  collect(ex.address?.street);
  collect(ex.address?.postal_code);
  collect(ex.address?.city);
  collect(ex.address?.country);
  collect(ex.contact?.email);
  collect(ex.contact?.phone);
  (ex.services ?? []).forEach((s) => (s.evidence ?? []).forEach((e) => all.push(e)));

  const lens = all.map((s) => (s ?? "").length).filter((n) => n > 0);
  const avg = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0;
  return { count: lens.length, avgChars: avg };
}

