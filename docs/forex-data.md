# صيغة بيانات صفحة الفوركس (TradingBrain Forex — Seconds Scalper)

الصفحة في الداشبورد **قراءة فقط**، وتعرض الأرقام الحقيقية بس (ما فيها عينة توضيحية). تقرأ ملف JSON واحد، وما ترسل أي أمر ولا تعدّل أي إعداد.
هذا الملف يوضح الصيغة اللي يكتبها مصدر البيانات (اللي يجهزه Codex من MT5 Demo).

## مصادر القراءة (تنختار من «مصدر البيانات» أسفل الصفحة)

| المصدر | كيف | ملاحظة |
|---|---|---|
| GitHub خاص | `latest.json` + أرشيف يومي | يستخدم رمز الوصول المحفوظ في الإعدادات، ولازم يكون له صلاحية قراءة على المستودع |
| رابط JSON | GET لرابط https (مثلاً Forex Worker) | يرسل رمز الإعدادات في `Authorization: Bearer` إذا موجود |

الافتراضي لـGitHub:
- المستودع: `3pp3ll/tradingbrain-forex-data` (خاص)
- آخر لقطة: `data/forex/latest.json`
- الأرشيف: `data/forex/days/YYYY-MM-DD.json` (الصفحة تقرا آخر 30 يوم وتدمجها بدون تكرار)

## الملف

```json
{
  "schema_version": "1.0",
  "producer_id": "tb-mt5-export",
  "generated_at_utc": "2026-11-23T17:40:48Z",
  "environment": "demo",
  "account_alias": "Exness Demo",
  "bot": {
    "name": "TradingBrain_Seconds_Demo_V1",
    "version": "1.10",
    "symbol": "EURUSDm",
    "site": "LOCAL_DEMO",
    "state": "ARMED_DEMO_ONLY",
    "execution_enabled": true,
    "last_heartbeat_utc": "2026-11-23T17:40:48Z"
  },
  "account": { "balance": 2000.69, "equity": 2000.81, "reference_balance": 2000 },
  "agents": {
    "at_utc": "2026-11-23T17:40:48Z",
    "price_vote": "BUY", "price_note": "نص قصير اختياري",
    "tick_speed_vote": "WAIT", "tick_note": "",
    "opportunity_vote": "FAIL", "opportunity_note": "",
    "president_decision": "WAIT",
    "risk_guardian": "OK",
    "risk_guardian_reason": null,
    "rejection_code": "LOW_TICK_SPEED"
  },
  "trades": [
    {
      "event_id": "evt-…", "kind": "demo_broker",
      "symbol": "EURUSDm", "side": "buy", "lot": 0.01,
      "order_id": "…", "deal_id": "…", "position_id": "…",
      "requested_price": 1.05852, "fill_price": 1.05851, "close_price": 1.05972,
      "sl": 1.05772, "tp": 1.05972,
      "open_time_utc": "2026-11-19T15:51:11Z", "close_time_utc": "2026-11-19T15:51:37Z",
      "broker_commission": 0.07, "fees": 0, "swap": 0,
      "spread_observed": 0.8, "slippage_observed": 0.1,
      "realized_pnl_net": 1.13, "balance": 2001.13,
      "holding_seconds": 26, "execution_latency_ms": 120
    }
  ],
  "open_positions": [],
  "decisions": [
    { "event_id": "dec-…", "timestamp_utc": "2026-11-23T16:10:41Z", "president_decision": "WAIT", "rejection_code": "SPREAD_TOO_WIDE" }
  ]
}
```

## القيم المعروفة

- `bot.state`: `ARMED_DEMO_ONLY`، `RUNNING`، `HALT`، `ORDER_UNCERTAIN`، `OFF`
- الأصوات (`*_vote`): `BUY`، `SELL`، `NEUTRAL`، `WAIT`، `PASS`، `FAIL`
- `president_decision`: `ENTER_BUY`، `ENTER_SELL`، `WAIT`، `REJECT`
- `risk_guardian`: `OK`، `BLOCK`، `HALT`
- `trade.kind`: `demo_broker` (تنفيذ فعلي على حساب Demo من تاريخ الوسيط)، `simulation` (محاكاة). إذا ما انكتب يعتبر `demo_broker`.
- `rejection_code`: أي كود. هذي لها ترجمة جاهزة: `SPREAD_TOO_WIDE`، `LOW_TICK_SPEED`، `NO_MOMENTUM`، `TREND_CONFLICT`، `STALE_SIGNAL`، `COST_TOO_HIGH`، `DAILY_ATTEMPTS_CAP`، `DAILY_LOSS_CAP`، `RESERVE_GUARD`، `MARGIN_GUARD`، `NEWS_WINDOW`، `SESSION_CLOSED`، `EXECUTION_DISABLED`، `NOT_DEMO_ACCOUNT`. غيرها ينعرض بنفس الكود.

## قواعد العرض

- كل الأوقات UTC بصيغة ISO وتنتهي بـ`Z`. الصفحة تعرض UTC وتوقيت الرياض.
- **القيمة الناقصة ≠ صفر**: أي حقل مو موجود ينعرض «غير متوفر»، والصفر ينعرض صفر.
- بدون صفقات مكتملة: نسبة النجاح وأقصى تراجع «بيانات غير كافية»، مو 0%.
- آخر نبضة أقدم من 10 دقائق = «البيانات قديمة (STALE)»، وبدون نبضة = «MISSING».
- `realized_pnl_net` هو الصافي من تاريخ الوسيط. الصفحة **ما تخصم** العمولة مرة ثانية، تعرضها بس.
- قرارات `WAIT` و`REJECT` ما تنحسب صفقات ولا تدخل في نسبة النجاح.
- عدم التكرار: الصفقات بـ`event_id` (أو `deal_id`)، والقرارات بـ`event_id` (أو الوقت + القرار).

## ممنوع في الملف

ما يكون فيه أي مفتاح أو كلمة مرور أو token أو رقم حساب كامل. `account_alias` اسم وصفي بس.
