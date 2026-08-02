async function loadReport() {
  const response = await fetch("contest_report_latest.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`failed_to_load_report:${response.status}`);
  }
  return response.json();
}

function fmtMoney(value) {
  return Number(value).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtPct(value) {
  return `${Number(value).toFixed(4)}%`;
}

function signedClass(value) {
  return Number(value) >= 0 ? "up" : "down";
}

function signedText(value, digits = 2) {
  const num = Number(value);
  const prefix = num >= 0 ? "+" : "";
  return `${prefix}${num.toFixed(digits)}`;
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

function strategyKeywordChips(themes) {
  const mapping = {
    "AI算力链": ["光模块", "CPO", "AI服务器"],
    "半导体国产替代": ["存储芯片", "半导体设备"],
    "机器人智能制造": ["机器人", "智能制造"],
    "资源高股息": ["煤炭红利", "电力红利"],
    "新能源龙头": ["新能源车", "锂电龙头"]
  };
  const values = [];
  themes.forEach((theme) => {
    (mapping[theme] || [theme]).forEach((item) => {
      if (!values.includes(item)) values.push(item);
    });
  });
  return values.slice(0, 10);
}

function candidatePool(data) {
  const codes = [];
  data.weekly_daily_results.forEach((day) => {
    day.trade_highlights.forEach((trade) => {
      const code = String(trade.stock).split(" ")[0];
      if (/^\d{6}$/.test(code) && !codes.includes(code)) codes.push(code);
    });
  });
  data.latest_holdings.forEach((item) => {
    if (!codes.includes(item.code)) codes.push(item.code);
  });
  return codes.slice(0, 10);
}

function renderMarketStrategyCompact(data) {
  const cycleLabel = `cyc_${String(data.generated_at || "").slice(0, 10).replaceAll("-", "")}`;
  const biasLabel = data.strategy.view === "bullish" ? "市场偏强，适合做多" : data.strategy.view === "bearish" ? "市场偏弱，先控制仓位" : "市场震荡，先稳一点";
  const biasClass = data.strategy.view === "bullish" ? "bullish" : data.strategy.view === "bearish" ? "bearish" : "neutral";
  const plainViewLabel = data.strategy.view === "bullish" ? "当前判断：市场偏强，可以积极一些" : data.strategy.view === "bearish" ? "当前判断：市场偏弱，应以防守为主" : "当前判断：市场没有明显方向，先稳健运行";
  const indicators = [
    ["策略置信度", fmtPct(data.strategy.confidence * 100)],
    ["目标总仓位", fmtPct(data.strategy.target_position * 100)],
    ["现金缓冲", fmtPct(data.strategy.cash_buffer * 100)],
    ["单票上限", fmtPct(data.strategy.per_stock_cap * 100)],
    ["单次增量", fmtPct(data.strategy.increment_cap * 100)]
  ];
  const keywords = strategyKeywordChips(data.strategy.themes);
  const pool = candidatePool(data);
  return `
    <section class="panel market-compact screenshot-card">
      <div class="strategy-card-header">
        <div class="strategy-card-title">🌐 大盘策略（阶段 0 · 全 A 股扫描 → 主线 → 筛选候选）</div>
        <div class="strategy-card-cycle">
          <span>周期</span>
          <strong>${cycleLabel}</strong>
        </div>
      </div>

      <div class="strategy-card-block">
        <div class="strategy-card-label">市场状态 / 目标总仓位</div>
        <div class="strategy-bias ${biasClass}">
          <span>${plainViewLabel}</span>
          <em>·</em>
          <strong>总仓位 ${Math.round(data.strategy.target_position * 100)}%</strong>
        </div>
        <p class="strategy-card-note">${biasLabel}。${data.strategy.notes}</p>
      </div>

      <div class="strategy-card-block">
        <div class="strategy-card-label">策略指标</div>
        <div class="strategy-metric-list">
          ${indicators.map(([label, value]) => `
            <div class="strategy-metric-item">
              <span>${label}</span>
              <strong>${value}</strong>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="strategy-card-block">
        <div class="strategy-card-label">当前投资主线 / 检索关键词</div>
        <div class="strategy-chip-group">
          ${data.strategy.themes.map((item) => `<span class="strategy-chip theme-chip">${item}</span>`).join("")}
        </div>
        <div class="strategy-chip-group strategy-chip-group-secondary">
          ${keywords.map((item) => `<span class="strategy-chip keyword-chip">🔍 ${item}</span>`).join("")}
        </div>
      </div>

      <div class="strategy-card-block">
        <div class="strategy-card-label">候选池（周内命中记录）</div>
        <div class="strategy-chip-group strategy-chip-group-muted">
          ${pool.map((item) => `<span class="strategy-chip pool-chip">${item}</span>`).join("")}
        </div>
      </div>

      <div class="strategy-card-summary">
        <p>${plainViewLabel}，目标仓位 ${Math.round(data.strategy.target_position * 100)}%，当前主线是 ${data.strategy.themes.join("、")}，关键词包括 ${keywords.join("、")}，周内候选股票共 ${pool.length} 只。</p>
      </div>
    </section>
  `;
}

function renderOverviewSummary(data) {
  const bestDay = [...data.weekly_daily_results].sort((a, b) => b.daily_pnl - a.daily_pnl)[0];
  const lastDay = data.weekly_daily_results[data.weekly_daily_results.length - 1];
  return `
    <article class="panel">
      <div class="section-kicker">Weekly Summary</div>
      <h2 class="section-title">周度结论</h2>
      <div class="card-list">
        <div class="info-card">
          <h3>本周表现</h3>
          <p class="mini">周内合计盈亏 ${signedText(data.weekly_summary.weekly_cumulative_pnl)}，周末总资产 ${fmtMoney(data.account.final_total_assets)}，相对初始收益率 ${fmtPct(data.account.return_vs_initial_pct)}。</p>
        </div>
        <div class="info-card">
          <h3>最佳交易日</h3>
          <p class="mini">${bestDay.date} 贡献最高，当日盈亏 ${signedText(bestDay.daily_pnl)}，核心说明为“${bestDay.focus}”。</p>
        </div>
        <div class="info-card">
          <h3>最新账户状态</h3>
          <p class="mini">${lastDay.date} 收盘现金 ${fmtMoney(lastDay.cash_balance)}，持仓市值 ${fmtMoney(lastDay.market_value)}，维持受控仓位运行。</p>
        </div>
      </div>
    </article>
  `;
}

function renderOverviewSupport(data) {
  return `
    <article class="panel">
      <div class="section-kicker">Submission Scope</div>
      <h2 class="section-title">提交内容与分析栈</h2>
      <div class="card-list">
        <div class="info-card">
          <h3>记录覆盖</h3>
          <p class="mini">${data.record_coverage.join("、")}。</p>
        </div>
        <div class="info-card">
          <h3>网页问答</h3>
          <p class="mini">页面已接入网页后台大模型接口，可基于当前展示数据回答周度结果、持仓、交易和策略摘要问题。</p>
        </div>
        <div class="info-card">
          <h3>分析栈</h3>
          <p class="mini">${data.models.analysis_stack.join("、")}。</p>
        </div>
      </div>
      <div class="summary-box" style="margin-top:18px;">
        <strong>页面分工</strong>
        <p class="mini">总览页只保留结论、策略、框架和提交映射；运行细节放在看板、收益表现和交易复盘页单独展开。</p>
      </div>
    </article>
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

      <section class="grid-2">
        ${renderMarketStrategyCompact(data)}
        ${renderOverviewSummary(data)}
      </section>

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

        ${renderOverviewSupport(data)}
      </section>

      ${renderChatPanel(data)}
    </section>
  `;
}

function renderDashboard(data) {
  return `
    <section class="stack">
      <div class="grid-4">
        ${metricCard("周末总资产", fmtMoney(data.account.final_total_assets), "2026-07-31 收盘口径")}
        ${metricCard("现金余额", fmtMoney(data.weekly_daily_results[data.weekly_daily_results.length - 1].cash_balance), "最新日终现金")}
        ${metricCard("持仓市值", fmtMoney(data.weekly_daily_results[data.weekly_daily_results.length - 1].market_value), "最新日终持仓市值")}
        ${metricCard("策略置信度", fmtPct(data.strategy.confidence * 100), "最新策略视图置信度")}
      </div>

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

      ${renderChatPanel(data)}
    </section>
  `;
}

function renderPerformance(data) {
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
          <p class="chart-note">周内最大正贡献来自 2026-07-30，当日盈亏 ${signedText(8216.58)}。</p>
        </article>
      </section>

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

      ${renderChatPanel(data)}
    </section>
  `;
}

function renderReplay(data) {
  return `
    <section class="stack">
      ${replayCards(data)}
      ${renderChatPanel(data)}
    </section>
  `;
}

function renderChatPanel(data) {
  return `
    <section class="panel">
      <div class="section-kicker">LLM Q&A</div>
      <h2 class="section-title">网页智能问答</h2>
      <p class="lead">可直接询问周度盈亏、最新持仓、当日交易或策略摘要，页面会调用网页后台大模型接口进行回答。</p>
      <div class="chat-card">
        <form class="chat-form" id="chat-form">
          <textarea id="chat-question" placeholder="例如：上周哪一天盈利最多？最新持仓里银行股占比如何？"></textarea>
          <div class="chat-actions">
            <button class="button" type="submit">提交问题</button>
            <span class="chat-status" id="chat-status">接口状态：待提问</span>
          </div>
        </form>
        <div class="chat-answer" id="chat-answer">这里会显示网页问答结果。</div>
      </div>
      <p class="footer-note">问答基于当前公开页展示数据与网页后台模型接口，不写入交易结果，也不修改策略参数。</p>
    </section>
  `;
}

function localAnswer(question, data) {
  const q = String(question || "");
  const bestDay = [...data.weekly_daily_results].sort((a, b) => b.daily_pnl - a.daily_pnl)[0];
  const lastDay = data.weekly_daily_results[data.weekly_daily_results.length - 1];

  if (/盈利最多|赚得最多|最好/.test(q)) {
    return `${bestDay.date} 盈利最多，当日盈亏 ${signedText(bestDay.daily_pnl)}，当日收益率 ${fmtPct(bestDay.daily_return_pct)}。`;
  }
  if (/最新持仓|持仓/.test(q)) {
    return `最新持仓快照日期为 ${data.latest_holdings_date}。持仓市值前五分别是 ${data.latest_holdings.slice(0, 5).map((item) => `${item.code} ${item.name} ${fmtMoney(item.market_value)}`).join("；")}。`;
  }
  if (/策略|仓位/.test(q)) {
    return `当前公开页展示的最新策略为“${data.strategy.view_label}”，目标仓位 ${fmtPct(data.strategy.target_position * 100)}，现金缓冲 ${fmtPct(data.strategy.cash_buffer * 100)}，主题包括 ${data.strategy.themes.join("、")}。`;
  }
  if (/周|结果|收益/.test(q)) {
    return `展示窗口为 ${data.weekly_window.start} 至 ${data.weekly_window.end}。周末总资产 ${fmtMoney(data.account.final_total_assets)}，周内合计盈亏 ${signedText(data.weekly_summary.weekly_cumulative_pnl)}，相对初始收益率 ${fmtPct(data.account.return_vs_initial_pct)}。`;
  }
  return `最新日终结果来自 ${lastDay.date}，期末总资产 ${fmtMoney(lastDay.close_total)}，当日盈亏 ${signedText(lastDay.daily_pnl)}。如需更细问题，可继续询问具体日期、持仓或交易。`;
}

async function bindChat(data) {
  const form = document.getElementById("chat-form");
  const questionEl = document.getElementById("chat-question");
  const statusEl = document.getElementById("chat-status");
  const answerEl = document.getElementById("chat-answer");
  if (!form || !questionEl || !statusEl || !answerEl) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = questionEl.value.trim();
    if (!question) {
      statusEl.textContent = "接口状态：请输入问题";
      answerEl.textContent = "请输入一个与周度结果、持仓或交易相关的问题。";
      return;
    }

    statusEl.textContent = "接口状态：正在调用网页后台模型接口";
    answerEl.textContent = "正在生成回答...";

    try {
      const response = await fetch("/api/chat", {
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
        statusEl.textContent = `接口状态：已返回${payload.model ? ` · ${payload.model}` : ""}`;
        answerEl.textContent = payload.answer;
        return;
      }
      statusEl.textContent = "接口状态：页面记录回答";
      answerEl.textContent = localAnswer(question, data);
    } catch (_) {
      statusEl.textContent = "接口状态：页面记录回答";
      answerEl.textContent = localAnswer(question, data);
    }
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
