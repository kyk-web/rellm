module.exports = async function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify({
    ok: true,
    api_key_present: Boolean(process.env.CODEBUDDY_API_KEY),
    endpoint: process.env.CODEBUDDY_ENDPOINT || "https://www.codebuddy.cn/v2/chat/completions",
    model: process.env.CHAT_MODEL || "deepseek-v4-pro",
    time: new Date().toISOString(),
  }));
};
