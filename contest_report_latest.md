# Contest Report Snapshot

- Generated at: `2026-07-21 14:21:41`
- Project root: `D:\rellm`
- Database: `D:\rellm\data\battle.db`
- Initial capital: `10000000.0`
- Trading sessions: `[('09:30', '11:30'), ('13:00', '15:00')]`
- Tick interval min: `5`

## Runtime Status

- Cash: `7091746.179999996`
- Account updated: `2026-07-21 14:18:37`
- Latest total equity: `9674893.179999996`
- Latest return vs initial: `-3.2511`%
- Position count: `30`
- Recent order count: `30`

## Model Configuration

- `cio_brain`: `kimi-k2.7`
- `financial_expert`: `kimi-k2.7`
- `daily_reflection`: `kimi-k2.7`
- `news_worker`: `deepseek-v4-pro`
- `news_analyst`: `deepseek-v4-pro`
- `sentiment_analyst`: `deepseek-v4-pro`
- `fundamentals_analyst`: `deepseek-v4-pro`
- `technical_analyst`: `deepseek-v4-pro`

## Latest Strategy

```json
{
  "id": 41,
  "ts": 1784602943,
  "view": "neutral",
  "themes": [
    "高股息红利",
    "央企增持",
    "金融蓝筹",
    "AI半导体反弹",
    "防御消费"
  ],
  "target_position": 0.25,
  "confidence": 0.6,
  "notes": "政策底明确（证监会稳市+央企超600亿增持），但全市场上涨比31.8%、跌停79家，风险偏好仍偏弱。成长赛道（半导体/光模块）短期超跌反弹，但技术面仍弱；高股息红利（银行/电力/保险/消费）防御属性突出，符合neutral regime下25%目标仓位。组合当前仓位约25%，以再平衡为主，汰弱留强，避免高位追涨。"
}
```

## Recent Positions

```json
[
  {
    "code": "000725",
    "qty": 13700,
    "avg_price": 6.11,
    "available": 0,
    "updated_at": 1784603898,
    "updated_at_readable": "2026-07-21 11:18:18"
  },
  {
    "code": "000676",
    "qty": 11900,
    "avg_price": 6.59,
    "available": 11900,
    "updated_at": 1784252287,
    "updated_at_readable": "2026-07-17 09:38:07"
  },
  {
    "code": "600227",
    "qty": 26800,
    "avg_price": 2.92,
    "available": 26800,
    "updated_at": 1784266686,
    "updated_at_readable": "2026-07-17 13:38:06"
  },
  {
    "code": "001896",
    "qty": 5500,
    "avg_price": 14.22,
    "available": 5500,
    "updated_at": 1784253183,
    "updated_at_readable": "2026-07-17 09:53:03"
  },
  {
    "code": "600487",
    "qty": 1300,
    "avg_price": 59.58,
    "available": 0,
    "updated_at": 1784614717,
    "updated_at_readable": "2026-07-21 14:18:37"
  },
  {
    "code": "600396",
    "qty": 5700,
    "avg_price": 13.56,
    "available": 0,
    "updated_at": 1784600592,
    "updated_at_readable": "2026-07-21 10:23:12"
  },
  {
    "code": "000938",
    "qty": 1900,
    "avg_price": 40.64,
    "available": 0,
    "updated_at": 1784603898,
    "updated_at_readable": "2026-07-21 11:18:18"
  },
  {
    "code": "300408",
    "qty": 800,
    "avg_price": 96.12,
    "available": 0,
    "updated_at": 1784597895,
    "updated_at_readable": "2026-07-21 09:38:15"
  },
  {
    "code": "600744",
    "qty": 11000,
    "avg_price": 6.99,
    "available": 0,
    "updated_at": 1784599392,
    "updated_at_readable": "2026-07-21 10:03:12"
  },
  {
    "code": "600415",
    "qty": 6600,
    "avg_price": 11.64,
    "available": 0,
    "updated_at": 1784599092,
    "updated_at_readable": "2026-07-21 09:58:12"
  }
]
```

## Recent Orders

```json
[
  {
    "id": 447,
    "ts": 1784614717,
    "code": "600487",
    "side": "BUY",
    "qty": 1300,
    "price": 59.58,
    "status": "FILLED",
    "fee": 19.36,
    "reason": "主动追入 涨5.3% 成交额176.8亿",
    "ts_readable": "2026-07-21 14:18:37"
  },
  {
    "id": 446,
    "ts": 1784614409,
    "code": "001309",
    "side": "BUY",
    "qty": 100,
    "price": 509.06,
    "status": "FILLED",
    "fee": 12.73,
    "reason": "主动追入 涨5.4% 成交额186.0亿",
    "ts_readable": "2026-07-21 14:13:29"
  },
  {
    "id": 445,
    "ts": 1784613499,
    "code": "002384",
    "side": "BUY",
    "qty": 300,
    "price": 230.22,
    "status": "FILLED",
    "fee": 17.27,
    "reason": "主动追入 涨5.7% 成交额304.6亿",
    "ts_readable": "2026-07-21 13:58:19"
  },
  {
    "id": 444,
    "ts": 1784613206,
    "code": "688981",
    "side": "BUY",
    "qty": 400,
    "price": 156.03,
    "status": "FILLED",
    "fee": 15.6,
    "reason": "主动追入 涨8.3% 成交额140.2亿",
    "ts_readable": "2026-07-21 13:53:26"
  },
  {
    "id": 443,
    "ts": 1784610720,
    "code": "600519",
    "side": "SELL",
    "qty": 100,
    "price": 1299.84,
    "status": "FILLED",
    "fee": 97.49,
    "reason": "跟踪止损 自高位 -3.24%",
    "ts_readable": "2026-07-21 13:12:00"
  },
  {
    "id": 442,
    "ts": 1784603898,
    "code": "000938",
    "side": "BUY",
    "qty": 1900,
    "price": 40.64,
    "status": "FILLED",
    "fee": 19.3,
    "reason": "主动追入 涨7.8% 成交额144.2亿",
    "ts_readable": "2026-07-21 11:18:18"
  },
  {
    "id": 441,
    "ts": 1784603898,
    "code": "000725",
    "side": "BUY",
    "qty": 1000,
    "price": 6.11,
    "status": "FILLED",
    "fee": 5.0,
    "reason": "突破加仓 30min涨4.1%",
    "ts_readable": "2026-07-21 11:18:18"
  },
  {
    "id": 440,
    "ts": 1784603590,
    "code": "000725",
    "side": "BUY",
    "qty": 12700,
    "price": 6.11,
    "status": "FILLED",
    "fee": 19.4,
    "reason": "主动追入 涨5.5% 成交额115.2亿",
    "ts_readable": "2026-07-21 11:13:10"
  },
  {
    "id": 439,
    "ts": 1784603293,
    "code": "300502",
    "side": "BUY",
    "qty": 100,
    "price": 540.24,
    "status": "FILLED",
    "fee": 13.51,
    "reason": "主动追入 涨5.9% 成交额236.0亿",
    "ts_readable": "2026-07-21 11:08:13"
  },
  {
    "id": 438,
    "ts": 1784603220,
    "code": "601016",
    "side": "SELL",
    "qty": 22400,
    "price": 3.57,
    "status": "FILLED",
    "fee": 59.98,
    "reason": "跟踪止损 自高位 -3.25%",
    "ts_readable": "2026-07-21 11:07:00"
  }
]
```

## Agent Trace Preview

```json
[
  {
    "id": 4215,
    "ts": 1784613698,
    "tick_id": "03bf1509",
    "stage": "done",
    "payload": "elapsed=98.51s rounds=2 fb=False",
    "ts_readable": "2026-07-21 14:01:38"
  },
  {
    "id": 4214,
    "ts": 1784613698,
    "tick_id": "03bf1509",
    "stage": "error",
    "payload": "URLError: <urlopen error _ssl.c:983: The handshake operation timed out>",
    "ts_readable": "2026-07-21 14:01:38"
  },
  {
    "id": 4213,
    "ts": 1784613645,
    "tick_id": "03bf1509",
    "stage": "tool_result:recent_news",
    "payload": "{'count': 10, 'items': [{'id': 'c4807cdfed855340', 'ts': 1784610946, 'source': '东财·第一财经·[688981]', 'title': '科技股早盘上演V型反转 跌停潮后半导体领涨反弹', 'content': '[2026-07-21 11:13:29] 华虹公司（688347.SH）涨超14%，中芯国际（688981.SH）涨超5%，两大科创50权重股发力带动指数反弹。寒武纪（688256.SH）等AI芯片公司也同步出现反弹趋势。', 'url': 'http://finance.eastmoney.com/a",
    "ts_readable": "2026-07-21 14:00:45"
  },
  {
    "id": 4212,
    "ts": 1784613645,
    "tick_id": "03bf1509",
    "stage": "tool_call:recent_news",
    "payload": "{\"limit\": 10, \"since_min\": 1440}",
    "ts_readable": "2026-07-21 14:00:45"
  },
  {
    "id": 4211,
    "ts": 1784613645,
    "tick_id": "03bf1509",
    "stage": "tool_result:get_market_regime",
    "payload": "{'ts': 1784613645, 'regime': 'neutral', 'score': 0.15, 'suggested_position': {'min': 0.18, 'target': 0.25, 'max': 0.32}, 'indices': {}, 'breadth': {'up_ratio': 0.471, 'limit_up': 184, 'limit_down': 31, 'limit_spread': 0.0294, 'total': 5200}, 'news_bias': {'positive_hits': 11, 'negative_hits': 7, 'ex",
    "ts_readable": "2026-07-21 14:00:45"
  },
  {
    "id": 4210,
    "ts": 1784613637,
    "tick_id": "03bf1509",
    "stage": "tool_call:get_market_regime",
    "payload": "{}",
    "ts_readable": "2026-07-21 14:00:37"
  },
  {
    "id": 4209,
    "ts": 1784613637,
    "tick_id": "03bf1509",
    "stage": "tool_result:get_market_overview",
    "payload": "{'indices': {'上证指数': {'code': 'sh000001', 'price': 3812.16, 'pct': 0.42}, '深证成指': {'code': 'sz399001', 'price': 13656.08, 'pct': 0.34}, '沪深300': {'code': 'sh000300', 'price': 4630.85, 'pct': 0.71}, '创业板指': {'code': 'sz399006', 'price': 3469.22, 'pct': 0.76}, '科创50': {'code': 'sh000688', 'price': 174",
    "ts_readable": "2026-07-21 14:00:37"
  },
  {
    "id": 4208,
    "ts": 1784613636,
    "tick_id": "03bf1509",
    "stage": "tool_call:get_market_overview",
    "payload": "{}",
    "ts_readable": "2026-07-21 14:00:36"
  }
]
```

## Agent Log Preview

```json
[
  {
    "id": 8049,
    "ts": 1784614849,
    "tick_id": "sched",
    "agent": "quote_worker",
    "role": "summary",
    "content": "{'quotes': 43, 'synthetic': False}",
    "ts_readable": "2026-07-21 14:20:49"
  },
  {
    "id": 8048,
    "ts": 1784614717,
    "tick_id": "sched",
    "agent": "opportunity",
    "role": "summary",
    "content": "{'actions': [{'code': '600487', 'rule': 'active_entry', 'qty': 1300, 'ok': True, 'name': '亨通光电'}], 'checked': 35, 'cur_position': 0.281, 'ts': 1784614717, 'thresholds': {'breakout_pct': 0.03, 'dip_pct': 0.02, 'entry_test_pct': 0.008, 'max_position': 0.32, 'effective_max_position': 0.32, 'regime': 'risk_on', 'momentum_buy_enabled': True, 'enable_dip_buy': False}}",
    "ts_readable": "2026-07-21 14:18:37"
  },
  {
    "id": 8047,
    "ts": 1784614620,
    "tick_id": "sched",
    "agent": "guardian",
    "role": "summary",
    "content": "{'triggered': [], 'checked': 35, 'ts': 1784614620, 'thresholds': {'hard_stop': 0.045, 'trail_trigger': 0.06, 'trail_drawdown': 0.03, 'portfolio_dd': 0.025}}",
    "ts_readable": "2026-07-21 14:17:00"
  },
  {
    "id": 8046,
    "ts": 1784614603,
    "tick_id": "sched",
    "agent": "news_worker",
    "role": "summary",
    "content": "{'fetched': 150, 'ranked': 44, 'saved_to_memory': 27}",
    "ts_readable": "2026-07-21 14:16:43"
  },
  {
    "id": 8045,
    "ts": 1784614603,
    "tick_id": "7730a7ff",
    "agent": "news_worker",
    "role": "summary",
    "content": "fetched=150 saved_imp3+=27 ranked=44",
    "ts_readable": "2026-07-21 14:16:43"
  },
  {
    "id": 8044,
    "ts": 1784614603,
    "tick_id": "7730a7ff",
    "agent": "news_worker",
    "role": "raw",
    "content": "{\n  \"items\": [\n    {\n      \"id\": \"0759cd86176d2701\",\n      \"importance\": 3,\n      \"reason\": \"美联储加息预期降温的权威声音，影响全球资产定价，但非官方决策\",\n      \"affects\": [\"宏观\"]\n    },\n    {\n      \"id\": \"7ed483421fc8ad31\",\n      \"importance\": 1,\n      \"reason\": \"日本企业家人特写，无直接市场影响\",\n      \"affects\": []\n    },\n    {\n      \"id\": \"3f7d9ed40fc1f51a\",\n      \"importance\": 4,\n      \"reason\": \"A股市场风格剧烈切换，风险偏好与资金流向出现重大分化，直接关系策略配置\",\n   ",
    "ts_readable": "2026-07-21 14:16:43"
  },
  {
    "id": 8043,
    "ts": 1784614565,
    "tick_id": "7730a7ff",
    "agent": "news_worker",
    "role": "prompt",
    "content": "新闻列表（id|源|标题）：\n0759cd86176d2701 | 财新-华尔街原声 | 安联集团首席经济顾问穆罕默德·埃尔-埃里安（Mohamed El-Erian）认为，最严重的通胀时期已经过去，预计美联储不会再进行三次加息\n7ed483421fc8ad31 | 财新-商圈 | 在守成思想浓厚的日本传统家族企业圈层，远藤是罕见的激进改革派\n3f7d9ed40fc1f51a | 财新-权益周观察 | 成长赛道估值集体深度调整，石油、煤炭等防御板块逆势走强，市场风险偏好快速从乐观转向谨慎避险。资金面呈现杠杆资金恐慌出逃、中长线资金逆势布局的反差\n048b4f74da71734b | 财新-市场动态 | 随着中国经济放缓和前所未有的供过于求，导致租金和房价暴跌，外资大多已转而站在卖方\n86e99d9291b3f3ad | 财新-市场动态 | 气候临界点是地球相互关联的自然系统，包括大气、陆地",
    "ts_readable": "2026-07-21 14:16:05"
  },
  {
    "id": 8042,
    "ts": 1784614500,
    "tick_id": "sched",
    "agent": "quote_worker",
    "role": "summary",
    "content": "{'quotes': 43, 'synthetic': False}",
    "ts_readable": "2026-07-21 14:15:00"
  }
]
```

## Recent News Preview

```json
[
  {
    "id": "c4807cdfed855340",
    "ts": 1784610946,
    "source": "东财·第一财经·[688981]",
    "title": "科技股早盘上演V型反转 跌停潮后半导体领涨反弹",
    "content": "[2026-07-21 11:13:29] 华虹公司（688347.SH）涨超14%，中芯国际（688981.SH）涨超5%，两大科创50权重股发力带动指数反弹。寒武纪（688256.SH）等AI芯片公司也同步出现反弹趋势。",
    "url": "http://finance.eastmoney.com/a/202607213814953198.html",
    "ts_readable": "2026-07-21 13:15:46"
  },
  {
    "id": "1317317f67d9c2f3",
    "ts": 1784610100,
    "source": "synthetic",
    "title": "央行：保持流动性合理充裕",
    "content": "",
    "url": "",
    "ts_readable": "2026-07-21 13:01:40"
  },
  {
    "id": "42eba99160c43008",
    "ts": 1784610100,
    "source": "synthetic",
    "title": "美联储官员鸽派表态，A 股北向资金流入扩大",
    "content": "",
    "url": "",
    "ts_readable": "2026-07-21 13:01:40"
  },
  {
    "id": "af39ae53e592d02e",
    "ts": 1784610100,
    "source": "synthetic",
    "title": "AI 算力板块强势反弹",
    "content": "",
    "url": "",
    "ts_readable": "2026-07-21 13:01:40"
  },
  {
    "id": "0759cd86176d2701",
    "ts": 1784601922,
    "source": "财新-华尔街原声",
    "title": "安联集团首席经济顾问穆罕默德·埃尔-埃里安（Mohamed El-Erian）认为，最严重的通胀时期已经过去，预计美联储不会再进行三次加息",
    "content": "安联集团首席经济顾问穆罕默德·埃尔-埃里安（Mohamed El-Erian）认为，最严重的通胀时期已经过去，预计美联储不会再进行三次加息",
    "url": "https://database.caixin.com/2026-07-21/102466470.html?cxapp_link=true",
    "ts_readable": "2026-07-21 10:45:22"
  },
  {
    "id": "7ed483421fc8ad31",
    "ts": 1784600133,
    "source": "财新-商圈",
    "title": "在守成思想浓厚的日本传统家族企业圈层，远藤是罕见的激进改革派",
    "content": "在守成思想浓厚的日本传统家族企业圈层，远藤是罕见的激进改革派",
    "url": "https://database.caixin.com/2026-07-21/102466448.html?cxapp_link=true",
    "ts_readable": "2026-07-21 10:15:33"
  },
  {
    "id": "91695a4cb8441281",
    "ts": 1784599223,
    "source": "东财·证券时报网·[688981]",
    "title": "355只科创板股现身基金重仓股名单",
    "content": "[2026-07-21 09:38:00] 211 995.06 -65.37 8.10 电子 688521 芯原股份 185 4231.87 -58.19 8.05 电子 688710 益诺思 20 690.92 -47.47 7.62 医药生物 688235 百济神州 39 822.23 -59.48 7.15 医药生物 688981",
    "url": "http://finance.eastmoney.com/a/202607213814401623.html",
    "ts_readable": "2026-07-21 10:00:23"
  },
  {
    "id": "3f7d9ed40fc1f51a",
    "ts": 1784598325,
    "source": "财新-权益周观察",
    "title": "成长赛道估值集体深度调整，石油、煤炭等防御板块逆势走强，市场风险偏好快速从乐观转向谨慎避险。资金面呈现杠杆资金恐慌出逃、中长线资金逆势布局的反差",
    "content": "成长赛道估值集体深度调整，石油、煤炭等防御板块逆势走强，市场风险偏好快速从乐观转向谨慎避险。资金面呈现杠杆资金恐慌出逃、中长线资金逆势布局的反差",
    "url": "https://database.caixin.com/2026-07-21/102466431.html?cxapp_link=true",
    "ts_readable": "2026-07-21 09:45:25"
  }
]
```

## Recent Anomalies

```json
[
  {
    "id": 8028,
    "ts": 1784613698,
    "tick_id": "03bf1509",
    "agent": "cio_brain",
    "role": "error",
    "content": "URLError: <urlopen error _ssl.c:983: The handshake operation timed out>",
    "ts_readable": "2026-07-21 14:01:38"
  },
  {
    "id": 8018,
    "ts": 1784613623,
    "tick_id": "03bf1509",
    "agent": "cio_brain",
    "role": "prompt",
    "content": "开始本轮决策。请走精简链路，先读持仓前 10 条、新闻前 10 条，尽快形成一版可执行方案。必须：(a) 先 get_portfolio / get_market_overview / get_market_regime / recent_news(limit=10)；(b) 用 search_stocks 围绕主线至少搜 3 次；(c) update_strategy_state 里的 target_position 要参考 get_market_regime；(d) draft_orders 保持 15-20 只票，再 consult_financial_expert；(e) update",
    "ts_readable": "2026-07-21 14:00:23"
  },
  {
    "id": 7967,
    "ts": 1784610108,
    "tick_id": "2ca07462",
    "agent": "cio_brain",
    "role": "error",
    "content": "URLError: <urlopen error [SSL: UNEXPECTED_EOF_WHILE_READING] EOF occurred in violation of protocol (_ssl.c:1000)>",
    "ts_readable": "2026-07-21 13:01:48"
  },
  {
    "id": 7963,
    "ts": 1784610102,
    "tick_id": "2ca07462",
    "agent": "cio_brain",
    "role": "prompt",
    "content": "开始本轮决策。请走精简链路，先读持仓前 10 条、新闻前 10 条，尽快形成一版可执行方案。必须：(a) 先 get_portfolio / get_market_overview / get_market_regime / recent_news(limit=10)；(b) 用 search_stocks 围绕主线至少搜 3 次；(c) update_strategy_state 里的 target_position 要参考 get_market_regime；(d) draft_orders 保持 15-20 只票，再 consult_financial_expert；(e) update",
    "ts_readable": "2026-07-21 13:01:42"
  },
  {
    "id": 7937,
    "ts": 1784603034,
    "tick_id": "96ff90a4",
    "agent": "cio_brain",
    "role": "tool_result",
    "content": "consult_financial_expert -> {\"verdict\": \"ERROR\", \"overall_comment\": \"禁止空调专家。你必须先自己形成 15-20 只票的 draft_orders，每项包含 code/side/target_weight/reason，至少 5 项，然后再调用 consult_financial_expert。下一步不要再调空专家，请先继续 search_stocks / market_top / run_analysts / get_history_indicators，随后 update_strategy_state，再提交非空 draf",
    "ts_readable": "2026-07-21 11:03:54"
  },
  {
    "id": 7935,
    "ts": 1784603034,
    "tick_id": "96ff90a4",
    "agent": "cio_brain",
    "role": "tool_result",
    "content": "place_orders(auto_from_expert_error) -> {\"results\": [{\"code\": \"000001\", \"side\": \"BUY\", \"ok\": false, \"msg\": \"qty<100, skipped\"}, {\"code\": \"002371\", \"side\": \"BUY\", \"ok\": false, \"msg\": \"qty<100, skipped\"}, {\"code\": \"300766\", \"side\": \"SELL\", \"ok\": true, \"qty\": 3400, \"price\": 22.55, \"fee\": 57.5}, {\"code\"",
    "ts_readable": "2026-07-21 11:03:54"
  },
  {
    "id": 7934,
    "ts": 1784603034,
    "tick_id": "96ff90a4",
    "agent": "cio_brain",
    "role": "tool_call",
    "content": "place_orders(auto_from_expert_error)({\"orders\": [{\"code\": \"600036\", \"side\": \"BUY\", \"target_weight\": 0.03, \"reason\": \"招商银行创52周新高，技术强势，高股息+金融蓝筹防御，low vol 3.08%\"}, {\"code\": \"601318\", \"side\": \"BUY\", \"target_weight\": 0.03, \"reason\": \"中国平安突破短期均线，短期动量强，保险龙头受益于高股息风格\"}, {\"code\": \"000001\", \"side\": \"BUY\", \"tar",
    "ts_readable": "2026-07-21 11:03:54"
  },
  {
    "id": 7933,
    "ts": 1784603033,
    "tick_id": "96ff90a4",
    "agent": "cio_brain",
    "role": "tool_result",
    "content": "consult_financial_expert -> {\"verdict\": \"ERROR\", \"overall_comment\": \"专家调用异常：deadline exceeded after 15s（专家快速失败已触发）。CIO 可基于自己判断继续，但请保守。\", \"per_order\": [], \"recommended_orders\": [], \"missing_considerations\": [\"专家调用异常\"], \"confidence\": 0.0, \"error_type\": \"other\", \"retry_count\": 1}",
    "ts_readable": "2026-07-21 11:03:53"
  }
]
```

## Order Failure Preview

```json
[
  {
    "id": 447,
    "ts": 1784614717,
    "code": "600487",
    "side": "BUY",
    "qty": 1300,
    "price": 59.58,
    "status": "FILLED",
    "fee": 19.36,
    "reason": "主动追入 涨5.3% 成交额176.8亿",
    "ts_readable": "2026-07-21 14:18:37"
  },
  {
    "id": 446,
    "ts": 1784614409,
    "code": "001309",
    "side": "BUY",
    "qty": 100,
    "price": 509.06,
    "status": "FILLED",
    "fee": 12.73,
    "reason": "主动追入 涨5.4% 成交额186.0亿",
    "ts_readable": "2026-07-21 14:13:29"
  },
  {
    "id": 445,
    "ts": 1784613499,
    "code": "002384",
    "side": "BUY",
    "qty": 300,
    "price": 230.22,
    "status": "FILLED",
    "fee": 17.27,
    "reason": "主动追入 涨5.7% 成交额304.6亿",
    "ts_readable": "2026-07-21 13:58:19"
  },
  {
    "id": 444,
    "ts": 1784613206,
    "code": "688981",
    "side": "BUY",
    "qty": 400,
    "price": 156.03,
    "status": "FILLED",
    "fee": 15.6,
    "reason": "主动追入 涨8.3% 成交额140.2亿",
    "ts_readable": "2026-07-21 13:53:26"
  },
  {
    "id": 443,
    "ts": 1784610720,
    "code": "600519",
    "side": "SELL",
    "qty": 100,
    "price": 1299.84,
    "status": "FILLED",
    "fee": 97.49,
    "reason": "跟踪止损 自高位 -3.24%",
    "ts_readable": "2026-07-21 13:12:00"
  },
  {
    "id": 442,
    "ts": 1784603898,
    "code": "000938",
    "side": "BUY",
    "qty": 1900,
    "price": 40.64,
    "status": "FILLED",
    "fee": 19.3,
    "reason": "主动追入 涨7.8% 成交额144.2亿",
    "ts_readable": "2026-07-21 11:18:18"
  },
  {
    "id": 441,
    "ts": 1784603898,
    "code": "000725",
    "side": "BUY",
    "qty": 1000,
    "price": 6.11,
    "status": "FILLED",
    "fee": 5.0,
    "reason": "突破加仓 30min涨4.1%",
    "ts_readable": "2026-07-21 11:18:18"
  },
  {
    "id": 440,
    "ts": 1784603590,
    "code": "000725",
    "side": "BUY",
    "qty": 12700,
    "price": 6.11,
    "status": "FILLED",
    "fee": 19.4,
    "reason": "主动追入 涨5.5% 成交额115.2亿",
    "ts_readable": "2026-07-21 11:13:10"
  }
]
```