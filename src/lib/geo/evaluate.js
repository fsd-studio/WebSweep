import { EvalSchema } from "./types.js";

const system = "You are a rigorous evaluator. Output STRICT JSON and no other text.";

const prompt = (page, extractionJson) => `
Evaluate the EXTRACTION against PAGE_TEXT.
Rules:
- Return STRICT JSON only.
- Do NOT include any top-level keys other than "scores", "overall", "field_feedback".
- "field_feedback" is optional; if absent, do not create any other keys.
- Keep reasons short (<= 25 words).

Schema:
{
  "scores":{
    "relevance":{"score":1-10,"reason":"..."},
    "support":{"score":1-10,"reason":"..."},
    "completeness":{"score":1-10,"reason":"..."},
    "citation_quality":{"score":1-10,"reason":"..."},
    "uniqueness":{"score":1-10,"reason":"..."}
  },
  "overall":{"score":0-100,"reason":"..."},
  "field_feedback":{"goal":"...","vision":"...","address":"...","faqs":"..."}
}

PAGE_TEXT:
<<<${page.text}>>>

EXTRACTION_JSON:
<<<${extractionJson}>>>
`.trim();

export async function evaluateExtraction(
  page,
  extraction,
  chat,
  model,
  temperature = 0.2
) {
  const content = await chat({
    model,
    temperature,
    response_format: "json",
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt(page, JSON.stringify(extraction)) },
    ],
  });

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    console.error("LLM #2 non-JSON content:\n", content);
    throw new Error("Evaluation JSON parse failed.");
  }

  const res = EvalSchema.safeParse(parsed);
  if (!res.success) {
    console.error("Evaluation schema errors:", res.error.flatten());
    throw new Error("Evaluation schema validation failed.");
  }
  return res.data;
}
