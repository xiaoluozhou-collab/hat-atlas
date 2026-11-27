# 小叶子的全球帽子分析图鉴

一个面向设计师帽饰与手工制帽爱好者的全球图鉴与分析平台，收录全球 **51 家** 独立设计师及百年手工帽坊（按 **A–Z** 排序），严格执行**「图鉴里必须有图」**原则，提供图片展示、**销量 / 热度 / 艺术性**三维排行对比、各品牌购买途径及每周末定时自动更新。

- **在线公共访问**：https://xiaoluozhou-collab.github.io/hat-atlas/
- **代码与数据仓库**：https://github.com/xiaoluozhou-collab/hat-atlas

---

## 一、核心功能

### 1. 图鉴浏览与多维筛选
- **直接展示实拍图**：卡片网格默认直接渲染帽款图片，点击任意卡片可打开详情弹层。
- **关键词检索**：支持按帽款名称、品牌中英文名、系列、材质工艺、佩戴名人、国家/城市进行实时模糊搜索。
- **品牌筛选（A–Z）**：全部 51 家品牌按英文/拼音首字母严格 A–Z 排序，并标注国家与当前有图收录数量。
- **类别筛选**：涵盖 **亚文化**（置顶）、秀场艺术帽、礼帽、软呢帽、贝雷帽、草帽、渔夫帽、针织帽、鸡尾酒帽/发饰、其他。
- **排序方式**：支持按**销量**、**热度**、**艺术性**及**年份（新→旧 / 旧→新）**排序。

### 2. 排行榜与品牌对比
提供四个独立榜单视图：
- **销量榜（Top 30）**
- **热度榜（Top 30）**
- **艺术性榜（Top 30）**
- **品牌对比（Top 20）**：横向对比各品牌在销量、热度、艺术性三个维度上的平均分。

### 3. 品牌与购买渠道名录
- 按 **A–Z** 列出全部 51 家品牌，展示创立年份、创始人、国家/城市、品牌简介及三维均分。
- 每家品牌均附详细**购买途径**（官网、线下门店、定制预约、买手店、电商平台）及直达外链。
- 支持一键点击「查看该品牌 N 款帽子」直接筛选进入图鉴。

### 4. 帽款详情弹层
点击任意帽款卡片或排行榜条目，可查看：
- 大图展示、类别、年份、系列、材质工艺、参考售价（附汇率折算参考）与秀场/展览信息；
- **销量 / 热度 / 艺术性**三维评分条与具体评估依据、名人佩戴标签；
- 商品/详情页直达链接、品牌全渠道购买说明，以及图片出处与参考来源链接。

---

## 二、三维评估维度说明（0–100）

| 维度 | 评估依据 |
| --- | --- |
| **销量指数** | 综合公开电商销量区间、官网常青主推/多渠道铺货与补货频次估算（手工孤品与非商业展品分值较低） |
| **热度分** | 综合名人/王室佩戴、国际时装周秀场与媒体曝光、社交平台及买手圈讨论热度 |
| **艺术性分** | 综合雕塑结构、手工工艺难度、亚文化/先锋原创度与博物馆/展览典藏价值 |

---

## 三、收录品牌分布（共 51 家）

- **英国（12）**：Awon Golding、Benny Andallo、Fred Butler、Harvy Santos、House of Flora、Karen Henriksen、Nasir Mazhar、Noel Stewart、Piers Atkinson、Stephen Jones Millinery、Victoria Grant、Virna Pasquinelli（原籍意大利，伦敦设工作室）
- **美国（9）**：Anya Caliendo、Ellen Christine Millinery、Gladys Tamez Millinery、Laura Whitlock Millinery、Lisa McFadden Millinery、Machine Dazzle、Maxwell Bresler、Nick Fouquet（原籍法国）、Rod Keenan
- **法国（6）**：Anthony Peto、Aurélie Chapalain、Charlie Le Mindu、Christian Silvani、Maison Michel、Muriel Nisse
- **中国（6）**：Atelier PHYL（香港）、Jaycow Millinery（香港）、Kreuzzz（上海）、Sheng Xi Fu 盛锡福（天津/北京，非遗老字号）、SHINE LI（北京/上海）、ZXYE（原创解构与亚文化帽饰）
- **日本（4）**：Haute Mode Hirata 平田暁夫、Kijima Takayuki、Kiriko Sato（巴黎）、Maiko Takeda（伦敦）
- **意大利（2）**：Federica Moretti、Super Duper Hats
- **西班牙（2）**：Eliurpi、Genis Whylan (Whyhats)
- **奥地利（2）**：Mühlbauer、Reinhard Plank（佛罗伦萨制作，按奥地利籍归组）
- **其余各 1 家（8）**：Ana Rajcevic（塞尔维亚/柏林）、James Merry（冰岛/纽约）、Maor Zabar（以色列）、Parker Millinery（澳大利亚/墨尔本）、Philip Treacy（爱尔兰/伦敦工坊）、Shmelevsky（乌克兰）、Xtinel（加拿大/蒙特利尔）、Zentow（韩国/首尔）

> **关于「图鉴里必须有图」规则**：图鉴与排行榜仅展示带有真实可访问图片链接的帽款；极少数暂以线下市集或私域展示为主、暂无公开直链官图的品牌（如 `Aurélie Chapalain`、`Christian Silvani`、`Parker Millinery`）保留在「品牌与渠道」名录中并标记为「待补图」，待后续补充官图后自动进入图鉴。

---

## 四、每周末定时自动更新机制

本项目通过 **GitHub Actions** 实现无人值守定时更新与自动重新部署：

- **配置文件**：[`.github/workflows/weekly-update.yml`](.github/workflows/weekly-update.yml)
- **执行时间**：`cron: '0 2 * * 0'`（**每周日北京时间 10:00** 自动运行）
- **执行脚本**：[`scripts/weekly_update.py`](scripts/weekly_update.py)
  1. `--sync-shopify`：自动拉取 12 家 Shopify 官网品牌最新上新商品，仅收录带有真实图片的帽款；
  2. `--verify-images`：自动巡检已有图片链接，剔除返回 `404/410` 的失效条目；
  3. 强制维持品牌 A–Z 排序，更新 `updatedAt` 时间戳；
  4. 自动重新生成 `data/atlas.json`、`data/all.js` 与单文件离线版 `dist/hat_atlas.html` 并提交回 `main` 分支，触发 GitHub Pages 自动刷新线上页面。

### 手动触发更新
- **网页端**：打开仓库的 `Actions` → 选择 `Weekly Hat Atlas Update` → 点击 `Run workflow`。
- **本地运行**：
  ```bash
  # 仅按当前数据重新构建 data/all.js 与 dist/hat_atlas.html
  python3 scripts/weekly_update.py

  # 同步品牌官网上新并巡检图片链接
  python3 scripts/weekly_update.py --sync-shopify --verify-images
  ```

---

## 五、项目目录结构

```text
hat-atlas/
├── index.html                        # 网站主入口
├── styles.css                        # 视觉样式（暖象牙纸底与暗酒红强调色）
├── app.js                            # 筛选、排序、排行榜、品牌名录与详情弹层逻辑
├── data/
│   ├── atlas.json                    # 核心结构化数据源（品牌 + 有图帽款）
│   └── all.js                        # 前端直接加载的 JS 数据包（由脚本自动生成）
├── dist/
│   └── hat_atlas.html                # 自包含单文件离线版 HTML（由脚本自动生成）
├── scripts/
│   ├── weekly_update.py              # 每周末定时更新与构建脚本
│   └── seed_51_brands.py             # 51 品牌初始化脚本
├── .github/workflows/
│   └── weekly-update.yml             # 每周日定时更新 GitHub Actions 工作流
├── .nojekyll                         # 关闭 Jekyll 处理，确保静态资源直出
└── README.md                         # 项目说明文档
```

---

## 六、如何手动新增帽款或补充品牌图片

1. 编辑 `data/atlas.json`，在 `hats` 数组中添加新条目（确保填写 `id`、`brandId`、`name`、`category`、`image`、`sales`、`artistry`、`heat` 等字段，且 `image` 为有效的公开图片链接）。
2. 运行 `python3 scripts/weekly_update.py` 重新生成 `data/all.js` 和 `dist/hat_atlas.html`。
3. 提交并推送至 `main` 分支，GitHub Pages 约 30–60 秒后自动更新生效。

---

## 七、版权与免责声明

- 平台内所有帽款图片版权均归对应品牌及原始发布方所有，本项目**仅保存原始图片链接并标注出处**，不托管、不二次分发受版权保护的图片文件。
- 参考售价与库存状态以采集时页面为准，可能随品牌调价或季节变动，请以各品牌官网或购买渠道实时页面为准。
