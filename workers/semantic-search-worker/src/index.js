const DEFAULT_MODEL = "gemini-embedding-2"
const DEFAULT_DIMENSION = 768
const MAX_QUERY_LENGTH = 300

function json(body, init = {}, cors = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...cors,
      ...(init.headers ?? {}),
    },
  })
}

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function corsFor(request, env) {
  const origin = request.headers.get("Origin") ?? ""
  const allowed = allowedOrigins(env)
  const allowAll = allowed.includes("*")
  const allowedOrigin =
    allowAll || !origin ? origin || allowed[0] || "*" : allowed.includes(origin) ? origin : ""

  return {
    ok: allowAll || !origin || Boolean(allowedOrigin),
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin || "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    },
  }
}

function normalizeQuery(value) {
  const query = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
  if (!query) return ""
  if (query.startsWith("task:")) return query.slice(0, MAX_QUERY_LENGTH)
  return `task: search result | query: ${query.slice(0, MAX_QUERY_LENGTH)}`
}

async function embedWithGemini(env, query) {
  const apiKey = env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const model = env.GEMINI_EMBEDDING_MODEL || DEFAULT_MODEL
  const outputDimensionality = Number(env.GEMINI_EMBEDDING_DIM || DEFAULT_DIMENSION)
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model: `models/${model}`,
      content: {
        parts: [{ text: normalizeQuery(query) }],
      },
      output_dimensionality: outputDimensionality,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini embedding request failed: ${response.status} ${errorText}`)
  }

  const payload = await response.json()
  const embedding = payload.embedding?.values ?? payload.embeddings?.[0]?.values
  if (!Array.isArray(embedding)) {
    throw new Error("Gemini response did not include embedding values")
  }

  return {
    embedding,
    model,
    outputDimensionality,
  }
}

export default {
  async fetch(request, env) {
    const cors = corsFor(request, env)

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors.headers })
    }

    if (!cors.ok) {
      return json({ error: "Origin is not allowed" }, { status: 403 }, cors.headers)
    }

    if (request.method !== "POST") {
      return json({ error: "Use POST / with { query }" }, { status: 405 }, cors.headers)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: "Invalid JSON body" }, { status: 400 }, cors.headers)
    }

    const query = normalizeQuery(body?.query)
    if (!query) {
      return json({ error: "query is required" }, { status: 400 }, cors.headers)
    }

    try {
      const result = await embedWithGemini(env, query)
      return json(result, { status: 200 }, cors.headers)
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : "Embedding request failed" },
        { status: 502 },
        cors.headers,
      )
    }
  },
}
