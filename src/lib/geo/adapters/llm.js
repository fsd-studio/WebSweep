export function togetherClientFactory(apiKey) {
  if (!apiKey) throw new Error("TOGETHER_API_KEY missing. Put it in .env");

  return async ({ model, messages, response_format, temperature = 0.2 }) => {
    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        response_format:
          response_format === "json" ? { type: "json_object" } : undefined,
      }),
    });

    const text = await res.text(); // read once

    if (!res.ok) {
      throw new Error(`Together API ${res.status}: ${text}`);
    }
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Together API returned non-JSON: ${text.slice(0, 400)}`);
    }
    const content = json?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error(`Together API content missing: ${text.slice(0, 400)}`);
    }
    return content;
  };
}
