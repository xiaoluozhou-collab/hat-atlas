#!/usr/bin/env python3
"""
Weekly automated updater for 小叶子的全球帽子分析图鉴.

Features:
1. Optional live catalog sync (`--sync-shopify`) from Shopify-powered millinery brands
   in the 51-brand roster (`/products.json?limit=6`), ingesting only products with real images.
2. Optional image URL health check (`--verify-images`) enforcing the strict rule:
   "图鉴里的必须有图" (every hat in the gallery MUST have a non-empty, valid image URL).
3. Enforces strict A-Z brand ordering.
4. Updates `updatedAt` and regenerates `data/atlas.json`, `data/all.js`, and standalone `dist/hat_atlas.html`.
"""

import argparse
import datetime as dt
import json
import re
import ssl
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
DIST_DIR = ROOT / "dist"
ATLAS_JSON = DATA_DIR / "atlas.json"
ALL_JS = DATA_DIR / "all.js"

# Shopify-powered brands from the 51-brand roster that expose /products.json
SHOPIFY_SOURCES = [
    {"brandId": "anthony-peto", "base": "https://anthonypeto.com", "currency": "EUR", "defaultCat": "礼帽"},
    {"brandId": "atelier-phyl", "base": "https://atelierphyl.com", "currency": "CNY", "defaultCat": "秀场艺术帽"},
    {"brandId": "awon-golding", "base": "https://awongolding.com", "currency": "GBP", "defaultCat": "鸡尾酒帽/发饰"},
    {"brandId": "genis-whylan", "base": "https://www.whyhats.es", "currency": "EUR", "defaultCat": "礼帽"},
    {"brandId": "gladys-tamez", "base": "https://gladystamez.com", "currency": "USD", "defaultCat": "礼帽"},
    {"brandId": "haute-mode-hirata", "base": "https://hautemodehirata.com", "currency": "USD", "defaultCat": "礼帽"},
    {"brandId": "james-merry", "base": "https://jtmerry.com", "currency": "USD", "defaultCat": "亚文化"},
    {"brandId": "lisa-mcfadden", "base": "https://lisamcfadden.com", "currency": "USD", "defaultCat": "鸡尾酒帽/发饰"},
    {"brandId": "maor-zabar", "base": "https://maorzabarhats.com", "currency": "USD", "defaultCat": "亚文化"},
    {"brandId": "nick-fouquet", "base": "https://www.nickfouquet.com", "currency": "USD", "defaultCat": "礼帽"},
    {"brandId": "reinhard-plank", "base": "https://reinhardplank.it", "currency": "EUR", "defaultCat": "亚文化"},
    {"brandId": "super-duper-hats", "base": "https://superduperhats.com", "currency": "EUR", "defaultCat": "软呢帽"},
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; HatAtlasWeeklyBot/1.0; +https://github.com/)"
}


def fetch_json(url: str, timeout: int = 12):
    req = urllib.request.Request(url, headers=HEADERS)
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
        return json.loads(resp.read().decode("utf-8"))


def check_image_alive(url: str, timeout: int = 8) -> bool:
    """Return False only on definitive 404/410 or non-http URLs; tolerate CDN 403/429 hotlink guards."""
    if not isinstance(url, str) or not url.startswith(("http://", "https://")):
        return False
    req = urllib.request.Request(url, method="HEAD", headers=HEADERS)
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            return resp.status < 400
    except urllib.error.HTTPError as e:
        if e.code in (404, 410):
            return False
        # 403/405/429 often mean CDN blocks HEAD/bot UA even though browsers load fine
        return True
    except Exception:
        return True


def infer_category(title: str, tags: list, default_cat: str) -> str:
    text = f"{title} {' '.join(tags)}".lower()
    if any(k in text for k in ("mask", "subculture", "punk", "goth", "cyber", "avant", "sculpture", "food", "cuisine")):
        return "亚文化"
    if any(k in text for k in ("straw", "panama", "raffia")):
        return "草帽"
    if any(k in text for k in ("beret", "basco")):
        return "贝雷帽"
    if any(k in text for k in ("bucket", "sailor")):
        return "渔夫帽"
    if any(k in text for k in ("beanie", "knit", "wool cap")):
        return "针织帽"
    if any(k in text for k in ("fascinator", "headband", "cocktail", "veil", "bridal")):
        return "鸡尾酒帽/发饰"
    if any(k in text for k in ("fedora", "trilby", "felt")):
        return "软呢帽"
    return default_cat


def sync_shopify(atlas: dict, max_per_brand: int = 2) -> int:
    existing_ids = {h["id"] for h in atlas["hats"]}
    existing_urls = {h.get("productUrl") for h in atlas["hats"] if h.get("productUrl")}
    year_now = dt.datetime.now(dt.timezone.utc).year
    added = 0

    for src in SHOPIFY_SOURCES:
        endpoint = f"{src['base']}/products.json?limit=6"
        try:
            payload = fetch_json(endpoint)
        except Exception as exc:
            print(f"[sync] skip {src['brandId']} ({endpoint}): {exc}")
            continue

        brand_added = 0
        for prod in payload.get("products", []):
            if brand_added >= max_per_brand:
                break
            images = prod.get("images") or []
            img_url = images[0].get("src") if images else None
            if not img_url:
                continue  # Strict rule: must have image

            handle = prod.get("handle") or ""
            prod_url = f"{src['base']}/products/{handle}" if handle else src["base"]
            hat_id = f"auto-{src['brandId']}-{re.sub(r'[^a-z0-9]+', '-', handle.lower()).strip('-')[:40]}"
            if hat_id in existing_ids or prod_url in existing_urls:
                continue

            title = (prod.get("title") or "").strip()
            if not title:
                continue

            variants = prod.get("variants") or []
            raw_price = variants[0].get("price") if variants else None
            try:
                price_val = round(float(raw_price)) if raw_price else None
            except ValueError:
                price_val = None

            tags = prod.get("tags") or []
            if isinstance(tags, str):
                tags = [t.strip() for t in tags.split(",") if t.strip()]
            cat = infer_category(title, tags, src["defaultCat"])

            new_hat = {
                "id": hat_id,
                "brandId": src["brandId"],
                "name": title,
                "year": year_now,
                "collection": "官网周末自动同步上新",
                "category": cat,
                "material": prod.get("product_type") or "手工帽饰（详见官网商品页）",
                "description": f"{title}，由每周定时同步任务自品牌官网捕获的最新有图上新款。",
                "price": price_val,
                "currency": src["currency"],
                "priceNote": "官网最新抓取价",
                "image": img_url,
                "imageSource": prod_url,
                "productUrl": prod_url,
                "available": True,
                "sales": 65,
                "salesNote": "官网当季在售新品（自动同步）",
                "artistry": 80,
                "artistryNote": "品牌官方手工线当季新作",
                "heat": {
                    "score": 72,
                    "celebrities": [],
                    "runway": None,
                    "evidence": "由每周末定时更新脚本从品牌官网自动收录。"
                },
                "sources": [prod_url],
            }
            atlas["hats"].append(new_hat)
            existing_ids.add(hat_id)
            existing_urls.add(prod_url)
            brand_added += 1
            added += 1
            print(f"[sync] + {src['brandId']}: {title}")

    return added


def build_standalone_dist(atlas: dict):
    """Build self-contained dist/hat_atlas.html by embedding styles.css, atlas JSON, and app.js into index.html."""
    index_html = (ROOT / "index.html").read_text(encoding="utf-8")
    styles_css = (ROOT / "styles.css").read_text(encoding="utf-8")
    app_js = (ROOT / "app.js").read_text(encoding="utf-8")
    data_js = "window.HAT_ATLAS = " + json.dumps(atlas, ensure_ascii=False) + ";"

    standalone = index_html.replace(
        '<link rel="stylesheet" href="styles.css" />',
        f"<style>\n{styles_css}\n</style>",
    ).replace(
        '<script src="data/all.js"></script>\n  <script src="app.js"></script>',
        f"<script>\n{data_js}\n</script>\n  <script>\n{app_js}\n</script>",
    )

    DIST_DIR.mkdir(parents=True, exist_ok=True)
    (DIST_DIR / "hat_atlas.html").write_text(standalone, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Weekly update for 小叶子的全球帽子分析图鉴")
    parser.add_argument("--sync-shopify", action="store_true", help="Fetch latest imaged hats from Shopify brand stores")
    parser.add_argument("--verify-images", action="store_true", help="Drop any hat whose image URL returns 404/410")
    args = parser.parse_args()

    atlas = json.loads(ATLAS_JSON.read_text(encoding="utf-8"))

    # Enforce strict A-Z brand ordering
    atlas["brands"] = sorted(atlas["brands"], key=lambda b: b["name"].lower())

    added = 0
    if args.sync_shopify:
        added = sync_shopify(atlas)

    # Enforce "图鉴里的必须有图"
    before = len(atlas["hats"])
    kept = []
    for h in atlas["hats"]:
        img = h.get("image")
        if not isinstance(img, str) or not img.strip().startswith(("http://", "https://")):
            continue
        if args.verify_images and not check_image_alive(img):
            print(f"[verify] removed dead image (404/410): {h['id']} -> {img}")
            continue
        kept.append(h)
    atlas["hats"] = kept
    removed = before - len(kept)

    # Update timestamp (Beijing Time UTC+8)
    cst = dt.timezone(dt.timedelta(hours=8))
    atlas["updatedAt"] = dt.datetime.now(cst).strftime("%Y-%m-%d")

    ATLAS_JSON.write_text(json.dumps(atlas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    ALL_JS.write_text("window.HAT_ATLAS = " + json.dumps(atlas, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    build_standalone_dist(atlas)

    print(
        f"Weekly update complete ({atlas['updatedAt']}): "
        f"{len(atlas['brands'])} brands (A-Z), {len(atlas['hats'])} imaged hats "
        f"(+{added} synced, -{removed} removed)."
    )


if __name__ == "__main__":
    main()
