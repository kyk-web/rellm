function json(res, status, payload, origin = "*") {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.setHeader("access-control-allow-origin", origin);
  res.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
  res.end(JSON.stringify(payload));
}

function trim(value, limit = 1800) {
  const text = value == null ? "" : String(value);
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length <= limit ? compact : `${compact.slice(0, limit)}...`;
}

function allowedOrigin(req) {
  const origin = req.headers.origin || "*";
  const allowList = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!allowList.length || origin === "*") return origin;
  return allowList.includes(origin) ? origin : allowList[0];
}

function briefContext(context) {
  const payload = {
    generated_at: context?.generated_at,
    runtime: context?.runtime || {},
    strategy: context?.strategy || {},
    market_regime: context?.market_regime || {},
    positions_top: (context?.positions || []).slice(0, 8),
    recent_orders: (context?.orders || []).slice(0, 8),
    agent_activity: (context?.agent_activity || []).slice(0, 8),
    llm_activity: (context?.llm_activity || []).slice(0, 6),
    agent_models: context?.agent_models || {},
    trading_sessions: context?.trading_sessions || [],
    design: context?.design || [],
  };
  return trim(JSON.stringify(payload), 9000);
}

function parseSse(text) {
  const chunks = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line.startsWith("data:")) continue;
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") continue;
    try {
      const obj = JSON.parse(data);
      const choice = obj.choices?.[0] || {};
      const delta = choice.delta || {};
      const message = choice.message || {};
      if (delta.content) chunks.push(delta.content);
      if (message.content) chunks.push(message.content);
    } catch (_) {
      // Upstream SSE can contain keepalive lines; ignore non-JSON chunks.
    }
  }
  return chunks.join("");
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function callModel(question, context) {
  const apiKey = process.env.CODEBUDDY_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      answer: "后端没有配置 CODEBUDDY_API_KEY，暂时不能调用大模型。",
      error: "missing_api_key",
    };
  }

  const endpoint = process.env.CODEBUDDY_ENDPOINT || "https://www.codebuddy.cn/v2/chat/completions";
  const model = process.env.CHAT_MODEL || "deepseek-v4-pro";
  const system = [
    "你是“量化智问”，服务于 A 股多智能体量化系统展示页。",
    "你只能基于用户问题和提供的运行证据回答，不要编造收益、持仓或订单。",
    "回答要简洁、正式、中文为主；涉及金额保留两位小数。",
    "不要输出或索要任何 API Key、令牌、密码。",
    "如果证据不足，直接说明当前页面证据不足。",
  ].join("");
  const user = `# 用户问题\n${question}\n\n# 当前页面运行证据 JSON\n${briefContext(context)}`;

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${apiKey}`,
      "accept": "text/event-stream",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: Number(process.env.CHAT_MAX_TOKENS || 700),
      stream: true,
    }),
  });

  const text = await upstream.text();
  if (!upstream.ok) {
    return {
      ok: false,
      answer: "大模型服务暂时没有返回有效结果，前端会自动使用本页证据回答。",
      error: `HTTP ${upstream.status}: ${trim(text, 420)}`,
      model,
    };
  }
  return {
    ok: true,
    answer: parseSse(text) || trim(text, 2000),
    model,
  };
}

module.exports = async function handler(req, res) {
  const origin = allowedOrigin(req);
  if (req.method === "OPTIONS") return json(res, 200, { ok: true }, origin);

  if (req.method === "GET") {
    return json(
      res,
      200,
      {
        ok: true,
        api_key_present: Boolean(process.env.CODEBUDDY_API_KEY),
        endpoint: process.env.CODEBUDDY_ENDPOINT || "https://www.codebuddy.cn/v2/chat/completions",
        model: process.env.CHAT_MODEL || "deepseek-v4-pro",
        time: new Date().toISOString(),
      },
      origin,
    );
  }

  if (req.method !== "POST") return json(res, 405, { ok: false, error: "method_not_allowed" }, origin);

  try {
    const payload = await readBody(req);
    const question = String(payload.question || "").trim();
    if (!question) return json(res, 400, { ok: false, error: "missing_question" }, origin);
    const context = payload.context && typeof payload.context === "object" ? payload.context : {};
    return json(res, 200, await callModel(question, context), origin);
  } catch (err) {
    return json(res, 500, { ok: false, error: `${err?.name || "Error"}: ${trim(err?.message || err, 240)}` }, origin);
  }
};
