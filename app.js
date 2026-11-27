(function () {
  const DATA = window.HAT_ATLAS;
  if (!DATA) return;

  // Enforce strict A-Z brand ordering & image-only gallery rule ("图鉴里的必须有图")
  const brandsAZ = [...DATA.brands].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  const brandMap = Object.fromEntries(brandsAZ.map(b => [b.id, b]));
  const imagedHats = DATA.hats.filter(h => typeof h.image === "string" && h.image.trim().length > 0);
  const FX = DATA.fx;
  const CURRENCY_SYM = { CNY: "¥", USD: "$", EUR: "€", GBP: "£" };

  const state = {
    view: "gallery",
    rankTab: "sales",
    q: "",
    brand: "",
    cat: "",
    sort: "sales"
  };

  const $ = sel => document.querySelector(sel);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  function toCNY(hat) {
    if (hat.price == null) return null;
    return Math.round(hat.price * (FX[hat.currency] || 1));
  }

  function fmtNum(n) {
    return n.toLocaleString("zh-CN");
  }

  function fmtPrice(hat) {
    if (hat.price == null) return hat.priceNote || "定制 / 非卖品";
    const sym = CURRENCY_SYM[hat.currency] || (hat.currency + " ");
    const orig = `${sym}${fmtNum(hat.price)}`;
    if (hat.currency === "CNY") return orig;
    return `${orig} · ≈¥${fmtNum(toCNY(hat))}`;
  }

  function monogram(name) {
    const words = String(name || "H").replace(/[^\w\u4e00-\u9fa5 ]+/g, "").trim().split(/\s+/);
    if (!words.length) return "H";
    if (/[\u4e00-\u9fa5]/.test(words[0])) return words[0].slice(0, 2);
    return words.slice(0, 2).map(w => w[0]).join("").toUpperCase();
  }

  function thumbHtml(hat, extraBadge = "") {
    const brand = brandMap[hat.brandId];
    const fb = `<div class="fallback"><div><div class="mono">${esc(monogram(hat.name))}</div><small>${esc(brand.name)} · ${esc(hat.category)}</small></div></div>`;
    if (!hat.image) return `${fb}${extraBadge}`;
    return `${fb}<img src="${esc(hat.image)}" alt="${esc(hat.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()" />${extraBadge}`;
  }

  function initMeta() {
    const subcultureCount = imagedHats.filter(h => h.category === "亚文化").length;
    const avgHeat = Math.round(imagedHats.reduce((s, h) => s + (h.heat?.score || 0), 0) / (imagedHats.length || 1));
    const avgArt = Math.round(imagedHats.reduce((s, h) => s + (h.artistry || 0), 0) / (imagedHats.length || 1));
    $("#stats").innerHTML = [
      `<span><b>${brandsAZ.length}</b> 家品牌（A–Z）</span>`,
      `<span><b>${imagedHats.length}</b> 款有图收录</span>`,
      `<span><b>${subcultureCount}</b> 款亚文化</span>`,
      `<span>均热度 <b>${avgHeat}</b></span>`,
      `<span>均艺术性 <b>${avgArt}</b></span>`,
      `<span>每周末定时更新（${esc(DATA.updatedAt)}）</span>`
    ].join("");

    $("#fx-note").textContent = `汇率参考：1 USD≈¥${FX.USD} · 1 EUR≈¥${FX.EUR} · 1 GBP≈¥${FX.GBP}（数据日期 ${DATA.updatedAt}，每周末自动更新）`;

    const fBrand = $("#f-brand");
    brandsAZ.forEach(b => {
      const cnt = imagedHats.filter(h => h.brandId === b.id).length;
      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = cnt > 0 ? `${b.name}（${b.country} · ${cnt}款）` : `${b.name}（${b.country} · 待补图）`;
      fBrand.appendChild(opt);
    });

    const catOrder = ["亚文化", "秀场艺术帽", "礼帽", "软呢帽", "贝雷帽", "草帽", "渔夫帽", "针织帽", "鸡尾酒帽/发饰", "其他"];
    const presentCats = [...new Set(imagedHats.map(h => h.category))];
    presentCats.sort((a, b) => {
      const ia = catOrder.indexOf(a), ib = catOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    const fCat = $("#f-cat");
    presentCats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      fCat.appendChild(opt);
    });
  }

  function filteredHats() {
    const q = state.q.trim().toLowerCase();
    const list = imagedHats.filter(h => {
      if (state.brand && h.brandId !== state.brand) return false;
      if (state.cat && h.category !== state.cat) return false;
      if (q) {
        const b = brandMap[h.brandId];
        const hay = [
          h.name, h.collection, h.category, h.material, h.description,
          h.heat?.evidence, h.heat?.runway, h.salesNote, h.artistryNote,
          ...(h.heat?.celebrities || []),
          b.name, b.nameZh, b.country, b.city
        ].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (state.sort === "sales") return (b.sales || 0) - (a.sales || 0);
      if (state.sort === "heat") return (b.heat?.score || 0) - (a.heat?.score || 0);
      if (state.sort === "artistry") return (b.artistry || 0) - (a.artistry || 0);
      if (state.sort === "year-desc") return (b.year || 0) - (a.year || 0);
      if (state.sort === "year-asc") return (a.year || 9999) - (b.year || 9999);
      return 0;
    });
    return list;
  }

  function renderGallery() {
    const list = filteredHats();
    $("#result-count").textContent = `显示 ${list.length} / ${imagedHats.length} 款有图帽子`;
    const grid = $("#grid");
    if (!list.length) {
      grid.innerHTML = `<div class="empty">没有匹配的帽款，请调整筛选条件。</div>`;
      return;
    }
    const metricLabel = state.sort === "sales" ? "销量" : state.sort === "artistry" ? "艺术性" : "热度";
    grid.innerHTML = list.map(h => {
      const b = brandMap[h.brandId];
      const catBadge = `<span class="badge">${esc(h.category)}</span>`;
      const mainScore = state.sort === "sales" ? h.sales : state.sort === "artistry" ? h.artistry : (h.heat?.score ?? 0);
      const pill = `<span class="heat-pill">${metricLabel} ${mainScore}</span>`;
      return `
        <button class="card" data-hat="${esc(h.id)}">
          <div class="thumb">${thumbHtml(h, catBadge + pill)}</div>
          <div class="card-body">
            <div class="card-brand">${esc(b.name)} · ${esc(h.year || "")}</div>
            <div class="card-name">${esc(h.name)}</div>
            <div class="card-meta">
              <span>销 ${h.sales} · 热 ${h.heat?.score ?? 0} · 艺 ${h.artistry}</span>
            </div>
          </div>
        </button>`;
    }).join("");
  }

  function renderRankTable(rows, mode) {
    const titleMap = { sales: "销量指数", heat: "热度分", artistry: "艺术性分" };
    const noteTitle = { sales: "销量依据", heat: "热度依据", artistry: "艺术性依据" };
    return `
      <div class="table-scroll">
        <table class="rank-table">
          <thead>
            <tr>
              <th>#</th>
              <th>帽款 / 品牌</th>
              <th class="hide-sm">类别 / 年份</th>
              <th>${titleMap[mode]}</th>
              <th class="hide-sm">三维得分（销/热/艺）</th>
              <th class="hide-sm">${noteTitle[mode]}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((h, i) => {
              const b = brandMap[h.brandId];
              const score = mode === "sales" ? h.sales : mode === "artistry" ? h.artistry : (h.heat?.score || 0);
              const note = mode === "sales" ? h.salesNote : mode === "artistry" ? h.artistryNote : (h.heat?.evidence || "");
              return `
                <tr data-hat="${esc(h.id)}">
                  <td class="rk ${i < 3 ? "top" : ""}">${i + 1}</td>
                  <td>
                    <div class="rt-hat">
                      <div class="mini">${thumbHtml(h)}</div>
                      <div>
                        <div class="rt-name">${esc(h.name)}</div>
                        <div class="rt-sub">${esc(b.name)}（${esc(b.country)}）</div>
                      </div>
                    </div>
                  </td>
                  <td class="hide-sm"><div>${esc(h.category)}</div><div class="rt-sub">${esc(h.year || "—")}</div></td>
                  <td class="num">
                    <div>${score} / 100</div>
                    <div class="bar"><i style="width:${score}%"></i></div>
                  </td>
                  <td class="num hide-sm">${h.sales} / ${h.heat?.score ?? 0} / ${h.artistry}</td>
                  <td class="hide-sm">${esc(note)}</td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`;
  }

  function renderBrandCompare() {
    const stats = brandsAZ
      .map(b => {
        const hats = imagedHats.filter(h => h.brandId === b.id);
        if (!hats.length) return null;
        const n = hats.length;
        return {
          b,
          avgSales: Math.round(hats.reduce((s, h) => s + (h.sales || 0), 0) / n),
          avgHeat: Math.round(hats.reduce((s, h) => s + (h.heat?.score || 0), 0) / n),
          avgArt: Math.round(hats.reduce((s, h) => s + (h.artistry || 0), 0) / n)
        };
      })
      .filter(Boolean);

    const panel = (title, key, list) => `
      <div class="panel">
        <h3>${title}</h3>
        ${list.map(s => `
          <div class="hbar">
            <span>${esc(s.b.name)}</span>
            <div class="bar"><i style="width:${s[key]}%"></i></div>
            <span class="num">${s[key]} 分</span>
          </div>`).join("")}
      </div>`;

    return `
      <div class="brand-compare">
        ${panel("品牌平均销量指数（Top 20）", "avgSales", [...stats].sort((a, b) => b.avgSales - a.avgSales).slice(0, 20))}
        ${panel("品牌平均热度排行（Top 20）", "avgHeat", [...stats].sort((a, b) => b.avgHeat - a.avgHeat).slice(0, 20))}
        ${panel("品牌平均艺术性排行（Top 20）", "avgArt", [...stats].sort((a, b) => b.avgArt - a.avgArt).slice(0, 20))}
      </div>`;
  }

  function renderRank() {
    const body = $("#rank-body");
    if (state.rankTab === "sales") {
      const rows = [...imagedHats].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 30);
      body.innerHTML = renderRankTable(rows, "sales");
    } else if (state.rankTab === "heat") {
      const rows = [...imagedHats].sort((a, b) => (b.heat?.score || 0) - (a.heat?.score || 0)).slice(0, 30);
      body.innerHTML = renderRankTable(rows, "heat");
    } else if (state.rankTab === "artistry") {
      const rows = [...imagedHats].sort((a, b) => (b.artistry || 0) - (a.artistry || 0)).slice(0, 30);
      body.innerHTML = renderRankTable(rows, "artistry");
    } else {
      body.innerHTML = renderBrandCompare();
    }
  }

  function renderBrands() {
    $("#brand-list").innerHTML = brandsAZ.map(b => {
      const hats = imagedHats.filter(h => h.brandId === b.id);
      const hasHats = hats.length > 0;
      const n = hats.length || 1;
      const avgSales = hasHats ? Math.round(hats.reduce((s, h) => s + (h.sales || 0), 0) / n) : null;
      const avgHeat = hasHats ? Math.round(hats.reduce((s, h) => s + (h.heat?.score || 0), 0) / n) : null;
      const avgArt = hasHats ? Math.round(hats.reduce((s, h) => s + (h.artistry || 0), 0) / n) : null;
      return `
        <article class="brand-card">
          <div>
            <h2>${esc(b.name)}<span class="zh">${esc(b.nameZh)}</span></h2>
            <div class="where">${esc(b.country)} · ${esc(b.city)} · 创立于 ${esc(b.founded)} · ${esc(b.founder)}</div>
          </div>
          <p>${esc(b.description)}</p>
          <div class="rt-sub">${hasHats ? `已收录 ${hats.length} 款有图帽饰 · 均销量 ${avgSales} · 均热度 ${avgHeat} · 均艺术性 ${avgArt}` : `暂无公开可直链官图（暂不列入图鉴，待周末更新补图）`}</div>
          <ul class="channels">
            ${b.channels.map(ch => `
              <li>
                <span class="ch-type">${esc(ch.type)}</span>
                <div>
                  <div>${ch.url ? `<a href="${esc(ch.url)}" target="_blank" rel="noopener">${esc(ch.name)} ↗</a>` : esc(ch.name)} <span class="ch-note">· ${esc(ch.region)}</span></div>
                  <div class="ch-note">${esc(ch.note)}</div>
                </div>
              </li>`).join("")}
          </ul>
          <div class="brand-actions">
            ${hasHats ? `<button class="btn" data-jump-brand="${esc(b.id)}">查看该品牌 ${hats.length} 款帽子</button>` : ""}
            ${b.website ? `<a class="btn ghost" href="${esc(b.website)}" target="_blank" rel="noopener">访问官网/店铺 ↗</a>` : ""}
          </div>
        </article>`;
    }).join("");
  }

  function openModal(hatId) {
    const h = DATA.hats.find(x => x.id === hatId);
    if (!h) return;
    const b = brandMap[h.brandId];
    const celebs = h.heat?.celebrities || [];
    $("#modal-body").innerHTML = `
      <div class="m-img">${thumbHtml(h)}</div>
      <div class="m-info">
        <div>
          <div class="card-brand">${esc(b.name)} · ${esc(b.country)} ${esc(b.city)}</div>
          <h2 id="m-title">${esc(h.name)}</h2>
        </div>
        <p style="margin:0;color:var(--ink-2)">${esc(h.description)}</p>
        <dl class="m-kv">
          <dt>类别</dt><dd><span class="badge">${esc(h.category)}</span></dd>
          <dt>年份</dt><dd>${esc(h.year || "—")}</dd>
          <dt>系列</dt><dd>${esc(h.collection || "—")}</dd>
          <dt>材质工艺</dt><dd>${esc(h.material || "—")}</dd>
          <dt>参考价</dt><dd>${esc(fmtPrice(h))}${h.priceNote ? ` <span class="rt-sub">（${esc(h.priceNote)}）</span>` : ""}</dd>
          ${h.heat?.runway ? `<dt>秀场/展览</dt><dd>${esc(h.heat.runway)}</dd>` : ""}
        </dl>

        <div class="m-sec">
          <h4>销量 / 热度 / 艺术性评估</h4>
          <div class="hbar"><span>销量指数</span><div class="bar"><i style="width:${h.sales}%"></i></div><span class="num">${h.sales} / 100</span></div>
          <div class="rt-sub" style="margin-bottom:6px">${esc(h.salesNote || "")}</div>
          <div class="hbar"><span>热度评分</span><div class="bar"><i style="width:${h.heat?.score ?? 0}%"></i></div><span class="num">${h.heat?.score ?? 0} / 100</span></div>
          <div class="rt-sub" style="margin-bottom:6px">${esc(h.heat?.evidence || "")}</div>
          <div class="hbar"><span>艺术性分</span><div class="bar"><i style="width:${h.artistry}%"></i></div><span class="num">${h.artistry} / 100</span></div>
          <div class="rt-sub">${esc(h.artistryNote || "")}</div>
          ${celebs.length ? `<div class="celebs" style="margin-top:8px">${celebs.map(c => `<span class="badge">佩戴：${esc(c)}</span>`).join("")}</div>` : ""}
        </div>

        <div class="m-sec">
          <h4>购买途径与原始页面</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">
            ${h.productUrl ? `<a class="btn" href="${esc(h.productUrl)}" target="_blank" rel="noopener">前往商品/详情页 ↗</a>` : ""}
            ${b.website ? `<a class="btn ghost" href="${esc(b.website)}" target="_blank" rel="noopener">品牌官网/店铺 ↗</a>` : ""}
          </div>
          <ul class="channels">
            ${b.channels.map(ch => `
              <li>
                <span class="ch-type">${esc(ch.type)}</span>
                <div>
                  <div>${ch.url ? `<a href="${esc(ch.url)}" target="_blank" rel="noopener">${esc(ch.name)} ↗</a>` : esc(ch.name)}</div>
                  <div class="ch-note">${esc(ch.region)} · ${esc(ch.note)}</div>
                </div>
              </li>`).join("")}
          </ul>
        </div>

        <div class="m-sec m-src">
          <h4>图片与信息来源</h4>
          ${h.imageSource ? `<div>图片出处：<a href="${esc(h.imageSource)}" target="_blank" rel="noopener">${esc(h.imageSource)}</a></div>` : ""}
          ${(h.sources || []).map(u => `<div>参考链接：<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a></div>`).join("")}
        </div>
      </div>`;
    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    $("#modal").hidden = true;
    document.body.style.overflow = "";
  }

  function switchView(view) {
    state.view = view;
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === view));
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + view));
    if (view === "gallery") renderGallery();
    if (view === "rank") renderRank();
    if (view === "brands") renderBrands();
  }

  $("#tabs").addEventListener("click", e => {
    const btn = e.target.closest("[data-view]");
    if (btn) switchView(btn.dataset.view);
  });

  $("#rank-switch").addEventListener("click", e => {
    const btn = e.target.closest("[data-rank]");
    if (!btn) return;
    state.rankTab = btn.dataset.rank;
    document.querySelectorAll("#rank-switch .chip").forEach(c => c.classList.toggle("active", c === btn));
    renderRank();
  });

  $("#q").addEventListener("input", e => { state.q = e.target.value; renderGallery(); });
  $("#f-brand").addEventListener("change", e => { state.brand = e.target.value; renderGallery(); });
  $("#f-cat").addEventListener("change", e => { state.cat = e.target.value; renderGallery(); });
  $("#f-sort").addEventListener("change", e => { state.sort = e.target.value; renderGallery(); });

  document.addEventListener("click", e => {
    const hatEl = e.target.closest("[data-hat]");
    if (hatEl) { openModal(hatEl.dataset.hat); return; }
    const jump = e.target.closest("[data-jump-brand]");
    if (jump) {
      state.brand = jump.dataset.jumpBrand;
      $("#f-brand").value = state.brand;
      switchView("gallery");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (e.target.closest("[data-close]")) closeModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("#modal").hidden) closeModal();
  });

  initMeta();
  renderGallery();
})();
