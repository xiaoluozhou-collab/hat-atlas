(function () {
  const DATA = window.HAT_ATLAS;
  if (!DATA) return;

  // Enforce strict A-Z brand ordering & image-only gallery rule ("图鉴里的必须有图")
  const brandsAZ = [...DATA.brands].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  const brandMap = Object.fromEntries(brandsAZ.map(b => [b.id, b]));
  const imagedHats = DATA.hats.filter(h => typeof h.image === "string" && h.image.trim().length > 0);
  const hatMap = Object.fromEntries(imagedHats.map(h => [h.id, h]));
  const FX = DATA.fx;
  const CURRENCY_SYM = { CNY: "¥", USD: "$", EUR: "€", GBP: "£" };

  const STORAGE_SAVED = "hat_atlas_creations_v1";
  const STORAGE_API = "hat_atlas_api_v1";

  const STYLE_EN = {
    "亚文化解构": "avant-garde subculture deconstructed asymmetric structure, rebellious underground fashion",
    "赛博金属未来感": "cyberpunk futuristic liquid chrome metallic accents, iridescent translucent trim",
    "暗黑哥特蕾丝": "dark gothic romantic black lace veil, dramatic shadow silhouette",
    "高定雕塑花艺": "haute couture 3D sculptural silk floral petals, dramatic volume",
    "东方非遗夏布手作": "traditional Chinese handwoven ramie grasscloth, artisanal heritage embroidery and bamboo weave",
    "极简建筑雕塑": "minimalist architectural geometric sculpture, clean razor-sharp felt folds",
    "超现实波普": "surrealist pop art whimsical bold color blocking, museum-grade statement headwear",
    "复古好莱坞浪漫": "vintage old-Hollywood cinema glamour, sweeping brim and silk satin ribbon"
  };

  const CAT_EN = {
    "亚文化": "avant-garde subculture sculptural headpiece",
    "秀场艺术帽": "haute couture runway sculptural art hat",
    "礼帽": "structured wide-brim couture hat",
    "软呢帽": "hand-blocked luxury felt fedora",
    "贝雷帽": "sculpted couture beret",
    "草帽": "architectural woven straw hat",
    "渔夫帽": "designer structured bucket hat",
    "针织帽": "textured designer knit beanie",
    "鸡尾酒帽/发饰": "sculptural cocktail fascinator headpiece",
    "其他": "bespoke designer cap"
  };

  const ZH_EN_DICT = [
    ["赛博", "cyberpunk"], ["金属", "metallic chrome"], ["银色", "silver"], ["金色", "gold"],
    ["黑色", "obsidian black"], ["白色", "ivory white"], ["红色", "crimson red"], ["酒红", "oxblood burgundy"],
    ["粉色", "blush pink"], ["蓝色", "cobalt blue"], ["雾霾蓝", "misty slate blue"], ["绿色", "emerald green"],
    ["紫色", "deep violet"], ["蕾丝", "delicate lace"], ["面纱", "sheer veil"], ["羽毛", "sculpted feathers"],
    ["珍珠", "luminous pearls"], ["蝴蝶结", "oversized silk bow"], ["花朵", "3D silk florals"], ["玫瑰", "couture roses"],
    ["链条", "silver chains"], ["铆钉", "punk studs"], ["漆皮", "glossy patent leather"], ["皮革", "fine leather"],
    ["丝绒", "plush velvet"], ["羊毛毡", "sculpted wool felt"], ["草编", "woven natural straw"], ["透明", "translucent acrylic"],
    ["光环", "floating halo"], ["宽檐", "dramatic wide brim"], ["解构", "deconstructed"], ["哥特", "gothic"],
    ["东方", "oriental artisanal"], ["刺绣", "intricate embroidery"], ["褶皱", "pleated sculptural folds"],
    ["火焰", "torched distressed"], ["未来", "futuristic"], ["暗黑", "dark avant-garde"], ["极简", "minimalist"]
  ];

  const state = {
    view: "gallery",
    rankTab: "sales",
    q: "",
    brand: "",
    cat: "",
    sort: "sales",
    selectedIds: [],
    styles: [],
    currentCreation: null,
    savedCreations: loadJson(STORAGE_SAVED, [])
  };

  const $ = sel => document.querySelector(sel);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

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
    const fb = `<div class="fallback" style="position:absolute;inset:0;z-index:0"><div><div class="mono">${esc(monogram(hat.name))}</div><small>${esc(brand.name)} · ${esc(hat.category)}</small></div></div>`;
    if (!hat.image) return `${fb}${extraBadge}`;
    return `${fb}<img src="${esc(hat.image)}" alt="${esc(hat.name)}" referrerpolicy="no-referrer" style="position:absolute;inset:0;z-index:1;width:100%;height:100%;object-fit:cover;display:block" onload="this.previousElementSibling&&this.previousElementSibling.remove()" onerror="this.remove()" />${extraBadge}`;
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

    // Restore optional API config
    const savedApi = loadJson(STORAGE_API, {});
    if (savedApi.endpoint) $("#api-endpoint").value = savedApi.endpoint;
    if (savedApi.key) $("#api-key").value = savedApi.key;
    if (savedApi.model) $("#api-model").value = savedApi.model;
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
      const isSel = state.selectedIds.includes(h.id);
      const catBadge = `<span class="badge">${esc(h.category)}</span>`;
      const mainScore = state.sort === "sales" ? h.sales : state.sort === "artistry" ? h.artistry : (h.heat?.score ?? 0);
      const pill = `<span class="heat-pill">${metricLabel} ${mainScore}</span>`;
      return `
        <div class="card ${isSel ? "selected" : ""}" data-hat="${esc(h.id)}" role="button" tabindex="0">
          <div class="thumb">${thumbHtml(h, catBadge + pill)}</div>
          <div class="card-body">
            <div class="card-brand">${esc(b.name)} · ${esc(h.year || "")}</div>
            <div class="card-name">${esc(h.name)}</div>
            <div class="card-meta">
              <span>销 ${h.sales} · 热 ${h.heat?.score ?? 0} · 艺 ${h.artistry}</span>
              <button type="button" class="pick-btn ${isSel ? "on" : ""}" data-pick="${esc(h.id)}">${isSel ? "✓ 已选" : "+ 选入二创"}</button>
            </div>
          </div>
        </div>`;
    }).join("");
  }

  /* ==================== Selection & Studio ==================== */
  function togglePick(hatId) {
    if (!hatMap[hatId]) return;
    const idx = state.selectedIds.indexOf(hatId);
    if (idx >= 0) {
      state.selectedIds.splice(idx, 1);
    } else {
      if (state.selectedIds.length >= 3) {
        alert("最多同时选中 3 顶帽子进行融合创作，请先取消其中 1 顶。");
        return;
      }
      state.selectedIds.push(hatId);
    }
    syncSelectionUI();
  }

  function syncSelectionUI() {
    const n = state.selectedIds.length;
    const badge = $("#studio-count");
    badge.textContent = String(n);
    badge.hidden = n === 0;

    // Floating dock (hidden while inside studio view)
    const dock = $("#fusion-dock");
    if (n > 0 && state.view !== "studio") {
      dock.hidden = false;
      $("#dock-thumbs").innerHTML = state.selectedIds.map(id => {
        const h = hatMap[id];
        return `<span class="dock-chip"><img src="${esc(h.image)}" alt="" referrerpolicy="no-referrer" /><span>${esc(h.name)}</span><button type="button" data-unpick="${esc(id)}" aria-label="移除">×</button></span>`;
      }).join("");
      $("#dock-go").textContent = n === 1 ? "进入单帽文字二创 →" : `进入 ${n} 帽融合创作 →`;
    } else {
      dock.hidden = true;
    }

    if (state.view === "gallery") renderGallery();
    if (state.view === "studio") renderStudioSlots();
  }

  function renderStudioSlots() {
    const n = state.selectedIds.length;
    $("#sel-num").textContent = String(n);
    const pill = $("#studio-mode-pill");
    if (n === 0) {
      pill.textContent = "请先选择 1–3 顶帽子";
      pill.className = "badge";
    } else if (n === 1) {
      pill.textContent = "当前模式：单帽文字二创";
      pill.className = "badge on";
    } else {
      pill.textContent = `当前模式：${n} 帽创意融合`;
      pill.className = "badge on";
    }

    const slots = [];
    for (let i = 0; i < 3; i++) {
      const id = state.selectedIds[i];
      if (id && hatMap[id]) {
        const h = hatMap[id];
        const b = brandMap[h.brandId];
        slots.push(`
          <div class="slot-card">
            <div class="slot-thumb">
              <span class="slot-idx">#${i + 1}</span>
              <button type="button" class="slot-rm" data-unpick="${esc(id)}" aria-label="移除">×</button>
              <img src="${esc(h.image)}" alt="${esc(h.name)}" referrerpolicy="no-referrer" />
            </div>
            <div class="slot-info">
              <div class="s-brand">${esc(b.name)}</div>
              <div class="s-name">${esc(h.name)}</div>
            </div>
          </div>`);
      } else {
        slots.push(`
          <button type="button" class="slot-card empty-slot" data-goto-gallery="1">
            <div style="font-size:20px;margin-bottom:4px">+</div>
            <div>灵感槽位 #${i + 1}</div>
            <div style="font-size:11px;margin-top:2px;opacity:.75">${i === 0 ? "必选：去图鉴挑选" : "可选：再选 1 顶融合"}</div>
          </button>`);
      }
    }
    $("#studio-slots").innerHTML = slots.join("");
    renderSavedCreations();
  }

  function translateKeywordsToEn(text) {
    if (!text) return "";
    const hits = [];
    for (const [zh, en] of ZH_EN_DICT) {
      if (text.includes(zh)) hits.push(en);
    }
    // Keep any Latin/English words typed by user directly
    const latin = text.match(/[A-Za-z0-9][A-Za-z0-9\s\-]{1,40}/g);
    if (latin) hits.push(...latin.map(s => s.trim()));
    return [...new Set(hits)].join(", ");
  }

  function buildDesignBrief(hats, userPrompt, styles) {
    const mode = hats.length === 1 ? "单帽文字二创" : hats.length === 2 ? "双帽基因融合" : "三帽跨界融合";
    const brands = hats.map(h => brandMap[h.brandId]);
    const cleanPrompt = userPrompt.trim();

    // Generate creative title
    const stylePrefix = styles[0] ? styles[0].slice(0, 4) : (hats.length === 1 ? "重塑" : "融生");
    const coreCat = hats[0].category === "亚文化" ? "亚文化雕塑帽" : hats[0].category;
    const shortNames = hats.map(h => h.name.split(/[\s(（]+/)[0]).slice(0, 3).join(" × ");
    const zhTitle = hats.length === 1
      ? `《${stylePrefix}·${hats[0].name}》二创概念款`
      : `《${stylePrefix}·${shortNames}》${hats.length}帽融合概念款`;
    const enTitle = hats.length === 1
      ? `Reimagined ${hats[0].name} — Atelier Remix`
      : `${brands.map(b => b.name.split(" ")[0]).join(" × ")} Fusion Edition`;

    // Build detailed Chinese description
    const styleDesc = styles.length ? `整体注入「${styles.join("」「")}」视觉方向，` : "";
    const userDesc = cleanPrompt
      ? `并严格结合你的创意指令——“${cleanPrompt}”进行细节再造。`
      : "在保留原作标志性辨识度的同时，强化立体雕塑光影与当代先锋佩戴张力。";

    let narrative = "";
    if (hats.length === 1) {
      narrative = `本作品以 ${brands[0].name}（${brands[0].country}）的「${hats[0].name}」为原型骨架，延续其${hats[0].category}基因与「${hats[0].material}」工艺语言；${styleDesc}${userDesc}新造型在帽冠比例与表面肌理上实现突破，呈现出既具原作血统又焕然一新的独立设计师单品气质。`;
    } else if (hats.length === 2) {
      narrative = `本作品将 ${brands[0].name}「${hats[0].name}」的主体轮廓与 ${brands[1].name}「${hats[1].name}」的标志性材质及装饰语汇深度融合。${styleDesc}${userDesc}两者的跨地域工艺在帽檐转折与顶冠层次处自然咬合，形成兼具视觉张力与可佩戴性的全新融合帽饰。`;
    } else {
      narrative = `本作品横跨 ${brands.map(b => b.name).join("、")} 三家帽坊的标志性基因：以「${hats[0].name}」定调核心轮廓，融入「${hats[1].name}」的结构张力，并以「${hats[2].name}」的材质细节收尾点睛。${styleDesc}${userDesc}三股美学脉络在光影与比例中达成微妙平衡，呈现秀场级概念新作。`;
    }

    // Breakdown per hat + user prompt
    const roles = ["主体廓形与比例骨架", "核心肌理与结构细节", "点睛装饰与风格气场"];
    const breakdown = hats.map((h, i) => {
      const b = brandMap[h.brandId];
      return `<strong>灵感 #${i + 1} · ${esc(b.name)}「${esc(h.name)}」</strong>：贡献${roles[i]}（${esc(h.category)} · ${esc(h.material)}）。`;
    });
    if (styles.length) {
      breakdown.push(`<strong>风格叠加强化</strong>：融合 ${styles.map(s => `「${esc(s)}」`).join("、")} 美学特征。`);
    }
    if (cleanPrompt) {
      breakdown.push(`<strong>你的二创文字指令</strong>：${esc(cleanPrompt)}`);
    }

    // Material & craft spec
    const craftParts = [...new Set(hats.map(h => h.material).filter(Boolean))];
    if (styles.includes("赛博金属未来感")) craftParts.push("电镀液态银丝 / 半透明复合薄膜");
    if (styles.includes("暗黑哥特蕾丝")) craftParts.push("法式手工黑蕾丝面纱");
    if (styles.includes("东方非遗夏布手作")) craftParts.push("手工夏布织物与传统木模蒸汽定型");
    const craftNote = `建议采用「${craftParts.slice(0, 3).join(" + ")}」复合工艺，配合手工木模定型与隐形内衬配重，确保复杂轮廓依然轻盈贴合头围。`;

    // Estimated 3D scores
    const avgSales = Math.round(hats.reduce((s, h) => s + (h.sales || 60), 0) / hats.length);
    const avgHeat = Math.round(hats.reduce((s, h) => s + (h.heat?.score || 75), 0) / hats.length);
    const avgArt = Math.round(hats.reduce((s, h) => s + (h.artistry || 82), 0) / hats.length);
    const estSales = Math.min(96, Math.max(35, avgSales + (hats.length === 1 ? 4 : -4)));
    const estHeat = Math.min(99, avgHeat + (hats.length > 1 ? 6 : 4) + (styles.length ? 3 : 0));
    const estArt = Math.min(99, avgArt + (hats.length > 1 ? 7 : 5) + (cleanPrompt ? 3 : 0));

    // Build vivid English prompt for AI image generation
    const hatFragments = hats.map((h, i) => {
      const b = brandMap[h.brandId];
      const catEn = CAT_EN[h.category] || "designer couture hat";
      const matEn = translateKeywordsToEn(h.material || "");
      return `${i === 0 ? "primary silhouette inspired by" : "fused with elements of"} ${b.name} ${h.name} (${catEn}${matEn ? ", " + matEn : ""})`;
    }).join("; ");
    const styleEn = styles.map(s => STYLE_EN[s]).filter(Boolean).join(", ");
    const userEn = translateKeywordsToEn(cleanPrompt);

    const aiPrompt = [
      "Haute couture millinery studio product photography of ONE single newly designed avant-garde hat on a clean minimalist mannequin bust",
      hatFragments,
      styleEn ? `aesthetic direction: ${styleEn}` : "",
      userEn ? `custom creative modifications: ${userEn}` : "",
      "museum editorial gallery lighting, warm ivory seamless background, ultra crisp craftsmanship textile details, sharp focus, fashion lookbook, no text, no watermark"
    ].filter(Boolean).join(". ");

    return {
      mode,
      zhTitle,
      enTitle,
      coreCat,
      narrative,
      breakdown,
      craftNote,
      estSales,
      estHeat,
      estArt,
      aiPrompt,
      userPrompt: cleanPrompt,
      styles: [...styles],
      sourceIds: hats.map(h => h.id)
    };
  }

  function renderFallbackConceptCanvas(canvas, brief) {
    const w = 768, h = 960;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#f5efe6");
    grad.addColorStop(0.55, "#ead9d4");
    grad.addColorStop(1, "#dfd3c3");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle editorial frame
    ctx.strokeStyle = "rgba(124, 39, 54, 0.25)";
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    // Abstract sculptural hat silhouette
    ctx.save();
    ctx.translate(w / 2, h * 0.44);
    ctx.fillStyle = "rgba(38, 30, 28, 0.88)";
    ctx.beginPath();
    ctx.ellipse(0, 75, 250, 44, -0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(124, 39, 54, 0.9)";
    ctx.beginPath();
    ctx.moveTo(-125, 65);
    ctx.bezierCurveTo(-135, -95, 115, -135, 130, 65);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#d9b47a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 48, 128, 22, -0.04, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#7c2736";
    ctx.font = "600 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(brief.mode + " · 概念视觉板", w / 2, 108);

    ctx.fillStyle = "#261e1c";
    ctx.font = "700 30px serif";
    ctx.fillText(brief.zhTitle.slice(0, 22), w / 2, h - 140);
    ctx.fillStyle = "#6b5d57";
    ctx.font = "18px sans-serif";
    ctx.fillText("（当前网络受限，已生成本地概念视觉板，可点击「换一版构图」重试云端 AI 绘图）", w / 2, h - 88);
  }

  async function generateImageForBrief(brief, seed) {
    const endpoint = ($("#api-endpoint").value || "").trim();
    const apiKey = ($("#api-key").value || "").trim();
    const model = ($("#api-model").value || "dall-e-3").trim();

    saveJson(STORAGE_API, { endpoint, key: apiKey, model });

    if (endpoint && apiKey) {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          prompt: brief.aiPrompt,
          size: "1024x1024",
          n: 1
        })
      });
      if (!resp.ok) throw new Error("自定义图像接口返回 HTTP " + resp.status);
      const data = await resp.json();
      const item = data.data && data.data[0];
      if (item?.url) return item.url;
      if (item?.b64_json) return "data:image/png;base64," + item.b64_json;
      throw new Error("接口未返回有效图片字段");
    }

    // Default zero-config AI image endpoint (Pollinations Flux)
    const encoded = encodeURIComponent(brief.aiPrompt);
    return `https://image.pollinations.ai/prompt/${encoded}?width=768&height=960&seed=${seed}&nologo=true&model=flux`;
  }

  async function runGeneration(customSeed) {
    const hats = state.selectedIds.map(id => hatMap[id]).filter(Boolean);
    if (!hats.length) {
      alert("请先选择 1–3 顶帽子（可点击右上角「+ 去图鉴选帽」或「🎲 随机融合」）。");
      return;
    }
    const userPrompt = $("#studio-prompt").value || "";
    if (hats.length === 1 && !userPrompt.trim() && !state.styles.length) {
      alert("单帽二创请至少输入一段二创文字说明，或选择 1 个风格方向标签。");
      $("#studio-prompt").focus();
      return;
    }

    const seed = customSeed || Math.floor(Math.random() * 999999);
    const brief = buildDesignBrief(hats, userPrompt, state.styles);
    const genBtn = $("#btn-generate");
    genBtn.disabled = true;
    genBtn.textContent = "⏳ 正在生成全新帽款图片…";
    $("#btn-reroll").hidden = false;

    const resultEl = $("#studio-result");
    resultEl.innerHTML = `
      <div class="gen-stage" id="gen-stage">
        <div class="gen-loading" id="gen-loading">
          <div class="spinner"></div>
          <div><b>正在绘制全新帽款视觉图…</b></div>
          <div class="rt-sub">AI 正在融合参考帽型与你的创意描述，通常需要 5–15 秒</div>
        </div>
      </div>
      <div class="gen-actions">
        <button type="button" class="btn sm" id="btn-save-creation">💾 保存到我的作品集</button>
        <button type="button" class="btn ghost sm" id="btn-copy-prompt">📋 复制英文 Prompt</button>
        <a class="btn ghost sm" id="btn-open-img" href="#" target="_blank" rel="noopener" hidden>↗ 查看高清大图</a>
      </div>
      <div style="margin-bottom:8px"><span class="badge on">${esc(brief.mode)}</span> <span class="badge">${esc(brief.coreCat)}</span></div>
      <h3 class="gen-title">${esc(brief.zhTitle)}</h3>
      <div class="gen-en">${esc(brief.enTitle)}</div>
      <p class="gen-desc">${esc(brief.narrative)}</p>

      <div class="gen-box">
        <h4>创意融合与二创元素拆解</h4>
        <ul class="gen-list">
          ${brief.breakdown.map(line => `<li>${line}</li>`).join("")}
        </ul>
      </div>

      <div class="gen-box">
        <h4>推荐材质与手作工艺方案</h4>
        <div style="color:var(--ink-2)">${esc(brief.craftNote)}</div>
      </div>

      <div class="gen-box">
        <h4>新作三维潜力预估</h4>
        <div class="hbar"><span>销量潜力</span><div class="bar"><i style="width:${brief.estSales}%"></i></div><span class="num">${brief.estSales} / 100</span></div>
        <div class="hbar"><span>话题热度</span><div class="bar"><i style="width:${brief.estHeat}%"></i></div><span class="num">${brief.estHeat} / 100</span></div>
        <div class="hbar"><span>艺术性分</span><div class="bar"><i style="width:${brief.estArt}%"></i></div><span class="num">${brief.estArt} / 100</span></div>
      </div>

      <div class="gen-box">
        <h4>AI 图像生成提示词（Prompt）</h4>
        <div class="gen-prompt-code" id="gen-prompt-text">${esc(brief.aiPrompt)}</div>
      </div>`;

    try {
      const imgUrl = await generateImageForBrief(brief, seed);
      const stage = $("#gen-stage");
      const img = document.createElement("img");
      img.alt = brief.zhTitle;
      img.referrerPolicy = "no-referrer";
      let triedTurbo = false;

      img.onload = () => {
        const loader = $("#gen-loading");
        if (loader) loader.remove();
        const openBtn = $("#btn-open-img");
        if (openBtn) { openBtn.href = img.src; openBtn.hidden = false; }
        state.currentCreation = {
          id: "cr-" + Date.now(),
          createdAt: new Date().toISOString().slice(0, 10),
          image: img.src,
          brief
        };
        genBtn.disabled = false;
        genBtn.textContent = "✨ 生成二创新图与设计说明";
      };

      img.onerror = () => {
        if (!triedTurbo && img.src.includes("model=flux")) {
          triedTurbo = true;
          img.src = img.src.replace("model=flux", "model=turbo");
          return;
        }
        // Fallback to local concept board canvas so user never sees a broken frame
        img.remove();
        const loader = $("#gen-loading");
        if (loader) loader.remove();
        const canvas = document.createElement("canvas");
        renderFallbackConceptCanvas(canvas, brief);
        stage.appendChild(canvas);
        const dataUrl = canvas.toDataURL("image/png");
        state.currentCreation = {
          id: "cr-" + Date.now(),
          createdAt: new Date().toISOString().slice(0, 10),
          image: dataUrl,
          brief
        };
        genBtn.disabled = false;
        genBtn.textContent = "✨ 生成二创新图与设计说明";
      };

      stage.appendChild(img);
      img.src = imgUrl;
    } catch (err) {
      const loader = $("#gen-loading");
      if (loader) loader.innerHTML = `<div style="color:var(--accent)"><b>生成失败</b></div><div class="rt-sub">${esc(err.message || err)}</div>`;
      genBtn.disabled = false;
      genBtn.textContent = "✨ 生成二创新图与设计说明";
    }
  }

  function renderSavedCreations() {
    const sec = $("#saved-section");
    const list = state.savedCreations;
    if (!list.length) {
      sec.hidden = true;
      return;
    }
    sec.hidden = false;
    $("#saved-num").textContent = String(list.length);
    $("#saved-grid").innerHTML = list.map(c => `
      <div class="saved-card">
        <div class="s-img" data-open-creation="${esc(c.id)}">
          <img src="${esc(c.image)}" alt="${esc(c.brief.zhTitle)}" referrerpolicy="no-referrer" />
        </div>
        <div class="s-body">
          <div class="rt-sub">${esc(c.brief.mode)} · ${esc(c.createdAt)}</div>
          <div class="s-title">${esc(c.brief.zhTitle)}</div>
          <div class="rt-sub" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(c.brief.narrative)}</div>
          <div style="display:flex;gap:6px;margin-top:4px">
            <button type="button" class="btn ghost sm" data-open-creation="${esc(c.id)}">查看</button>
            <button type="button" class="btn ghost sm" data-del-creation="${esc(c.id)}">删除</button>
          </div>
        </div>
      </div>`).join("");
  }

  function showSavedCreation(id) {
    const c = state.savedCreations.find(x => x.id === id);
    if (!c) return;
    state.currentCreation = c;
    const brief = c.brief;
    $("#studio-result").innerHTML = `
      <div class="gen-stage">
        <img src="${esc(c.image)}" alt="${esc(brief.zhTitle)}" referrerpolicy="no-referrer" />
      </div>
      <div class="gen-actions">
        <a class="btn sm" href="${esc(c.image)}" target="_blank" rel="noopener">↗ 查看高清大图</a>
        <button type="button" class="btn ghost sm" id="btn-copy-prompt">📋 复制英文 Prompt</button>
      </div>
      <div style="margin-bottom:8px"><span class="badge on">${esc(brief.mode)}</span> <span class="badge">${esc(c.createdAt)}</span></div>
      <h3 class="gen-title">${esc(brief.zhTitle)}</h3>
      <div class="gen-en">${esc(brief.enTitle)}</div>
      <p class="gen-desc">${esc(brief.narrative)}</p>
      <div class="gen-box">
        <h4>创意融合与二创元素拆解</h4>
        <ul class="gen-list">${brief.breakdown.map(line => `<li>${line}</li>`).join("")}</ul>
      </div>
      <div class="gen-box">
        <h4>推荐材质与手作工艺方案</h4>
        <div style="color:var(--ink-2)">${esc(brief.craftNote)}</div>
      </div>
      <div class="gen-box">
        <h4>AI 图像生成提示词（Prompt）</h4>
        <div class="gen-prompt-code" id="gen-prompt-text">${esc(brief.aiPrompt)}</div>
      </div>`;
    $("#studio-result").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ==================== Rankings & Brands ==================== */
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
      body.innerHTML = renderRankTable([...imagedHats].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 30), "sales");
    } else if (state.rankTab === "heat") {
      body.innerHTML = renderRankTable([...imagedHats].sort((a, b) => (b.heat?.score || 0) - (a.heat?.score || 0)).slice(0, 30), "heat");
    } else if (state.rankTab === "artistry") {
      body.innerHTML = renderRankTable([...imagedHats].sort((a, b) => (b.artistry || 0) - (a.artistry || 0)).slice(0, 30), "artistry");
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
    const h = hatMap[hatId];
    if (!h) return;
    const b = brandMap[h.brandId];
    const celebs = h.heat?.celebrities || [];
    const isSel = state.selectedIds.includes(h.id);
    $("#modal-body").innerHTML = `
      <div class="m-img">${thumbHtml(h)}</div>
      <div class="m-info">
        <div>
          <div class="card-brand">${esc(b.name)} · ${esc(b.country)} ${esc(b.city)}</div>
          <h2 id="m-title">${esc(h.name)}</h2>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <button type="button" class="btn sm" data-modal-pick="${esc(h.id)}">${isSel ? "✓ 已选入创意融合" : "✨ 选入二创 / 融合工坊"}</button>
          <button type="button" class="btn ghost sm" data-modal-go-studio="${esc(h.id)}">直接去二创 →</button>
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
            ${h.productUrl ? `<a class="btn sm" href="${esc(h.productUrl)}" target="_blank" rel="noopener">前往商品/详情页 ↗</a>` : ""}
            ${b.website ? `<a class="btn ghost sm" href="${esc(b.website)}" target="_blank" rel="noopener">品牌官网/店铺 ↗</a>` : ""}
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
    if (view === "studio") renderStudioSlots();
    if (view === "rank") renderRank();
    if (view === "brands") renderBrands();
    syncSelectionUI();
  }

  /* ==================== Events ==================== */
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

  $("#style-chips").addEventListener("click", e => {
    const chip = e.target.closest("[data-style]");
    if (!chip) return;
    const val = chip.dataset.style;
    const idx = state.styles.indexOf(val);
    if (idx >= 0) state.styles.splice(idx, 1);
    else state.styles.push(val);
    chip.classList.toggle("active", idx < 0);
  });

  $("#btn-pick-gallery").addEventListener("click", () => switchView("gallery"));
  $("#btn-clear-selected").addEventListener("click", () => { state.selectedIds = []; syncSelectionUI(); });
  $("#dock-clear").addEventListener("click", () => { state.selectedIds = []; syncSelectionUI(); });
  $("#dock-go").addEventListener("click", () => { switchView("studio"); window.scrollTo({ top: 0, behavior: "smooth" }); });

  $("#btn-random-fusion").addEventListener("click", () => {
    const pool = [...imagedHats].sort(() => Math.random() - 0.5);
    const chosen = [];
    const seenBrands = new Set();
    for (const h of pool) {
      if (!seenBrands.has(h.brandId)) {
        chosen.push(h.id);
        seenBrands.add(h.brandId);
      }
      if (chosen.length === 2) break;
    }
    state.selectedIds = chosen;
    syncSelectionUI();
  });

  $("#btn-generate").addEventListener("click", () => runGeneration());
  $("#btn-reroll").addEventListener("click", () => runGeneration());

  $("#q").addEventListener("input", e => { state.q = e.target.value; renderGallery(); });
  $("#f-brand").addEventListener("change", e => { state.brand = e.target.value; renderGallery(); });
  $("#f-cat").addEventListener("change", e => { state.cat = e.target.value; renderGallery(); });
  $("#f-sort").addEventListener("change", e => { state.sort = e.target.value; renderGallery(); });

  document.addEventListener("click", e => {
    const pick = e.target.closest("[data-pick]");
    if (pick) {
      e.stopPropagation();
      togglePick(pick.dataset.pick);
      return;
    }
    const unpick = e.target.closest("[data-unpick]");
    if (unpick) {
      e.stopPropagation();
      togglePick(unpick.dataset.unpick);
      return;
    }
    const gotoGallery = e.target.closest("[data-goto-gallery]");
    if (gotoGallery) {
      switchView("gallery");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const modalPick = e.target.closest("[data-modal-pick]");
    if (modalPick) {
      togglePick(modalPick.dataset.modalPick);
      const isSel = state.selectedIds.includes(modalPick.dataset.modalPick);
      modalPick.textContent = isSel ? "✓ 已选入创意融合" : "✨ 选入二创 / 融合工坊";
      return;
    }
    const modalGo = e.target.closest("[data-modal-go-studio]");
    if (modalGo) {
      const id = modalGo.dataset.modalGoStudio;
      if (!state.selectedIds.includes(id)) togglePick(id);
      closeModal();
      switchView("studio");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (e.target.id === "btn-save-creation" && state.currentCreation) {
      if (!state.savedCreations.some(x => x.id === state.currentCreation.id)) {
        state.savedCreations.unshift(state.currentCreation);
        state.savedCreations = state.savedCreations.slice(0, 24);
        saveJson(STORAGE_SAVED, state.savedCreations);
        renderSavedCreations();
      }
      e.target.textContent = "✓ 已保存到作品集";
      return;
    }
    if (e.target.id === "btn-copy-prompt") {
      const txt = $("#gen-prompt-text")?.textContent || "";
      if (txt && navigator.clipboard) {
        navigator.clipboard.writeText(txt).then(() => { e.target.textContent = "✓ 已复制 Prompt"; });
      }
      return;
    }
    const openCr = e.target.closest("[data-open-creation]");
    if (openCr) { showSavedCreation(openCr.dataset.openCreation); return; }
    const delCr = e.target.closest("[data-del-creation]");
    if (delCr) {
      state.savedCreations = state.savedCreations.filter(x => x.id !== delCr.dataset.delCreation);
      saveJson(STORAGE_SAVED, state.savedCreations);
      renderSavedCreations();
      return;
    }

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
