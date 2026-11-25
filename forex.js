/* TradingBrain Forex — Seconds Scalper: صفحة قراءة فقط.
 *
 * حدود هذا الملف: عرض وتصفية ورسوم بس. ما فيه أي مفاتيح تداول، ولا أوامر، ولا تعديل إعدادات مخاطر.
 * مصدر البيانات طبقة مستقلة (FX_SOURCES) تنبدل لما يجهز الربط الفعلي:
 *   - github : ملف JSON في مستودع GitHub خاص (latest.json + أرشيف يومي days/YYYY-MM-DD.json).
 *   - url    : رابط JSON للقراءة (مثلاً Forex Worker على Cloudflare لاحقاً).
 * صيغة الملف موثقة في docs/forex-data.md.
 */
(function () {
  "use strict";

  var CSS = [
    ".fx-miss{color:var(--muted);font:500 12px var(--f-body);border:1px dashed var(--line);border-radius:6px;padding:1px 6px;white-space:nowrap}",
    ".fx-sub{display:block;font-size:11.5px;color:var(--muted);margin-top:2px}",
    ".fx-banner{margin:0 0 14px;padding:12px 16px;border-radius:14px;border:1px dashed color-mix(in srgb,var(--live) 60%,transparent);background:var(--live-soft);color:var(--fg);font-size:14px;line-height:1.7}",
    ".fx-banner.warn{border-color:var(--loss);background:var(--loss-soft)}",
    
    ".pill.fx-ro{background:var(--accent-soft);color:var(--fg)}",
    ".fx-status{margin-bottom:14px}.fx-st-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-start}",
    ".fx-name{font:700 18px var(--f-display)}.fx-name small{font-size:12px;color:var(--muted)}",
    ".fx-chips{display:flex;gap:6px;flex-wrap:wrap}",
    ".fx-st-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}",
    ".fx-st-row>div{min-width:0}.fx-st-row .k{display:block;font-size:12px;color:var(--muted)}.fx-st-row b{display:block;font-size:15px}.fx-st-row small{font-size:11.5px;color:var(--muted)}",
    ".fx-kpis{grid-template-columns:repeat(4,minmax(0,1fr));row-gap:16px;margin-bottom:0;border-bottom:0;padding-bottom:0}",
    ".fx-kpis .kpi:nth-child(5){border:0;padding-inline-start:0}",
    ".fx-h{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap}",
    ".fx-agents{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:10px}",
    ".fx-agent{display:grid;gap:6px;align-content:start;padding:12px;border-radius:14px;border:1px solid var(--line);background:var(--sunk);min-width:0}",
    ".fx-agent .k{font-size:12.5px;color:var(--muted);font-weight:600}.fx-agent small{font-size:12px;color:var(--muted);line-height:1.5}",
    ".fx-agent .pill{justify-self:start}.fx-pres{border-color:color-mix(in srgb,var(--accent) 55%,transparent)}.fx-guard{border-color:color-mix(in srgb,var(--win) 45%,transparent)}",
    ".fx-filters{display:flex;flex-wrap:wrap;gap:10px;align-items:center}",
    ".fx-sel{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--muted)}",
    ".fx-sel select,.fx-src select,.fx-src input{font:500 13px var(--f-body);color:var(--fg);background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:7px 10px;min-height:38px}",
    ".fx-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:14px 0}.fx-grid>.panel{min-width:0}",
    "section.panel{margin-bottom:14px}",
    ".fx-empty{border:0;padding:24px 10px}",
    ".fx-bars{display:flex;align-items:flex-end;gap:6px;height:96px;padding-top:6px;overflow-x:auto}",
    ".fx-bar{display:grid;justify-items:center;gap:4px;flex:1 0 24px}.fx-bar small{font-size:10px;color:var(--muted)}",
    ".fx-bar-col{height:60px;display:flex;align-items:flex-end}.fx-bar i{display:block;width:14px;border-radius:5px 5px 2px 2px}",
    ".fx-bar i.up{background:linear-gradient(180deg,var(--win),color-mix(in srgb,var(--win) 50%,transparent))}.fx-bar i.dn{background:linear-gradient(180deg,var(--loss),color-mix(in srgb,var(--loss) 50%,transparent))}",
    ".fx-reasons{display:grid;gap:10px}.fx-r{display:grid;grid-template-columns:minmax(0,12em) minmax(0,1fr) 3em;gap:10px;align-items:center;font-size:13px}",
    ".fx-track{height:10px;border-radius:99px;background:var(--sunk);overflow:hidden}.fx-track i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--accent),var(--live))}",
    ".fx-r b{text-align:end}",
    ".fx-table td,.fx-table th{white-space:nowrap}.fx-table small.when{display:block}",
    ".fx-src summary{cursor:pointer;min-height:32px;display:flex;align-items:center;gap:6px}",
    ".fx-src-in{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}",
    ".fx-src-in label{display:grid;gap:4px;font-size:12.5px;color:var(--muted)}.fx-src-in .note{grid-column:1/-1}",
    ".fx-src-btns{display:flex;gap:8px;align-items:end;flex-wrap:wrap}",
    ".fx-foot{margin-top:8px}",
    "@media (max-width:1100px){.fx-agents{grid-template-columns:repeat(3,minmax(0,1fr))}}",
    "@media (max-width:860px){.fx-grid{grid-template-columns:minmax(0,1fr)}.fx-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.fx-kpis .kpi:nth-child(odd){border:0;padding-inline-start:0}.fx-st-row{grid-template-columns:minmax(0,1fr)}.fx-src-in{grid-template-columns:minmax(0,1fr)}}",
    "@media (max-width:560px){.fx-agents{grid-template-columns:repeat(2,minmax(0,1fr))}.fx-agents .fx-agent:last-child{grid-column:1/-1}.fx-r{grid-template-columns:minmax(0,7.5em) minmax(0,1fr) 2.5em}}"
  ].join("\n");
  (function () { var st = document.createElement("style"); st.id = "fx-css"; st.textContent = CSS; (document.head || document.documentElement).appendChild(st); })();
  var SN = function () { return window.SN || {}; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ls = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var STALE_MIN = 10;          // آخر نبضة أقدم من كذا = البيانات قديمة
  var DEF = { kind: "github", repo: "3pp3ll/tradingbrain-forex-data", path: "data/forex/latest.json", archive: "data/forex/days", url: "" };
  var CFG = (function () { try { return Object.assign({}, DEF, JSON.parse(ls.get("sentinel.fx.src") || "{}")); } catch (e) { return Object.assign({}, DEF); } })();
  if (CFG.kind === "sample") CFG.kind = "github";      // العينة التوضيحية انشالت: الصفحة تعرض الأرقام الحقيقية بس
  var F = (function () { try { return Object.assign({ period: "14", symbol: "all", side: "all", result: "all", kind: "all" }, JSON.parse(ls.get("sentinel.fx.filters") || "{}")); } catch (e) { return { period: "14", symbol: "all", side: "all", result: "all", kind: "all" }; } })();
  var DATA = null, ERR = null, AT = null, BUSY = false;

  /* ---------- أدوات ---------- */
  var D = function (s) { return s ? new Date(s) : null; };
  var isNum = function (x) { return typeof x === "number" && isFinite(x); };
  // قيمة ناقصة تنعرض «غير متوفر»، والصفر صفر
  var MISS = '<span class="fx-miss" title="ما وصلت هذي القيمة من المصدر">غير متوفر</span>';
  var money = function (x, sign) {
    if (!isNum(x)) return MISS;
    var s = "$" + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return '<span class="num ' + (x > 0 ? "pos" : x < 0 ? "neg" : "zero") + '">' + (x < 0 ? "−" : sign && x > 0 ? "+" : "") + s + "</span>";
  };
  var plain = function (x, d) { return isNum(x) ? '<span class="num">' + x.toFixed(d == null ? 2 : d) + "</span>" : MISS; };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var utc = function (s) { var d = D(s); return d && !isNaN(d) ? d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + " " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) : "—"; };
  var ryd = function (s) { var d = D(s); if (!d || isNaN(d)) return "—"; var r = new Date(d.getTime() + 3 * 36e5); return pad(r.getUTCHours()) + ":" + pad(r.getUTCMinutes()) + ":" + pad(r.getUTCSeconds()); };
  var dayKey = function (s) { var d = D(s); return d ? d.toISOString().slice(0, 10) : ""; };
  var ago = function (s) {
    var d = D(s); if (!d || isNaN(d)) return null;
    var m = Math.round((Date.now() - d.getTime()) / 6e4);
    return m < 1 ? "الحين" : m < 60 ? "قبل " + m + " د" : m < 1440 ? "قبل " + Math.round(m / 60) + " س" : "قبل " + Math.round(m / 1440) + " يوم";
  };

  var KIND = { demo_broker: ["تنفيذ Demo من الوسيط", "live"], simulation: ["محاكاة", "muted"] };
  var SIDE = { buy: "شراء", sell: "بيع" };
  var VOTE = { BUY: ["شراء", "win"], SELL: ["بيع", "loss"], NEUTRAL: ["محايد", "muted"], WAIT: ["انتظار", "muted"], PASS: ["يمر", "win"], FAIL: ["ما يمر", "loss"] };
  var DECISION = { ENTER_BUY: ["دخول شراء", "win"], ENTER_SELL: ["دخول بيع", "loss"], WAIT: ["انتظار", "muted"], REJECT: ["رفض", "loss"] };
  var GUARD = { OK: ["يسمح", "win"], BLOCK: ["يمنع", "loss"], HALT: ["إيقاف", "loss"] };
  var BOT = { ARMED_DEMO_ONLY: ["جاهز · Demo فقط", "win"], RUNNING: ["شغال", "win"], HALT: ["موقوف (HALT)", "loss"], ORDER_UNCERTAIN: ["أمر غير مؤكد", "loss"], OFF: ["مطفي", "muted"] };
  // أسباب الانتظار والرفض: الكود من الإكسبرت، والنص العربي هنا للعرض
  var REASON = {
    SPREAD_TOO_WIDE: "السبريد واسع", LOW_TICK_SPEED: "سرعة Tick ضعيفة", NO_MOMENTUM: "ما فيه زخم", TREND_CONFLICT: "تعارض الاتجاه",
    STALE_SIGNAL: "الإشارة قديمة", COST_TOO_HIGH: "التكلفة عالية مقابل الهدف", DAILY_ATTEMPTS_CAP: "وصلنا حد المحاولات اليومي",
    DAILY_LOSS_CAP: "وصلنا حد الخسارة اليومي", RESERVE_GUARD: "حماية الاحتياطي", MARGIN_GUARD: "الهامش", NEWS_WINDOW: "وقت أخبار",
    SESSION_CLOSED: "خارج وقت الجلسة", EXECUTION_DISABLED: "التنفيذ غير مفعّل", NOT_DEMO_ACCOUNT: "الحساب ليس Demo"
  };
  var reasonTxt = function (c, fallback) { return c ? (REASON[c] || c) : (fallback || "—"); };
  var pill = function (m, k) { var x = m[k] || [k || "—", "muted"]; return '<span class="pill ' + x[1] + '">' + esc(x[0]) + "</span>"; };

  /* ---------- طبقة مصدر البيانات (قابلة للاستبدال) ---------- */
  var FX_SOURCES = {
    github: {
      label: "GitHub خاص",
      load: function () {
        var tk = SN().token && SN().token(); if (!tk) return Promise.reject({ code: "token" });
        var get = function (p) {
          return fetch("https://api.github.com/repos/" + CFG.repo + "/contents/" + p + "?t=" + Date.now(), { cache: "no-store", headers: { Authorization: "Bearer " + tk.t, Accept: "application/vnd.github.raw+json", "X-GitHub-Api-Version": "2022-11-28" } })
            .then(function (r) { if (!r.ok) throw { code: r.status }; return r.json(); });
        };
        var list = function (p) {
          return fetch("https://api.github.com/repos/" + CFG.repo + "/contents/" + p + "?t=" + Date.now(), { cache: "no-store", headers: { Authorization: "Bearer " + tk.t, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" } })
            .then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
        };
        return get(CFG.path).then(function (latest) {
          if (!CFG.archive) return latest;
          // الأرشيف اليومي: آخر 30 يوم، ونجمع بدون تكرار (event_id / deal_id)
          return list(CFG.archive).then(function (files) {
            var days = (Array.isArray(files) ? files : []).filter(function (f) { return /\d{4}-\d{2}-\d{2}\.json$/.test(f.name); }).map(function (f) { return f.path; }).sort().slice(-30);
            return Promise.all(days.map(function (p) { return get(p).catch(function () { return null; }); })).then(function (arr) { return merge(latest, arr.filter(Boolean)); });
          });
        });
      }
    },
    url: {
      label: "رابط JSON",
      load: function () {
        if (!CFG.url) return Promise.reject({ code: "nourl" });
        var tk = SN().token && SN().token();
        return fetch(CFG.url + (CFG.url.indexOf("?") < 0 ? "?" : "&") + "t=" + Date.now(), { cache: "no-store", headers: tk ? { Authorization: "Bearer " + tk.t } : {} })
          .then(function (r) { if (!r.ok) throw { code: r.status }; return r.json(); });
      }
    }
  };
  function merge(latest, days) {
    var seenT = {}, seenD = {}, out = Object.assign({}, latest, { trades: [], decisions: [] });
    [latest].concat(days).forEach(function (src) {
      (src.trades || []).forEach(function (t) { var k = t.event_id || t.deal_id || t.position_id; if (k && seenT[k]) return; if (k) seenT[k] = 1; out.trades.push(t); });
      (src.decisions || []).forEach(function (x) { var k = x.event_id || x.timestamp_utc + "|" + x.president_decision; if (seenD[k]) return; seenD[k] = 1; out.decisions.push(x); });
    });
    return out;
  }
  function load(force) {
    if (BUSY) return; BUSY = true;
    var src = FX_SOURCES[CFG.kind] || FX_SOURCES.github;
    src.load().then(function (d) { DATA = norm(d); ERR = null; AT = new Date(); if (force && SN().toast) SN().toast("تم تحديث بيانات الفوركس"); })
      .catch(function (e) { ERR = e && e.code ? e.code : "net"; })
      .then(function () { BUSY = false; if (SN().rerender) SN().rerender(); });
  }
  // تنظيف: الصفقة بدون kind تعتبر demo_broker
  function norm(d) {
    d = d || {};
    d.trades = (d.trades || []).map(function (t) { return Object.assign({}, t, { kind: t.kind || "demo_broker", side: String(t.side || "").toLowerCase() }); })
      .sort(function (a, b) { return (b.close_time_utc || b.open_time_utc || "") < (a.close_time_utc || a.open_time_utc || "") ? -1 : 1; });
    d.decisions = (d.decisions || []).slice().sort(function (a, b) { return a.timestamp_utc < b.timestamp_utc ? 1 : -1; });
    return d;
  }

  /* ---------- الحسابات ---------- */
  var closed = function (t) { return !!t.close_time_utc && isNum(t.realized_pnl_net); };
  var costOf = function (t) { var parts = [t.broker_commission, t.fees, t.swap].filter(isNum); return parts.length ? parts.reduce(function (a, b) { return a + Math.abs(b); }, 0) : null; };
  function inPeriod(s) {
    if (F.period === "all") return true;
    var d = D(s); if (!d) return false;
    if (F.period === "today") return dayKey(s) === new Date().toISOString().slice(0, 10);
    return Date.now() - d.getTime() <= (+F.period) * 864e5;
  }
  function filtered() {
    return DATA.trades.filter(function (t) {
      var ts = t.close_time_utc || t.open_time_utc;
      if (!inPeriod(ts)) return false;
      if (F.symbol !== "all" && t.symbol !== F.symbol) return false;
      if (F.side !== "all" && t.side !== F.side) return false;
      if (F.kind !== "all" && t.kind !== F.kind) return false;
      if (F.result !== "all") {
        if (!closed(t)) return false;
        if (F.result === "win" && !(t.realized_pnl_net > 0)) return false;
        if (F.result === "loss" && !(t.realized_pnl_net < 0)) return false;
        if (F.result === "flat" && t.realized_pnl_net !== 0) return false;
      }
      return true;
    });
  }
  function stats(list) {
    var c = list.filter(closed).slice().sort(function (a, b) { return a.close_time_utc < b.close_time_utc ? -1 : 1; });
    var cum = 0, peak = 0, dd = 0, curve = [], days = {};
    c.forEach(function (t) {
      cum += t.realized_pnl_net; peak = Math.max(peak, cum); dd = Math.min(dd, cum - peak); curve.push(+cum.toFixed(2));
      var k = dayKey(t.close_time_utc); days[k] = (days[k] || 0) + t.realized_pnl_net;
    });
    var wins = c.filter(function (t) { return t.realized_pnl_net > 0; }), losses = c.filter(function (t) { return t.realized_pnl_net < 0; });
    var avg = function (a) { return a.length ? a.reduce(function (s, t) { return s + t.realized_pnl_net; }, 0) / a.length : null; };
    var gw = wins.reduce(function (s, t) { return s + t.realized_pnl_net; }, 0), gl = Math.abs(losses.reduce(function (s, t) { return s + t.realized_pnl_net; }, 0));
    return { n: c.length, open: list.filter(function (t) { return !closed(t); }).length, net: c.length ? +cum.toFixed(2) : null, wins: wins.length, losses: losses.length,
      rate: c.length ? wins.length / c.length : null, dd: c.length ? +dd.toFixed(2) : null, curve: curve, days: days, avgW: avg(wins), avgL: avg(losses), pf: gl ? gw / gl : null };
  }

  /* ---------- رسوم SVG بسيطة بألوان الثيم ---------- */
  function curveSvg(vals) {
    if (!vals.length) return '<div class="empty fx-empty"><b>ما فيه صفقات مكتملة</b>المنحنى يبدأ مع أول صفقة تنقفل.</div>';
    var W = 600, H = 200, P = 26, pts = [0].concat(vals), mn = Math.min.apply(null, pts), mx = Math.max.apply(null, pts);
    if (mx === mn) { mx += 1; mn -= 1; }
    var x = function (i) { return P + (W - 2 * P) * i / (pts.length - 1); }, y = function (v) { return P + (H - 2 * P) * (mx - v) / (mx - mn); };
    var line = pts.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(" ");
    return '<svg class="curve" dir="ltr" style="direction:ltr" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="الصافي التراكمي"><g class="g"><line x1="' + P + '" x2="' + (W - P) + '" y1="' + y(0).toFixed(1) + '" y2="' + y(0).toFixed(1) + '" class="zero-l"/>' +
      '<text x="' + (W - 4) + '" y="' + (y(mx) + 4).toFixed(1) + '" text-anchor="end">' + mx.toFixed(2) + '$</text><text x="' + (W - 4) + '" y="' + (y(mn) + 4).toFixed(1) + '" text-anchor="end">' + mn.toFixed(2) + "$</text></g>" +
      '<path class="area" d="' + line + " L" + x(pts.length - 1).toFixed(1) + " " + y(0).toFixed(1) + " L" + x(0).toFixed(1) + " " + y(0).toFixed(1) + 'Z"/><path class="ln" d="' + line + '"/>' +
      '<circle class="dot" r="5" cx="' + x(pts.length - 1).toFixed(1) + '" cy="' + y(pts[pts.length - 1]).toFixed(1) + '"/></svg>';
  }
  function dailyBars(days) {
    var keys = Object.keys(days).sort().slice(-14);
    if (!keys.length) return '<div class="empty fx-empty"><b>ما فيه أيام فيها صفقات مكتملة</b></div>';
    var mx = Math.max.apply(null, keys.map(function (k) { return Math.abs(days[k]); })) || 1;
    return '<div class="fx-bars" role="img" aria-label="الصافي اليومي">' + keys.map(function (k) {
      var v = days[k], h = Math.max(3, Math.round(56 * Math.abs(v) / mx));
      return '<div class="fx-bar" title="' + k + ": " + v.toFixed(2) + '$"><div class="fx-bar-col"><i class="' + (v >= 0 ? "up" : "dn") + '" style="height:' + h + 'px"></i></div><small class="num">' + k.slice(5) + "</small></div>";
    }).join("") + "</div>";
  }
  function reasonBars(dec) {
    var counts = {}, total = 0;
    dec.forEach(function (x) { if (x.president_decision === "WAIT" || x.president_decision === "REJECT") { var k = x.rejection_code || "UNSPECIFIED"; counts[k] = (counts[k] || 0) + 1; total++; } });
    var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 8);
    if (!keys.length) return '<div class="empty fx-empty"><b>ما فيه قرارات انتظار أو رفض مسجلة</b></div>';
    return '<div class="fx-reasons">' + keys.map(function (k) {
      return '<div class="fx-r"><span>' + esc(k === "UNSPECIFIED" ? "بدون سبب مسجل" : reasonTxt(k)) + '</span><div class="fx-track"><i style="width:' + Math.round(100 * counts[k] / counts[keys[0]]) + '%"></i></div><b class="num">' + counts[k] + "</b></div>";
    }).join("") + '<p class="note">من ' + total + " قرار انتظار أو رفض في الفترة. الانتظار مو صفقة، وما يدخل في نسبة النجاح.</p></div>";
  }

  /* ---------- الأجزاء ---------- */
  function statusCard() {
    var b = DATA.bot || {}, hb = b.last_heartbeat_utc || DATA.generated_at_utc, age = hb ? (Date.now() - new Date(hb).getTime()) / 6e4 : null;
    var conn = !hb ? ["ما وصلت نبضة (MISSING)", "loss"] : age > STALE_MIN ? ["البيانات قديمة (STALE)", "live"] : ["متصل", "win"];
    return '<section class="panel fx-status"><div class="fx-st-head"><div><div class="fx-name">' + esc(b.name || "TradingBrain") + (b.version ? ' <small class="num">v' + esc(b.version) + "</small>" : "") + "</div>" +
      '<div class="note">' + esc(DATA.account_alias || "حساب Demo") + " · " + esc(b.symbol || "—") + (b.site ? " · " + esc(b.site) : "") + "</div></div>" +
      '<div class="fx-chips">' + pill(BOT, b.state) + '<span class="pill ' + conn[1] + '">' + conn[0] + '</span><span class="pill fx-ro">🔒 قراءة فقط</span>' + (DATA.environment === "demo" ? '<span class="pill live">DEMO</span>' : '<span class="pill loss">بيئة غير Demo!</span>') + "</div></div>" +
      '<div class="fx-st-row"><div><span class="k">آخر تحديث</span><b class="num">' + (hb ? ryd(hb) + " الرياض" : "—") + '</b><small class="num">' + (hb ? utc(hb) + " UTC · " + ago(hb) : "") + "</small></div>" +
      '<div><span class="k">التنفيذ في الإكسبرت</span><b>' + (b.execution_enabled === true ? "مفعّل (Demo)" : b.execution_enabled === false ? "غير مفعّل" : "غير معروف") + "</b></div>" +
      '<div><span class="k">المصدر</span><b>' + esc((FX_SOURCES[CFG.kind] || FX_SOURCES.github).label) + '</b><small class="num">' + (AT ? "قرأته " + ago(AT.toISOString()) : "") + "</small></div></div></section>";
  }
  function kpis(st) {
    var a = DATA.account || {};
    var rate = st.n ? '<span class="num">' + Math.round(st.rate * 100) + "%</span>" + (st.n < 10 ? '<small class="fx-sub">عينة صغيرة (' + st.n + ")</small>" : "") : '<span class="fx-miss">بيانات غير كافية</span>';
    var k = function (label, v, sub) { return '<div class="kpi"><div class="k">' + label + '</div><div class="v">' + v + "</div>" + (sub ? '<small class="fx-sub">' + sub + "</small>" : "") + "</div>"; };
    return '<section class="panel"><div class="kpis fx-kpis">' +
      k("الرصيد", money(a.balance), isNum(a.reference_balance) ? "المرجعي " + a.reference_balance.toLocaleString("en-US") + "$" : "") +
      k("Equity", money(a.equity)) +
      k("الصفقات المكتملة", '<span class="num">' + st.n + "</span>", st.wins + " رابحة · " + st.losses + " خاسرة") +
      k("المفتوحة", '<span class="num">' + ((DATA.open_positions || []).length + st.open) + "</span>") +
      k("الصافي بعد التكاليف", st.n ? money(st.net, true) : '<span class="fx-miss">ما فيه صفقات</span>') +
      k("نسبة النجاح", rate) +
      k("أقصى تراجع", st.n ? money(st.dd) : '<span class="fx-miss">بيانات غير كافية</span>') +
      k("معامل الربح", st.pf == null ? '<span class="fx-miss">—</span>' : plain(st.pf), st.avgW != null || st.avgL != null ? "متوسط +" + (st.avgW || 0).toFixed(2) + " / " + (st.avgL || 0).toFixed(2) : "") +
      "</div></section>";
  }
  function agentsCard() {
    var g = DATA.agents;
    if (!g) return '<section class="panel"><h2>المحللين والرئيس والحارس</h2><div class="empty fx-empty"><b>ما وصلت قرارات المحللين (MISSING)</b>تنعرض أول ما يرسلها الإكسبرت.</div></section>';
    var card = function (t, vote, note) { return '<div class="fx-agent"><span class="k">' + t + "</span>" + pill(VOTE, vote) + '<small>' + esc(note || "") + "</small></div>"; };
    var gd = g.risk_guardian || (g.risk_guardian_reason ? "BLOCK" : null);
    return '<section class="panel"><div class="fx-h"><h2>المحللين والرئيس والحارس</h2><small class="note num">' + (g.at_utc ? utc(g.at_utc) + " UTC · " + ago(g.at_utc) : "") + "</small></div>" +
      '<div class="fx-agents">' + card("محلل حركة السعر", g.price_vote, g.price_note) + card("محلل سرعة Tick", g.tick_speed_vote, g.tick_note) + card("محلل الفرص", g.opportunity_vote, g.opportunity_note) +
      '<div class="fx-agent fx-pres"><span class="k">رئيس القرار</span>' + pill(DECISION, g.president_decision) + "<small>" + esc(g.president_decision === "WAIT" || g.president_decision === "REJECT" ? "السبب: " + reasonTxt(g.rejection_code) : "") + "</small></div>" +
      '<div class="fx-agent fx-guard"><span class="k">حارس المخاطر</span>' + (gd ? pill(GUARD, gd) : '<span class="pill muted">غير معروف</span>') + "<small>" + esc(g.risk_guardian_reason ? reasonTxt(g.risk_guardian_reason) : gd === "OK" ? "ضمن الحدود" : "") + "</small></div></div>" +
      '<p class="note">الحارس يتقدم على أي محلل: إذا منع، ما فيه دخول حتى لو كل المحللين وافقوا.</p></section>';
  }
  function filtersBar() {
    var syms = {}; DATA.trades.forEach(function (t) { if (t.symbol) syms[t.symbol] = 1; });
    var seg = function (key, opts) { return '<div class="seg" role="group">' + opts.map(function (o) { return '<button type="button" data-fx-f="' + key + '" data-v="' + o[0] + '" class="' + (F[key] === o[0] ? "on" : "") + '">' + o[1] + "</button>"; }).join("") + "</div>"; };
    var sel = function (key, label, opts) { return '<label class="fx-sel"><span>' + label + '</span><select data-fx-s="' + key + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (F[key] === o[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select></label>"; };
    return '<div class="fx-filters">' + seg("period", [["today", "اليوم"], ["7", "أسبوع"], ["14", "14 يوم"], ["all", "الكل"]]) +
      sel("symbol", "الرمز", [["all", "الكل"]].concat(Object.keys(syms).sort().map(function (s) { return [s, s]; }))) +
      sel("side", "الاتجاه", [["all", "الكل"], ["buy", "شراء"], ["sell", "بيع"]]) +
      sel("result", "النتيجة", [["all", "الكل"], ["win", "ربح"], ["loss", "خسارة"], ["flat", "تعادل"]]) +
      sel("kind", "النوع", [["all", "الكل"], ["demo_broker", "تنفيذ Demo"], ["simulation", "محاكاة"]]) + "</div>";
  }
  function tradesTable(list) {
    if (!list.length) return '<div class="empty fx-empty"><b>ما فيه صفقات بهالفلاتر</b>' + (DATA.trades.length ? "غيّر الفترة أو الفلتر." : "ما سجل الإكسبرت أي صفقة للحين. قرارات الانتظار تحت.") + "</div>";
    var rows = list.slice(0, 300).map(function (t) {
      var k = KIND[t.kind] || [t.kind, "muted"], c = costOf(t);
      return "<tr><td><span class=\"num\">" + utc(t.open_time_utc) + '</span><small class="when num">الرياض ' + ryd(t.open_time_utc) + "</small></td>" +
        '<td class="num">' + esc(t.symbol || "—") + '<small class="when"><span class="pill ' + k[1] + '">' + k[0] + "</span></small></td>" +
        '<td><span class="pill ' + (t.side === "buy" ? "win" : "loss") + '">' + (SIDE[t.side] || "—") + "</span></td>" +
        '<td class="n">' + (closed(t) ? money(t.realized_pnl_net, true) : '<span class="zero">—</span>') + "</td>" +
        '<td class="n">' + plain(t.lot, 2) + '</td><td class="n">' + plain(t.fill_price, 5) + (isNum(t.requested_price) && t.requested_price !== t.fill_price ? '<small class="when num">طلب ' + t.requested_price.toFixed(5) + "</small>" : "") + "</td>" +
        '<td class="n">' + (t.close_time_utc ? plain(t.close_price, 5) : '<span class="pill live">مفتوحة</span>') + '</td><td class="n">' + plain(t.sl, 5) + '</td><td class="n">' + plain(t.tp, 5) + "</td>" +
        '<td class="n">' + (isNum(t.holding_seconds) ? '<span class="num">' + t.holding_seconds + "ث</span>" : MISS) + "</td>" +
        '<td class="n">' + (c == null ? MISS : '<span class="num">' + c.toFixed(2) + "$</span>") + (isNum(t.swap) && t.swap ? '<small class="when num">سواب ' + t.swap.toFixed(2) + "</small>" : "") + "</td>" +
        '<td class="n">' + (isNum(t.slippage_observed) ? '<span class="num">' + t.slippage_observed + "</span>" : MISS) + "</td>" +
        '<td><small class="num">' + esc(t.deal_id || "—") + "<br>" + esc(t.position_id || "") + "</small></td></tr>";
    }).join("");
    return '<div class="table-wrap"><table class="fx-table"><thead><tr><th>الفتح (UTC)</th><th>الرمز</th><th>الاتجاه</th><th class="n">الصافي</th><th class="n">اللوت</th><th class="n">الدخول</th><th class="n">الخروج</th><th class="n">SL</th><th class="n">TP</th><th class="n">المدة</th><th class="n">العمولة والرسوم</th><th class="n">الانزلاق (نقطة)</th><th>Deal / Position</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      '<p class="note">الصافي من تاريخ الوسيط بعد العمولة والرسوم والسواب، بدون خصم التكلفة مرتين. توقيت الوسيط في Exness هو UTC.</p>';
  }
  function decisionsTable(dec) {
    var rows = dec.slice(0, 15).map(function (x) {
      return '<tr><td class="num">' + utc(x.timestamp_utc) + "</td><td>" + pill(DECISION, x.president_decision) + "</td><td>" + esc(x.president_decision === "WAIT" || x.president_decision === "REJECT" ? reasonTxt(x.rejection_code, "بدون سبب مسجل") : "—") + "</td></tr>";
    }).join("");
    return rows ? '<div class="table-wrap"><table><thead><tr><th>الوقت (UTC)</th><th>القرار</th><th>السبب</th></tr></thead><tbody>' + rows + "</tbody></table></div>" : '<div class="empty fx-empty"><b>ما فيه قرارات مسجلة</b></div>';
  }
  function sourcePanel() {
    var o = function (k) { return '<option value="' + k + '"' + (CFG.kind === k ? " selected" : "") + ">" + FX_SOURCES[k].label + "</option>"; };
    return '<details class="panel fx-src"' + (ERR ? " open" : "") + "><summary><b>مصدر البيانات</b> · " + esc((FX_SOURCES[CFG.kind] || {}).label || "") + '</summary><div class="fx-src-in">' +
      '<label><span>النوع</span><select id="fx-kind">' + o("github") + o("url") + "</select></label>" +
      '<label data-fx-for="github"><span>المستودع (خاص)</span><input id="fx-repo" dir="ltr" value="' + esc(CFG.repo) + '"></label>' +
      '<label data-fx-for="github"><span>ملف آخر لقطة</span><input id="fx-path" dir="ltr" value="' + esc(CFG.path) + '"></label>' +
      '<label data-fx-for="github"><span>مجلد الأرشيف اليومي</span><input id="fx-archive" dir="ltr" value="' + esc(CFG.archive) + '"></label>' +
      '<label data-fx-for="url"><span>رابط JSON (قراءة فقط)</span><input id="fx-url" dir="ltr" placeholder="https://…/api/forex" value="' + esc(CFG.url) + '"></label>' +
      '<div class="fx-src-btns"><button type="button" class="btn" data-fx-act="save">حفظ وتحديث</button><button type="button" class="btn ghost" data-fx-act="refresh">تحديث</button></div>' +
      '<p class="note">GitHub يستخدم رمز الوصول الموجود في الإعدادات، ولازم يكون عنده صلاحية قراءة على مستودع الفوركس. الصفحة تقرا بس، وما تكتب ولا ترسل أي أمر. صيغة الملف في docs/forex-data.md.</p></div></details>';
  }

  /* ---------- الصفحة ---------- */
  function page() {
    if (!DATA && !ERR) { load(); return '<section><div class="empty"><b>جاري تحميل بيانات الفوركس…</b></div></section>' + sourcePanel(); }
    if (!DATA) {
      var msg = { token: ["اربط رمز GitHub من الإعدادات", "مصدر GitHub يحتاج رمز وصول."], nourl: ["ما فيه رابط", "حط رابط JSON في مصدر البيانات."], 401: ["الرمز ما يخص المستودع", "تأكد إن الرمز عنده صلاحية قراءة على مستودع الفوركس."], 403: ["الرمز ما عنده صلاحية", "أضف مستودع الفوركس لصلاحيات الرمز (Contents: Read)."], 404: ["بانتظار الأرقام الحقيقية", "لسه ما وصل ملف البيانات. أول ما ينرفع latest.json على المستودع تظهر الأرقام هنا."] }[ERR] || ["ما قدرت أقرأ البيانات", "تأكد من النت وجرب التحديث."];
      return '<section><div class="empty"><b>' + msg[0] + "</b>" + msg[1] + "</div></section>" + sourcePanel();
    }
    var list = filtered(), st = stats(list), dec = DATA.decisions.filter(function (x) { return inPeriod(x.timestamp_utc); });
    return (ERR && DATA ? '<div class="fx-banner warn">آخر تحديث فشل، المعروض آخر نسخة محفوظة.</div>' : "") +
      statusCard() + kpis(st) + agentsCard() +
      '<section class="panel">' + filtersBar() + "</section>" +
      '<section class="fx-grid"><div class="panel"><h2>الصافي التراكمي</h2>' + curveSvg(st.curve) + '</div><div class="panel"><h2>الصافي اليومي</h2>' + dailyBars(st.days) + "</div></section>" +
      '<section class="panel"><h2>صفقات الفترة <small class="note num">' + list.length + "</small></h2>" + tradesTable(list) + "</section>" +
      '<section class="fx-grid"><div class="panel"><h2>أسباب الانتظار والرفض</h2>' + reasonBars(dec) + '</div><div class="panel"><h2>آخر قرارات الرئيس</h2>' + decisionsTable(dec) + "</div></section>" +
      sourcePanel() +
      '<p class="note fx-foot">الصفحة للعرض فقط: ما فيها مفاتيح ولا أوامر ولا تعديل لحدود المخاطر. الإكسبرت هو مصدر قرارات التداول وحده، والنتائج تجربة Demo وليست ضماناً لأداء مستقبلي.</p>';
  }

  /* ---------- التفاعل ---------- */
  var saveF = function () { ls.set("sentinel.fx.filters", JSON.stringify(F)); if (SN().rerender) SN().rerender(); };
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-fx-f],[data-fx-act]"); if (!b) return;
    if (b.dataset.fxF) { F[b.dataset.fxF] = b.dataset.v; saveF(); return; }
    if (b.dataset.fxAct === "refresh") { load(true); return; }
    if (b.dataset.fxAct === "save") {
      var v = function (id) { var x = document.getElementById(id); return x ? x.value.trim() : ""; };
      CFG = { kind: v("fx-kind") || "github", repo: v("fx-repo") || DEF.repo, path: v("fx-path") || DEF.path, archive: v("fx-archive"), url: v("fx-url") };
      if (CFG.url && !/^https:\/\//.test(CFG.url)) { if (SN().toast) SN().toast("الرابط لازم يبدأ بـ https://"); return; }
      ls.set("sentinel.fx.src", JSON.stringify(CFG)); DATA = null; ERR = null; load(true);
    }
  });
  document.addEventListener("change", function (e) {
    var s = e.target; if (!s || !s.dataset) return;
    if (s.dataset.fxS) { F[s.dataset.fxS] = s.value; saveF(); }
  });

  window.FX = { page: page, load: load, sources: FX_SOURCES, info: function () { return DATA && DATA.bot ? DATA.bot : { symbol: "EURUSDm" }; }, _stats: stats };
})();
