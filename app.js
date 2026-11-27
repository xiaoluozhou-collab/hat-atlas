(function () {
  const DATA = window.HAT_ATLAS;
  if (!DATA) return;

  const brandsAZ = [...DATA.brands].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  const brandMap = Object.fromEntries(brandsAZ.map(b => [b.id, b]));
  const imagedHats = DATA.hats.filter(h => typeof h.image === "string" && h.image.trim().length > 0);
  const hatMap = Object.fromEntries(imagedHats.map(h => [h.id, h]));
  const FX = DATA.fx;
  const CURRENCY_SYM = { CNY: "¥", USD: "$", EUR: "€", GBP: "£" };

  const STORAGE_SAVED = "hat_atlas_creations_v1";
  const STORAGE_API = "hat_atlas_api_v1";
  const STORAGE_LANG = "hat_atlas_lang_v1";

  /* ==================== 4-Language Dictionary (ZH / EN / FR / IT) ==================== */
  const I18N = {
    zh: {
      html_lang: "zh-CN",
      site_title: "全球帽饰分析图鉴与创意融合",
      site_subtitle: "GLOBAL MILLINERY ARCHIVE & CREATIVE FUSION",
      topbar_meta: "高级手工帽饰档案馆 · 创意工坊",
      tab_gallery: "图鉴",
      tab_studio: "创意融合",
      tab_rank: "排行榜",
      tab_brands: "品牌与渠道",
      stat_brands: "家品牌（A–Z）",
      stat_hats: "款有图收录",
      stat_sub: "款亚文化",
      stat_heat: "均热度",
      stat_art: "均艺术性",
      stat_weekly: "每周末定时更新",
      search_ph: "搜索款式、名人、系列、材质…",
      all_brands: "全部品牌（A–Z）",
      all_cats: "全部类别",
      brand_cnt: n => `${n}款`,
      brand_pending: "待补图",
      sort_sales: "按销量",
      sort_heat: "按热度",
      sort_artistry: "按艺术性",
      sort_year_desc: "年份 新→旧",
      sort_year_asc: "年份 旧→新",
      result_count: (a, b) => `显示 ${a} / ${b} 款有图帽饰`,
      gallery_tip: "提示：点击卡片右下角 <b>+ 选入二创</b>，可选中 1 顶文字二创，或选中 2–3 顶融合生成新帽款",
      empty_gallery: "没有匹配的帽款，请调整筛选条件。",
      m_sales: "销量", m_heat: "热度", m_art: "艺术性",
      s_sales: "销", s_heat: "热", s_art: "艺",
      pick_add: "+ 选入二创",
      pick_on: "✓ 已选",
      max_pick_alert: "最多同时选中 3 顶帽子进行融合创作，请先取消其中 1 顶。",
      dock_go_1: "进入单帽文字二创 →",
      dock_go_n: n => `进入 ${n} 帽融合创作 →`,
      btn_clear: "清空",
      studio_title: "帽饰二创与融合工坊",
      studio_sub: "选中 1 顶帽子输入文字进行风格二创，或选中 2–3 顶帽子进行跨品牌基因融合，生成全新帽款图片与设计说明。",
      btn_pick_gallery: "+ 去图鉴选帽",
      btn_random_fusion: "随机融合",
      selected_hats: "已选参考帽款",
      mode_none: "请先选择 1–3 顶帽子",
      mode_1: "当前模式：单帽文字二创",
      mode_n: n => `当前模式：${n} 帽创意融合`,
      slot_label: i => `灵感槽位 #${i}`,
      slot_req: "必选：去图鉴挑选",
      slot_opt: "可选：再选 1 顶融合",
      style_dir: "风格方向（可多选叠加）",
      prompt_label: "二创 / 融合文字说明",
      prompt_hint: "可描述材质、配色、帽檐变化、装饰元素等",
      prompt_ph: "例如：保留第一顶的宽檐雕塑廓形，融入第二顶的暗黑蕾丝与流动银色金属丝，改成雾霾蓝与酒红撞色，增加半透明面纱细节…",
      btn_generate: "生成二创新图与设计说明",
      btn_generating: "正在生成全新帽款图片…",
      btn_reroll: "换一版构图",
      api_summary: "高级绘图引擎设置（默认免费免 Key 直接生成，可选填自有 OpenAI 兼容接口）",
      api_endpoint_label: "自定义 Endpoint（留空则使用默认免费 AI 绘图引擎）",
      api_key_label: "API Key（仅保存在本地浏览器，不上传）",
      api_model_label: "模型名称",
      ph_title: "等待创意生成",
      ph_desc: "在左侧选择 1 顶帽子输入二创文字，或选择 2–3 顶帽子融合创作，点击「生成二创新图与设计说明」后，这里将呈现全新帽款视觉图与完整设计解读。",
      gen_loading_title: "正在绘制全新帽款视觉图…",
      gen_loading_sub: "AI 正在融合参考帽型与你的创意描述，通常需要 5–15 秒",
      btn_save: "保存到我的作品集",
      btn_saved: "✓ 已保存到作品集",
      btn_copy_prompt: "复制英文 Prompt",
      btn_copied: "✓ 已复制 Prompt",
      btn_open_img: "查看高清大图 ↗",
      box_breakdown: "创意融合与二创元素拆解",
      box_craft: "推荐材质与手作工艺方案",
      box_est: "新作三维潜力预估",
      est_sales: "销量潜力", est_heat: "话题热度", est_art: "艺术性分",
      box_prompt: "AI 图像生成提示词（Prompt）",
      saved_title: "我的二创与融合作品集",
      btn_view: "查看", btn_del: "删除",
      need_hat_alert: "请先选择 1–3 顶帽子（可点击「+ 去图鉴选帽」或「随机融合」）。",
      need_prompt_alert: "单帽二创请至少输入一段二创文字说明，或选择 1 个风格方向标签。",
      rank_sales: "销量榜", rank_heat: "热度榜", rank_artistry: "艺术性榜", rank_brand: "品牌对比",
      rank_notice: "<strong>三大评估维度（0–100）：</strong><b>销量指数</b>综合公开电商销量区间、官网常青主推/多渠道铺货与补货频次估算（手工孤品与非商业展品分值较低）；<b>热度分</b>综合名人/王室佩戴、秀场与媒体曝光、站内热搜；<b>艺术性分</b>综合雕塑结构、手工工艺难度、亚文化/先锋原创度与博物馆典藏价值。",
      th_hat: "帽款 / 品牌", th_cat: "类别 / 年份", th_3d: "三维得分（销/热/艺）",
      th_sales: "销量指数", th_heat: "热度分", th_art: "艺术性分",
      th_sales_note: "销量依据", th_heat_note: "热度依据", th_art_note: "艺术性依据",
      bc_sales: "品牌平均销量指数（Top 20）",
      bc_heat: "品牌平均热度排行（Top 20）",
      bc_art: "品牌平均艺术性排行（Top 20）",
      pts: "分",
      founded: "创立于",
      brand_stats: (n, s, h, a) => `已收录 ${n} 款有图帽饰 · 均销量 ${s} · 均热度 ${h} · 均艺术性 ${a}`,
      brand_no_img: "暂无公开可直链官图（暂不列入图鉴，待周末更新补图）",
      brand_jump: n => `查看该品牌 ${n} 款帽子`,
      brand_web: "访问官网/店铺 ↗",
      modal_pick_on: "✓ 已选入创意融合",
      modal_pick_add: "选入二创 / 融合工坊",
      modal_go_studio: "直接去二创 →",
      kv_cat: "类别", kv_year: "年份", kv_col: "系列", kv_mat: "材质工艺", kv_price: "参考价", kv_runway: "秀场/展览",
      modal_eval: "销量 / 热度 / 艺术性评估",
      modal_buy: "购买途径与原始页面",
      modal_prod: "前往商品/详情页 ↗",
      modal_src: "图片与信息来源",
      src_img: "图片出处：", src_ref: "参考链接：",
      worn_by: "佩戴：",
      bespoke: "定制 / 非卖品",
      foot_copy: "图片版权归各品牌及原始来源所有，本平台仅存链接并标注出处；创意融合生成的新图与设计说明仅供灵感参考。",
      fx_note: (fx, d) => `汇率参考：1 USD≈¥${fx.USD} · 1 EUR≈¥${fx.EUR} · 1 GBP≈¥${fx.GBP}（数据日期 ${d}，每周末自动更新）`
    },
    en: {
      html_lang: "en",
      site_title: "GLOBAL MILLINERY ARCHIVE & CREATIVE FUSION",
      site_subtitle: "HAUTE MILLINERY · ANALYTICS · ATELIER REMIX",
      topbar_meta: "GLOBAL MILLINERY ARCHIVE & CREATIVE STUDIO",
      tab_gallery: "ARCHIVE",
      tab_studio: "FUSION STUDIO",
      tab_rank: "RANKINGS",
      tab_brands: "MAISONS",
      stat_brands: "MAISONS (A–Z)",
      stat_hats: "PHOTOGRAPHED PIECES",
      stat_sub: "SUBCULTURE",
      stat_heat: "AVG HEAT",
      stat_art: "AVG ARTISTRY",
      stat_weekly: "WEEKEND AUTO-SYNC",
      search_ph: "Search silhouette, maison, celebrity, material…",
      all_brands: "ALL MAISONS (A–Z)",
      all_cats: "ALL CATEGORIES",
      brand_cnt: n => `${n}`,
      brand_pending: "Pending",
      sort_sales: "SORT BY SALES",
      sort_heat: "SORT BY HEAT",
      sort_artistry: "SORT BY ARTISTRY",
      sort_year_desc: "YEAR NEW → OLD",
      sort_year_asc: "YEAR OLD → NEW",
      result_count: (a, b) => `SHOWING ${a} OF ${b} PHOTOGRAPHED HATS`,
      gallery_tip: "TIP: Click <b>+ SELECT</b> on any card to remix 1 hat with text or fuse 2–3 hats into a new creation",
      empty_gallery: "No matching millinery pieces found.",
      m_sales: "SALES", m_heat: "HEAT", m_art: "ARTISTRY",
      s_sales: "S", s_heat: "H", s_art: "A",
      pick_add: "+ SELECT",
      pick_on: "✓ SELECTED",
      max_pick_alert: "You can select up to 3 hats for fusion. Please remove one first.",
      dock_go_1: "REMIX THIS HAT →",
      dock_go_n: n => `FUSE ${n} HATS →`,
      btn_clear: "CLEAR",
      studio_title: "MILLINERY REMIX & FUSION STUDIO",
      studio_sub: "Select 1 hat to remix with custom text, or select 2–3 hats to fuse cross-maison silhouettes and generate a new image & design brief.",
      btn_pick_gallery: "+ BROWSE ARCHIVE",
      btn_random_fusion: "RANDOM FUSION",
      selected_hats: "SELECTED REFERENCES",
      mode_none: "SELECT 1–3 HATS",
      mode_1: "MODE: SINGLE-HAT TEXT REMIX",
      mode_n: n => `MODE: ${n}-HAT CREATIVE FUSION`,
      slot_label: i => `SLOT #${i}`,
      slot_req: "Required: Pick from Archive",
      slot_opt: "Optional: Add for Fusion",
      style_dir: "AESTHETIC DIRECTION (MULTI-SELECT)",
      prompt_label: "CREATIVE BRIEF / REMIX INSTRUCTIONS",
      prompt_hint: "Describe materials, palette, brim sculpture, embellishments…",
      prompt_ph: "e.g. Keep the sweeping architectural brim of #1, fuse the gothic black lace and liquid silver wire of #2, rendered in obsidian black and sheer ivory veil…",
      btn_generate: "GENERATE NEW CREATION & BRIEF",
      btn_generating: "GENERATING COUTURE VISUAL…",
      btn_reroll: "RE-ROLL COMPOSITION",
      api_summary: "Advanced Image Engine (Free zero-key AI enabled by default; optional OpenAI-compatible API)",
      api_endpoint_label: "Custom Endpoint (leave blank for built-in free AI)",
      api_key_label: "API Key (stored locally in browser only)",
      api_model_label: "Model Name",
      ph_title: "AWAITING CREATION",
      ph_desc: "Select 1 hat for text remixing or 2–3 hats for creative fusion on the left, then click Generate to produce a new hat visual and couture specification.",
      gen_loading_title: "CRAFTING NEW MILLINERY VISUAL…",
      gen_loading_sub: "Synthesizing silhouette, craftsmanship & prompt — typically 5–15 seconds",
      btn_save: "SAVE TO ATELIER",
      btn_saved: "✓ SAVED",
      btn_copy_prompt: "COPY PROMPT",
      btn_copied: "✓ COPIED",
      btn_open_img: "VIEW FULL IMAGE ↗",
      box_breakdown: "FUSION & REMIX GENEALOGY",
      box_craft: "RECOMMENDED MATERIALS & SAVOIR-FAIRE",
      box_est: "PROJECTED 3D INDEX",
      est_sales: "SALES INDEX", est_heat: "BUZZ / HEAT", est_art: "ARTISTRY",
      box_prompt: "AI GENERATION PROMPT",
      saved_title: "SAVED ATELIER CREATIONS",
      btn_view: "VIEW", btn_del: "DELETE",
      need_hat_alert: "Please select 1–3 hats first (Browse Archive or click Random Fusion).",
      need_prompt_alert: "For a single-hat remix, please enter text instructions or pick at least one style tag.",
      rank_sales: "TOP SALES", rank_heat: "TOP HEAT", rank_artistry: "TOP ARTISTRY", rank_brand: "MAISON INDEX",
      rank_notice: "<strong>Three Evaluation Dimensions (0–100):</strong> <b>Sales Index</b> estimates commercial volume & restock frequency (bespoke one-offs score lower); <b>Heat</b> tracks celebrity/royal wear, runway & press visibility; <b>Artistry</b> evaluates sculptural form, savoir-faire, subcultural originality & museum significance.",
      th_hat: "PIECE / MAISON", th_cat: "CATEGORY / YEAR", th_3d: "SCORES (S/H/A)",
      th_sales: "SALES", th_heat: "HEAT", th_art: "ARTISTRY",
      th_sales_note: "SALES BASIS", th_heat_note: "HEAT BASIS", th_art_note: "ARTISTRY BASIS",
      bc_sales: "AVG SALES INDEX (TOP 20)",
      bc_heat: "AVG HEAT SCORE (TOP 20)",
      bc_art: "AVG ARTISTRY SCORE (TOP 20)",
      pts: "pts",
      founded: "EST.",
      brand_stats: (n, s, h, a) => `${n} pieces · Avg Sales ${s} · Avg Heat ${h} · Avg Artistry ${a}`,
      brand_no_img: "No public direct image yet (excluded from visual archive)",
      brand_jump: n => `VIEW ${n} PIECES`,
      brand_web: "OFFICIAL SITE ↗",
      modal_pick_on: "✓ SELECTED FOR STUDIO",
      modal_pick_add: "SELECT FOR REMIX / FUSION",
      modal_go_studio: "OPEN IN STUDIO →",
      kv_cat: "CATEGORY", kv_year: "YEAR", kv_col: "COLLECTION", kv_mat: "MATERIAL", kv_price: "REF. PRICE", kv_runway: "RUNWAY / EXH.",
      modal_eval: "SALES / HEAT / ARTISTRY",
      modal_buy: "ACQUISITION & CHANNELS",
      modal_prod: "PRODUCT PAGE ↗",
      modal_src: "CREDITS & SOURCES",
      src_img: "Image Source: ", src_ref: "Reference: ",
      worn_by: "Worn by: ",
      bespoke: "Bespoke / Archive",
      foot_copy: "All image copyrights belong to their respective maisons and sources. Creative fusion outputs are conceptual studio inspirations.",
      fx_note: (fx, d) => `FX Ref: 1 USD≈¥${fx.USD} · 1 EUR≈¥${fx.EUR} · 1 GBP≈¥${fx.GBP} (Updated ${d} · Weekly Auto-Sync)`
    },
    fr: {
      html_lang: "fr",
      site_title: "ARCHIVES MONDIALES DE CHAPELLERIE & FUSION CRÉATIVE",
      site_subtitle: "HAUTE MODISTE · ANALYSE · ATELIER DE CRÉATION",
      topbar_meta: "ARCHIVES MONDIALES DE HAUTE CHAPELLERIE",
      tab_gallery: "GALERIE",
      tab_studio: "ATELIER FUSION",
      tab_rank: "CLASSEMENTS",
      tab_brands: "MAISONS",
      stat_brands: "MAISONS (A–Z)",
      stat_hats: "PIÈCES ILLUSTRÉES",
      stat_sub: "SOUS-CULTURE",
      stat_heat: "NOTORIÉTÉ MOY.",
      stat_art: "ARTISTICITÉ MOY.",
      stat_weekly: "MISE À JOUR HEBDO",
      search_ph: "Rechercher modèle, maison, célébrité, matière…",
      all_brands: "TOUTES LES MAISONS (A–Z)",
      all_cats: "TOUTES CATÉGORIES",
      brand_cnt: n => `${n}`,
      brand_pending: "En attente",
      sort_sales: "TRIER PAR VENTES",
      sort_heat: "TRIER PAR NOTORIÉTÉ",
      sort_artistry: "TRIER PAR ARTISTICITÉ",
      sort_year_desc: "ANNÉE RÉCENT → ANCIEN",
      sort_year_asc: "ANNÉE ANCIEN → RÉCENT",
      result_count: (a, b) => `${a} / ${b} CHAPEAUX ILLUSTRÉS`,
      gallery_tip: "ASTUCE : Cliquez sur <b>+ CHOISIR</b> pour réinterpréter 1 chapeau ou fusionner 2 à 3 pièces",
      empty_gallery: "Aucune pièce ne correspond à vos critères.",
      m_sales: "VENTES", m_heat: "NOTORIÉTÉ", m_art: "ART",
      s_sales: "V", s_heat: "N", s_art: "A",
      pick_add: "+ CHOISIR",
      pick_on: "✓ CHOISI",
      max_pick_alert: "Vous pouvez sélectionner 3 chapeaux maximum pour une fusion.",
      dock_go_1: "RÉINTERPRÉTER CE CHAPEAU →",
      dock_go_n: n => `FUSIONNER ${n} CHAPEAUX →`,
      btn_clear: "EFFACER",
      studio_title: "ATELIER DE RÉINTERPRÉTATION & FUSION",
      studio_sub: "Sélectionnez 1 chapeau pour le réinterpréter par texte, ou 2–3 chapeaux pour fusionner leurs codes et générer un nouveau visuel accompagné de sa note créative.",
      btn_pick_gallery: "+ CHOISIR EN GALERIE",
      btn_random_fusion: "FUSION ALÉATOIRE",
      selected_hats: "RÉFÉRENCES SÉLECTIONNÉES",
      mode_none: "SÉLECTIONNEZ 1–3 CHAPEAUX",
      mode_1: "MODE : RÉINTERPRÉTATION TEXTUELLE",
      mode_n: n => `MODE : FUSION DE ${n} CHAPEAUX`,
      slot_label: i => `EMPLACEMENT #${i}`,
      slot_req: "Requis : Galerie",
      slot_opt: "Optionnel : Fusion",
      style_dir: "DIRECTION ESTHÉTIQUE (MULTI-CHOIX)",
      prompt_label: "INSTRUCTIONS DE CRÉATION / FUSION",
      prompt_hint: "Matières, palette, bord sculptural, ornements…",
      prompt_ph: "Ex. : Conserver le large bord architectural du n°1, y intégrer la dentelle noire gothique et le fil d'argent du n°2, voilette ivoire translucide…",
      btn_generate: "GÉNÉRER LE VISUEL & LA NOTE",
      btn_generating: "CRÉATION DU VISUEL EN COURS…",
      btn_reroll: "NOUVELLE COMPOSITION",
      api_summary: "Moteur d'image avancé (IA gratuite sans clé par défaut ; API compatible OpenAI optionnelle)",
      api_endpoint_label: "Endpoint personnalisé (laisser vide pour le moteur gratuit)",
      api_key_label: "Clé API (stockée uniquement dans votre navigateur)",
      api_model_label: "Modèle",
      ph_title: "EN ATTENTE DE CRÉATION",
      ph_desc: "Sélectionnez 1 chapeau pour une réinterprétation ou 2–3 chapeaux pour une fusion, puis cliquez sur Générer pour obtenir une création inédite et son dossier artistique.",
      gen_loading_title: "ÉLABORATION DU VISUEL HAUTE MODISTE…",
      gen_loading_sub: "Synthèse des silhouettes et matières — environ 5 à 15 secondes",
      btn_save: "ENREGISTRER",
      btn_saved: "✓ ENREGISTRÉ",
      btn_copy_prompt: "COPIER LE PROMPT",
      btn_copied: "✓ COPIÉ",
      btn_open_img: "VOIR EN GRAND ↗",
      box_breakdown: "ANALYSE DES CODES FUSIONNÉS",
      box_craft: "MATIÈRES & SAVOIR-FAIRE RECOMMANDÉS",
      box_est: "INDICE 3D ESTIMÉ",
      est_sales: "POTENTIEL VENTES", est_heat: "NOTORIÉTÉ", est_art: "ARTISTICITÉ",
      box_prompt: "PROMPT DE GÉNÉRATION IA",
      saved_title: "MES CRÉATIONS ENREGISTRÉES",
      btn_view: "VOIR", btn_del: "SUPPRIMER",
      need_hat_alert: "Veuillez sélectionner 1 à 3 chapeaux d'abord.",
      need_prompt_alert: "Pour une réinterprétation, ajoutez un texte ou sélectionnez un style.",
      rank_sales: "TOP VENTES", rank_heat: "TOP NOTORIÉTÉ", rank_artistry: "TOP ARTISTICITÉ", rank_brand: "COMPARATIF MAISONS",
      rank_notice: "<strong>Trois Dimensions (0–100) :</strong> <b>Ventes</b> évalue la diffusion commerciale et les réassorts ; <b>Notoriété</b> mesure la visibilité célébrités/défilés/presse ; <b>Artisticité</b> juge la sculpture, le savoir-faire et l'avant-garde.",
      th_hat: "PIÈCE / MAISON", th_cat: "CATÉGORIE / ANNÉE", th_3d: "SCORES (V/N/A)",
      th_sales: "VENTES", th_heat: "NOTORIÉTÉ", th_art: "ARTISTICITÉ",
      th_sales_note: "BASE VENTES", th_heat_note: "BASE NOTORIÉTÉ", th_art_note: "BASE ARTISTIQUE",
      bc_sales: "VENTES MOYENNES (TOP 20)",
      bc_heat: "NOTORIÉTÉ MOYENNE (TOP 20)",
      bc_art: "ARTISTICITÉ MOYENNE (TOP 20)",
      pts: "pts",
      founded: "FONDÉE EN",
      brand_stats: (n, s, h, a) => `${n} pièces · Ventes ${s} · Notoriété ${h} · Art ${a}`,
      brand_no_img: "Aucune image publique directe pour l'instant",
      brand_jump: n => `VOIR LES ${n} PIÈCES`,
      brand_web: "SITE OFFICIEL ↗",
      modal_pick_on: "✓ SÉLECTIONNÉ",
      modal_pick_add: "AJOUTER À L'ATELIER",
      modal_go_studio: "CRÉER MAINTENANT →",
      kv_cat: "CATÉGORIE", kv_year: "ANNÉE", kv_col: "COLLECTION", kv_mat: "MATIÈRE", kv_price: "PRIX RÉF.", kv_runway: "DÉFILÉ / EXPO",
      modal_eval: "ÉVALUATION VENTES / NOTORIÉTÉ / ART",
      modal_buy: "POINTS DE VENTE & CANAUX",
      modal_prod: "FICHE PRODUIT ↗",
      modal_src: "CRÉDITS & SOURCES",
      src_img: "Source image : ", src_ref: "Référence : ",
      worn_by: "Porté par : ",
      bespoke: "Sur-mesure / Archive",
      foot_copy: "Les droits des images appartiennent aux maisons et sources d'origine. Les visuels générés en atelier sont des esquisses d'inspiration.",
      fx_note: (fx, d) => `Change réf. : 1 USD≈¥${fx.USD} · 1 EUR≈¥${fx.EUR} · 1 GBP≈¥${fx.GBP} (MàJ ${d})`
    },
    it: {
      html_lang: "it",
      site_title: "ARCHIVIO MONDIALE DI MODISTERIA & FUSIONE CREATIVA",
      site_subtitle: "ALTA MODISTERIA · ANALISI · ATELIER CREATIVO",
      topbar_meta: "ARCHIVIO MONDIALE DI ALTA MODISTERIA",
      tab_gallery: "GALLERIA",
      tab_studio: "FUSIONE CREATIVA",
      tab_rank: "CLASSIFICHE",
      tab_brands: "MAISON",
      stat_brands: "MAISON (A–Z)",
      stat_hats: "CAPI ILLUSTRATI",
      stat_sub: "SOTTOCULTURA",
      stat_heat: "NOTORIETÀ MEDIA",
      stat_art: "ARTISTICITÀ MEDIA",
      stat_weekly: "AGGIORNAMENTO WEEKEND",
      search_ph: "Cerca modello, maison, celebrità, materiale…",
      all_brands: "TUTTE LE MAISON (A–Z)",
      all_cats: "TUTTE LE CATEGORIE",
      brand_cnt: n => `${n}`,
      brand_pending: "In attesa",
      sort_sales: "ORDINA PER VENDITE",
      sort_heat: "ORDINA PER NOTORIETÀ",
      sort_artistry: "ORDINA PER ARTISTICITÀ",
      sort_year_desc: "ANNO RECENTE → STORICO",
      sort_year_asc: "ANNO STORICO → RECENTE",
      result_count: (a, b) => `${a} / ${b} CAPPELLI ILLUSTRATI`,
      gallery_tip: "SUGGERIMENTO: Clicca <b>+ SELEZIONA</b> per rielaborare 1 cappello o fonderne 2–3",
      empty_gallery: "Nessun cappello corrisponde ai filtri.",
      m_sales: "VENDITE", m_heat: "NOTORIETÀ", m_art: "ARTE",
      s_sales: "V", s_heat: "N", s_art: "A",
      pick_add: "+ SELEZIONA",
      pick_on: "✓ SELEZIONATO",
      max_pick_alert: "Puoi selezionare fino a 3 cappelli per la fusione creativa.",
      dock_go_1: "RIELABORA QUESTO CAPPELLO →",
      dock_go_n: n => `FONDI ${n} CAPPELLI →`,
      btn_clear: "SVUOTA",
      studio_title: "ATELIER DI RIELABORAZIONE & FUSIONE",
      studio_sub: "Seleziona 1 cappello per una rielaborazione testuale, oppure 2–3 cappelli per fonderne i codici e generare una nuova immagine con scheda artistica.",
      btn_pick_gallery: "+ SCEGLI IN GALLERIA",
      btn_random_fusion: "FUSIONE CASUALE",
      selected_hats: "RIFERIMENTI SELEZIONATI",
      mode_none: "SELEZIONA 1–3 CAPPELLI",
      mode_1: "MODALITÀ: RIELABORAZIONE TESTUALE",
      mode_n: n => `MODALITÀ: FUSIONE DI ${n} CAPPELLI`,
      slot_label: i => `SLOT #${i}`,
      slot_req: "Richiesto: Galleria",
      slot_opt: "Opzionale: Fusione",
      style_dir: "DIREZIONE ESTETICA (MULTI-SELEZIONE)",
      prompt_label: "ISTRUZIONI CREATIVE / FUSIONE",
      prompt_hint: "Materiali, palette, tesa scultorea, dettagli…",
      prompt_ph: "Es.: Mantieni la tesa ampia scultorea del n.1, integra il pizzo nero gotico e il filo d'argento del n.2, con velo avorio traslucido…",
      btn_generate: "GENERA IMMAGINE & SCHEDA",
      btn_generating: "CREAZIONE VISIVA IN CORSO…",
      btn_reroll: "NUOVA COMPOSIZIONE",
      api_summary: "Motore immagini avanzato (IA gratuita inclusa di default; API compatibile OpenAI opzionale)",
      api_endpoint_label: "Endpoint personalizzato (lascia vuoto per motore gratuito)",
      api_key_label: "API Key (salvata solo nel browser locale)",
      api_model_label: "Modello",
      ph_title: "IN ATTESA DI CREAZIONE",
      ph_desc: "Seleziona 1 cappello per la rielaborazione o 2–3 cappelli per la fusione a sinistra, quindi clicca Genera per visualizzare la nuova creazione e la sua analisi.",
      gen_loading_title: "CREAZIONE DEL NUOVO CAPPELLO…",
      gen_loading_sub: "Sintesi di silhouette e dettagli artigianali — circa 5–15 secondi",
      btn_save: "SALVA NELL'ATELIER",
      btn_saved: "✓ SALVATO",
      btn_copy_prompt: "COPIA PROMPT",
      btn_copied: "✓ COPIATO",
      btn_open_img: "APRI IMMAGINE ↗",
      box_breakdown: "ANALISI DEGLI ELEMENTI FUSI",
      box_craft: "MATERIALI & ARTIGIANALITÀ CONSIGLIATI",
      box_est: "STIMA INDICI 3D",
      est_sales: "POTENZIALE VENDITE", est_heat: "NOTORIETÀ", est_art: "ARTISTICITÀ",
      box_prompt: "PROMPT DI GENERAZIONE IA",
      saved_title: "LE MIE CREAZIONI SALVATE",
      btn_view: "VEDI", btn_del: "ELIMINA",
      need_hat_alert: "Seleziona prima da 1 a 3 cappelli.",
      need_prompt_alert: "Per la rielaborazione singola inserisci un testo o scegli uno stile.",
      rank_sales: "TOP VENDITE", rank_heat: "TOP NOTORIETÀ", rank_artistry: "TOP ARTISTICITÀ", rank_brand: "CONFRONTO MAISON",
      rank_notice: "<strong>Tre Dimensioni (0–100):</strong> <b>Vendite</b> stima diffusione commerciale e riassortimenti; <b>Notorietà</b> misura visibilità su celebrità, passerelle e stampa; <b>Artisticità</b> valuta scultura, savoir-faire e avanguardia.",
      th_hat: "CAPO / MAISON", th_cat: "CATEGORIA / ANNO", th_3d: "PUNTEGGI (V/N/A)",
      th_sales: "VENDITE", th_heat: "NOTORIETÀ", th_art: "ARTISTICITÀ",
      th_sales_note: "BASE VENDITE", th_heat_note: "BASE NOTORIETÀ", th_art_note: "BASE ARTISTICA",
      bc_sales: "MEDIA VENDITE (TOP 20)",
      bc_heat: "MEDIA NOTORIETÀ (TOP 20)",
      bc_art: "MEDIA ARTISTICITÀ (TOP 20)",
      pts: "pt",
      founded: "FONDATA NEL",
      brand_stats: (n, s, h, a) => `${n} capi · Vendite ${s} · Notorietà ${h} · Arte ${a}`,
      brand_no_img: "Nessuna immagine pubblica diretta disponibile",
      brand_jump: n => `VEDI ${n} CAPI`,
      brand_web: "SITO UFFICIALE ↗",
      modal_pick_on: "✓ SELEZIONATO",
      modal_pick_add: "SELEZIONA PER ATELIER",
      modal_go_studio: "CREA ORA →",
      kv_cat: "CATEGORIA", kv_year: "ANNO", kv_col: "COLLEZIONE", kv_mat: "MATERIALE", kv_price: "PREZZO RIF.", kv_runway: "SFILATA / MOSTRA",
      modal_eval: "VALUTAZIONE VENDITE / NOTORIETÀ / ARTE",
      modal_buy: "CANALI DI ACQUISTO",
      modal_prod: "PAGINA PRODOTTO ↗",
      modal_src: "CREDITI & FONTI",
      src_img: "Fonte immagine: ", src_ref: "Riferimento: ",
      worn_by: "Indossato da: ",
      bespoke: "Su misura / Archivio",
      foot_copy: "I diritti delle immagini appartengono alle rispettive maison e fonti originali. Le immagini generate in atelier sono ispirazioni concettuali.",
      fx_note: (fx, d) => `Cambio rif.: 1 USD≈¥${fx.USD} · 1 EUR≈¥${fx.EUR} · 1 GBP≈¥${fx.GBP} (Agg. ${d})`
    }
  };

  const CAT_LABELS = {
    "亚文化": { zh: "亚文化", en: "Subculture", fr: "Sous-culture", it: "Sottocultura" },
    "秀场艺术帽": { zh: "秀场艺术帽", en: "Runway Couture", fr: "Haute Couture Défilé", it: "Alta Moda Sfilata" },
    "礼帽": { zh: "礼帽", en: "Formal Hat", fr: "Chapeau de Cérémonie", it: "Cappello Formale" },
    "软呢帽": { zh: "软呢帽", en: "Fedora", fr: "Fédora", it: "Fedora" },
    "贝雷帽": { zh: "贝雷帽", en: "Beret", fr: "Béret", it: "Basco" },
    "草帽": { zh: "草帽", en: "Straw Hat", fr: "Chapeau de Paille", it: "Cappello di Paglia" },
    "渔夫帽": { zh: "渔夫帽", en: "Bucket Hat", fr: "Bob", it: "Cappello a Secchiello" },
    "针织帽": { zh: "针织帽", en: "Knit Beanie", fr: "Bonnet", it: "Berretto in Maglia" },
    "鸡尾酒帽/发饰": { zh: "鸡尾酒帽/发饰", en: "Cocktail / Fascinator", fr: "Bibis & Accessoires", it: "Cocktail & Cerchietti" },
    "其他": { zh: "其他", en: "Other", fr: "Autres", it: "Altro" }
  };

  const COUNTRY_LABELS = {
    "英国": { zh: "英国", en: "UK", fr: "Royaume-Uni", it: "Regno Unito" },
    "美国": { zh: "美国", en: "USA", fr: "États-Unis", it: "Stati Uniti" },
    "法国": { zh: "法国", en: "France", fr: "France", it: "Francia" },
    "中国": { zh: "中国", en: "China", fr: "Chine", it: "Cina" },
    "日本": { zh: "日本", en: "Japan", fr: "Japon", it: "Giappone" },
    "意大利": { zh: "意大利", en: "Italy", fr: "Italie", it: "Italia" },
    "西班牙": { zh: "西班牙", en: "Spain", fr: "Espagne", it: "Spagna" },
    "奥地利": { zh: "奥地利", en: "Austria", fr: "Autriche", it: "Austria" },
    "爱尔兰": { zh: "爱尔兰", en: "Ireland", fr: "Irlande", it: "Irlanda" },
    "乌克兰": { zh: "乌克兰", en: "Ukraine", fr: "Ukraine", it: "Ucraina" },
    "加拿大": { zh: "加拿大", en: "Canada", fr: "Canada", it: "Canada" },
    "韩国": { zh: "韩国", en: "South Korea", fr: "Corée du Sud", it: "Corea del Sud" },
    "以色列": { zh: "以色列", en: "Israel", fr: "Israël", it: "Israele" },
    "塞尔维亚": { zh: "塞尔维亚", en: "Serbia", fr: "Serbie", it: "Serbia" },
    "冰岛": { zh: "冰岛", en: "Iceland", fr: "Islande", it: "Islanda" },
    "澳大利亚": { zh: "澳大利亚", en: "Australia", fr: "Australie", it: "Australia" }
  };

  const CHANNEL_LABELS = {
    "官网": { zh: "官网", en: "Official", fr: "Site Officiel", it: "Sito Ufficiale" },
    "门店": { zh: "门店", en: "Boutique", fr: "Boutique", it: "Boutique" },
    "定制预约": { zh: "定制预约", en: "Bespoke", fr: "Sur-mesure", it: "Su Misura" },
    "买手店": { zh: "买手店", en: "Stockist", fr: "Concept Store", it: "Boutique Multimarca" },
    "电商平台": { zh: "电商平台", en: "E-Commerce", fr: "Plateforme", it: "E-Commerce" }
  };

  const STYLE_DEFS = [
    { key: "subculture", zh: "亚文化解构", en: "Subculture Deconstruction", fr: "Déconstruction Sous-culture", it: "Decostruzione Sottocultura", prompt: "avant-garde subculture deconstructed asymmetric structure, rebellious underground couture" },
    { key: "cyber", zh: "赛博金属未来感", en: "Cyber Metallic", fr: "Futurisme Métallique", it: "Cyber Metallico", prompt: "cyberpunk futuristic liquid chrome metallic accents, iridescent translucent trim" },
    { key: "gothic", zh: "暗黑哥特蕾丝", en: "Dark Gothic Lace", fr: "Dentelle Gothique Noire", it: "Pizzo Gotico Nero", prompt: "dark gothic romantic black Chantilly lace veil, dramatic chiaroscuro silhouette" },
    { key: "floral", zh: "高定雕塑花艺", en: "Couture Floral Sculpture", fr: "Sculpture Florale Couture", it: "Scultura Floreale Couture", prompt: "haute couture 3D sculptural silk camellia and floral petals, dramatic Parisian volume" },
    { key: "ramie", zh: "东方非遗夏布手作", en: "Eastern Heritage Craft", fr: "Artisanat Patrimonial d'Orient", it: "Artigianato Orientale", prompt: "traditional Chinese handwoven ramie grasscloth, artisanal heritage embroidery and bamboo weave" },
    { key: "minimal", zh: "极简建筑雕塑", en: "Architectural Minimalism", fr: "Minimalisme Architectural", it: "Minimalismo Architettonico", prompt: "minimalist monochrome architectural geometric sculpture, clean razor-sharp felt folds" },
    { key: "pop", zh: "超现实波普", en: "Surrealist Pop", fr: "Pop Surréaliste", it: "Pop Surrealista", prompt: "surrealist pop art whimsical bold silhouette, museum-grade statement headwear" },
    { key: "hollywood", zh: "复古好莱坞浪漫", en: "Old-Hollywood Glamour", fr: "Glamour Cinéma Rétro", it: "Glamour Cinema Retrò", prompt: "vintage old-Hollywood monochrome cinema glamour, sweeping brim and silk satin ribbon" }
  ];

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
    ["山茶花", "white silk camellia"], ["粗花呢", "bouclé tweed"], ["链条", "silver chains"], ["铆钉", "punk studs"],
    ["漆皮", "glossy patent leather"], ["皮革", "fine leather"], ["丝绒", "plush velvet"], ["羊毛毡", "sculpted wool felt"],
    ["草编", "woven natural straw"], ["透明", "translucent acrylic"], ["光环", "floating halo"], ["宽檐", "dramatic wide brim"],
    ["解构", "deconstructed"], ["哥特", "gothic"], ["东方", "oriental artisanal"], ["刺绣", "intricate embroidery"],
    ["褶皱", "pleated sculptural folds"], ["火焰", "torched distressed"], ["未来", "futuristic"], ["暗黑", "dark avant-garde"],
    ["极简", "minimalist"]
  ];

  const state = {
    lang: ["zh", "en", "fr", "it"].includes(localStorage.getItem(STORAGE_LANG)) ? localStorage.getItem(STORAGE_LANG) : "zh",
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
  const T = () => I18N[state.lang] || I18N.zh;
  const catLabel = c => (CAT_LABELS[c] && CAT_LABELS[c][state.lang]) || c;
  const countryLabel = c => (COUNTRY_LABELS[c] && COUNTRY_LABELS[c][state.lang]) || c;
  const chLabel = c => (CHANNEL_LABELS[c] && CHANNEL_LABELS[c][state.lang]) || c;

  function loadJson(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  }
  function saveJson(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  function toCNY(hat) {
    if (hat.price == null) return null;
    return Math.round(hat.price * (FX[hat.currency] || 1));
  }
  function fmtNum(n) { return n.toLocaleString("en-US"); }
  function fmtPrice(hat) {
    if (hat.price == null) return hat.priceNote || T().bespoke;
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
    const fb = `<div class="fallback" style="position:absolute;inset:0;z-index:0"><div><div class="mono">${esc(monogram(hat.name))}</div><small>${esc(brand.name)}</small></div></div>`;
    if (!hat.image) return `${fb}${extraBadge}`;
    return `${fb}<img src="${esc(hat.image)}" alt="${esc(hat.name)}" referrerpolicy="no-referrer" style="position:absolute;inset:0;z-index:1;width:100%;height:100%;object-fit:cover;display:block" onload="this.previousElementSibling&&this.previousElementSibling.remove()" onerror="this.remove()" />${extraBadge}`;
  }

  function applyLang() {
    const t = T();
    document.documentElement.lang = t.html_lang;
    document.title = t.site_title;
    $("#site-title").textContent = t.site_title;
    $("#site-subtitle").textContent = t.site_subtitle;
    $("#topbar-meta").textContent = t.topbar_meta;
    $("#foot-brand").textContent = t.site_title;
    $("#foot-copy").textContent = t.foot_copy;
    $("#fx-note").textContent = t.fx_note(FX, DATA.updatedAt);

    document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === state.lang));
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (typeof t[key] === "string") el.textContent = t[key];
    });

    $("#q").placeholder = t.search_ph;
    $("#studio-prompt").placeholder = t.prompt_ph;
    $("#gallery-tip").innerHTML = t.gallery_tip;
    $("#rank-notice").innerHTML = t.rank_notice;

    // Stats bar
    const subcultureCount = imagedHats.filter(h => h.category === "亚文化").length;
    const avgHeat = Math.round(imagedHats.reduce((s, h) => s + (h.heat?.score || 0), 0) / (imagedHats.length || 1));
    const avgArt = Math.round(imagedHats.reduce((s, h) => s + (h.artistry || 0), 0) / (imagedHats.length || 1));
    $("#stats").innerHTML = [
      `<span><b>${brandsAZ.length}</b> ${esc(t.stat_brands)}</span>`,
      `<span><b>${imagedHats.length}</b> ${esc(t.stat_hats)}</span>`,
      `<span><b>${subcultureCount}</b> ${esc(t.stat_sub)}</span>`,
      `<span>${esc(t.stat_heat)} <b>${avgHeat}</b></span>`,
      `<span>${esc(t.stat_art)} <b>${avgArt}</b></span>`,
      `<span>${esc(t.stat_weekly)} (${esc(DATA.updatedAt)})</span>`
    ].join("");

    // Rebuild Brand select preserving selection
    const prevBrand = state.brand;
    const fBrand = $("#f-brand");
    fBrand.innerHTML = `<option value="">${esc(t.all_brands)}</option>`;
    brandsAZ.forEach(b => {
      const cnt = imagedHats.filter(h => h.brandId === b.id).length;
      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = `${b.name} (${countryLabel(b.country)} · ${cnt > 0 ? t.brand_cnt(cnt) : t.brand_pending})`;
      fBrand.appendChild(opt);
    });
    fBrand.value = prevBrand;

    // Rebuild Category select preserving selection
    const prevCat = state.cat;
    const catOrder = ["亚文化", "秀场艺术帽", "礼帽", "软呢帽", "贝雷帽", "草帽", "渔夫帽", "针织帽", "鸡尾酒帽/发饰", "其他"];
    const presentCats = [...new Set(imagedHats.map(h => h.category))].sort((a, b) => {
      const ia = catOrder.indexOf(a), ib = catOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    const fCat = $("#f-cat");
    fCat.innerHTML = `<option value="">${esc(t.all_cats)}</option>`;
    presentCats.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = catLabel(c);
      fCat.appendChild(opt);
    });
    fCat.value = prevCat;

    // Rebuild Studio style chips
    $("#style-chips").innerHTML = STYLE_DEFS.map(s => `
      <button type="button" class="chip sm ${state.styles.includes(s.key) ? "active" : ""}" data-style="${s.key}">${esc(s[state.lang])}</button>`
    ).join("");

    // Reset placeholder if no active creation
    if (!state.currentCreation) renderStudioPlaceholder();

    syncSelectionUI();
    if (state.view === "gallery") renderGallery();
    if (state.view === "studio") renderStudioSlots();
    if (state.view === "rank") renderRank();
    if (state.view === "brands") renderBrands();
  }

  function renderStudioPlaceholder() {
    const t = T();
    $("#studio-result").innerHTML = `
      <div class="studio-placeholder">
        <div class="ph-icon">✦</div>
        <h3>${esc(t.ph_title)}</h3>
        <p>${esc(t.ph_desc)}</p>
      </div>`;
  }

  function initApi() {
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
          h.name, h.collection, h.category, catLabel(h.category), h.material, h.description,
          h.heat?.evidence, h.heat?.runway, h.salesNote, h.artistryNote,
          ...(h.heat?.celebrities || []),
          b.name, b.nameZh, b.country, countryLabel(b.country), b.city
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
    const t = T();
    const list = filteredHats();
    $("#result-count").textContent = t.result_count(list.length, imagedHats.length);
    const grid = $("#grid");
    if (!list.length) {
      grid.innerHTML = `<div class="empty">${esc(t.empty_gallery)}</div>`;
      return;
    }
    const metricLabel = state.sort === "sales" ? t.m_sales : state.sort === "artistry" ? t.m_art : t.m_heat;
    grid.innerHTML = list.map(h => {
      const b = brandMap[h.brandId];
      const isSel = state.selectedIds.includes(h.id);
      const catBadge = `<span class="badge">${esc(catLabel(h.category))}</span>`;
      const mainScore = state.sort === "sales" ? h.sales : state.sort === "artistry" ? h.artistry : (h.heat?.score ?? 0);
      const pill = `<span class="heat-pill">${esc(metricLabel)} ${mainScore}</span>`;
      return `
        <div class="card ${isSel ? "selected" : ""}" data-hat="${esc(h.id)}" role="button" tabindex="0">
          <div class="thumb">${thumbHtml(h, catBadge + pill)}</div>
          <div class="card-body">
            <div class="card-brand">${esc(b.name)} · ${esc(h.year || "")}</div>
            <div class="card-name">${esc(h.name)}</div>
            <div class="card-meta">
              <span>${t.s_sales} ${h.sales} · ${t.s_heat} ${h.heat?.score ?? 0} · ${t.s_art} ${h.artistry}</span>
              <button type="button" class="pick-btn ${isSel ? "on" : ""}" data-pick="${esc(h.id)}">${isSel ? esc(t.pick_on) : esc(t.pick_add)}</button>
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
        alert(T().max_pick_alert);
        return;
      }
      state.selectedIds.push(hatId);
    }
    syncSelectionUI();
  }

  function syncSelectionUI() {
    const t = T();
    const n = state.selectedIds.length;
    const badge = $("#studio-count");
    badge.textContent = String(n);
    badge.hidden = n === 0;

    const dock = $("#fusion-dock");
    if (n > 0 && state.view !== "studio") {
      dock.hidden = false;
      $("#dock-thumbs").innerHTML = state.selectedIds.map(id => {
        const h = hatMap[id];
        return `<span class="dock-chip"><img src="${esc(h.image)}" alt="" referrerpolicy="no-referrer" /><span>${esc(h.name)}</span><button type="button" data-unpick="${esc(id)}" aria-label="Remove">×</button></span>`;
      }).join("");
      $("#dock-go").textContent = n === 1 ? t.dock_go_1 : t.dock_go_n(n);
    } else {
      dock.hidden = true;
    }

    if (state.view === "gallery") renderGallery();
    if (state.view === "studio") renderStudioSlots();
  }

  function renderStudioSlots() {
    const t = T();
    const n = state.selectedIds.length;
    $("#sel-num").textContent = String(n);
    const pill = $("#studio-mode-pill");
    if (n === 0) {
      pill.textContent = t.mode_none;
      pill.className = "badge";
    } else if (n === 1) {
      pill.textContent = t.mode_1;
      pill.className = "badge on";
    } else {
      pill.textContent = t.mode_n(n);
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
              <button type="button" class="slot-rm" data-unpick="${esc(id)}" aria-label="Remove">×</button>
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
            <div>${esc(t.slot_label(i + 1))}</div>
            <div style="font-size:10px;margin-top:3px;opacity:.75">${esc(i === 0 ? t.slot_req : t.slot_opt)}</div>
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
    const latin = text.match(/[A-Za-z0-9][A-Za-z0-9\s\-]{1,40}/g);
    if (latin) hits.push(...latin.map(s => s.trim()));
    return [...new Set(hits)].join(", ");
  }

  function buildDesignBrief(hats, userPrompt, styleKeys) {
    const lang = state.lang;
    const brands = hats.map(h => brandMap[h.brandId]);
    const cleanPrompt = userPrompt.trim();
    const styleObjs = styleKeys.map(k => STYLE_DEFS.find(s => s.key === k)).filter(Boolean);
    const styleLabels = styleObjs.map(s => s[lang]);

    const modeMap = {
      zh: hats.length === 1 ? "单帽文字二创" : hats.length === 2 ? "双帽基因融合" : "三帽跨界融合",
      en: hats.length === 1 ? "Single-Hat Remix" : hats.length === 2 ? "Dual-Hat Fusion" : "Tri-Hat Couture Fusion",
      fr: hats.length === 1 ? "Réinterprétation Solo" : hats.length === 2 ? "Fusion Duo" : "Fusion Trio Couture",
      it: hats.length === 1 ? "Rielaborazione Singola" : hats.length === 2 ? "Fusione Duo" : "Fusione Trio Couture"
    };
    const mode = modeMap[lang];
    const coreCat = catLabel(hats[0].category);

    const shortNames = hats.map(h => h.name.split(/[\s(（]+/)[0]).slice(0, 3).join(" × ");
    const prefix = styleLabels[0] || (lang === "zh" ? (hats.length === 1 ? "重塑" : "融生") : "Atelier");
    const zhTitle = lang === "zh"
      ? (hats.length === 1 ? `《${prefix}·${hats[0].name}》二创概念款` : `《${prefix}·${shortNames}》${hats.length}帽融合概念款`)
      : `${prefix} · ${hats.length === 1 ? hats[0].name : shortNames}`;
    const enTitle = hats.length === 1
      ? `Reimagined ${hats[0].name} — Atelier Edition`
      : `${brands.map(b => b.name.split(" ")[0]).join(" × ")} Fusion Edition`;

    let narrative = "";
    if (lang === "zh") {
      const sPart = styleLabels.length ? `整体注入「${styleLabels.join("」「")}」视觉方向，` : "";
      const uPart = cleanPrompt ? `并结合你的创意指令——“${cleanPrompt}”进行细节再造。` : "在保留原作标志性辨识度的同时，强化立体雕塑光影与先锋佩戴张力。";
      narrative = hats.length === 1
        ? `本作品以 ${brands[0].name}「${hats[0].name}」为原型骨架，延续其${hats[0].category}基因；${sPart}${uPart}新造型在帽冠比例与表面肌理上实现突破，呈现出焕然一新的高级手工帽饰气质。`
        : `本作品跨界融合 ${brands.map((b, i) => `${b.name}「${hats[i].name}」`).join(" 与 ")} 的标志性美学基因。${sPart}${uPart}多重工艺语汇在帽檐转折与顶冠层次处自然咬合，形成兼具视觉张力与可佩戴性的全新概念新作。`;
    } else if (lang === "fr") {
      const sPart = styleLabels.length ? ` Enrichie par une direction « ${styleLabels.join(", ")} »,` : "";
      const uPart = cleanPrompt ? ` elle intègre votre note créative : « ${cleanPrompt} ».` : " elle sublime l'équilibre sculptural et la pureté des proportions.";
      narrative = hats.length === 1
        ? `Réinterprétation contemporaine du modèle « ${hats[0].name} » de ${brands[0].name}.${sPart}${uPart}`
        : `Fusion haute modiste réunissant les signatures de ${brands.map((b, i) => `${b.name} (« ${hats[i].name} »)`).join(" et ")}.${sPart}${uPart}`;
    } else if (lang === "it") {
      const sPart = styleLabels.length ? ` Arricchita dallo stile « ${styleLabels.join(", ")} »,` : "";
      const uPart = cleanPrompt ? ` integra la tua direzione creativa: « ${cleanPrompt} ».` : " esalta l'equilibrio scultoreo e la purezza delle proporzioni.";
      narrative = hats.length === 1
        ? `Rielaborazione contemporanea del modello « ${hats[0].name} » di ${brands[0].name}.${sPart}${uPart}`
        : `Fusione di alta modisteria che unisce i codici di ${brands.map((b, i) => `${b.name} (« ${hats[i].name} »)`).join(" e ")}.${sPart}${uPart}`;
    } else {
      const sPart = styleLabels.length ? ` Infused with ${styleLabels.join(" & ")} direction,` : "";
      const uPart = cleanPrompt ? ` it directly incorporates your brief: "${cleanPrompt}".` : " it heightens sculptural proportion and studio-grade tactile contrast.";
      narrative = hats.length === 1
        ? `A contemporary atelier reinterpretation of ${brands[0].name}'s "${hats[0].name}".${sPart}${uPart}`
        : `A cross-maison millinery fusion uniting ${brands.map((b, i) => `${b.name} ("${hats[i].name}")`).join(" and ")}.${sPart}${uPart}`;
    }

    const roles = {
      zh: ["主体廓形与比例骨架", "核心肌理与结构细节", "点睛装饰与风格气场"],
      en: ["primary silhouette & proportion", "core texture & structural detail", "signature trim & sculptural finish"],
      fr: ["silhouette principale et proportions", "texture et structure centrale", "ornementation et signature finale"],
      it: ["silhouette principale e proporzioni", "texture e struttura centrale", "dettagli e firma scultorea"]
    }[lang];

    const breakdown = hats.map((h, i) => {
      const b = brandMap[h.brandId];
      return `<strong>#${i + 1} · ${esc(b.name)} — ${esc(h.name)}</strong>: ${roles[i]} (${esc(catLabel(h.category))}).`;
    });
    if (styleLabels.length) {
      breakdown.push(`<strong>${esc(T().style_dir)}</strong>: ${esc(styleLabels.join(" · "))}`);
    }
    if (cleanPrompt) {
      breakdown.push(`<strong>${esc(T().prompt_label)}</strong>: ${esc(cleanPrompt)}`);
    }

    const craftMap = {
      zh: `建议以手工木模定型为主轴，结合 ${hats.map(h => h.material).filter(Boolean).slice(0, 2).join(" 与 ")} 复合工艺，配以隐形内衬平衡配重。`,
      en: `Recommended hand-blocked wooden millinery mold construction combining composite textiles with concealed internal counter-balance for effortless wearability.`,
      fr: `Confection recommandée sur forme en bois traditionnelle, alliant matières composites et équilibrage intérieur invisible.`,
      it: `Lavorazione consigliata su forma in legno tradizionale, combinando materiali compositi con bilanciamento interno invisibile.`
    };

    const avgSales = Math.round(hats.reduce((s, h) => s + (h.sales || 60), 0) / hats.length);
    const avgHeat = Math.round(hats.reduce((s, h) => s + (h.heat?.score || 75), 0) / hats.length);
    const avgArt = Math.round(hats.reduce((s, h) => s + (h.artistry || 82), 0) / hats.length);
    const estSales = Math.min(96, Math.max(35, avgSales + (hats.length === 1 ? 4 : -4)));
    const estHeat = Math.min(99, avgHeat + (hats.length > 1 ? 6 : 4) + (styleObjs.length ? 3 : 0));
    const estArt = Math.min(99, avgArt + (hats.length > 1 ? 7 : 5) + (cleanPrompt ? 3 : 0));

    const hatFragments = hats.map((h, i) => {
      const b = brandMap[h.brandId];
      const catEn = CAT_EN[h.category] || "designer couture hat";
      const matEn = translateKeywordsToEn(h.material || "");
      return `${i === 0 ? "primary silhouette inspired by" : "fused with elements of"} ${b.name} ${h.name} (${catEn}${matEn ? ", " + matEn : ""})`;
    }).join("; ");
    const styleEn = styleObjs.map(s => s.prompt).join(", ");
    const userEn = translateKeywordsToEn(cleanPrompt);

    const aiPrompt = [
      "Parisian haute couture millinery studio photography of ONE single newly designed avant-garde hat on a clean minimalist matte mannequin bust",
      hatFragments,
      styleEn ? `aesthetic direction: ${styleEn}` : "",
      userEn ? `custom creative modifications: ${userEn}` : "",
      "Chanel-style monochrome gallery lighting, pure white studio backdrop, ultra crisp textile craftsmanship details, sharp focus, high-fashion lookbook, no text, no watermark"
    ].filter(Boolean).join(". ");

    return { mode, zhTitle, enTitle, coreCat, narrative, breakdown, craftNote: craftMap[lang], estSales, estHeat, estArt, aiPrompt, userPrompt: cleanPrompt, sourceIds: hats.map(h => h.id) };
  }

  const FUSION_MODES = [
    { key: "blend", zh: "结构叠融", en: "Structural Blend", fr: "Fusion Structurelle", it: "Fusione Strutturale" },
    { key: "split", zh: "解构拼贴", en: "Deconstructed Split", fr: "Découpe Déconstruite", it: "Taglio Decostruito" },
    { key: "double", zh: "光影重曝", en: "Double Exposure", fr: "Double Exposition", it: "Doppia Esposizione" },
    { key: "board", zh: "高定方案板", en: "Couture Lookbook", fr: "Planche Couture", it: "Scheda Couture" }
  ];

  function loadCorsImage(url) {
    const candidates = [
      `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=900&output=png`,
      `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=900&output=png`,
      url
    ];
    return new Promise((resolve, reject) => {
      let idx = 0;
      const tryNext = () => {
        if (idx >= candidates.length) { reject(new Error("Image load failed")); return; }
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";
        const timer = setTimeout(() => { img.src = ""; idx++; tryNext(); }, 8000);
        img.onload = () => { clearTimeout(timer); resolve(img); };
        img.onerror = () => { clearTimeout(timer); idx++; tryNext(); };
        img.src = candidates[idx];
      };
      tryNext();
    });
  }

  function drawCover(ctx, img, x, y, w, h, zoom = 1.0, offsetX = 0, offsetY = 0) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const scale = Math.max(w / iw, h / ih) * zoom;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = x + (w - dw) / 2 + offsetX;
    const dy = y + (h - dh) / 2 + offsetY;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function makeMaskedLayer(img, w, h, maskFn, zoom = 1.04, ox = 0, oy = 0) {
    const off = document.createElement("canvas");
    off.width = w; off.height = h;
    const octx = off.getContext("2d");
    drawCover(octx, img, 0, 0, w, h, zoom, ox, oy);
    octx.globalCompositeOperation = "destination-in";
    maskFn(octx, w, h);
    return off;
  }

  function styleFilterString(styleKeys, userPrompt) {
    const txt = (userPrompt || "") + " " + styleKeys.join(" ");
    if (styleKeys.includes("gothic") || txt.includes("暗黑") || txt.includes("哥特")) {
      return "contrast(1.22) brightness(0.9) saturate(0.45)";
    }
    if (styleKeys.includes("minimal") || txt.includes("极简") || txt.includes("黑白")) {
      return "grayscale(0.85) contrast(1.16) brightness(1.02)";
    }
    if (styleKeys.includes("cyber") || txt.includes("赛博") || txt.includes("金属") || txt.includes("银")) {
      return "contrast(1.18) saturate(0.75) hue-rotate(190deg) brightness(1.03)";
    }
    if (styleKeys.includes("ramie") || txt.includes("东方") || txt.includes("夏布")) {
      return "sepia(0.28) contrast(1.06) brightness(0.99)";
    }
    if (styleKeys.includes("pop") || txt.includes("波普")) {
      return "saturate(1.45) contrast(1.14)";
    }
    if (styleKeys.includes("hollywood") || txt.includes("复古")) {
      return "sepia(0.18) contrast(1.12) brightness(0.97)";
    }
    return "contrast(1.08) saturate(0.96)";
  }

  function renderMultiHatFusionCanvas(canvas, loadedImgs, hats, brief, mode = "blend", seed = 1) {
    const W = 768, H = 960;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const imgs = loadedImgs.filter(Boolean);
    const jitter = ((seed % 7) - 3) * 10;

    // Clean gallery studio canvas
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, W, H);

    const filt = styleFilterString(state.styles, brief.userPrompt);
    const heroH = mode === "board" ? 730 : H;

    if (imgs.length > 0) {
      ctx.save();
      ctx.filter = filt;

      if (mode === "blend") {
        // Base: Hat #1 (primary crown & posture)
        drawCover(ctx, imgs[0], 0, 0, W, H, 1.06, jitter * 0.5, -12);

        if (imgs.length >= 2) {
          // Fuse Hat #2 into lower brim & right sculptural plane with feathered alpha mask
          const layer2 = makeMaskedLayer(imgs[1], W, H, (mctx, w, h) => {
            const g = mctx.createLinearGradient(w * 0.15, h * 0.22, w * 0.85, h * 0.78);
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(0.45, "rgba(0,0,0,0.65)");
            g.addColorStop(1, "rgba(0,0,0,0.96)");
            mctx.fillStyle = g;
            mctx.fillRect(0, 0, w, h);
          }, 1.08, -jitter * 0.6, 16);
          ctx.globalAlpha = 0.88;
          ctx.drawImage(layer2, 0, 0);

          // Harmonizing soft-light tonal unification
          ctx.globalCompositeOperation = "soft-light";
          ctx.globalAlpha = 0.42;
          drawCover(ctx, imgs[1], 0, 0, W, H, 1.12, jitter, 0);
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1;
        }

        if (imgs.length >= 3) {
          // Fuse Hat #3 as sculptural upper-right / radial highlight & trim layer
          const layer3 = makeMaskedLayer(imgs[2], W, H, (mctx, w, h) => {
            const rg = mctx.createRadialGradient(w * 0.64, h * 0.36, 40, w * 0.55, h * 0.44, w * 0.58);
            rg.addColorStop(0, "rgba(0,0,0,0.92)");
            rg.addColorStop(0.55, "rgba(0,0,0,0.45)");
            rg.addColorStop(1, "rgba(0,0,0,0)");
            mctx.fillStyle = rg;
            mctx.fillRect(0, 0, w, h);
          }, 1.12, jitter * 0.8, -18);
          ctx.globalAlpha = 0.78;
          ctx.drawImage(layer3, 0, 0);
          ctx.globalAlpha = 1;
        }
      } else if (mode === "split") {
        // Architectural avant-garde diagonal / asymmetric splicing
        drawCover(ctx, imgs[0], 0, 0, W, H, 1.06, -24, 0);
        if (imgs.length >= 2) {
          ctx.save();
          ctx.beginPath();
          const cutX = W * (0.46 + (seed % 5) * 0.02);
          ctx.moveTo(cutX + 70, 0);
          ctx.lineTo(W, 0);
          ctx.lineTo(W, H);
          ctx.lineTo(cutX - 70, H);
          ctx.closePath();
          ctx.clip();
          drawCover(ctx, imgs[1], 0, 0, W, H, 1.08, 20, 0);
          ctx.restore();
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cutX + 70, 0);
          ctx.lineTo(cutX - 70, H);
          ctx.stroke();
        }
        if (imgs.length >= 3) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, H * 0.58);
          ctx.lineTo(W, H * 0.44);
          ctx.lineTo(W, H);
          ctx.lineTo(0, H);
          ctx.closePath();
          ctx.clip();
          ctx.globalAlpha = 0.92;
          drawCover(ctx, imgs[2], 0, 0, W, H, 1.1, 0, 30);
          ctx.restore();
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, H * 0.58);
          ctx.lineTo(W, H * 0.44);
          ctx.stroke();
        }
      } else if (mode === "double") {
        // High-fashion film double exposure
        drawCover(ctx, imgs[0], 0, 0, W, H, 1.05, 0, 0);
        imgs.slice(1).forEach((im, idx) => {
          ctx.globalCompositeOperation = idx === 0 ? "multiply" : "screen";
          ctx.globalAlpha = idx === 0 ? 0.72 : 0.58;
          drawCover(ctx, im, 0, 0, W, H, 1.1 + idx * 0.05, (idx % 2 ? 1 : -1) * 18, -10);
        });
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      } else {
        // Couture Lookbook Sheet: fused hero top + reference swatches strip bottom
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, heroH);
        ctx.clip();
        drawCover(ctx, imgs[0], 0, 0, W, heroH, 1.05, 0, 0);
        if (imgs.length >= 2) {
          const l2 = makeMaskedLayer(imgs[1], W, heroH, (mctx, w, h) => {
            const g = mctx.createLinearGradient(0, h * 0.2, w, h * 0.8);
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(0.55, "rgba(0,0,0,0.68)");
            g.addColorStop(1, "rgba(0,0,0,0.94)");
            mctx.fillStyle = g; mctx.fillRect(0, 0, w, h);
          }, 1.08, 0, 0);
          ctx.drawImage(l2, 0, 0);
        }
        if (imgs.length >= 3) {
          const l3 = makeMaskedLayer(imgs[2], W, heroH, (mctx, w, h) => {
            const rg = mctx.createRadialGradient(w * 0.65, h * 0.35, 30, w * 0.55, h * 0.4, w * 0.5);
            rg.addColorStop(0, "rgba(0,0,0,0.85)");
            rg.addColorStop(1, "rgba(0,0,0,0)");
            mctx.fillStyle = rg; mctx.fillRect(0, 0, w, h);
          }, 1.1, 0, 0);
          ctx.drawImage(l3, 0, 0);
        }
        ctx.restore();
      }
      ctx.restore();
    }

    // Subtle monochrome editorial vignette & custom accent glow
    const vig = ctx.createLinearGradient(0, heroH - 180, 0, heroH);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.68)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, heroH - 180, W, 180);

    // Hairline Chanel couture border
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, W - 40, heroH - 40);

    // Top-left atelier edition tag
    ctx.fillStyle = "rgba(0,0,0,0.78)";
    ctx.fillRect(28, 28, 260, 30);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 11px Montserrat, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`ATELIER ${brief.mode.toUpperCase()}`, 40, 47);

    // Bottom title & source swatches
    if (mode === "board") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, heroH, W, H - heroH);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, heroH); ctx.lineTo(W, heroH); ctx.stroke();

      const swW = 110, swH = 136, gap = 16;
      const startX = 28;
      imgs.forEach((im, i) => {
        const sx = startX + i * (swW + gap);
        const sy = heroH + 26;
        ctx.save();
        ctx.beginPath(); ctx.rect(sx, sy, swW, swH); ctx.clip();
        drawCover(ctx, im, sx, sy, swW, swH, 1.0);
        ctx.restore();
        ctx.strokeStyle = "#e5e5e5"; ctx.strokeRect(sx, sy, swW, swH);
        ctx.fillStyle = "#000000"; ctx.fillRect(sx, sy, 26, 20);
        ctx.fillStyle = "#ffffff"; ctx.font = "600 10px Montserrat, sans-serif";
        ctx.fillText(`#${i + 1}`, sx + 6, sy + 14);
      });

      const tx = startX + imgs.length * (swW + gap) + 12;
      ctx.fillStyle = "#000000";
      ctx.font = "600 18px Montserrat, 'Noto Sans SC', sans-serif";
      ctx.fillText(brief.zhTitle.slice(0, 18), tx, heroH + 62);
      ctx.fillStyle = "#666666";
      ctx.font = "12px Montserrat, 'Noto Sans SC', sans-serif";
      ctx.fillText(brief.enTitle.slice(0, 34), tx, heroH + 88);
      if (brief.userPrompt) {
        ctx.fillStyle = "#111111";
        ctx.fillText(`“${brief.userPrompt.slice(0, 22)}”`, tx, heroH + 122);
      }
      ctx.fillStyle = "#767676";
      ctx.font = "11px Montserrat, sans-serif";
      ctx.fillText(`SALES ${brief.estSales}  ·  HEAT ${brief.estHeat}  ·  ARTISTRY ${brief.estArt}`, tx, heroH + 156);
    } else {
      // Compact editorial caption + micro reference swatches in bottom corners
      ctx.fillStyle = "#ffffff";
      ctx.font = "600 20px Montserrat, 'Noto Sans SC', sans-serif";
      ctx.fillText(brief.zhTitle.slice(0, 22), 34, H - 62);
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.font = "12px Montserrat, sans-serif";
      ctx.fillText(hats.map(h => brandMap[h.brandId].name).join("  ×  ").slice(0, 56), 34, H - 36);

      const sw = 46, sg = 8;
      imgs.forEach((im, i) => {
        const sx = W - 34 - (imgs.length - i) * sw - (imgs.length - 1 - i) * sg;
        const sy = H - 82;
        ctx.save();
        ctx.beginPath(); ctx.rect(sx, sy, sw, 56); ctx.clip();
        drawCover(ctx, im, sx, sy, sw, 56, 1.0);
        ctx.restore();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sx, sy, sw, 56);
      });
    }
  }

  function buildShortCloudPrompt(hats, brief) {
    const cats = [...new Set(hats.map(h => CAT_EN[h.category] || "couture hat"))].slice(0, 2).join(" fused with ");
    const styles = state.styles.slice(0, 2).map(k => (STYLE_DEFS.find(s => s.key === k)?.en || "")).filter(Boolean).join(", ");
    const userEn = translateKeywordsToEn(brief.userPrompt).split(",").slice(0, 4).join(",");
    return [
      `Haute couture ${cats}`,
      styles,
      userEn,
      "single designer hat studio product photo, white backdrop, sharp editorial lighting"
    ].filter(Boolean).join(", ").slice(0, 210);
  }

  async function runCloudAiRerender(hats, brief, seed) {
    const endpoint = ($("#api-endpoint").value || "").trim();
    const apiKey = ($("#api-key").value || "").trim();
    const model = ($("#api-model").value || "dall-e-3").trim();
    saveJson(STORAGE_API, { endpoint, key: apiKey, model });

    const stage = $("#gen-stage");
    const btn = $("#btn-cloud-ai");
    if (btn) { btn.disabled = true; btn.textContent = "⏳ AI…"; }
    const loader = document.createElement("div");
    loader.className = "gen-loading";
    loader.id = "gen-loading";
    loader.innerHTML = `<div class="spinner"></div><div><b>${esc(T().gen_loading_title)}</b></div><div class="rt-sub">${esc(T().gen_loading_sub)}</div>`;
    stage.appendChild(loader);

    try {
      let imgUrl = "";
      if (endpoint && apiKey) {
        const resp = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
          body: JSON.stringify({ model, prompt: brief.aiPrompt, size: "1024x1024", n: 1 })
        });
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();
        const item = data.data && data.data[0];
        imgUrl = item?.url || (item?.b64_json ? "data:image/png;base64," + item.b64_json : "");
      } else {
        const shortPrompt = buildShortCloudPrompt(hats, brief);
        imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(shortPrompt)}?width=768&height=960&seed=${seed}&nologo=true`;
      }
      if (!imgUrl) throw new Error("Empty image");

      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.alt = brief.zhTitle;
      img.onload = () => {
        stage.innerHTML = "";
        stage.appendChild(img);
        state.currentCreation = { id: "cr-" + Date.now(), createdAt: new Date().toISOString().slice(0, 10), image: img.src, brief };
        const dl = $("#btn-download-img");
        if (dl) { dl.href = img.src; dl.hidden = false; }
        if (btn) { btn.disabled = false; btn.textContent = state.lang === "zh" ? "☁️ 云端 AI 写实重绘" : "☁️ CLOUD AI RENDER"; }
      };
      img.onerror = () => {
        loader.remove();
        alert(state.lang === "zh" ? "云端免费 AI 服务当前繁忙，已保留本地多图融合成果（您也可在下方填入自有 API Key 使用）。" : "Cloud AI endpoint is busy right now; your real multi-image fusion remains intact.");
        if (btn) { btn.disabled = false; btn.textContent = state.lang === "zh" ? "☁️ 云端 AI 写实重绘" : "☁️ CLOUD AI RENDER"; }
      };
      img.src = imgUrl;
    } catch (err) {
      loader.remove();
      alert(err.message || String(err));
      if (btn) { btn.disabled = false; btn.textContent = state.lang === "zh" ? "☁️ 云端 AI 写实重绘" : "☁️ CLOUD AI RENDER"; }
    }
  }

  let lastFusionCtx = null;

  function drawActiveFusionMode(modeKey, seedOverride) {
    if (!lastFusionCtx) return;
    lastFusionCtx.mode = modeKey;
    if (seedOverride) lastFusionCtx.seed = seedOverride;
    const { loadedImgs, hats, brief, mode, seed } = lastFusionCtx;
    const stage = $("#gen-stage");
    if (!stage) return;
    stage.innerHTML = "";
    const canvas = document.createElement("canvas");
    renderMultiHatFusionCanvas(canvas, loadedImgs, hats, brief, mode, seed);
    stage.appendChild(canvas);
    const dataUrl = canvas.toDataURL("image/png");
    state.currentCreation = { id: "cr-" + Date.now(), createdAt: new Date().toISOString().slice(0, 10), image: dataUrl, brief };
    const dl = $("#btn-download-img");
    if (dl) { dl.href = dataUrl; dl.download = `hat-fusion-${mode}.png`; dl.hidden = false; }
    document.querySelectorAll("[data-fmode]").forEach(b => b.classList.toggle("active", b.dataset.fmode === mode));
  }

  async function runGeneration(customSeed) {
    const t = T();
    const hats = state.selectedIds.map(id => hatMap[id]).filter(Boolean);
    if (!hats.length) { alert(t.need_hat_alert); return; }
    const userPrompt = $("#studio-prompt").value || "";
    if (hats.length === 1 && !userPrompt.trim() && !state.styles.length) {
      alert(t.need_prompt_alert);
      $("#studio-prompt").focus();
      return;
    }

    const seed = customSeed || Math.floor(Math.random() * 999999);
    const brief = buildDesignBrief(hats, userPrompt, state.styles);
    const genBtn = $("#btn-generate");
    genBtn.disabled = true;
    genBtn.textContent = t.btn_generating;
    $("#btn-reroll").hidden = false;

    const dlLabel = state.lang === "zh" ? "下载融合新图 (PNG)" : state.lang === "fr" ? "TÉLÉCHARGER PNG" : state.lang === "it" ? "SCARICA PNG" : "DOWNLOAD PNG";
    const cloudLabel = state.lang === "zh" ? "☁️ 云端 AI 写实重绘" : "☁️ CLOUD AI RENDER";

    const resultEl = $("#studio-result");
    resultEl.innerHTML = `
      <div class="gen-actions" style="margin-bottom:10px">
        ${FUSION_MODES.map((m, idx) => `<button type="button" class="chip sm ${idx === 0 ? "active" : ""}" data-fmode="${m.key}">${esc(m[state.lang])}</button>`).join("")}
      </div>
      <div class="gen-stage" id="gen-stage">
        <div class="gen-loading" id="gen-loading">
          <div class="spinner"></div>
          <div><b>${esc(t.gen_loading_title)}</b></div>
          <div class="rt-sub">${esc(t.gen_loading_sub)}</div>
        </div>
      </div>
      <div class="gen-actions">
        <button type="button" class="btn sm" id="btn-save-creation">${esc(t.btn_save)}</button>
        <a class="btn ghost sm" id="btn-download-img" href="#" download="hat-fusion.png" hidden>${esc(dlLabel)}</a>
        <button type="button" class="btn ghost sm" id="btn-cloud-ai">${esc(cloudLabel)}</button>
        <button type="button" class="btn ghost sm" id="btn-copy-prompt">${esc(t.btn_copy_prompt)}</button>
      </div>
      <div style="margin-bottom:10px"><span class="badge on">${esc(brief.mode)}</span> <span class="badge">${esc(brief.coreCat)}</span></div>
      <h3 class="gen-title">${esc(brief.zhTitle)}</h3>
      <div class="gen-en">${esc(brief.enTitle)}</div>
      <p class="gen-desc">${esc(brief.narrative)}</p>

      <div class="gen-box">
        <h4>${esc(t.box_breakdown)}</h4>
        <ul class="gen-list">${brief.breakdown.map(line => `<li>${line}</li>`).join("")}</ul>
      </div>
      <div class="gen-box">
        <h4>${esc(t.box_craft)}</h4>
        <div style="color:var(--ink-2)">${esc(brief.craftNote)}</div>
      </div>
      <div class="gen-box">
        <h4>${esc(t.box_est)}</h4>
        <div class="hbar"><span>${esc(t.est_sales)}</span><div class="bar"><i style="width:${brief.estSales}%"></i></div><span class="num">${brief.estSales} / 100</span></div>
        <div class="hbar"><span>${esc(t.est_heat)}</span><div class="bar"><i style="width:${brief.estHeat}%"></i></div><span class="num">${brief.estHeat} / 100</span></div>
        <div class="hbar"><span>${esc(t.est_art)}</span><div class="bar"><i style="width:${brief.estArt}%"></i></div><span class="num">${brief.estArt} / 100</span></div>
      </div>
      <div class="gen-box">
        <h4>${esc(t.box_prompt)}</h4>
        <div class="gen-prompt-code" id="gen-prompt-text">${esc(brief.aiPrompt)}</div>
      </div>`;

    // Load all 1-3 real hat images in parallel with CORS support and fuse immediately!
    const settled = await Promise.allSettled(hats.map(h => loadCorsImage(h.image)));
    const loadedImgs = settled.map(r => (r.status === "fulfilled" ? r.value : null));
    lastFusionCtx = { loadedImgs, hats, brief, mode: "blend", seed };
    drawActiveFusionMode("blend", seed);

    genBtn.disabled = false;
    genBtn.textContent = T().btn_generate;
  }

  function renderSavedCreations() {
    const t = T();
    const sec = $("#saved-section");
    const list = state.savedCreations;
    if (!list.length) { sec.hidden = true; return; }
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
            <button type="button" class="btn ghost sm" data-open-creation="${esc(c.id)}">${esc(t.btn_view)}</button>
            <button type="button" class="btn ghost sm" data-del-creation="${esc(c.id)}">${esc(t.btn_del)}</button>
          </div>
        </div>
      </div>`).join("");
  }

  function showSavedCreation(id) {
    const t = T();
    const c = state.savedCreations.find(x => x.id === id);
    if (!c) return;
    state.currentCreation = c;
    const brief = c.brief;
    $("#studio-result").innerHTML = `
      <div class="gen-stage"><img src="${esc(c.image)}" alt="${esc(brief.zhTitle)}" referrerpolicy="no-referrer" /></div>
      <div class="gen-actions">
        <a class="btn sm" href="${esc(c.image)}" target="_blank" rel="noopener">${esc(t.btn_open_img)}</a>
        <button type="button" class="btn ghost sm" id="btn-copy-prompt">${esc(t.btn_copy_prompt)}</button>
      </div>
      <div style="margin-bottom:10px"><span class="badge on">${esc(brief.mode)}</span> <span class="badge">${esc(c.createdAt)}</span></div>
      <h3 class="gen-title">${esc(brief.zhTitle)}</h3>
      <div class="gen-en">${esc(brief.enTitle)}</div>
      <p class="gen-desc">${esc(brief.narrative)}</p>
      <div class="gen-box"><h4>${esc(t.box_breakdown)}</h4><ul class="gen-list">${brief.breakdown.map(line => `<li>${line}</li>`).join("")}</ul></div>
      <div class="gen-box"><h4>${esc(t.box_craft)}</h4><div style="color:var(--ink-2)">${esc(brief.craftNote)}</div></div>
      <div class="gen-box"><h4>${esc(t.box_prompt)}</h4><div class="gen-prompt-code" id="gen-prompt-text">${esc(brief.aiPrompt)}</div></div>`;
    $("#studio-result").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ==================== Rankings & Brands ==================== */
  function renderRankTable(rows, mode) {
    const t = T();
    const titleMap = { sales: t.th_sales, heat: t.th_heat, artistry: t.th_art };
    const noteTitle = { sales: t.th_sales_note, heat: t.th_heat_note, artistry: t.th_art_note };
    return `
      <div class="table-scroll">
        <table class="rank-table">
          <thead>
            <tr>
              <th>#</th>
              <th>${esc(t.th_hat)}</th>
              <th class="hide-sm">${esc(t.th_cat)}</th>
              <th>${esc(titleMap[mode])}</th>
              <th class="hide-sm">${esc(t.th_3d)}</th>
              <th class="hide-sm">${esc(noteTitle[mode])}</th>
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
                        <div class="rt-sub">${esc(b.name)} (${esc(countryLabel(b.country))})</div>
                      </div>
                    </div>
                  </td>
                  <td class="hide-sm"><div>${esc(catLabel(h.category))}</div><div class="rt-sub">${esc(h.year || "—")}</div></td>
                  <td class="num"><div>${score} / 100</div><div class="bar"><i style="width:${score}%"></i></div></td>
                  <td class="num hide-sm">${h.sales} / ${h.heat?.score ?? 0} / ${h.artistry}</td>
                  <td class="hide-sm">${esc(note)}</td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`;
  }

  function renderBrandCompare() {
    const t = T();
    const stats = brandsAZ.map(b => {
      const hats = imagedHats.filter(h => h.brandId === b.id);
      if (!hats.length) return null;
      const n = hats.length;
      return {
        b,
        avgSales: Math.round(hats.reduce((s, h) => s + (h.sales || 0), 0) / n),
        avgHeat: Math.round(hats.reduce((s, h) => s + (h.heat?.score || 0), 0) / n),
        avgArt: Math.round(hats.reduce((s, h) => s + (h.artistry || 0), 0) / n)
      };
    }).filter(Boolean);

    const panel = (title, key, list) => `
      <div class="panel">
        <h3>${esc(title)}</h3>
        ${list.map(s => `
          <div class="hbar">
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(s.b.name)}</span>
            <div class="bar"><i style="width:${s[key]}%"></i></div>
            <span class="num">${s[key]} ${esc(t.pts)}</span>
          </div>`).join("")}
      </div>`;

    return `
      <div class="brand-compare">
        ${panel(t.bc_sales, "avgSales", [...stats].sort((a, b) => b.avgSales - a.avgSales).slice(0, 20))}
        ${panel(t.bc_heat, "avgHeat", [...stats].sort((a, b) => b.avgHeat - a.avgHeat).slice(0, 20))}
        ${panel(t.bc_art, "avgArt", [...stats].sort((a, b) => b.avgArt - a.avgArt).slice(0, 20))}
      </div>`;
  }

  function renderRank() {
    const body = $("#rank-body");
    if (state.rankTab === "sales") body.innerHTML = renderRankTable([...imagedHats].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 30), "sales");
    else if (state.rankTab === "heat") body.innerHTML = renderRankTable([...imagedHats].sort((a, b) => (b.heat?.score || 0) - (a.heat?.score || 0)).slice(0, 30), "heat");
    else if (state.rankTab === "artistry") body.innerHTML = renderRankTable([...imagedHats].sort((a, b) => (b.artistry || 0) - (a.artistry || 0)).slice(0, 30), "artistry");
    else body.innerHTML = renderBrandCompare();
  }

  function renderBrands() {
    const t = T();
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
            <h2>${esc(b.name)}${state.lang === "zh" ? `<span class="zh">${esc(b.nameZh)}</span>` : ""}</h2>
            <div class="where">${esc(countryLabel(b.country))} · ${esc(b.city)} · ${esc(t.founded)} ${esc(b.founded)}</div>
          </div>
          <p>${esc(b.description)}</p>
          <div class="rt-sub">${hasHats ? esc(t.brand_stats(hats.length, avgSales, avgHeat, avgArt)) : esc(t.brand_no_img)}</div>
          <ul class="channels">
            ${b.channels.map(ch => `
              <li>
                <span class="ch-type">${esc(chLabel(ch.type))}</span>
                <div>
                  <div>${ch.url ? `<a href="${esc(ch.url)}" target="_blank" rel="noopener">${esc(ch.name)} ↗</a>` : esc(ch.name)} <span class="ch-note">· ${esc(ch.region)}</span></div>
                  <div class="ch-note">${esc(ch.note)}</div>
                </div>
              </li>`).join("")}
          </ul>
          <div class="brand-actions">
            ${hasHats ? `<button class="btn sm" data-jump-brand="${esc(b.id)}">${esc(t.brand_jump(hats.length))}</button>` : ""}
            ${b.website ? `<a class="btn ghost sm" href="${esc(b.website)}" target="_blank" rel="noopener">${esc(t.brand_web)}</a>` : ""}
          </div>
        </article>`;
    }).join("");
  }

  function openModal(hatId) {
    const t = T();
    const h = hatMap[hatId];
    if (!h) return;
    const b = brandMap[h.brandId];
    const celebs = h.heat?.celebrities || [];
    const isSel = state.selectedIds.includes(h.id);
    $("#modal-body").innerHTML = `
      <div class="m-img">${thumbHtml(h)}</div>
      <div class="m-info">
        <div>
          <div class="card-brand">${esc(b.name)} · ${esc(countryLabel(b.country))} ${esc(b.city)}</div>
          <h2 id="m-title">${esc(h.name)}</h2>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <button type="button" class="btn sm" data-modal-pick="${esc(h.id)}">${isSel ? esc(t.modal_pick_on) : esc(t.modal_pick_add)}</button>
          <button type="button" class="btn ghost sm" data-modal-go-studio="${esc(h.id)}">${esc(t.modal_go_studio)}</button>
        </div>
        <p style="margin:0;color:var(--ink-2)">${esc(h.description)}</p>
        <dl class="m-kv">
          <dt>${esc(t.kv_cat)}</dt><dd><span class="badge">${esc(catLabel(h.category))}</span></dd>
          <dt>${esc(t.kv_year)}</dt><dd>${esc(h.year || "—")}</dd>
          <dt>${esc(t.kv_col)}</dt><dd>${esc(h.collection || "—")}</dd>
          <dt>${esc(t.kv_mat)}</dt><dd>${esc(h.material || "—")}</dd>
          <dt>${esc(t.kv_price)}</dt><dd>${esc(fmtPrice(h))}</dd>
          ${h.heat?.runway ? `<dt>${esc(t.kv_runway)}</dt><dd>${esc(h.heat.runway)}</dd>` : ""}
        </dl>

        <div class="m-sec">
          <h4>${esc(t.modal_eval)}</h4>
          <div class="hbar"><span>${esc(t.th_sales)}</span><div class="bar"><i style="width:${h.sales}%"></i></div><span class="num">${h.sales} / 100</span></div>
          <div class="rt-sub" style="margin-bottom:6px">${esc(h.salesNote || "")}</div>
          <div class="hbar"><span>${esc(t.th_heat)}</span><div class="bar"><i style="width:${h.heat?.score ?? 0}%"></i></div><span class="num">${h.heat?.score ?? 0} / 100</span></div>
          <div class="rt-sub" style="margin-bottom:6px">${esc(h.heat?.evidence || "")}</div>
          <div class="hbar"><span>${esc(t.th_art)}</span><div class="bar"><i style="width:${h.artistry}%"></i></div><span class="num">${h.artistry} / 100</span></div>
          <div class="rt-sub">${esc(h.artistryNote || "")}</div>
          ${celebs.length ? `<div class="celebs" style="margin-top:8px">${celebs.map(c => `<span class="badge">${esc(t.worn_by)}${esc(c)}</span>`).join("")}</div>` : ""}
        </div>

        <div class="m-sec">
          <h4>${esc(t.modal_buy)}</h4>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">
            ${h.productUrl ? `<a class="btn sm" href="${esc(h.productUrl)}" target="_blank" rel="noopener">${esc(t.modal_prod)}</a>` : ""}
            ${b.website ? `<a class="btn ghost sm" href="${esc(b.website)}" target="_blank" rel="noopener">${esc(t.brand_web)}</a>` : ""}
          </div>
          <ul class="channels">
            ${b.channels.map(ch => `
              <li>
                <span class="ch-type">${esc(chLabel(ch.type))}</span>
                <div>
                  <div>${ch.url ? `<a href="${esc(ch.url)}" target="_blank" rel="noopener">${esc(ch.name)} ↗</a>` : esc(ch.name)}</div>
                  <div class="ch-note">${esc(ch.region)} · ${esc(ch.note)}</div>
                </div>
              </li>`).join("")}
          </ul>
        </div>

        <div class="m-sec m-src">
          <h4>${esc(t.modal_src)}</h4>
          ${h.imageSource ? `<div>${esc(t.src_img)}<a href="${esc(h.imageSource)}" target="_blank" rel="noopener">${esc(h.imageSource)}</a></div>` : ""}
          ${(h.sources || []).map(u => `<div>${esc(t.src_ref)}<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a></div>`).join("")}
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
  $("#lang-switch").addEventListener("click", e => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;
    state.lang = btn.dataset.lang;
    try { localStorage.setItem(STORAGE_LANG, state.lang); } catch {}
    applyLang();
  });

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
      if (!seenBrands.has(h.brandId)) { chosen.push(h.id); seenBrands.add(h.brandId); }
      if (chosen.length === 2) break;
    }
    state.selectedIds = chosen;
    syncSelectionUI();
  });

  $("#btn-generate").addEventListener("click", () => runGeneration());
  $("#btn-reroll").addEventListener("click", () => {
    if (lastFusionCtx) {
      drawActiveFusionMode(lastFusionCtx.mode, Math.floor(Math.random() * 999999));
    } else {
      runGeneration();
    }
  });

  $("#q").addEventListener("input", e => { state.q = e.target.value; renderGallery(); });
  $("#f-brand").addEventListener("change", e => { state.brand = e.target.value; renderGallery(); });
  $("#f-cat").addEventListener("change", e => { state.cat = e.target.value; renderGallery(); });
  $("#f-sort").addEventListener("change", e => { state.sort = e.target.value; renderGallery(); });

  document.addEventListener("click", e => {
    const fmode = e.target.closest("[data-fmode]");
    if (fmode && lastFusionCtx) { drawActiveFusionMode(fmode.dataset.fmode); return; }
    if (e.target.id === "btn-cloud-ai" && lastFusionCtx) {
      runCloudAiRerender(lastFusionCtx.hats, lastFusionCtx.brief, Math.floor(Math.random() * 999999));
      return;
    }
    const pick = e.target.closest("[data-pick]");
    if (pick) { e.stopPropagation(); togglePick(pick.dataset.pick); return; }
    const unpick = e.target.closest("[data-unpick]");
    if (unpick) { e.stopPropagation(); togglePick(unpick.dataset.unpick); return; }
    const gotoGallery = e.target.closest("[data-goto-gallery]");
    if (gotoGallery) { switchView("gallery"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const modalPick = e.target.closest("[data-modal-pick]");
    if (modalPick) {
      togglePick(modalPick.dataset.modalPick);
      const isSel = state.selectedIds.includes(modalPick.dataset.modalPick);
      modalPick.textContent = isSel ? T().modal_pick_on : T().modal_pick_add;
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
      e.target.textContent = T().btn_saved;
      return;
    }
    if (e.target.id === "btn-copy-prompt") {
      const txt = $("#gen-prompt-text")?.textContent || "";
      if (txt && navigator.clipboard) {
        navigator.clipboard.writeText(txt).then(() => { e.target.textContent = T().btn_copied; });
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

  initApi();
  applyLang();
})();
