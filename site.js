async function loadReport() {
  const response = await fetch("contest_report_latest.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`failed_to_load_report:${response.status}`);
  }
  return response.json();
}

const CHAT_ENDPOINTS = [
  "https://rellm-quant-agent.vercel.app/api/chat",
  "https://rellm-quant-agent-4chjr1u0k-kyk-quant-lab.vercel.app/api/chat",
];

function fmtMoney(value) {
  return Number(value || 0).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtPct(value) {
  return `${Number(value || 0).toFixed(4)}%`;
}

function fmtRatio(value) {
  return `${(Number(value || 0) * 100).toFixed(2)}%`;
}

function signedClass(value) {
  return Number(value || 0) >= 0 ? "up" : "down";
}

function signedText(value, digits = 2) {
  const num = Number(value || 0);
  const prefix = num >= 0 ? "+" : "";
  return `${prefix}${num.toFixed(digits)}`;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function metricCard(label, value, sub, extraClass = "") {
  return `
    <article class="metric ${extraClass}">
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
      <div class="metric-sub">${sub}</div>
    </article>
  `;
}

function makeLineChart(points) {
  const width = 720;
  const height = 240;
  const padX = 46;
  const padTop = 24;
  const padBottom = 34;
  const values = points.map((item) => item.close_total);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const xStep = (width - padX * 2) / Math.max(points.length - 1, 1);
  const yOf = (value) => padTop + ((max - value) / range) * (height - padTop - padBottom);
  const polyline = points.map((item, index) => `${padX + index * xStep},${yOf(item.close_total)}`).join(" ");

  const labels = points.map((item, index) => `
    <text x="${padX + index * xStep}" y="${height - 10}" text-anchor="middle" fill="#637083" font-size="12">${item.date.slice(5)}</text>
    <circle cx="${padX + index * xStep}" cy="${yOf(item.close_total)}" r="4.5" fill="#9f4b23"></circle>
  `).join("");

  return `
    <svg class="svg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="周度净值曲线">
      <line x1="${padX}" y1="${height - padBottom}" x2="${width - padX}" y2="${height - padBottom}" stroke="rgba(24,33,43,0.16)" />
      <line x1="${padX}" y1="${padTop}" x2="${padX}" y2="${height - padBottom}" stroke="rgba(24,33,43,0.16)" />
      <polyline points="${polyline}" fill="none" stroke="#9f4b23" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></polyline>
      ${labels}
      <text x="${padX - 8}" y="${padTop + 4}" text-anchor="end" fill="#637083" font-size="12">${fmtMoney(max)}</text>
      <text x="${padX - 8}" y="${height - padBottom + 4}" text-anchor="end" fill="#637083" font-size="12">${fmtMoney(min)}</text>
    </svg>
  `;
}

function makeBarChart(points) {
  const width = 720;
  const height = 220;
  const padX = 52;
  const padTop = 20;
  const padBottom = 40;
  const values = points.map((item) => item.daily_pnl);
  const maxAbs = Math.max(...values.map((item) => Math.abs(item)), 1);
  const baseY = height / 2;
  const barWidth = 78;
  const gap = 48;
  const yScale = (height - padTop - padBottom) / (2 * maxAbs);

  const bars = points.map((item, index) => {
    const x = padX + index * (barWidth + gap);
    const size = Math.abs(item.daily_pnl) * yScale;
    const y = item.daily_pnl >= 0 ? baseY - size : baseY;
    const fill = item.daily_pnl >= 0 ? "#b53b2f" : "#157352";
    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${size}" rx="12" fill="${fill}"></rect>
      <text x="${x + barWidth / 2}" y="${height - 14}" text-anchor="middle" fill="#637083" font-size="12">${item.date.slice(5)}</text>
      <text x="${x + barWidth / 2}" y="${item.daily_pnl >= 0 ? y - 8 : y + size + 16}" text-anchor="middle" fill="${fill}" font-size="12">${signedText(item.daily_pnl)}</text>
    `;
  }).join("");

  return `
    <svg class="svg-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="单日盈亏柱状图">
      <line x1="${padX - 18}" y1="${baseY}" x2="${width - 20}" y2="${baseY}" stroke="rgba(24,33,43,0.16)"></line>
      ${bars}
    </svg>
  `;
}

function weeklyTableRows(data) {
  return data.weekly_daily_results.map((item) => `
    <tr>
      <td>${item.date}</td>
      <td class="num">${fmtMoney(item.open_total)}</td>
      <td class="num">${fmtMoney(item.close_total)}</td>
      <td class="num ${signedClass(item.daily_pnl)}">${signedText(item.daily_pnl)}</td>
      <td class="num ${signedClass(item.daily_return_pct)}">${fmtPct(item.daily_return_pct)}</td>
      <td class="num ${signedClass(item.cumulative_return_pct)}">${fmtPct(item.cumulative_return_pct)}</td>
    </tr>
  `).join("");
}

function holdingsRows(data) {
  return data.latest_holdings.map((item) => `
    <tr>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td class="num">${item.qty}</td>
      <td class="num">${fmtMoney(item.cost)}</td>
      <td class="num">${fmtMoney(item.last)}</td>
      <td class="num">${fmtMoney(item.market_value)}</td>
      <td class="num ${signedClass(item.unrealized_pnl)}">${signedText(item.unrealized_pnl)}</td>
      <td class="num">${fmtPct(item.weight_pct)}</td>
    </tr>
  `).join("");
}

function agentRows(data) {
  return data.agent_activity.map((item) => `
    <tr>
      <td>${item.agent}</td>
      <td class="num">${item.events}</td>
      <td class="num">${item.last_time}</td>
    </tr>
  `).join("");
}

function dayCards(data) {
  return data.weekly_daily_results.map((item) => `
    <article class="day-card">
      <div class="section-kicker">${item.date}</div>
      <h3>${signedText(item.daily_pnl)} / ${fmtPct(item.daily_return_pct)}</h3>
      <p class="mini">${item.focus}</p>
      <div class="list-row">
        <span class="pill">期末总资产 ${fmtMoney(item.close_total)}</span>
        <span class="pill">现金 ${fmtMoney(item.cash_balance)}</span>
        <span class="pill">持仓市值 ${fmtMoney(item.market_value)}</span>
      </div>
    </article>
  `).join("");
}

function replayCards(data) {
  return data.weekly_daily_results.map((day) => `
    <section class="panel">
      <div class="section-kicker">${day.date}</div>
      <h2 class="section-title">${signedText(day.daily_pnl)} / ${fmtPct(day.daily_return_pct)}</h2>
      <p class="lead">${day.focus}</p>
      <div class="grid-4">
        ${metricCard("期初总资产", fmtMoney(day.open_total), "当日开盘资产口径")}
        ${metricCard("期末总资产", fmtMoney(day.close_total), "当日收盘资产口径")}
        ${metricCard("现金余额", fmtMoney(day.cash_balance), "日终账户现金")}
        ${metricCard("持仓市值", fmtMoney(day.market_value), "日终股票市值")}
      </div>
      <div class="timeline" style="margin-top:18px;">
        ${day.trade_highlights.map((trade) => `
          <article class="timeline-item">
            <div class="timeline-meta">${trade.time}</div>
            <strong>${trade.stock} · ${trade.side} · ${trade.qty} 股 @ ${fmtMoney(trade.price)}</strong>
            <p>${trade.reason}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function bestDay(data) {
  return [...data.weekly_daily_results].sort((a, b) => b.daily_pnl - a.daily_pnl)[0];
}

function worstDay(data) {
  return [...data.weekly_daily_results].sort((a, b) => a.daily_pnl - b.daily_pnl)[0];
}

function topHoldings(data, count = 8) {
  return [...data.latest_holdings]
    .sort((a, b) => b.market_value - a.market_value)
    .slice(0, count);
}

function strategyKeywords(data) {
  const raw = [];
  for (const item of data.strategy.themes || []) {
    raw.push(item);
    for (const sep of ["/", "、", "+", "，", ","]) {
      if (String(item).includes(sep)) {
        raw.push(...String(item).split(sep));
      }
    }
  }
  const result = [];
  for (const item of raw) {
    const text = String(item || "").trim();
    if (text && !result.includes(text)) {
      result.push(text);
    }
  }
  return result.slice(0, 14);
}

function marketIndexCards(data) {
  const best = bestDay(data);
  const lastHoldings = topHoldings(data, 1)[0];
  const cards = [
    {
      label: "初始资金",
      value: fmtMoney(data.account.initial_capital),
      meta: "统一提交口径"
    },
    {
      label: "周末总资产",
      value: fmtMoney(data.account.final_total_assets),
      meta: data.weekly_window.end
    },
    {
      label: "周内合计盈亏",
      value: signedText(data.weekly_summary.weekly_cumulative_pnl),
      meta: `${data.weekly_summary.profit_days} / 5 个交易日盈利`
    },
    {
      label: "最佳单日",
      value: signedText(best.daily_pnl),
      meta: best.date
    },
    {
      label: "核心持仓",
      value: lastHoldings ? `${lastHoldings.code}` : "-",
      meta: lastHoldings ? `${lastHoldings.name} ${fmtMoney(lastHoldings.market_value)}` : "暂无"
    }
  ];
  return cards.map((item) => `
    <div class="market-index">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <em>${item.meta}</em>
    </div>
  `).join("");
}

function renderMarketStrategy(data) {
  const best = bestDay(data);
  const worst = worstDay(data);
  const holdings = topHoldings(data, 10);
  const cycle = `cyc_${(data.weekly_window.end || "").replaceAll("-", "") || "latest"}`;
  const stanceClass = data.strategy.view === "bullish" ? "good" : data.strategy.view === "bearish" ? "bad" : "neutral";

  return `
    <section class="panel market-strategy">
      <div class="market-head">
        <div>
          <div class="section-kicker">大盘策略</div>
          <h2 class="section-title">阶段 0 · 全 A 股扫描 → 主线 → 筛选候选</h2>
        </div>
        <div class="cycle-code">周期<br><strong>${cycle}</strong></div>
      </div>

      <div class="market-hero-card">
        <div class="market-stance">
          <span>市场状态 / 基础目标总仓位</span>
          <strong class="${stanceClass}">${data.strategy.view_label}</strong>
          <p>${data.strategy.notes}</p>
        </div>
        <div class="market-side-facts">
          <div><span>目标仓位</span><strong>${fmtRatio(data.strategy.target_position)}</strong></div>
          <div><span>现金缓冲</span><strong>${fmtRatio(data.strategy.cash_buffer)}</strong></div>
          <div><span>单票上限</span><strong>${fmtRatio(data.strategy.per_stock_cap)}</strong></div>
          <div><span>单次增量</span><strong>${fmtRatio(data.strategy.increment_cap)}</strong></div>
        </div>
      </div>

      <div class="market-index-wrap">
        <div class="market-index-grid">
          ${marketIndexCards(data)}
        </div>
      </div>

      <section class="grid-2" style="margin-top:16px;">
        <article class="market-block flat">
          <h3>主线主题</h3>
          <p class="strategy-subtitle">按照最新版提交口径，当前周度策略围绕以下主线进行筛选与配置。</p>
          <div class="strategy-chip-row">
            ${data.strategy.themes.map((item) => `<span class="theme-chip">${escapeHtml(item)}</span>`).join("")}
          </div>
          <div class="strategy-chip-row" style="margin-top:12px;">
            ${strategyKeywords(data).map((item) => `<span class="keyword-chip">${escapeHtml(item)}</span>`).join("")}
          </div>
        </article>

        <article class="market-block flat">
          <h3>候选与核心持仓</h3>
          <p class="strategy-subtitle">展示最新版记录下的核心持仓候选，用于说明主题如何落到具体标的。</p>
          <div class="candidate-pool">
            ${holdings.map((item) => `<span>${escapeHtml(`${item.code} ${item.name}`)}</span>`).join("")}
          </div>
        </article>
      </section>

      <section class="grid-2" style="margin-top:12px;">
        <article class="market-block flat">
          <h3>执行约束</h3>
          <ul class="evidence-list">
            ${data.execution_constraints.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </article>

        <article class="market-block flat">
          <h3>本周策略节奏</h3>
          <ul class="evidence-list">
            <li>最佳交易日为 ${best.date}，当日盈亏 ${signedText(best.daily_pnl)}，重点是 ${escapeHtml(best.focus)}</li>
            <li>波动最大回撤日为 ${worst.date}，当日盈亏 ${signedText(worst.daily_pnl)}，说明执行层在该日更偏收缩。</li>
            <li>周末总资产 ${fmtMoney(data.account.final_total_assets)}，相对初始收益率 ${fmtPct(data.account.return_vs_initial_pct)}。</li>
          </ul>
        </article>
      </section>

      <div class="market-hero-card" style="margin-top:16px;">
        <div class="market-stance">
          <span>LLM / 策略问答</span>
          <strong class="neutral">量化智问</strong>
          <p>右下角小插件已恢复，优先调用网页后台大模型接口；如果接口短时不可用，再回退到当前页面证据回答，不会改写策略或交易结果。</p>
        </div>
        <div class="market-side-facts">
          <div><span>问答范围</span><strong>盈亏 / 持仓 / 交易 / 策略</strong></div>
          <div><span>数据窗口</span><strong>${data.weekly_window.start} 至 ${data.weekly_window.end}</strong></div>
          <div><span>分析栈</span><strong>${escapeHtml((data.models.analysis_stack || []).slice(0, 3).join(" / "))}</strong></div>
          <div><span>记录口径</span><strong>仅使用最新版提交数据</strong></div>
        </div>
      </div>
    </section>
  `;
}

function renderFloatingChatWidget() {
  return `
    <button class="ai-fab" id="aiFab" type="button" aria-label="打开量化智问">
      <span class="ai-orb" aria-hidden="true"></span>
      <span><strong>量化智问</strong><span>RELLM MULTI-AGENT</span></span>
    </button>
    <aside class="ai-panel" id="aiPanel" aria-label="量化智问问答界面">
      <header class="ai-head">
        <div class="ai-brand">
          <span class="ai-orb" aria-hidden="true"></span>
          <div>
            <h3>量化智问</h3>
            <p>多智能体 · 运行记录 · 策略解释</p>
          </div>
        </div>
        <button class="ai-close" id="aiClose" type="button" aria-label="关闭">×</button>
      </header>
      <div class="ai-body" id="aiBody">
        <div class="ai-msg assistant">你好，我是量化智问。我可以解释当前页面里的收益、持仓、交易、策略和智能体记录。优先走网页后台大模型接口，接口暂不可用时会切换到页面证据回答。</div>
        <div class="ai-chips" id="aiChips">
          <button class="ai-chip" type="button">本周哪一天盈利最多？</button>
          <button class="ai-chip" type="button">当前最新持仓是什么？</button>
          <button class="ai-chip" type="button">现在的策略仓位怎样？</button>
          <button class="ai-chip" type="button">系统用了哪些分析栈？</button>
          <button class="ai-chip" type="button">这周总体收益如何？</button>
        </div>
      </div>
      <form class="ai-form" id="aiForm">
        <input class="ai-input" id="aiInput" autocomplete="off" placeholder="问问收益、持仓、策略或交易记录..." />
        <button class="ai-send" type="submit">发送</button>
        <div class="ai-footnote" id="aiStatus">优先调用网页后台大模型接口，不写入网页中的任何密钥。</div>
      </form>
    </aside>
  `;
}

function renderOverview(data) {
  return `
    <section class="stack">
      <div class="grid-4">
        ${metricCard("周末总资产", fmtMoney(data.account.final_total_assets), "最终提交版周末账户快照")}
        ${metricCard("相对初始收益率", fmtPct(data.account.return_vs_initial_pct), "初始资金 10,000,000.00")}
        ${metricCard("周内合计盈亏", signedText(data.weekly_summary.weekly_cumulative_pnl), "五个交易日累计结果")}
        ${metricCard("盈利天数", `${data.weekly_summary.profit_days}`, "本周盈利交易日")}
      </div>

      ${renderMarketStrategy(data)}

      <section class="panel">
        <div class="section-kicker">Weekly Result</div>
        <h2 class="section-title">周度账户结果</h2>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th class="num">期初总资产</th>
              <th class="num">期末总资产</th>
              <th class="num">当日盈亏</th>
              <th class="num">当日收益率</th>
              <th class="num">累计收益率</th>
            </tr>
          </thead>
          <tbody>${weeklyTableRows(data)}</tbody>
        </table>
      </section>

      <section class="grid-2">
        <article class="panel">
          <div class="section-kicker">Architecture</div>
          <h2 class="section-title">系统框架</h2>
          <div class="card-list">
            ${data.system_design.map((item) => `<div class="info-card"><h3>${item}</h3></div>`).join("")}
          </div>
        </article>

        <article class="panel">
          <div class="section-kicker">Coverage</div>
          <h2 class="section-title">提交记录覆盖</h2>
          <div class="card-list">
            ${data.record_coverage.map((item) => `<div class="info-card"><h3>${item}</h3></div>`).join("")}
          </div>
          <div class="summary-box" style="margin-top:18px;">
            <strong>网页问答</strong>
            <p class="mini">右下角量化智问已恢复，可直接对当前最新版提交数据发问。</p>
          </div>
        </article>
      </section>

      ${renderFloatingChatWidget()}
    </section>
  `;
}

function renderDashboard(data) {
  return `
    <section class="stack">
      <div class="grid-4">
        ${metricCard("周末总资产", fmtMoney(data.account.final_total_assets), `${data.weekly_window.end} 收盘口径`)}
        ${metricCard("现金余额", fmtMoney(data.weekly_daily_results[data.weekly_daily_results.length - 1].cash_balance), "最新日终现金")}
        ${metricCard("持仓市值", fmtMoney(data.weekly_daily_results[data.weekly_daily_results.length - 1].market_value), "最新日终持仓市值")}
        ${metricCard("策略置信度", fmtPct(data.strategy.confidence * 100), "最新策略视图置信度")}
      </div>

      ${renderMarketStrategy(data)}

      <section class="panel">
        <div class="section-kicker">Daily Snapshot</div>
        <h2 class="section-title">逐日运行摘要</h2>
        <div class="grid-3">${dayCards(data)}</div>
      </section>

      <section class="grid-2">
        <article class="panel">
          <div class="section-kicker">Holdings</div>
          <h2 class="section-title">最新持仓快照</h2>
          <table>
            <thead>
              <tr>
                <th>代码</th>
                <th>名称</th>
                <th class="num">数量</th>
                <th class="num">成本价</th>
                <th class="num">最新价</th>
                <th class="num">持仓市值</th>
                <th class="num">浮动盈亏</th>
                <th class="num">仓位占比</th>
              </tr>
            </thead>
            <tbody>${holdingsRows(data)}</tbody>
          </table>
        </article>

        <article class="panel">
          <div class="section-kicker">Agents</div>
          <h2 class="section-title">智能体运行记录</h2>
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th class="num">Events</th>
                <th class="num">Last Time</th>
              </tr>
            </thead>
            <tbody>${agentRows(data)}</tbody>
          </table>
          <div class="summary-box" style="margin-top:18px;">
            <strong>分析栈</strong>
            <p class="mini">${data.models.analysis_stack.join("、")}。</p>
          </div>
        </article>
      </section>

      ${renderFloatingChatWidget()}
    </section>
  `;
}

function renderPerformance(data) {
  const best = bestDay(data);
  return `
    <section class="stack">
      <section class="grid-2">
        <article class="panel">
          <div class="section-kicker">Equity Curve</div>
          <h2 class="section-title">周度净值曲线</h2>
          ${makeLineChart(data.weekly_daily_results)}
          <p class="chart-note">展示窗口：${data.weekly_window.start} 至 ${data.weekly_window.end}</p>
        </article>

        <article class="panel">
          <div class="section-kicker">Daily PnL</div>
          <h2 class="section-title">单日盈亏贡献</h2>
          ${makeBarChart(data.weekly_daily_results)}
          <p class="chart-note">周内最大正贡献来自 ${best.date}，当日盈亏 ${signedText(best.daily_pnl)}。</p>
        </article>
      </section>

      ${renderMarketStrategy(data)}

      <section class="grid-3">
        ${data.weekly_daily_results.map((item) => `
          <article class="metric">
            <div class="metric-label">${item.date}</div>
            <div class="metric-value ${signedClass(item.daily_pnl)}">${signedText(item.daily_pnl)}</div>
            <div class="metric-sub">当日收益率 ${fmtPct(item.daily_return_pct)}<br>期末总资产 ${fmtMoney(item.close_total)}</div>
          </article>
        `).join("")}
      </section>

      <section class="grid-2">
        <article class="panel">
          <div class="section-kicker">Interpretation</div>
          <h2 class="section-title">结果解释</h2>
          <div class="card-list">
            ${data.weekly_daily_results.map((item) => `
              <div class="info-card">
                <h3>${item.date}</h3>
                <p class="mini">${item.focus}</p>
              </div>
            `).join("")}
          </div>
        </article>

        <article class="panel">
          <div class="section-kicker">Constraints</div>
          <h2 class="section-title">策略执行约束</h2>
          <div class="card-list">
            ${data.execution_constraints.map((item) => `<div class="info-card"><h3>${item}</h3></div>`).join("")}
          </div>
          <div class="summary-box" style="margin-top:18px;">
            <strong>提交口径</strong>
            <p class="mini">公开页、周报、日报与代码包统一采用同一份最终提交版周记录数据。</p>
          </div>
        </article>
      </section>

      ${renderFloatingChatWidget()}
    </section>
  `;
}

function renderReplay(data) {
  return `
    <section class="stack">
      ${renderMarketStrategy(data)}
      ${replayCards(data)}
      ${renderFloatingChatWidget()}
    </section>
  `;
}

function localAnswer(question, data) {
  const q = String(question || "");
  const best = bestDay(data);
  const lastDay = data.weekly_daily_results[data.weekly_daily_results.length - 1];
  const worst = worstDay(data);

  if (/盈利最多|赚得最多|最好/.test(q)) {
    return `${best.date} 盈利最多，当日盈亏 ${signedText(best.daily_pnl)}，当日收益率 ${fmtPct(best.daily_return_pct)}。`;
  }
  if (/亏损最多|最差|回撤/.test(q)) {
    return `${worst.date} 波动最弱，当日盈亏 ${signedText(worst.daily_pnl)}，重点记录为：${worst.focus}`;
  }
  if (/最新持仓|持仓/.test(q)) {
    return `最新持仓快照日期为 ${data.latest_holdings_date}。持仓市值前五分别是 ${data.latest_holdings.slice(0, 5).map((item) => `${item.code} ${item.name} ${fmtMoney(item.market_value)}`).join("；")}。`;
  }
  if (/策略|仓位|大盘/.test(q)) {
    return `当前公开页展示的最新策略为“${data.strategy.view_label}”，目标仓位 ${fmtRatio(data.strategy.target_position)}，现金缓冲 ${fmtRatio(data.strategy.cash_buffer)}，主题包括 ${data.strategy.themes.join("、")}。`;
  }
  if (/智能体|分析栈|模型/.test(q)) {
    return `当前展示页的分析栈包括 ${data.models.analysis_stack.join("、")}，智能体活跃记录中最新的是 ${data.agent_activity[0].agent}，最近时间 ${data.agent_activity[0].last_time}。`;
  }
  if (/周|结果|收益/.test(q)) {
    return `展示窗口为 ${data.weekly_window.start} 至 ${data.weekly_window.end}。周末总资产 ${fmtMoney(data.account.final_total_assets)}，周内合计盈亏 ${signedText(data.weekly_summary.weekly_cumulative_pnl)}，相对初始收益率 ${fmtPct(data.account.return_vs_initial_pct)}。`;
  }
  return `最新日终结果来自 ${lastDay.date}，期末总资产 ${fmtMoney(lastDay.close_total)}，当日盈亏 ${signedText(lastDay.daily_pnl)}。如需更细问题，可继续询问具体日期、持仓、交易或策略。`;
}

async function askBackend(question, data) {
  for (const endpoint of CHAT_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          question,
          context: data
        })
      });
      const payload = await response.json();
      if (payload && payload.ok && payload.answer) {
        return {
          ok: true,
          answer: payload.answer,
          label: payload.model ? `后台大模型 · ${payload.model}` : "后台大模型"
        };
      }
    } catch (_) {
      // Try the next endpoint.
    }
  }
  return {
    ok: false,
    answer: localAnswer(question, data),
    label: "页面证据回答"
  };
}

async function bindChat(data) {
  const aiFab = document.getElementById("aiFab");
  const aiPanel = document.getElementById("aiPanel");
  const aiClose = document.getElementById("aiClose");
  const aiBody = document.getElementById("aiBody");
  const aiForm = document.getElementById("aiForm");
  const aiInput = document.getElementById("aiInput");
  const aiChips = document.getElementById("aiChips");
  const aiStatus = document.getElementById("aiStatus");
  if (!aiFab || !aiPanel || !aiClose || !aiBody || !aiForm || !aiInput || !aiChips || !aiStatus) return;

  const addMsg = (role, text) => {
    const div = document.createElement("div");
    div.className = `ai-msg ${role}`;
    div.textContent = text;
    aiBody.appendChild(div);
    aiBody.scrollTop = aiBody.scrollHeight;
    return div;
  };

  aiFab.addEventListener("click", () => {
    aiPanel.classList.add("open");
    window.setTimeout(() => aiInput.focus(), 80);
  });

  aiClose.addEventListener("click", () => {
    aiPanel.classList.remove("open");
  });

  aiChips.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    aiInput.value = button.textContent.trim();
    aiForm.requestSubmit();
  });

  aiForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = aiInput.value.trim();
    if (!question) return;

    aiInput.value = "";
    addMsg("user", question);
    const pending = addMsg("assistant", "正在读取运行证据...");
    aiStatus.textContent = "正在请求网页后台大模型接口...";

    const result = await askBackend(question, data);
    pending.textContent = result.answer;
    aiStatus.textContent = `当前回答来源：${result.label}`;
  });
}

async function main() {
  const root = document.getElementById("page-root");
  if (!root) return;

  try {
    const data = await loadReport();
    const page = document.body.dataset.page || "overview";
    if (page === "dashboard") {
      root.innerHTML = renderDashboard(data);
    } else if (page === "performance") {
      root.innerHTML = renderPerformance(data);
    } else if (page === "replay") {
      root.innerHTML = renderReplay(data);
    } else {
      root.innerHTML = renderOverview(data);
    }
    await bindChat(data);
  } catch (error) {
    root.innerHTML = `
      <section class="panel">
        <div class="section-kicker">Load Error</div>
        <h2 class="section-title">页面数据暂时不可用</h2>
        <p class="lead">请确认 <code>contest_report_latest.json</code> 可被当前静态站点正常访问。</p>
        <p class="footer-note">${String(error && error.message ? error.message : error)}</p>
      </section>
    `;
  }
}

main();
