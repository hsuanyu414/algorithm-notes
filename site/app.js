/* 解題筆記：單頁靜態網站（hash routing，適用 GitHub Pages） */
(() => {
  "use strict";

  const DIFFS = ["Easy", "Medium", "Hard", "Unrated"];
  const DIFF_NAME = { Easy: "Easy", Medium: "Medium", Hard: "Hard", Unrated: "未分級" };
  const SORTS = { num: "依題號", recent: "最近新增", diff: "依難度" };

  const $main = document.getElementById("main");
  const state = { data: null, byKey: new Map(), tags: new Map(), cache: new Map() };

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const diffClass = (d) => `d-${d.toLowerCase()}`;
  const label = (p) => (p.num !== null ? `${p.num}. ${p.title}` : p.title);
  const sourceName = (key) => state.data.sources.find((s) => s.key === key)?.name ?? key;
  const githubBase = () => {
    const g = state.data.config.github || "";
    return g.replace(/\/$/, "");
  };

  async function getJSON(url) {
    if (state.cache.has(url)) return state.cache.get(url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const json = await res.json();
    state.cache.set(url, json);
    return json;
  }

  /**
   * 數學公式：$...$（行內）與 $$...$$（獨立區塊），用 KaTeX 渲染。
   * 先把公式換成佔位字串再交給 marked，避免公式裡的 _ * \\ 被當成 Markdown 語法；
   * 程式碼區塊與行內程式碼裡的 $ 不處理。
   */
  function extractMath(md) {
    const math = [];
    const keep = (tex, display) => `@@MATH${math.push({ tex, display }) - 1}@@`;
    const parts = md.split(/(```[\s\S]*?```|`[^`\n]*`)/);   // 奇數位置是程式碼
    const out = parts.map((s, i) => i % 2 ? s : s
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => keep(tex.trim(), true))
      // 行內：$ 後不能是空白、結尾 $ 前不能是空白、後面不能接數字（避免 $5 和 $10 被誤判）
      .replace(/(^|[^\\$])\$(?!\s)([^$\n]+?)(?<!\s)\$(?!\d)/g, (_, pre, tex) => pre + keep(tex, false))
      .replace(/\\\$/g, "$"));                             // \$ 代表真正的錢字號
    return { md: out.join(""), math };
  }

  function renderMath({ tex, display }) {
    if (!window.katex) return esc(display ? `$$${tex}$$` : `$${tex}$`);
    return window.katex.renderToString(tex, { displayMode: display, throwOnError: false });
  }

  function renderMarkdown(md) {
    if (!window.marked) return `<pre>${esc(md)}</pre>`;
    const { md: body, math } = extractMath(md);
    let html = window.marked.parse(body, { gfm: true });
    html = window.DOMPurify ? window.DOMPurify.sanitize(html) : html;
    // KaTeX 的輸出是安全的 HTML（預設不允許 \\href 等指令），在清理之後才放回去
    return html
      .replace(/<p>@@MATH(\d+)@@<\/p>/g, (_, i) => renderMath(math[i]))
      .replace(/@@MATH(\d+)@@/g, (_, i) => renderMath(math[i]));
  }

  /** 把筆記內的相對連結改成站內路由或 GitHub 連結，並為程式碼上色 */
  function enhance(container, baseFolder) {
    container.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (/^(https?:|#|mailto:)/.test(href)) {
        if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
        return;
      }
      const tag = href.match(/(?:tags|patterns)\/([^/]+)\.md$/);
      if (tag) { a.setAttribute("href", tagHref(decodeURIComponent(tag[1]))); return; }
      const gh = githubBase();
      if (gh && baseFolder) {
        const url = new URL(href, `https://x/${baseFolder}/`).pathname.slice(1);
        a.href = `${gh}/blob/main/${url}`;
        a.target = "_blank"; a.rel = "noopener";
      }
    });
    if (window.hljs) container.querySelectorAll("pre code").forEach((el) => window.hljs.highlightElement(el));
  }

  function diffPill(d) {
    return `<span class="diff ${diffClass(d)}"><span class="dot" aria-hidden="true"></span>${DIFF_NAME[d]}</span>`;
  }

  const tagHref = (slug) => `#/tags/${encodeURIComponent(slug)}`;
  const tagName = (slug) => state.tags.get(slug)?.name ?? slug;

  function tagLinks(slugs) {
    return slugs.map((s) => `<a class="tag-link" href="${tagHref(s)}">${esc(tagName(s))}</a>`).join("");
  }

  function problemRow(p) {
    return `
      <div class="row">
        <span class="row-id">${p.num !== null ? p.num : `<span class="src-tag">${esc(sourceName(p.source))}</span>`}</span>
        <span class="row-title">
          <a class="t row-link" href="#/p/${p.key}">${esc(p.title)}</a>${p.star ? '<span class="star" title="精選">★</span>' : ""}
          ${p.summary ? `<span class="row-summary">${esc(p.summary)}</span>` : ""}
        </span>
        <span class="row-diff">${diffPill(p.difficulty)}</span>
        <span class="row-tags">${p.tags.map((s) => `<a href="${tagHref(s)}">${esc(tagName(s))}</a>`).join("、")}</span>
        <span class="row-note">${p.note ? '<span class="has-note" title="有筆記">筆記</span>' : ""}</span>
      </div>`;
  }

  function diffBar(diff, total) {
    if (!total) return '<span class="bar" aria-hidden="true"></span>';
    return `<span class="bar" aria-hidden="true">${DIFFS.filter((d) => diff[d])
      .map((d) => `<span class="${diffClass(d)}" style="flex:${diff[d]}"></span>`).join("")}</span>`;
  }

  /* ---------- pages ---------- */
  function pageHome() {
    const { config, problems, tags } = state.data;
    const count = (d) => problems.filter((p) => p.difficulty === d).length;
    const featured = problems.filter((p) => p.star);
    const recent = problems.filter((p) => p.date).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    const others = state.data.sources.filter((s) => s.key !== "leetcode")
      .map((s) => ({ ...s, n: problems.filter((p) => p.source === s.key).length }));

    return `
      <section class="hero">
        <h1 class="hero-title">${esc(config.title)}</h1>
        <p class="hero-intro">${esc(config.intro)}</p>
        <dl class="tally">
          ${DIFFS.filter(count).map((d) => `<div class="${diffClass(d)}"><dt><span class="dot"></span>${DIFF_NAME[d]}</dt><dd>${count(d)}</dd></div>`).join("")}
        </dl>
        ${others.length ? `<p class="others">另收錄 ${others.map((s) => `<a href="#/problems?src=${s.key}">${esc(s.name)} ${s.n} 題</a>`).join("、")}。</p>` : ""}
      </section>

      ${featured.length ? `
      <section class="block">
        <div class="block-head"><h2>精選題目</h2><a href="#/problems?star=1">全部精選</a></div>
        <div class="list">${featured.map((p) => problemRow(p)).join("")}</div>
      </section>` : ""}

      <section class="block two-col">
        <div>
          <div class="block-head"><h2>標籤</h2><a href="#/tags">全部標籤</a></div>
          <ul class="tag-mini">
            ${tags.filter((t) => t.count).slice(0, 8).map((t) => `
              <li><a href="${tagHref(t.slug)}"><span class="pm-name">${esc(t.name)}</span><span class="pm-count">${t.count}</span></a>${diffBar(t.diff, t.count)}</li>`).join("")
              || "<li class='muted'>在題目的 front matter 加上 tags 就會顯示在這裡。</li>"}
          </ul>
        </div>
        <div>
          <div class="block-head"><h2>最近新增</h2><a href="#/problems?sort=recent">依時間排序</a></div>
          <ul class="recent">
            ${recent.map((p) => `<li><a href="#/p/${p.key}"><time>${esc(p.date)}</time><span>${esc(label(p))}</span></a></li>`).join("") || "<li class='muted'>在題目的 front matter 加上 date 欄位就會顯示在這裡。</li>"}
          </ul>
        </div>
      </section>`;
  }

  function parseQuery(qs) {
    const q = new URLSearchParams(qs);
    return {
      q: q.get("q") || "", src: q.get("src") || "", d: q.get("d") || "", t: q.get("t") || "",
      star: q.get("star") === "1", note: q.get("note") === "1", sort: SORTS[q.get("sort")] ? q.get("sort") : "num",
    };
  }

  function filterProblems(f) {
    const words = f.q.toLowerCase().split(/\s+/).filter(Boolean);
    let list = state.data.problems.filter((p) =>
      (!f.src || p.source === f.src) && (!f.d || p.difficulty === f.d) &&
      (!f.t || p.tags.includes(f.t)) && (!f.star || p.star) && (!f.note || p.note) &&
      words.every((w) => [p.id, p.title, p.summary, ...p.tags.flatMap((s) => [tagName(s), ...(state.tags.get(s)?.aliases ?? [])])]
        .join(" ").toLowerCase().includes(w)));
    if (f.sort === "recent") list = [...list].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (f.sort === "diff") list = [...list].sort((a, b) => DIFFS.indexOf(a.difficulty) - DIFFS.indexOf(b.difficulty));
    return list;
  }

  function pageProblems(qs) {
    const f = parseQuery(qs);
    const chips = (name, options, current) => options.map(([v, text]) =>
      `<button type="button" class="chip" data-f="${name}" data-v="${v}" aria-pressed="${current === v}">${text}</button>`).join("");
    const srcOpts = [["", "全部"], ...state.data.sources.map((s) => [s.key, esc(s.name)])];
    const dOpts = [["", "全部"], ...DIFFS.filter((d) => state.data.problems.some((p) => p.difficulty === d)).map((d) => [d, DIFF_NAME[d]])];

    return `
      <h1 class="page-title">題目</h1>
      <form class="filters" id="filters" role="search" onsubmit="return false">
        <input class="search" id="q" type="search" placeholder="搜尋題號、題名或標籤" value="${esc(f.q)}" autocomplete="off" aria-label="搜尋題目">
        <div class="filter-line">
          ${state.data.sources.length > 1 ? `<div class="chips" role="group" aria-label="來源">${chips("src", srcOpts, f.src)}</div>` : ""}
          <div class="chips" role="group" aria-label="難度">${chips("d", dOpts, f.d)}</div>
        </div>
        <div class="filter-line">
          <label class="select"><span>標籤</span>
            <select id="t"><option value="">全部</option>${[...state.data.tags].filter((t) => t.count)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((t) => `<option value="${esc(t.slug)}"${f.t === t.slug ? " selected" : ""}>${esc(t.name)}（${t.count}）</option>`).join("")}</select>
          </label>
          <label class="check"><input type="checkbox" id="star"${f.star ? " checked" : ""}> 只看精選</label>
          <label class="check"><input type="checkbox" id="note"${f.note ? " checked" : ""}> 只看有筆記</label>
          <label class="select push"><span>排序</span>
            <select id="sort">${Object.entries(SORTS).map(([v, t]) => `<option value="${v}"${f.sort === v ? " selected" : ""}>${t}</option>`).join("")}</select>
          </label>
        </div>
      </form>
      <p class="result-count" id="count" aria-live="polite"></p>
      <div class="list list-full" id="results"></div>`;
  }

  function bindProblems(qs) {
    const f = parseQuery(qs);
    const results = document.getElementById("results");
    const countEl = document.getElementById("count");

    const draw = () => {
      const list = filterProblems(f);
      countEl.textContent = `共 ${list.length} 題`;
      results.innerHTML = list.length
        ? list.map((p) => problemRow(p)).join("")
        : `<div class="empty">沒有符合條件的題目。<button type="button" id="reset">清除所有篩選</button></div>`;
      document.getElementById("reset")?.addEventListener("click", () => { location.hash = "#/problems"; });
    };
    const sync = () => {
      const q = new URLSearchParams();
      if (f.q) q.set("q", f.q);
      ["src", "d", "t"].forEach((k) => f[k] && q.set(k, f[k]));
      if (f.star) q.set("star", "1");
      if (f.note) q.set("note", "1");
      if (f.sort !== "num") q.set("sort", f.sort);
      const s = q.toString();
      history.replaceState(null, "", `#/problems${s ? "?" + s : ""}`);
      draw();
    };

    document.getElementById("q").addEventListener("input", (e) => { f.q = e.target.value; sync(); });
    document.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
      f[b.dataset.f] = b.dataset.v;
      document.querySelectorAll(`.chip[data-f="${b.dataset.f}"]`).forEach((x) => x.setAttribute("aria-pressed", x === b));
      sync();
    }));
    ["t", "sort"].forEach((id) => document.getElementById(id).addEventListener("change", (e) => { f[id] = e.target.value; sync(); }));
    ["star", "note"].forEach((id) => document.getElementById(id).addEventListener("change", (e) => { f[id] = e.target.checked; sync(); }));
    draw();
  }

  async function pageProblem(key) {
    const p = state.byKey.get(key);
    if (!p) return notFound("找不到這道題目，可能已被移除或網址有誤。");
    const detail = await getJSON(`data/p/${key}.json`);
    const all = state.data.problems;
    const i = all.indexOf(p);
    const prev = all[i - 1], next = all[i + 1];
    const gh = githubBase();
    const open = p.url ? `<a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">${p.source === "leetcode" ? "在 LeetCode 開啟" : "開啟原題"}</a>` : "";
    const ghLink = gh ? `<a class="btn ghost" href="${gh}/tree/main/${detail.folder}" target="_blank" rel="noopener">在 GitHub 查看</a>` : "";
    document.title = `${label(p)}｜${state.data.config.title}`;

    return `
      <a class="back" href="#/problems">返回題目列表</a>
      <header class="p-head">
        <div class="p-num ${diffClass(p.difficulty)}${p.num === null ? " is-text" : ""}">${p.num !== null ? p.num : esc(sourceName(p.source))}</div>
        <div class="p-meta">
          ${p.num !== null && p.source !== "leetcode" ? `<span class="src-tag">${esc(sourceName(p.source))}</span>` : ""}
          <h1 class="p-title">${esc(p.title)}${p.star ? '<span class="star" title="精選">★</span>' : ""}</h1>
          <div class="p-tags">
            ${diffPill(p.difficulty)}
            ${tagLinks(p.tags)}
          </div>
          ${open || ghLink ? `<div class="p-actions">${open}${ghLink}</div>` : ""}
        </div>
      </header>
      <div class="p-body">
        <article class="note prose" id="note">
          ${p.note || detail.body ? renderMarkdown(detail.body) : ""}
          ${!p.note ? '<p class="muted note-empty">這題還沒寫筆記。</p>' : ""}
        </article>
        <section class="code" aria-label="解答程式碼">
          ${detail.solutions.length > 1 ? `<div class="tabs" role="tablist">${detail.solutions.map((s, j) =>
            `<button type="button" role="tab" class="tab" aria-selected="${j === 0}" data-i="${j}">${esc(s.name)}</button>`).join("")}</div>` : ""}
          ${detail.solutions.map((s, j) => `
            <div class="code-panel" data-i="${j}"${j ? " hidden" : ""}>
              <div class="code-bar"><span>${esc(s.lang)}${detail.solutions.length === 1 ? `　${esc(s.name)}` : ""}</span><button type="button" class="copy" data-i="${j}">複製</button></div>
              <pre><code class="language-${s.lang === "C++" ? "cpp" : s.lang.toLowerCase()}">${esc(s.code)}</code></pre>
            </div>`).join("")}
        </section>
      </div>
      <nav class="pager" aria-label="上一題 / 下一題">
        ${prev ? `<a href="#/p/${prev.key}" class="pg-prev"><span>上一題</span>${esc(label(prev))}</a>` : "<span></span>"}
        ${next ? `<a href="#/p/${next.key}" class="pg-next"><span>下一題</span>${esc(label(next))}</a>` : "<span></span>"}
      </nav>`;
  }

  function bindProblem(key) {
    const detail = state.cache.get(`data/p/${key}.json`);
    enhance(document.getElementById("note"), detail.folder);
    document.querySelectorAll(".code pre code").forEach((el) => window.hljs?.highlightElement(el));
    document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.setAttribute("aria-selected", x === t));
      document.querySelectorAll(".code-panel").forEach((pnl) => { pnl.hidden = pnl.dataset.i !== t.dataset.i; });
    }));
    document.querySelectorAll(".copy").forEach((b) => b.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(detail.solutions[+b.dataset.i].code);
        b.textContent = "已複製";
      } catch { b.textContent = "無法複製"; }
      setTimeout(() => { b.textContent = "複製"; }, 1600);
    }));
  }

  function pageTags() {
    const all = state.data.tags;
    return `
      <h1 class="page-title">標籤</h1>
      <p class="lead">每個標籤都會列出有這個標籤的題目；有整理說明的標籤另外附上適用情境與程式模板。</p>
      ${all.length ? `<ul class="tag-list">
        ${all.map((t) => `
          <li>
            <a href="${tagHref(t.slug)}">
              <span class="pl-name">${esc(t.name)}${t.body ? '<span class="has-note" title="有說明與模板">說明</span>' : ""}</span>
              <span class="pl-summary">${esc(t.summary)}</span>
              <span class="pl-count">${t.count} 題</span>
            </a>
            ${diffBar(t.diff, t.count)}
          </li>`).join("")}
      </ul>` : '<p class="muted">還沒有任何標籤。</p>'}`;
  }

  /** slug 找不到時，再用名稱 / 別名找（例如舊網址 #/patterns/hash-map） */
  function findTag(key) {
    if (state.tags.has(key)) return state.tags.get(key);
    const k = key.toLowerCase().replace(/[-_]+/g, " ");
    return state.data.tags.find((t) => [t.slug, t.name, ...t.aliases]
      .some((n) => n.toLowerCase().replace(/[-_]+/g, " ") === k));
  }

  async function pageTag(key) {
    const t = findTag(key);
    if (!t) return notFound("找不到這個標籤。");
    if (t.slug !== key) { history.replaceState(null, "", tagHref(t.slug)); }
    const slug = t.slug;
    const body = t.body ? (await getJSON(`data/tag/${encodeURIComponent(slug)}.json`)).body.replace(/^#\s.*\n/, "") : "";
    const list = state.data.problems.filter((p) => p.tags.includes(slug));
    document.title = `${t.name}｜${state.data.config.title}`;
    const problems = `
      <h2>有這個標籤的題目（${list.length}）</h2>
      ${list.length ? `<div class="list${body ? " compact" : ""}">${list.map((p) => problemRow(p)).join("")}</div>` : '<p class="muted">還沒有題目使用這個標籤。</p>'}`;
    return `
      <a class="back" href="#/tags">返回標籤</a>
      <h1 class="page-title">${esc(t.name)}</h1>
      ${t.summary ? `<p class="lead">${esc(t.summary)}</p>` : ""}
      ${body ? `
      <div class="tag-layout">
        <article class="prose" id="tag-body">${renderMarkdown(body)}</article>
        <aside class="tag-problems">${problems}</aside>
      </div>` : `<section class="tag-problems solo">${problems}</section>`}`;
  }

  function notFound(msg) {
    return `<div class="empty big"><h1>找不到頁面</h1><p>${esc(msg)}</p><a class="btn" href="#/">回到首頁</a></div>`;
  }

  /* ---------- router ---------- */
  async function route() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const [path, qs = ""] = hash.split("?");
    const parts = path.split("/").filter(Boolean);
    document.title = state.data.config.title;
    document.querySelectorAll("[data-nav]").forEach((a) =>
      a.toggleAttribute("aria-current", a.dataset.nav === (parts[0] === "p" ? "problems" : parts[0])));

    let html, bind = () => {};
    try {
      if (!parts.length) { html = pageHome(); }
      else if (parts[0] === "problems") { html = pageProblems(qs); bind = () => bindProblems(qs); }
      else if (parts[0] === "p" && parts[1]) { html = await pageProblem(parts[1]); bind = () => state.byKey.has(parts[1]) && bindProblem(parts[1]); }
      else if (parts[0] === "patterns") { location.replace(`#/tags${parts[1] ? "/" + parts[1] : ""}`); return; }  // 舊網址
      else if (parts[0] === "tags" && parts[1]) {
        html = await pageTag(decodeURIComponent(parts[1]));
        bind = () => { const el = document.getElementById("tag-body"); if (el) enhance(el, "tags"); };
      }
      else if (parts[0] === "tags") html = pageTags();
      else html = notFound("這個網址沒有對應的頁面。");
    } catch (err) {
      console.error(err);
      html = `<div class="empty big"><h1>載入失敗</h1><p>無法讀取資料（${esc(err.message)}）。請重新整理頁面再試一次。</p></div>`;
    }
    $main.innerHTML = html;
    bind();
    if (!qs || parts[0] !== "problems") window.scrollTo(0, 0);
  }

  /* ---------- theme ---------- */
  function initTheme() {
    const root = document.documentElement;
    try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch {}
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = dark ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch {}
    });
  }

  /* ---------- boot ---------- */
  async function boot() {
    initTheme();
    try {
      state.data = await getJSON("data/index.json");
    } catch (err) {
      $main.innerHTML = `<div class="empty big"><h1>載入失敗</h1><p>找不到 data/index.json。請先執行 <code>python scripts/build_site.py</code>，再從 _site/ 開啟網站。</p></div>`;
      return;
    }
    state.data.problems.forEach((p) => state.byKey.set(p.key, p));
    state.data.tags.forEach((t) => state.tags.set(t.slug, t));

    const { config, generated } = state.data;
    document.getElementById("brand").textContent = config.title;
    const gh = githubBase();
    const ghLink = document.getElementById("github-link");
    if (gh) ghLink.href = gh; else ghLink.remove();
    document.getElementById("footer").innerHTML =
      `${config.author ? `<span>${esc(config.author)}</span>` : "<span></span>"}<span>最後更新 ${esc(generated.slice(0, 10))}</span>`;

    window.addEventListener("hashchange", route);
    route();
  }

  boot();
})();
