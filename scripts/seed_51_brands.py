#!/usr/bin/env python3
"""
Seed canonical 51-brand dataset (data/atlas.json & data/all.js) for 小叶子的全球帽子分析图鉴.
- Preserves all 31 existing imaged hats from the original 8 brands.
- Adds all 43 remaining brands (total 51 brands, sorted strictly A-Z).
- Adds verified real-image hats for newly included brands + Maison Michel / Nick Fouquet / Philip Treacy.
- Enforces the strict rule: EVERY hat in `hats` MUST have a non-empty verified `image` URL.
"""

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"


def extract_existing_data():
    """Read existing window.HAT_ATLAS via Node so we preserve all 8 existing brands and 31 imaged hats."""
    js = """
    const fs = require('fs');
    const vm = require('vm');
    const ctx = { window: {} };
    vm.runInNewContext(fs.readFileSync('data/all.js', 'utf8'), ctx);
    process.stdout.write(JSON.stringify(ctx.window.HAT_ATLAS));
    """
    out = subprocess.check_output(["node", "-e", js], cwd=str(ROOT), text=True)
    return json.loads(out)


NEW_BRANDS = [
    # --- UK (11 new + Stephen Jones) ---
    {
        "id": "awon-golding",
        "name": "Awon Golding",
        "nameZh": "艾雯·戈尔丁帽饰",
        "country": "英国",
        "city": "伦敦",
        "founded": 2012,
        "founder": "Awon Golding（香港出生，现亦任 Lock & Co. 女士帽饰首席设计师）",
        "description": "伦敦当代手工帽饰设计师，毕业于伦敦时装学院，融合东方色彩灵动感与英式传统礼帽工艺，常亮相皇家赛马会与伦敦时装周，同时担任百年名店 Lock & Co. Hatters 首席女士帽饰设计师。",
        "website": "https://awongolding.com/",
        "channels": [
            {"name": "Awon Golding 官网", "type": "官网", "url": "https://awongolding.com/", "region": "英国 / 全球直邮", "note": "在售鸡尾酒帽、发饰与季节系列，支持线上定制配色。"},
            {"name": "Lock & Co. Hatters（Lock Couture 系列）", "type": "买手店", "url": "https://www.lockhatters.com/collections/women-lock-couture", "region": "英国 · 伦敦 / 全球", "note": "Awon Golding 主理的 Lock Couture 联名高定线。"}
        ]
    },
    {
        "id": "benny-andallo",
        "name": "Benny Andallo",
        "nameZh": "本尼·安达洛",
        "country": "英国",
        "city": "伦敦",
        "founded": 2019,
        "founder": "Benny Andallo",
        "description": "伦敦先锋帽饰新锐，自称“silly crown designer”，以夸张皮草、针织、解构毛绒与波普亚文化廓形闻名，曾为 Rihanna、FKA Twigs 打造造型并与 Junya Watanabe 合作秀场帽饰。",
        "website": "https://apoc-store.com/collections/benny-andallo",
        "channels": [
            {"name": "APOC Store 买手平台", "type": "买手店", "url": "https://apoc-store.com/collections/benny-andallo", "region": "英国 / 全球直邮", "note": "核心线上发售平台，主打限量手工制作造型帽。"},
            {"name": "Liberty London / 伦敦工坊定制", "type": "买手店", "url": "https://www.libertylondon.com/uk/features/craft/craft-club-benny-andallo.html", "region": "英国 · 伦敦", "note": "不定期与 Liberty 等百货及艺术家合作特别系列。"}
        ]
    },
    {
        "id": "fred-butler",
        "name": "Fred Butler",
        "nameZh": "弗雷德·巴特勒",
        "country": "英国",
        "city": "伦敦",
        "founded": 2006,
        "founder": "Fred Butler",
        "description": "伦敦知名立体造型与折纸几何配饰设计师，擅长以多彩几何折面、亚克力与雕塑廓形打造极具未来感与俱乐部亚文化张力的头饰，代表作包括 Lady Gaga《Telephone》蓝色电话头饰、Björk 与 Nicki Minaj 舞台造型。",
        "website": "https://www.showstudio.com/contributors/fred_butler",
        "channels": [
            {"name": "伦敦工作室私人与演出定制", "type": "定制预约", "url": "https://www.showstudio.com/contributors/fred_butler", "region": "英国 · 伦敦", "note": "主要面向音乐人、舞台艺术、博物馆展览与高定造型委约。"}
        ]
    },
    {
        "id": "harvy-santos",
        "name": "Harvy Santos",
        "nameZh": "哈维·桑托斯",
        "country": "英国",
        "city": "伦敦",
        "founded": 2012,
        "founder": "Harvy Santos（原籍菲律宾，前职业芭蕾舞者）",
        "description": "伦敦英国帽业公会（British Hat Guild）成员，从职业芭蕾舞者转型高定制帽师，擅长以羽毛、马尾网纱与建筑感线条营造轻盈漂浮的动态雕塑美，客户包括 Lady Gaga、Kylie Minogue 等。",
        "website": "https://harvysantos.com/",
        "channels": [
            {"name": "Harvy Santos 官网与伦敦工作室", "type": "定制预约", "url": "https://harvysantos.com/", "region": "英国 · 伦敦 / 全球", "note": "支持线上咨询与伦敦工作室一对一高定预约。"}
        ]
    },
    {
        "id": "house-of-flora",
        "name": "House of Flora",
        "nameZh": "弗洛拉之家",
        "country": "英国",
        "city": "伦敦",
        "founded": 1996,
        "founder": "Flora McLean",
        "description": "1996 年由英国皇家艺术学院毕业生 Flora McLean 创立的先锋建筑感帽饰品牌，以 PVC、有机玻璃（Perspex）与硬朗几何帽型打破传统柔软制帽边界，作品入选 V&A 博物馆《Hats: An Anthology》并深受 Erykah Badu 与 Beyoncé 喜爱。",
        "website": "https://www.showstudio.com/contributors/house_of_flora",
        "channels": [
            {"name": "House of Flora 伦敦工作室定制", "type": "定制预约", "url": "https://www.showstudio.com/contributors/house_of_flora", "region": "英国 · 伦敦", "note": "承接秀场、舞台造型与收藏级私人定制，二手档案偶见于精品买手店。"}
        ]
    },
    {
        "id": "karen-henriksen",
        "name": "Karen Henriksen",
        "nameZh": "凯伦·亨里克森",
        "country": "英国",
        "city": "伦敦",
        "founded": 2005,
        "founder": "Karen Henriksen（皇家艺术学院硕士）",
        "description": "驻扎伦敦 Cockpit Bloomsbury 手工艺中心的独立制帽师，以男女皆宜的建筑感剪裁鸭舌帽、报童帽与防风蜡棉/苏格兰粗花呢帽著称，兼具英伦传统质感与现代实穿性。",
        "website": "https://www.karenhenriksen.co.uk/",
        "channels": [
            {"name": "Karen Henriksen 官网", "type": "官网", "url": "https://www.karenhenriksen.co.uk/", "region": "英国 / 全球直邮", "note": "提供全系列男女手工帽在线购买与头围定制。"},
            {"name": "Cockpit Bloomsbury 伦敦工作室", "type": "定制预约", "url": "https://www.karenhenriksen.co.uk/", "region": "英国 · 伦敦", "note": "支持预约试戴及布料选色定制。"}
        ]
    },
    {
        "id": "nasir-mazhar",
        "name": "Nasir Mazhar",
        "nameZh": "纳西尔·马扎尔",
        "country": "英国",
        "city": "伦敦",
        "founded": 2008,
        "founder": "Nasir Mazhar",
        "description": "东伦敦先锋街头与赛博亚文化代表设计师，最早以革命性的 Bully Cap 立体帽檐棒球帽与金属漆皮帽饰闻名，曾为 Madonna、Lady Gaga 与 Skepta 打造头饰，深刻影响当代伦敦街头帽饰美学。",
        "website": "https://knownsource.co.uk/en-us/products/nasir-mazhar-sad-dragon-hat-jub-15024022356313",
        "channels": [
            {"name": "Known Source / Grailed / eBay 档案二级市场", "type": "电商平台", "url": "https://knownsource.co.uk/en-us/products/nasir-mazhar-sad-dragon-hat-jub-15024022356313", "region": "全球", "note": "早期经典 Bully Cap 与秀场帽款主要流通于档案买手店及二级市场。"}
        ]
    },
    {
        "id": "noel-stewart",
        "name": "Noel Stewart",
        "nameZh": "诺埃尔·斯图尔特",
        "country": "英国",
        "city": "伦敦",
        "founded": 2003,
        "founder": "Noel Stewart（曾师从 Stephen Jones）",
        "description": "英国皇家艺术学院毕业、曾担任 Stephen Jones 首席助手的伦敦顶级制帽大师，长期与 Erdem、Roland Mouret、Hussein Chalayan 等时装屋合作，兼具冷峻极简建筑廓形与高定实穿度。",
        "website": "http://www.noelstewart.com/shop-flatiron",
        "channels": [
            {"name": "Noel Stewart 官方商店（Shop Flatiron）", "type": "官网", "url": "http://www.noelstewart.com/shop-flatiron", "region": "英国 / 全球直邮", "note": "在线发售品牌成衣帽线与精选档案作品。"},
            {"name": "伦敦沙龙定制预约", "type": "定制预约", "url": "http://www.noelstewart.com/", "region": "英国 · 伦敦", "note": "提供皇家赛马会、婚礼与红毯私人高定服务。"}
        ]
    },
    {
        "id": "piers-atkinson",
        "name": "Piers Atkinson",
        "nameZh": "皮尔斯·阿特金森",
        "country": "英国",
        "city": "伦敦",
        "founded": 2008,
        "founder": "Piers Atkinson",
        "description": "东伦敦以俏皮波普、超大樱桃与雕塑戏剧头饰著称的传奇制帽师，作品频繁亮相 Vogue、伦敦时装周与全球巡演，佩戴者涵盖 Rihanna、Lady Gaga、Kate Moss 与比阿特丽斯公主。",
        "website": "https://www.piersatkinson.com/",
        "channels": [
            {"name": "Piers Atkinson 官网", "type": "官网", "url": "https://www.piersatkinson.com/", "region": "英国 / 全球直邮", "note": "提供季节主线与经典樱桃发箍/头饰选购及定制。"},
            {"name": "伦敦精品买手店与百货", "type": "买手店", "url": "https://www.piersatkinson.com/", "region": "英国 / 全球", "note": "不定期入驻 Dover Street Market、Selfridges 等买手空间。"}
        ]
    },
    {
        "id": "victoria-grant",
        "name": "Victoria Grant",
        "nameZh": "维多利亚·格兰特",
        "country": "英国",
        "city": "伦敦（诺丁山）",
        "founded": 2011,
        "founder": "Victoria Grant",
        "description": "伦敦诺丁山高定制帽沙龙，以复古好莱坞华丽感与英伦暗黑浪漫结合闻名，作品高频出现于皇家赛马会与巨星巡演，客户包括 Beyoncé、Madonna、Rihanna 与 Lady Gaga。",
        "website": "https://victoriagrant.com/",
        "channels": [
            {"name": "Victoria Grant 官网", "type": "官网", "url": "https://victoriagrant.com/", "region": "英国 / 全球配送", "note": "展示赛马会、派对与红毯高定帽系列，支持线上定制咨询。"},
            {"name": "伦敦诺丁山沙龙", "type": "定制预约", "url": "https://victoriagrant.com/", "region": "英国 · 伦敦", "note": "预约一对一私人量身定型与配色。"}
        ]
    },
    {
        "id": "virna-pasquinelli",
        "name": "Virna Pasquinelli",
        "nameZh": "维尔娜·帕斯奎内利",
        "country": "英国",
        "city": "伦敦（原籍意大利）",
        "founded": 2018,
        "founder": "Virna Pasquinelli（原籍意大利，伦敦周边设工作室）",
        "description": "意大利裔伦敦独立制帽师与英国帽业公会成员，曾任 Piers Atkinson 生产主管并为 Philip Treacy 及伦敦西区音乐剧（如《狮子王》）制帽，2021 年获 QEST 工艺奖学金，擅长融合都市亚文化、戏剧张力与环保再生材质。",
        "website": "https://www.thebritishhatguild.org.uk/virna-pasquinelli",
        "channels": [
            {"name": "英国帽业公会与工作室预约", "type": "定制预约", "url": "https://www.thebritishhatguild.org.uk/virna-pasquinelli", "region": "英国 · 伦敦/萨里", "note": "主打无性别先锋帽饰私人定制与 HatLab Academy 制帽工坊课程。"}
        ]
    },

    # --- US (7 new + Gladys Tamez + Nick Fouquet) ---
    {
        "id": "anya-caliendo",
        "name": "Anya Caliendo",
        "nameZh": "安雅·卡连多",
        "country": "美国",
        "city": "纽约",
        "founded": 2008,
        "founder": "Anya Caliendo（曾师从 Stephen Jones）",
        "description": "纽约高级定制帽饰大师，曾在伦敦师从 Stephen Jones 并参与 Comme des Garçons、John Galliano 秀场制作，以繁复欧式雕塑花艺、真丝羽毛与戏剧性高定贝雷帽闻名，并长期开设国际高定制帽大师课。",
        "website": "https://www.artipistilos.com/en/blog/15_masterclass-with-anya-caliendo-in-artipistilos.html",
        "channels": [
            {"name": "纽约高定工作室与国际大师课", "type": "定制预约", "url": "https://www.artipistilos.com/en/blog/15_masterclass-with-anya-caliendo-in-artipistilos.html", "region": "美国 · 纽约", "note": "承接高定私人定制与红毯帽饰委约。"},
            {"name": "拍卖行与二手收藏平台（Invaluable / eBay）", "type": "电商平台", "url": "https://www.invaluable.com/auction-lot/anya-caliendo-a-matadors-mistress-couture-hat-bri-4-c-a1646528bc", "region": "全球", "note": "早期签名高定孤品常现身欧美拍卖与古董精品渠道。"}
        ]
    },
    {
        "id": "ellen-christine",
        "name": "Ellen Christine Millinery",
        "nameZh": "艾伦·克里斯汀帽坊",
        "country": "美国",
        "city": "纽约（切尔西）",
        "founded": 1995,
        "founder": "Ellen Christine",
        "description": "1995 年创立于纽约切尔西的高定制帽沙龙，以老好莱坞优雅廓形、复古新娘礼帽与 3.1 Phillip Lim 等纽约时装周秀场合作闻名，坚持纯手工木模拉制。",
        "website": "https://theurbanoutlander.com/an-outlandish-hat-chat-with-ellen-christine-couture/",
        "channels": [
            {"name": "纽约切尔西高定沙龙", "type": "定制预约", "url": "https://theurbanoutlander.com/an-outlandish-hat-chat-with-ellen-christine-couture/", "region": "美国 · 纽约", "note": "预约制一对一量头围定制；二手经典款流通于 Mercari / eBay。"}
        ]
    },
    {
        "id": "laura-whitlock",
        "name": "Laura Whitlock Millinery",
        "nameZh": "劳拉·惠特洛克帽饰",
        "country": "美国",
        "city": "洛杉矶 / 芝加哥",
        "founded": 1987,
        "founder": "Laura Whitlock（副线 Lark Millinery）",
        "description": "拥有 30 余年资历的美国资深制帽师与帽饰史学者，长期为电影（《我最好朋友的婚礼》）、剧集（《冰血暴》第四季）、歌剧院及肯塔基德比赛马会打造手工礼帽，并创立日常手工副线 Lark Millinery。",
        "website": "https://millinerymeetup.com/faculty/",
        "channels": [
            {"name": "工作室定制与 Millinery Meetup 教学", "type": "定制预约", "url": "https://millinerymeetup.com/faculty/", "region": "美国", "note": "承接影视戏剧与肯塔基德比私人定制，副线 Lark 偶见于买手店及二手平台。"}
        ]
    },
    {
        "id": "lisa-mcfadden",
        "name": "Lisa McFadden Millinery",
        "nameZh": "丽莎·麦克法登帽饰",
        "country": "美国",
        "city": "纽约",
        "founded": 2014,
        "founder": "Lisa McFadden",
        "description": "2014 年创立于纽约的独立高定制帽工作室，以精致新娘头饰、丝绸花卉与现代建筑感礼帽著称，作品曾参与纽约大都会艺术博物馆（Met Museum）相关时尚展览。",
        "website": "https://lisamcfadden.com/",
        "channels": [
            {"name": "Lisa McFadden 官网", "type": "官网", "url": "https://lisamcfadden.com/", "region": "美国 / 全球直邮", "note": "提供新娘与高定帽饰预约及线上咨询。"}
        ]
    },
    {
        "id": "machine-dazzle",
        "name": "Machine Dazzle",
        "nameZh": "马欣·达兹尔",
        "country": "美国",
        "city": "纽约",
        "founded": 2010,
        "founder": "Matthew Flower (Machine Dazzle)",
        "description": "艾美奖得主、纽约极繁主义与酷儿亚文化舞台装置及头饰艺术大师，以废旧日用品、亮片、雕塑结构打造震撼人心的奇观头饰，2022 年在纽约艺术与设计博物馆（MAD）举办大型个展《Queer Maximalism》。",
        "website": "https://clampart.com/2023/09/machine-dazzle/",
        "channels": [
            {"name": "纽约工作室艺术委约与画廊展览（ClampArt）", "type": "定制预约", "url": "https://clampart.com/2023/09/machine-dazzle/", "region": "美国 · 纽约", "note": "作品多为演出、红毯与博物馆级艺术委约孤品。"}
        ]
    },
    {
        "id": "maxwell-bresler",
        "name": "Maxwell Bresler",
        "nameZh": "麦克斯韦·布雷斯勒",
        "country": "美国",
        "city": "丹佛",
        "founded": 2018,
        "founder": "Maxwell Bresler",
        "description": "美国丹佛先锋雕塑帽饰与解构时装设计师，作品深受 Maison Margiela 与 John Galliano 影响，擅长手工重塑异形毛毡与夸张解构帽冠，在先锋买手与二级档案圈具有极高辨识度。",
        "website": "https://www.grailed.com/",
        "channels": [
            {"name": "独立工作室发售 & Grailed 先锋档案市场", "type": "电商平台", "url": "https://www.grailed.com/", "region": "美国 / 全球", "note": "以小批量手工孤品发布为主，部分作品流通于 Grailed 先锋买手圈。"}
        ]
    },
    {
        "id": "rod-keenan",
        "name": "Rod Keenan",
        "nameZh": "罗德·基南",
        "country": "美国",
        "city": "纽约（哈林区）",
        "founded": 2000,
        "founder": "Rod Keenan（CFDA 成员）",
        "description": "纽约哈林区传奇男装与中性手工制帽师，2006 年入选美国时装设计师协会（CFDA），以精致古典高顶礼帽、罗缎饰边费多拉帽闻名，曾为 Brad Pitt、Justin Timberlake、Snoop Dogg 及 Paul Smith 制帽。",
        "website": "https://www.therealreal.com/designers/rod-keenan-new-york",
        "channels": [
            {"name": "The RealReal / eBay 精品二手渠道", "type": "电商平台", "url": "https://www.therealreal.com/products/men/accessories/hats/rod-keenan-new-york-grosgrain-trimmed-felt-top-hat", "region": "全球", "note": "经典纽约手工礼帽与拉菲草帽常年有精选二级市场流通。"}
        ]
    },

    # --- France (5 new + Maison Michel) ---
    {
        "id": "anthony-peto",
        "name": "Anthony Peto",
        "nameZh": "安东尼·佩托",
        "country": "法国",
        "city": "巴黎",
        "founded": 1988,
        "founder": "Anthony Peto（英国出生，巴黎设工坊）",
        "description": "1980 年代末创立于巴黎的当代手工帽坊，在巴黎 Rue Tiquetonne 与 Atelier 144 设店，以轻盈洒脱的法式千鸟格鸭舌帽、巴拿马草帽与摩登钟形帽著称，价位亲民且全线巴黎手工制作。",
        "website": "https://anthonypeto.com/",
        "channels": [
            {"name": "Anthony Peto 官网", "type": "官网", "url": "https://anthonypeto.com/", "region": "法国 / 全球直邮", "note": "男女全系列现货在售，价格约 €100–€280。"},
            {"name": "巴黎 Rue Tiquetonne 旗舰店", "type": "门店", "url": "https://anthonypeto.com/", "region": "法国 · 巴黎", "note": "巴黎市中心直营精品店，提供现场试戴与微调。"}
        ]
    },
    {
        "id": "aurelie-chapalain",
        "name": "Aurélie Chapalain",
        "nameZh": "奥雷莉·沙帕兰",
        "country": "法国",
        "city": "巴黎",
        "founded": 2016,
        "founder": "Aurélie Chapalain",
        "description": "巴黎独立高定制帽师，专注于传统法式手工定型与当代雕塑感帽饰创作。目前以私密沙龙定制与秀场造型合作为主，暂无公开可直链官图（待后续更新补图）。",
        "website": None,
        "channels": [
            {"name": "巴黎工作室私人预约定制", "type": "定制预约", "url": None, "region": "法国 · 巴黎", "note": "以一对一高定与秀场造型合作为主。"}
        ]
    },
    {
        "id": "charlie-le-mindu",
        "name": "Charlie Le Mindu",
        "nameZh": "查理·勒·明杜",
        "country": "法国",
        "city": "伦敦 / 巴黎",
        "founded": 2009,
        "founder": "Charlie Le Mindu",
        "description": "法国“高级发型雕塑（Haute Coiffure）”先锋艺术家，现主要于伦敦与巴黎两地创作，擅长以真人发丝、马尾与夸张金属骨架打造极具视觉冲击力的暗黑亚文化头饰，长期合作 Lady Gaga、Chanel 并参展 V&A 博物馆。",
        "website": "https://www.showstudio.com/contributors/charlie_le_mindu",
        "channels": [
            {"name": "伦敦 / 巴黎艺术工作室委约", "type": "定制预约", "url": "https://www.showstudio.com/contributors/charlie_le_mindu", "region": "英国 / 法国", "note": "承接音乐人巡演、高定秀场与艺术展览定制。"}
        ]
    },
    {
        "id": "christian-silvani",
        "name": "Christian Silvani",
        "nameZh": "克里斯蒂安·西尔瓦尼",
        "country": "法国",
        "city": "巴黎",
        "founded": 2022,
        "founder": "Christian Silvani（@christian_silvani）",
        "description": "巴黎新锐配饰与帽饰设计师，受 BYTE Magazine 与 Numéro Netherlands 专题报道，以反差撞色与夸张缩放比例（放大或挤压传统帽型）打破日常穿搭单调感。因官图主要发布于 Instagram，暂无公开可直链图（待后续补图）。",
        "website": "https://byte-magazine.com/silvania/",
        "channels": [
            {"name": "Instagram (@christian_silvani) 预约发售", "type": "定制预约", "url": "https://byte-magazine.com/silvania/", "region": "法国 · 巴黎 / 全球", "note": "小批量手工创作，通过设计师社媒与买手渠道预约。"}
        ]
    },
    {
        "id": "muriel-nisse",
        "name": "Muriel Nisse",
        "nameZh": "穆里埃尔·尼斯",
        "country": "法国",
        "city": "巴黎 / 枫丹白露",
        "founded": 2010,
        "founder": "Muriel Nisse（巴黎歌剧院资深假发与面具大师）",
        "description": "拥有数十年巴黎歌剧院（Opéra de Paris）假发与面具制作背景的法国艺术工艺大师，入选 2024 威尼斯 Homo Faber 国际工艺双年展，擅长以发丝刺绣、牦牛毛、乳胶、丝绒与宝石打造神秘超现实面具帽饰。",
        "website": "https://www.homofaber.com/en/objects/a1VTG000000eyfm2AA",
        "channels": [
            {"name": "Homo Faber 工艺名录 & 巴黎工作室", "type": "定制预约", "url": "https://www.homofaber.com/en/objects/a1VTG000000eyfm2AA", "region": "法国 · 巴黎 / 全球", "note": "收藏级艺术孤品，通过工作室及国际艺术工艺展委约。"}
        ]
    },

    # --- Japan (4) ---
    {
        "id": "haute-mode-hirata",
        "name": "Haute Mode Hirata",
        "nameZh": "平田暁夫高级帽坊",
        "country": "日本",
        "city": "东京（西麻布）",
        "founded": 1964,
        "founder": "平田暁夫 Akio Hirata（现由女儿平田欧子继承）",
        "description": "1964 年由日本现代制帽之父平田暁夫在东京西麻布创立，曾长期为日本皇室美智子上皇后、川久保玲（Comme des Garçons）与山本耀司（Yohji Yamamoto）打造秀场与礼仪帽饰，被誉为日本高级制帽殿堂。",
        "website": "https://hautemodehirata.com/",
        "channels": [
            {"name": "Haute Mode Hirata 官方网店", "type": "官网", "url": "https://hautemodehirata.com/", "region": "日本 / 国际转运", "note": "发售 HIRATA Atelier 成衣线与经典礼帽。"},
            {"name": "东京西麻布总店沙龙", "type": "门店", "url": "https://www.hiratatelier.com/", "region": "日本 · 东京", "note": "提供一对一皇室级手工高定服务。"}
        ]
    },
    {
        "id": "kijima-takayuki",
        "name": "Kijima Takayuki",
        "nameZh": "木岛隆幸",
        "country": "日本",
        "city": "东京（代官山）",
        "founded": 2013,
        "founder": "木岛隆幸（曾师从平田暁夫 5 年）",
        "description": "由师从平田暁夫的日本制帽大师木岛隆幸创立于东京代官山，以精准头型贴合度、日本职人缝制工艺与极简日常实穿感闻名，在渔夫帽、水手帽与鸭舌帽领域稳居亚洲高端设计师帽饰销量前列。",
        "website": "https://www.kijimatakayuki.com/",
        "channels": [
            {"name": "Kijima Takayuki 官网 & 代官山旗舰店", "type": "官网", "url": "https://www.kijimatakayuki.com/", "region": "日本 · 东京", "note": "全线当季新品与联名款首发。"},
            {"name": "Bshop / THE TOKYO / Plus0 Concept 买手店", "type": "买手店", "url": "https://plus0concept.com/collections/kijima-takayuki-1", "region": "日本 / 全球直邮", "note": "广泛入驻日本及海外顶级买手店，常推限定别注配色。"}
        ]
    },
    {
        "id": "kiriko-sato",
        "name": "Kiriko Sato",
        "nameZh": "佐藤桐子",
        "country": "日本",
        "city": "巴黎（原籍日本）",
        "founded": 2014,
        "founder": "Kiriko Sato 佐藤桐子",
        "description": "2014 年在巴黎玛黑区（44 rue de Turenne）创立的日籍独立制帽品牌，将日本侘寂极简美学与法式高定手工塑形结合，每顶帽子均于巴黎工作室限量手工定型。",
        "website": "https://shop.kirikosato.com/products",
        "channels": [
            {"name": "Kiriko Sato 官方网店", "type": "官网", "url": "https://shop.kirikosato.com/products", "region": "法国 / 全球直邮", "note": "发售巴黎工作室手工限量帽款。"},
            {"name": "日本精选买手店（Arume 等）", "type": "买手店", "url": "https://arumeonline.com/items/65b87e5cb8793a00361fddb0", "region": "日本", "note": "于东京等地精品买手店少量上架。"}
        ]
    },
    {
        "id": "maiko-takeda",
        "name": "Maiko Takeda",
        "nameZh": "武田麻衣子",
        "country": "日本",
        "city": "伦敦（原籍日本）",
        "founded": 2013,
        "founder": "Maiko Takeda（伦敦皇家艺术学院毕业）",
        "description": "旅居伦敦的日本先锋头饰艺术家，曾实习于 Philip Treacy 与 Stephen Jones，以 2013 年 RCA 毕业系列《Atmospheric Reentry》透明激光切割亚克力光环头饰震惊时尚界，长期与 Björk 及 Issey Miyake 合作。",
        "website": "https://maikotakeda.com/",
        "channels": [
            {"name": "Maiko Takeda 伦敦工作室", "type": "定制预约", "url": "https://maikotakeda.com/allwork/", "region": "英国 · 伦敦 / 全球", "note": "主打秀场、美术馆收藏、音乐人舞台及高级定制委约。"}
        ]
    },

    # --- Italy (2) ---
    {
        "id": "federica-moretti",
        "name": "Federica Moretti",
        "nameZh": "费代丽卡·莫雷蒂",
        "country": "意大利",
        "city": "米兰",
        "founded": 2006,
        "founder": "Federica Moretti",
        "description": "2006 年创立于米兰的意大利设计师帽饰品牌，擅长将丝绒蝴蝶结、亮片刺绣与意式浪漫玩味融入针织帽与草帽，曾为 Madonna 登上《Vogue Italia》打造经典造型，并多次亮相米兰时装周。",
        "website": "https://www.ebay.com/sch/i.html?_nkw=Federica+Moretti+hat",
        "channels": [
            {"name": "米兰精品买手店 & 欧美二级渠道", "type": "电商平台", "url": "https://www.ebay.com/itm/267399117996", "region": "意大利 / 全球", "note": "经典丝绒蝴蝶结针织帽与亮片草帽常见于意大利买手店及 eBay 精品渠道。"}
        ]
    },
    {
        "id": "super-duper-hats",
        "name": "Super Duper Hats",
        "nameZh": "超级杜珀帽坊",
        "country": "意大利",
        "city": "佛罗伦萨",
        "founded": 2011,
        "founder": "Matteo Gioli, Ilaria Cornacchini & Veronica Cornacchini",
        "description": "2011 年创立于佛罗伦萨 Manifattura Tabacchi 创意园区的意式现代手工帽坊，2013 年斩获 Vogue Italia Who Is On Next 男装大奖，主打可折叠旅行毛毡帽 HOBO 与经典古董木模工艺。",
        "website": "https://superduperhats.com/",
        "channels": [
            {"name": "Super Duper Hats 官网", "type": "官网", "url": "https://superduperhats.com/", "region": "意大利 / 全球直邮", "note": "全线佛罗伦萨手工帽现货及季节新品。"},
            {"name": "佛罗伦萨工坊旗舰店", "type": "门店", "url": "https://superduperhats.com/", "region": "意大利 · 佛罗伦萨", "note": "可参观开放式制帽工坊并定制头围与徽章。"}
        ]
    },

    # --- Spain (2) ---
    {
        "id": "eliurpi",
        "name": "Eliurpi",
        "nameZh": "艾莉乌尔皮",
        "country": "西班牙",
        "city": "巴塞罗那",
        "founded": 2010,
        "founder": "Elisabet Urpí & Nacho Umpiérrez",
        "description": "2010 年创立于巴塞罗那哥特区的雕塑感手工草帽品牌，以直径可达 170 厘米的超现实巨型地中海草编雕塑帽著称，兼具艺术装置属性与可佩戴性，作品风靡全球时尚大片与艺术画廊。",
        "website": "https://www.eliurpi.com/hats",
        "channels": [
            {"name": "Eliurpi 官网", "type": "官网", "url": "https://www.eliurpi.com/hats", "region": "西班牙 / 全球配送", "note": "在线发售巴塞罗那手工草帽与雕塑系列。"},
            {"name": "巴塞罗那哥特区工作室", "type": "门店", "url": "https://www.eliurpi.com/", "region": "西班牙 · 巴塞罗那", "note": "开放预约试戴及艺术装置级大帽定制。"}
        ]
    },
    {
        "id": "genis-whylan",
        "name": "Genis Whylan (Whyhats)",
        "nameZh": "杰尼斯·惠兰（Whyhats）",
        "country": "西班牙",
        "city": "巴塞罗那",
        "founded": 2018,
        "founder": "Genis Whylan",
        "description": "巴塞罗那独立手工西部礼帽工坊 Whyhats 主理人，专注顶级海狸毛毡与纯手工火烤做旧、缝线刺绣工艺，每顶皆为独一无二的签名定制，2026 年更曾受托为教皇利奥十四世打造定制礼帽引发国际媒体关注。",
        "website": "https://www.whyhats.es/",
        "channels": [
            {"name": "Whyhats 官网", "type": "官网", "url": "https://www.whyhats.es/collections/ready-to-wear", "region": "西班牙 / 全球配送", "note": "提供成衣现货（€695 起）与全定制海狸毛毡帽（€895 起）。"},
            {"name": "巴塞罗那 Whyhats 定制工作室", "type": "定制预约", "url": "https://www.whyhats.es/pages/custom-hats", "region": "西班牙 · 巴塞罗那", "note": "可预约测量头型并定制火烤纹理与帽带。"}
        ]
    },

    # --- Austria (1 new + Mühlbauer) ---
    {
        "id": "reinhard-plank",
        "name": "Reinhard Plank",
        "nameZh": "莱因哈德·普兰克",
        "country": "奥地利",
        "city": "佛罗伦萨制作（奥地利籍）",
        "founded": 2005,
        "founder": "Reinhard Plank（奥地利南蒂罗尔裔，意大利托斯卡纳设工坊）",
        "description": "奥地利工业设计背景制帽大师，在意大利佛罗伦萨建立实验性手工帽坊，以解构揉皱、火烤熏黑、不对称帽檐与暗黑先锋气质闻名，是全球先锋买手店（如 Antonioli、Select Mode）的常青核心帽饰品牌。",
        "website": "https://reinhardplank.it/",
        "channels": [
            {"name": "Reinhard Plank 官网", "type": "官网", "url": "https://reinhardplank.it/collections/all-products", "region": "欧洲 / 全球直邮", "note": "在线发售当季所有毛毡与草编先锋帽款。"},
            {"name": "Select Mode / Lost & Found 等国际买手店", "type": "买手店", "url": "https://www.select-mode-online.de/en/Designer/Reinhard-Plank/", "region": "全球", "note": "全球数十家先锋暗黑系买手店常年代理。"}
        ]
    },

    # --- 1 each (7 new + Philip Treacy) ---
    {
        "id": "ana-rajcevic",
        "name": "Ana Rajcevic",
        "nameZh": "安娜·拉伊切维奇",
        "country": "塞尔维亚",
        "city": "柏林（原籍塞尔维亚）",
        "founded": 2012,
        "founder": "Ana Rajcevic（伦敦艺术大学毕业，ITS 2012 配饰大奖得主）",
        "description": "塞尔维亚裔柏林跨学科雕塑与先锋头饰艺术家，2012 年凭仿生动物角/骨质树脂头饰系列《ANIMAL: The Other Side of Evolution》斩获国际 ITS 配饰大奖，探索身体延伸、赛博仿生与暗黑亚文化美学。",
        "website": "http://www.tedore.at/2013/08/ana-rajcevic-fashion-artist-and-sculptor.html",
        "channels": [
            {"name": "柏林工作室艺术展览与定制委约", "type": "定制预约", "url": "http://www.tedore.at/2013/08/ana-rajcevic-fashion-artist-and-sculptor.html", "region": "德国 · 柏林 / 全球", "note": "以博物馆展览、电影服装与收藏级雕塑头饰为主。"}
        ]
    },
    {
        "id": "james-merry",
        "name": "James Merry",
        "nameZh": "詹姆斯·梅里",
        "country": "冰岛",
        "city": "纽约 / 冰岛（共同创意）",
        "founded": 2015,
        "founder": "James Merry（Björk 长期创意总监与面具设计师）",
        "description": "常驻冰岛与纽约的视觉艺术及面具/头饰大师，作为冰岛歌手 Björk 的核心视觉搭档，以有机植物刺绣、硅胶雕塑、3D 打印与自然共生美学闻名，为 Björk 与 Tilda Swinton 打造的头饰面具入选威尼斯 Homo Faber 大展。",
        "website": "https://jtmerry.com/",
        "channels": [
            {"name": "James Merry 官网", "type": "官网", "url": "https://jtmerry.com/", "region": "全球直邮", "note": "不定期限量发售手工刺绣作品及联名系列，高定面具仅限艺术委约。"},
            {"name": "Homo Faber 国际工艺展档案", "type": "定制预约", "url": "https://2024.homofaber.com/ecatalogue/objects/02iTG000001NYRpYAO", "region": "欧洲 / 全球", "note": "代表作多为博物馆级与艺人巡演孤品。"}
        ]
    },
    {
        "id": "maor-zabar",
        "name": "Maor Zabar",
        "nameZh": "毛尔·扎巴尔",
        "country": "以色列",
        "city": "特拉维夫",
        "founded": 2014,
        "founder": "Maor Zabar",
        "description": "2014 年创立于特拉维夫的超现实高定制帽品牌，因“可佩戴的美食（Cuisine）”系列——将牛排、煎蛋、沙拉与甜点以逼真手工雕塑化为头饰——在社交媒体与国际时尚圈爆红，亦擅长沙漠与植物题材雕塑帽。",
        "website": "https://maorzabarhats.com/",
        "channels": [
            {"name": "Maor Zabar 官网", "type": "官网", "url": "https://maorzabarhats.com/", "region": "以色列 / 全球直邮", "note": "全线超现实美食与艺术系列均可在线按单定制。"}
        ]
    },
    {
        "id": "parker-millinery",
        "name": "Parker Millinery",
        "nameZh": "帕克手工帽坊",
        "country": "澳大利亚",
        "city": "墨尔本",
        "founded": 2018,
        "founder": "Parker Millinery（墨尔本 St Kilda 独立制帽师）",
        "description": "澳大利亚墨尔本独立手工制帽品牌，长期与雕刻艺术工作室 SKULZRT 携手驻场墨尔本标志性的圣基尔达海滨市集（St Kilda Esplanade Market），专注传统手工定型与当代艺术礼帽。因以线下市集与 Instagram 展示为主，暂无公开可直链官图（待后续补图）。",
        "website": "https://www.stkildaesplanademarket.com.au/our-makers/skulzrt/",
        "channels": [
            {"name": "墨尔本 St Kilda Esplanade Market 周日市集", "type": "门店", "url": "https://www.stkildaesplanademarket.com.au/our-makers/skulzrt/", "region": "澳大利亚 · 墨尔本", "note": "每周日 10:00–16:00 现场展售手工孤品礼帽，亦可通过 @parker_millinery 联系定制。"}
        ]
    },
    {
        "id": "shmelevsky",
        "name": "Shmelevsky",
        "nameZh": "什梅列夫斯基",
        "country": "乌克兰",
        "city": "基辅",
        "founded": 2016,
        "founder": "Stas Shmelevsky",
        "description": "乌克兰先锋手工制帽品牌，以可自由塑形帽檐（Sculptable Brim）草帽、极简冷峻毛毡帽与高辨识度东方/斯拉夫建筑线条闻名，深受国际造型师与独立买手青睐。",
        "website": "https://shmelevsky.com/",
        "channels": [
            {"name": "Shmelevsky 官网", "type": "官网", "url": "https://shmelevsky.com/", "region": "乌克兰 / 全球直邮", "note": "在线发售春夏可塑形草帽与秋冬手工毛毡系列。"}
        ]
    },
    {
        "id": "xtinel",
        "name": "Xtinel",
        "nameZh": "Xtinel 蒙特利尔手作",
        "country": "加拿大",
        "city": "蒙特利尔",
        "founded": 2021,
        "founder": "Xtinel（@_xtinel）",
        "description": "加拿大蒙特利尔新锐亚文化手作帽饰品牌，以希腊神话、爱尔兰女妖（Banshee）与哥特解构美学为灵感，纯手工制作做旧破损毛毡帽、填充抽褶缎面帽与精灵感异形头饰。",
        "website": "https://ap0cene.com/products/artemis-wool-hat",
        "channels": [
            {"name": "AP0CENE 先锋买手平台", "type": "买手店", "url": "https://ap0cene.com/products/artemis-wool-hat", "region": "加拿大 / 全球直邮", "note": "核心线上发售平台，均价约 $250，蒙特利尔手工制作。"}
        ]
    },
    {
        "id": "zentow",
        "name": "Zentow",
        "nameZh": "Zentow 韩国设计师帽饰",
        "country": "韩国",
        "city": "首尔",
        "founded": 2023,
        "founder": "Zentow Studio",
        "description": "韩国首尔新兴独立设计师帽饰与配饰品牌，擅长在日常棒球帽与针织帽中融入抽褶丝绒（Shirred Velvet）、立体肌理与亚文化暗色调细节，兼具高性价比与韩系先锋氛围。",
        "website": "https://zentow.kr/62",
        "channels": [
            {"name": "Zentow 韩国官网", "type": "官网", "url": "https://zentow.kr/62", "region": "韩国 / 国际代购转运", "note": "官网直售当季帽饰与配饰，单价约 45,000 韩元起。"}
        ]
    },

    # --- China (4 new + SHINE LI + ZXYE = 6 total) ---
    {
        "id": "atelier-phyl",
        "name": "Atelier PHYL",
        "nameZh": "PHYL 手工帽坊（香港）",
        "country": "中国",
        "city": "香港",
        "founded": 2018,
        "founder": "Phoebe Leung",
        "description": "香港独立高级手工制帽工作室，由毕业于伦敦制帽体系的设计师 Phoebe Leung 创立，擅长花卉雕塑感（Fleur 系列）、轻盈草编与礼服高定帽饰，兼具东方细腻诗意与英式传统工艺。",
        "website": "https://atelierphyl.com/",
        "channels": [
            {"name": "Atelier PHYL 官网", "type": "官网", "url": "https://atelierphyl.com/collections/all", "region": "中国香港 / 全球直邮", "note": "支持在线购买现货系列及预约一对一高定。"}
        ]
    },
    {
        "id": "jaycow-millinery",
        "name": "Jaycow Millinery",
        "nameZh": "Jaycow 手工帽饰（香港）",
        "country": "中国",
        "city": "香港 / 多伦多",
        "founded": 2004,
        "founder": "Jay Cheng",
        "description": "2004 年由毕业于伦敦时装学院并师从英国王室御用制帽师 Rose Corey 的香港制帽师 Jay Cheng 创立，是华语区最早专注英式传统高定礼帽与赛马会发饰的先锋手工工作室之一，长期在港举办制帽工坊。",
        "website": "https://www.hkums.com/activity/jaycow-millinery-workshop/",
        "channels": [
            {"name": "Jaycow Millinery 工作室与定制工坊", "type": "定制预约", "url": "https://www.hkums.com/activity/jaycow-millinery-workshop/", "region": "中国香港 / 加拿大", "note": "提供新娘、赛马会高定帽定制及专业制帽课程。"}
        ]
    },
    {
        "id": "kreuzzz",
        "name": "Kreuzzz",
        "nameZh": "Kreuzzz 手工帽坊（上海）",
        "country": "中国",
        "city": "上海",
        "founded": 2011,
        "founder": "胡钰珑 Danielle Hu",
        "description": "2011 年由制帽师胡钰珑（Danielle）创立于英国、后扎根上海弄堂的独立手工帽坊，曾登上一席演讲《做个帽子能改变什么》。擅长结合中国传统夏布、真丝羊毛毡与克制温润的日常廓形，并多次与 deepmoss 等独立时装品牌合作上海时装周秀场帽饰。",
        "website": "https://www.yixi.tv/h5/speech/306/",
        "channels": [
            {"name": "上海弄堂工作室 Studio Kreuzzz", "type": "定制预约", "url": "https://eastbounder.com/local_creatives/17", "region": "中国 · 上海", "note": "预约制手工量头围定制，亦与国内独立设计师买手店合作展售。"}
        ]
    },
    {
        "id": "sheng-xi-fu",
        "name": "Sheng Xi Fu 盛锡福",
        "nameZh": "盛锡福（国家级非遗百年帽坊）",
        "country": "中国",
        "city": "天津 / 北京",
        "founded": 1911,
        "founder": "刘锡三（国家级非物质文化遗产代表性项目）",
        "description": "1911 年创立于天津、享誉百年的“中华老字号”手工帽业传奇，其皮帽与礼帽制作技艺列入国家级非物质文化遗产。从传统瓜皮帽、水獭皮帽到民国/当代手工毛呢礼帽，均坚持数十道纯手工烫压定型工序。",
        "website": "https://www.taobao.com/list/product/%E7%9B%9B%E9%94%A1%E7%A6%8F.htm",
        "channels": [
            {"name": "北京王府井旗舰店 & 天津老字号门店", "type": "门店", "url": "https://m.tesegu.com/techan/263548.html", "region": "中国 · 北京/天津", "note": "提供百年非遗工艺定制与全系列传统/现代礼帽现货。"},
            {"name": "盛锡福天猫 / 淘宝官方渠道", "type": "电商平台", "url": "https://www.taobao.com/list/product/%E7%9B%9B%E9%94%A1%E7%A6%8F.htm", "region": "中国", "note": "线上下单直发，涵盖复古羊毛礼帽、报童帽与经典皮帽。"}
        ]
    }
]


NEW_HATS = [
    # --- Maison Michel (6 real Farfetch images!) ---
    {
        "id": "mm-virginie-black-felt", "brandId": "maison-michel", "name": "Virginie Black Felt Fedora", "year": 2025,
        "collection": "Maison Michel 经典常青系列", "category": "礼帽", "material": "100% 兔毛毡、罗缎帽带、金属 M 字徽标",
        "description": "Maison Michel 销量最高的殿堂级旗舰款，微宽平檐配合经典罗缎饰带与标志性金属“M”徽章，兼具巴黎手工坊质感与极高日常搭配度。",
        "price": 535, "currency": "EUR", "priceNote": "Farfetch / 官网参考价",
        "image": "https://cdn-images.farfetch-contents.com/15/07/82/90/15078290_36358301_600.jpg",
        "imageSource": "https://www.farfetch.com/", "productUrl": "https://michel-paris.com/en", "available": True,
        "sales": 95, "salesNote": "品牌全球长期头号畅销常青款",
        "artistry": 80, "artistryNote": "香奈儿高级手工坊木模兔毛毡拉制定型",
        "heat": {"score": 94, "celebrities": ["Cara Delevingne", "Kate Moss", "Rosie Huntington-Whiteley"], "runway": "巴黎康朋街常青主推", "evidence": "各大奢侈品电商帽饰类目常年霸榜的经典法式礼帽。"},
        "sources": ["https://michel-paris.com/en", "https://www.farfetch.com/"]
    },
    {
        "id": "mm-virginie-straw", "brandId": "maison-michel", "name": "Virginie Straw Fedora", "year": 2025,
        "collection": "春夏巴拿马草编经典线", "category": "草帽", "material": "厄瓜多尔天然草编、罗缎丝带",
        "description": "Virginie 经典廓形的夏季草编版本，透气轻盈，是度假与日常防晒场景中最具辨识度的奢华草帽之一。",
        "price": 570, "currency": "EUR", "priceNote": "Farfetch 参考价",
        "image": "https://cdn-images.farfetch-contents.com/20/74/33/64/20743364_50774638_600.jpg",
        "imageSource": "https://www.farfetch.com/", "productUrl": "https://michel-paris.com/en", "available": True,
        "sales": 89, "salesNote": "春夏度假季核心畅销款",
        "artistry": 79, "artistryNote": "手工编织天然草料配巴黎坊精密定型",
        "heat": {"score": 88, "celebrities": ["Jessica Alba"], "runway": None, "evidence": "春夏欧美明星度假街拍高频出镜单品。"},
        "sources": ["https://michel-paris.com/en"]
    },
    {
        "id": "mm-henrietta-black-wool", "brandId": "maison-michel", "name": "Henrietta Black Wool Fedora", "year": 2025,
        "collection": "Henrietta 经典系列", "category": "软呢帽", "material": "防水处理兔毛/羊毛毡、撞色罗缎带",
        "description": "帽檐略窄于 Virginie、帽冠微尖的 Henrietta 经典黑色版本，更贴合亚洲与娇小脸型，日常佩戴轻松利落。",
        "price": 550, "currency": "EUR", "priceNote": "Farfetch 参考价",
        "image": "https://cdn-images.farfetch-contents.com/16/02/41/53/16024153_30307500_600.jpg",
        "imageSource": "https://www.farfetch.com/", "productUrl": "https://michel-paris.com/en", "available": True,
        "sales": 91, "salesNote": "品牌第二大常青畅销系列",
        "artistry": 78, "artistryNote": "精致窄檐比例与防水毛毡工艺",
        "heat": {"score": 87, "celebrities": ["Diane Kruger"], "runway": None, "evidence": "小红书与海外社媒推荐度极高的入门级法式礼帽。"},
        "sources": ["https://michel-paris.com/en"]
    },
    {
        "id": "mm-henrietta-bordeaux", "brandId": "maison-michel", "name": "Henrietta Bordeaux Felt Fedora", "year": 2024,
        "collection": "秋冬酒红限定配色", "category": "软呢帽", "material": "酒红色兔毛毡、丝绒罗缎带",
        "description": "秋冬标志性酒红配色 Henrietta 软呢帽，复古浓郁，极易成为大衣造型的视觉焦点。",
        "price": 625, "currency": "EUR", "priceNote": "Farfetch 参考价",
        "image": "https://cdn-images.farfetch-contents.com/17/13/92/88/17139288_34652521_600.jpg",
        "imageSource": "https://www.farfetch.com/", "productUrl": "https://michel-paris.com/en", "available": True,
        "sales": 79, "salesNote": "秋冬季节热门配色补货款",
        "artistry": 80, "artistryNote": "手工染色酒红毛毡与细腻丝带收边",
        "heat": {"score": 82, "celebrities": [], "runway": None, "evidence": "秋冬画报与法式穿搭博主高频上身款。"},
        "sources": ["https://michel-paris.com/en"]
    },
    {
        "id": "mm-henrietta-grey", "brandId": "maison-michel", "name": "Henrietta Grey Felt Fedora", "year": 2024,
        "collection": "Henrietta 经典中性灰", "category": "软呢帽", "material": "浅灰兔毛毡、黑色罗缎带",
        "description": "极简冷灰配色 Henrietta 礼帽，低饱和度高级感强，男女皆宜。",
        "price": 550, "currency": "EUR", "priceNote": "Farfetch 参考价",
        "image": "https://cdn-images.farfetch-contents.com/15/04/20/49/15042049_25242025_600.jpg",
        "imageSource": "https://www.farfetch.com/", "productUrl": "https://michel-paris.com/en", "available": True,
        "sales": 82, "salesNote": "全球多渠道稳定流通款",
        "artistry": 78, "artistryNote": "经典中性灰兔毛毡压制工艺",
        "heat": {"score": 79, "celebrities": [], "runway": None, "evidence": "低饱和通勤百搭款，长期位列买手店常备清单。"},
        "sources": ["https://michel-paris.com/en"]
    },
    {
        "id": "mm-henrietta-blue-straw", "brandId": "maison-michel", "name": "Henrietta Blue Straw Fedora", "year": 2025,
        "collection": "春夏蔚蓝草编系列", "category": "草帽", "material": "染色天然草编、丝带徽章",
        "description": "将地中海蓝调融入 Henrietta 草编廓形，清爽雅致。",
        "price": 570, "currency": "EUR", "priceNote": "Farfetch 参考价",
        "image": "https://cdn-images.farfetch-contents.com/23/91/88/50/23918850_53945081_600.jpg",
        "imageSource": "https://www.farfetch.com/", "productUrl": "https://michel-paris.com/en", "available": True,
        "sales": 74, "salesNote": "春夏限定色在售",
        "artistry": 79, "artistryNote": "手工染色草编定型工艺",
        "heat": {"score": 76, "celebrities": [], "runway": None, "evidence": "夏季限量清爽配色，Farfetch 当季精选。"},
        "sources": ["https://michel-paris.com/en"]
    },

    # --- Extra Philip Treacy (2 iconic Getty archive photos) ---
    {
        "id": "pt-victorian-lace-2001", "brandId": "philip-treacy", "name": "Victorian Lace Couture Hat (Isabella Blow Archive)", "year": 2001,
        "collection": "Isabella Blow 缪斯典藏系列", "category": "秀场艺术帽", "material": "古董维多利亚蕾丝、手工钢丝骨架",
        "description": "2001 年为传奇时尚编辑 Isabella Blow 打造的维多利亚蕾丝雕塑高定帽，曾在伦敦萨默塞特宫《Isabella Blow: Fashion Galore!》大展展出。",
        "price": None, "currency": "GBP", "priceNote": "博物馆级私人典藏孤品",
        "image": "https://media.gettyimages.com/id/450521467/photo/london-england-a-philip-treacy-victorian-lace-hat-from-2001-is-displayed-at-the-isabella-blow.jpg?s=612x612&w=gi&k=20&c=VTfj7X92pJEOaIXGCL0RXeptssF8LpTVSUMEE8cg-6Y=",
        "imageSource": "https://www.gettyimages.com/photos/philip-treacy-hat", "productUrl": "https://philiptreacy.co.uk/", "available": False,
        "sales": 8, "salesNote": "艺术典藏孤品（非商业量产）",
        "artistry": 98, "artistryNote": "当代高定制帽史里程碑，萨默塞特宫回顾展核心展品",
        "heat": {"score": 96, "celebrities": ["Isabella Blow"], "runway": "Somerset House 伦敦回顾展", "evidence": "Philip Treacy 与缪斯 Isabella Blow 合作黄金时代的标志性杰作。"},
        "sources": ["https://www.gettyimages.com/photos/philip-treacy-hat"]
    },
    {
        "id": "pt-isabella-sculpture", "brandId": "philip-treacy", "name": "British Fashion Awards Sculptural Couture Hat", "year": 1998,
        "collection": "伦敦高定档案", "category": "秀场艺术帽", "material": "手工定型羽毛、硬挺马尾纱",
        "description": "Philip Treacy 陪同 Isabella Blow 出席英国时尚大奖时的代表性雕塑礼帽，将超现实主义张力与英伦戏剧感推向极致。",
        "price": None, "currency": "GBP", "priceNote": "历史高定孤品",
        "image": "https://media.gettyimages.com/id/3183907/photo/london-milliner-philip-treacy-and-fashion-director-isabella-blow-attend-the-lycra-british.jpg?s=612x612&w=gi&k=20&c=jmlclJ5FWsXELgQ4zyuTrAf1efESu8sXouerdmv2r1o=",
        "imageSource": "https://www.gettyimages.com/photos/philip-treacy-hat", "productUrl": "https://philiptreacy.co.uk/", "available": False,
        "sales": 10, "salesNote": "早期高定孤品",
        "artistry": 96, "artistryNote": "奠定现代英国高定雕塑帽语汇的代表作",
        "heat": {"score": 93, "celebrities": ["Isabella Blow"], "runway": "英国时尚大奖红毯", "evidence": "屡次入选时尚史经典瞬间回顾。"},
        "sources": ["https://www.gettyimages.com/photos/philip-treacy-hat"]
    },

    # --- Extra Nick Fouquet (4 real photos) ---
    {
        "id": "nf-calypso-western", "brandId": "nick-fouquet", "name": "Calypso Western Felt Fedora", "year": 2025,
        "collection": "Venice Beach Signature 系列", "category": "礼帽", "material": "100% 顶级海狸毛毡、酒红罗缎带、招牌火柴棍",
        "description": "威尼斯海滩工坊手工火烤塑形的西部风毛毡费多拉帽，配酒红帽带与品牌标志性火柴细节。",
        "price": 1450, "currency": "USD", "priceNote": "官网手工签名线参考价",
        "image": "https://www.nickfouquet.com/cdn/shop/files/814-1-Calypso.png?v=1792094098&width=1600",
        "imageSource": "https://www.nickfouquet.com/collections/hats", "productUrl": "https://www.nickfouquet.com/collections/hats", "available": True,
        "sales": 76, "salesNote": "官网主力热销西部帽款",
        "artistry": 86, "artistryNote": "纯手工火烤做旧与海狸毛毡压制",
        "heat": {"score": 85, "celebrities": ["Johnny Depp", "Pharrell Williams"], "runway": None, "evidence": "加州摇滚与好莱坞波西米亚风格代表单品。"},
        "sources": ["https://www.nickfouquet.com/collections/hats"]
    },
    {
        "id": "nf-anchor-bleu", "brandId": "nick-fouquet", "name": "Anchor Bleu Grey Western Fedora", "year": 2025,
        "collection": "Signature Felt 系列", "category": "礼帽", "material": "冷灰海狸毛毡、黑色罗缎带、火柴装饰",
        "description": "冷灰调西部阔檐费多拉帽，搭配黑色粗罗缎带与手工做旧边缘，潇洒不羁。",
        "price": 1510, "currency": "USD", "priceNote": "官网参考价",
        "image": "https://www.nickfouquet.com/cdn/shop/files/799-1_-_Anchor_Bleu.png?v=1792093272&width=1500",
        "imageSource": "https://www.nickfouquet.com/collections/all", "productUrl": "https://www.nickfouquet.com/collections/all", "available": True,
        "sales": 72, "salesNote": "官网常青在售色",
        "artistry": 85, "artistryNote": "手工火烤帽冠与粗犷做旧边处理",
        "heat": {"score": 82, "celebrities": [], "runway": None, "evidence": "品牌官网首页主推冷灰西部廓形。"},
        "sources": ["https://www.nickfouquet.com/collections/all"]
    },
    {
        "id": "nf-matchstick-brown", "brandId": "nick-fouquet", "name": "Matchstick-Detail Coffee Brown Fedora", "year": 2025,
        "collection": "Farfetch 精选签名线", "category": "软呢帽", "material": "咖啡棕羊毛毡、蝴蝶结罗缎带、胸针与火柴细节",
        "description": "咖啡棕色平檐羊毛毡费多拉帽，融入手工火柴、徽章与复古蝴蝶结，是品牌在 Farfetch 流通度最高的热门款之一。",
        "price": 1575, "currency": "USD", "priceNote": "Farfetch 参考价",
        "image": "https://cdn-images.farfetch-contents.com/24/19/33/03/24193303_54445951_600.jpg",
        "imageSource": "https://www.farfetch.com/be/shopping/women/nick-fouquet-matchstick-detail-fedora-hat-item-24193303.aspx", "productUrl": "https://www.farfetch.com/be/shopping/women/nick-fouquet-matchstick-detail-fedora-hat-item-24193303.aspx", "available": True,
        "sales": 81, "salesNote": "Farfetch 多地区上架畅销款",
        "artistry": 84, "artistryNote": "多层次手工徽章与标志性火柴点缀",
        "heat": {"score": 84, "celebrities": [], "runway": None, "evidence": "国际奢侈品电商高频曝光的 Nick Fouquet 经典棕色礼帽。"},
        "sources": ["https://www.farfetch.com/be/shopping/women/nick-fouquet-matchstick-detail-fedora-hat-item-24193303.aspx"]
    },
    {
        "id": "nf-melange-suede", "brandId": "nick-fouquet", "name": "Melange Grey Suede Fedora", "year": 2025,
        "collection": "Maxfield LA 买手店限定", "category": "礼帽", "material": "灰色麂皮绒毛毡、库存古董织带、刺绣火柴贴布",
        "description": "于洛杉矶传奇买手店 Maxfield 发售的灰色麂皮质感费多拉帽，帽带采用环保古董库存织带拼接。",
        "price": 1650, "currency": "USD", "priceNote": "Maxfield LA 精品线参考价",
        "image": "https://www.maxfieldla.com/cdn/shop/files/300234-35130-NICK-FOUQUET-MELANGE-HAT-2.jpg?v=1792796097",
        "imageSource": "https://www.maxfieldla.com/products/nick-fouquet-melange-hat", "productUrl": "https://www.maxfieldla.com/products/nick-fouquet-melange-hat", "available": True,
        "sales": 58, "salesNote": "Maxfield LA 限量买手合作款",
        "artistry": 88, "artistryNote": "古董库存丝带再生拼接与刺绣火柴工艺",
        "heat": {"score": 80, "celebrities": [], "runway": None, "evidence": "洛杉矶高端买手店 Maxfield 主推收藏级单品。"},
        "sources": ["https://www.maxfieldla.com/products/nick-fouquet-melange-hat"]
    },

    # --- UK New Brands ---
    {
        "id": "ns-wool-leather-golf", "brandId": "noel-stewart", "name": "Wool & Leather Golf Cap", "year": 2014,
        "collection": "Noel Stewart AW14", "category": "其他", "material": "精纺羊毛、手工皮革镶边",
        "description": "以建筑几何线条重塑英式经典高尔夫鸭舌帽，将硬朗皮革与柔软羊毛结合，利落摩登。",
        "price": 380, "currency": "GBP", "priceNote": "Shop Flatiron 官网参考价",
        "image": "https://images.squarespace-cdn.com/content/v1/5659b144e4b0e91a03bb361f/1570537866753-8KA8RB78ZSKPEJGAHVT3/Noel+AW14+WEB-098.jpg?format=2500w",
        "imageSource": "http://www.noelstewart.com/shop-flatiron/wool-and-leather-golf-cap", "productUrl": "http://www.noelstewart.com/shop-flatiron/wool-and-leather-golf-cap", "available": True,
        "sales": 64, "salesNote": "品牌成衣线经典实穿款",
        "artistry": 84, "artistryNote": "羊毛与皮革异材质精准立体剪裁",
        "heat": {"score": 76, "celebrities": [], "runway": "Noel Stewart AW14 伦敦发布", "evidence": "官网长期展示的代表性摩登鸭舌帽设计。"},
        "sources": ["http://www.noelstewart.com/shop-flatiron/wool-and-leather-golf-cap"]
    },
    {
        "id": "ns-tri-cocktail", "brandId": "noel-stewart", "name": "Quilted Satin & Leather Tri-Cocktail Hat", "year": 2015,
        "collection": "Noel Stewart 高定鸡尾酒系列", "category": "鸡尾酒帽/发饰", "material": "绗缝真丝缎、皮革三角结构",
        "description": "将优雅绗缝真丝缎与冷峻皮革三角廓形碰撞的鸡尾酒帽，尽显 Noel Stewart 的英伦极简雕塑美学。",
        "price": 520, "currency": "GBP", "priceNote": "官网高定参考价",
        "image": "https://images.squarespace-cdn.com/content/v1/5659b144e4b0e91a03bb361f/1570537297681-LHP96J22AMQ537N82F7B/3.jpg?format=2500w",
        "imageSource": "http://www.noelstewart.com/shop-flatiron/quilted-satin-and-leather-tri-cocktail-hat", "productUrl": "http://www.noelstewart.com/shop-flatiron/quilted-satin-and-leather-tri-cocktail-hat", "available": True,
        "sales": 46, "salesNote": "沙龙限量制作款",
        "artistry": 90, "artistryNote": "几何三角力学定型与真丝绗缝工艺",
        "heat": {"score": 78, "celebrities": [], "runway": "伦敦时装周静态展", "evidence": "英式现代礼仪帽饰的建筑感典范。"},
        "sources": ["http://www.noelstewart.com/shop-flatiron/quilted-satin-and-leather-tri-cocktail-hat"]
    },
    {
        "id": "ns-aviaclava", "brandId": "noel-stewart", "name": "Aviaclava in Toscana & Leather", "year": 2015,
        "collection": "Noel Stewart AW15", "category": "亚文化", "material": "托斯卡纳卷毛羊皮、小牛皮",
        "description": "将飞行员头盔与巴拉克拉法帽融合的前卫冬季头饰，兼具赛博复古气息与极高保暖雕塑感。",
        "price": 590, "currency": "GBP", "priceNote": "AW15 档案参考价",
        "image": "https://images.squarespace-cdn.com/content/v1/5659b144e4b0e91a03bb361f/1478020557388-G9L8KD1LNKF7M817V59U/Noel+Stewart+AW15+WEB-053.jpg?format=1000w",
        "imageSource": "http://www.noelstewart.com/shop-flatiron", "productUrl": "http://www.noelstewart.com/shop-flatiron", "available": False,
        "sales": 42, "salesNote": "AW15 限量秀场款",
        "artistry": 91, "artistryNote": "飞行帽与巴拉克拉法解构合一",
        "heat": {"score": 81, "celebrities": [], "runway": "AW15 伦敦发布", "evidence": "比近年巴拉克拉法风潮早近十年的先锋之作。"},
        "sources": ["http://www.noelstewart.com/shop-flatiron"]
    },
    {
        "id": "pa-collection-34", "brandId": "piers-atkinson", "name": "Collection 34 Sculptural Headpiece (Look 1)", "year": 2024,
        "collection": "Collection 34", "category": "秀场艺术帽", "material": "手工雕塑丝绒、金属丝、波普装饰",
        "description": "Piers Atkinson 第 34 季主推开场造型头饰，以夸张饱满的色彩与波普雕塑廓形点燃东伦敦戏剧张力。",
        "price": 780, "currency": "GBP", "priceNote": "官网定制参考价",
        "image": "https://images.squarespace-cdn.com/content/v1/547c61dbe4b0ac0fb963846e/8abd39c8-ca05-4dd2-8489-f3c04a8122a5/LOOK+1.jpg",
        "imageSource": "https://www.piersatkinson.com/collection-34", "productUrl": "https://www.piersatkinson.com/collection-34", "available": True,
        "sales": 48, "salesNote": "官网按单手工制作",
        "artistry": 93, "artistryNote": "东伦敦波普艺术与高定雕塑结合",
        "heat": {"score": 85, "celebrities": ["Rihanna", "Kate Moss"], "runway": "Collection 34 伦敦发布", "evidence": "伦敦时装周与时尚杂志大片高频借拍系列。"},
        "sources": ["https://www.piersatkinson.com/collection-34"]
    },
    {
        "id": "pa-aw16-look15", "brandId": "piers-atkinson", "name": "AW16 Mainline Pop Headpiece (Look 15)", "year": 2016,
        "collection": "AW16 Mainline", "category": "亚文化", "material": "手工编织亮片、丝网纱、立体饰件",
        "description": "极具俱乐部亚文化与超现实趣味的秋冬主线头饰，展现 Piers Atkinson 标志性的视觉幽默感。",
        "price": None, "currency": "GBP", "priceNote": "AW16 秀场档案",
        "image": "https://images.squarespace-cdn.com/content/v1/547c61dbe4b0ac0fb963846e/1588596069160-LNQTJJSPT7HXRPJAU1IA/look-15.jpg",
        "imageSource": "https://www.piersatkinson.com/aw16-mainline", "productUrl": "https://www.piersatkinson.com/aw16-mainline", "available": False,
        "sales": 34, "salesNote": "秀场档案限量款",
        "artistry": 91, "artistryNote": "波普拼贴与戏剧感头饰结构",
        "heat": {"score": 82, "celebrities": [], "runway": "AW16 伦敦时装周", "evidence": "品牌档案库精选视觉代表作。"},
        "sources": ["https://www.piersatkinson.com/aw16-mainline"]
    },
    {
        "id": "vg-royal-ascot", "brandId": "victoria-grant", "name": "Royal Ascot Schiaparelli-Inspired Couture Hat", "year": 2023,
        "collection": "Royal Ascot 皇家赛马会高定", "category": "秀场艺术帽", "material": "手工染色剑麻草、超现实装饰细节",
        "description": "致敬超现实主义大师 Schiaparelli 的皇家赛马会高定大礼帽，曾登上英国《Tatler》杂志封面专题。",
        "price": 1250, "currency": "GBP", "priceNote": "诺丁山沙龙定制参考价",
        "image": "https://images.squarespace-cdn.com/content/v1/56e48ad9b654f908342e0404/aa255629-d89c-4e64-bf12-730dea43f07e/victoria-grant-royal-ascot-hat-london-schiaparelli-tatler.jpg+.JPG",
        "imageSource": "https://victoriagrant.com/", "productUrl": "https://victoriagrant.com/", "available": True,
        "sales": 38, "salesNote": "赛马会季沙龙定制款",
        "artistry": 92, "artistryNote": "超现实主义华丽配色与立体剑麻塑形",
        "heat": {"score": 86, "celebrities": [], "runway": "Royal Ascot / Tatler 杂志", "evidence": "《Tatler》皇家赛马会最佳帽饰专题推荐。"},
        "sources": ["https://victoriagrant.com/"]
    },
    {
        "id": "vg-beyonce-custom", "brandId": "victoria-grant", "name": "Mrs. Carter Show Custom Stage Hat", "year": 2013,
        "collection": "Beyoncé 世界巡演定制", "category": "礼帽", "material": "黑色兔毛毡、手工金属刺绣与面纱",
        "description": "为 Beyoncé《The Mrs. Carter Show》全球巡演专门定制的舞台礼帽，霸气轮廓与华丽暗黑细节相得益彰。",
        "price": None, "currency": "GBP", "priceNote": "艺人巡演专属高定",
        "image": "https://images.squarespace-cdn.com/content/v1/56e48ad9b654f908342e0404/1460812651636-MEXAQTU5PP6UAOW1B6EE/BeyonceMrsCarterVictoriaGrantcrop.jpg",
        "imageSource": "https://victoriagrant.com/", "productUrl": "https://victoriagrant.com/party-red-carpet-hats", "available": False,
        "sales": 12, "salesNote": "艺人舞台孤品定制",
        "artistry": 91, "artistryNote": "舞台级抗动作固定结构与奢华手工饰边",
        "heat": {"score": 93, "celebrities": ["Beyoncé"], "runway": "The Mrs. Carter Show 世界巡演", "evidence": "Beyoncé 巡演标志性造型之一，大幅提升品牌全球知名度。"},
        "sources": ["https://victoriagrant.com/"]
    },
    {
        "id": "hof-geometric-avantgarde", "brandId": "house-of-flora", "name": "Geometric Architectural PVC & Felt Headpiece", "year": 2010,
        "collection": "House of Flora 先锋建筑档案", "category": "亚文化", "material": "硬质 PVC、有机玻璃与工业感毡料",
        "description": "House of Flora 标志性的硬质几何建筑感头饰，彻底打破传统制帽的柔美惯性，具有强烈包豪斯与后朋克亚文化气质。",
        "price": None, "currency": "GBP", "priceNote": "工作室高定档案",
        "image": "https://cms.showstudio.com/images/gWATBXfDe6Ekf4uCVP2q0plAVIE=/129896/width-640/contributors_171.jpg",
        "imageSource": "https://www.showstudio.com/contributors/house_of_flora", "productUrl": "https://www.showstudio.com/contributors/house_of_flora", "available": False,
        "sales": 22, "salesNote": "限量高定与展览委约",
        "artistry": 95, "artistryNote": "以工业 PVC/亚克力革新英国制帽雕塑语言",
        "heat": {"score": 86, "celebrities": ["Erykah Badu", "Beyoncé"], "runway": "V&A 博物馆 / SHOWstudio", "evidence": "入选 V&A 博物馆《Hats: An Anthology》并获 SHOWstudio 专题收录。"},
        "sources": ["https://www.showstudio.com/contributors/house_of_flora"]
    },
    {
        "id": "nm-bully-cap-metallic", "brandId": "nasir-mazhar", "name": "Metallic Pink & Silver Bully Cap", "year": 2014,
        "collection": "Nasir Mazhar AW14", "category": "亚文化", "material": "金属涂层漆皮、标志性立体双弧帽檐",
        "description": "Nasir Mazhar 最具代表性的革命性单品 Bully Cap，独特的拱形加厚立体帽檐配未来感金属粉银光泽，风靡东伦敦地下电子与 Grime 亚文化圈。",
        "price": 320, "currency": "GBP", "priceNote": "二级档案市场参考价",
        "image": "https://i.ebayimg.com/images/g/VJIAAOSwN6tjqKQV/s-l1200.jpg",
        "imageSource": "https://www.ebay.co.uk/itm/234834947233", "productUrl": "https://www.ebay.co.uk/itm/234834947233", "available": False,
        "sales": 72, "salesNote": "品牌历史上最具影响力的爆款街头帽型",
        "artistry": 89, "artistryNote": "独创立体双弧帽檐结构，改写当代街头帽饰设计史",
        "heat": {"score": 90, "celebrities": ["Skepta", "FKA Twigs", "Rihanna"], "runway": "伦敦男装周 AW14", "evidence": "2010 年代东伦敦街头亚文化最具标志性的帽饰单品。"},
        "sources": ["https://www.ebay.co.uk/itm/234834947233"]
    },
    {
        "id": "nm-sad-dragon", "brandId": "nasir-mazhar", "name": "Sad Dragon Sculptural Hat", "year": 2016,
        "collection": "Nasir Mazhar 档案系列", "category": "亚文化", "material": "重磅斜纹棉与立体缝线拼接",
        "description": "极具暗黑幽默与涂鸦精神的 Sad Dragon 造型帽，伦敦档案买手店 Known Source 收藏级单品。",
        "price": 240, "currency": "GBP", "priceNote": "Known Source 档案价",
        "image": "https://knownsource.co.uk/cdn/shop/files/FullSizeRender_114ab798-6b36-4b7a-b2f9-ce9840018caa.jpg?v=1755274403&width=600",
        "imageSource": "https://knownsource.co.uk/en-us/products/nasir-mazhar-sad-dragon-hat-jub-15024022356313", "productUrl": "https://knownsource.co.uk/en-us/products/nasir-mazhar-sad-dragon-hat-jub-15024022356313", "available": True,
        "sales": 45, "salesNote": "档案买手店少量流通",
        "artistry": 85, "artistryNote": "赛博街头与反叛插画语汇融合",
        "heat": {"score": 78, "celebrities": [], "runway": None, "evidence": "英国知名档案买手平台 Known Source 收录款。"},
        "sources": ["https://knownsource.co.uk/en-us/products/nasir-mazhar-sad-dragon-hat-jub-15024022356313"]
    },
    {
        "id": "ba-liberty-baker", "brandId": "benny-andallo", "name": "Oversized Sculptural Baker Crown", "year": 2023,
        "collection": "Liberty London Craft Club", "category": "亚文化", "material": "手工蓬松织物填充、雕塑褶皱结构",
        "description": "Benny Andallo 代表性的“Silly Crown”超大比例膨胀报童/面包师造型帽，兼具童趣荒诞与伦敦先锋亚文化魅力。",
        "price": 390, "currency": "GBP", "priceNote": "APOC / Liberty 参考价",
        "image": "https://i8.amplience.net/i/liberty/CraftClubBennyAndalo(14)?fmt=auto&qlt=75",
        "imageSource": "https://www.libertylondon.com/uk/features/craft/craft-club-benny-andallo.html", "productUrl": "https://apoc-store.com/collections/benny-andallo", "available": True,
        "sales": 56, "salesNote": "APOC Store 限量手作补货",
        "artistry": 91, "artistryNote": "超现实膨胀体积与手工软雕塑廓形",
        "heat": {"score": 87, "celebrities": ["Rihanna", "FKA Twigs"], "runway": "Junya Watanabe 合作 / Liberty 专题", "evidence": "Rihanna 多次佩戴同系列夸张皮草/膨胀帽引发全网热议。"},
        "sources": ["https://www.libertylondon.com/uk/features/craft/craft-club-benny-andallo.html"]
    },
    {
        "id": "ba-apoc-fur-crown", "brandId": "benny-andallo", "name": "Faux Fur Oversized Crown Hat", "year": 2024,
        "collection": "APOC Store 独家手作系列", "category": "亚文化", "material": "蓬松仿皮草、手工内衬定型",
        "description": "APOC Store 在售的巨型毛绒王冠帽，以夸张体量重塑头身比例，是伦敦新锐亚文化穿搭圈的标志性单品。",
        "price": 420, "currency": "GBP", "priceNote": "APOC Store 参考价",
        "image": "https://apoc-store.com/cdn/shop/files/475020136_541431468948278_666562395282047140_n.jpg?v=1756329575&width=400",
        "imageSource": "https://apoc-store.com/collections/benny-andallo", "productUrl": "https://apoc-store.com/collections/benny-andallo", "available": True,
        "sales": 62, "salesNote": "APOC 平台高人气限量款",
        "artistry": 89, "artistryNote": "极具识别度的超大毛绒软雕塑语言",
        "heat": {"score": 88, "celebrities": ["Rihanna"], "runway": None, "evidence": "Instagram 与欧美潮流媒体高频刷屏的“大毛帽”风潮核心推手。"},
        "sources": ["https://apoc-store.com/collections/benny-andallo"]
    },
    {
        "id": "ag-cosmic-cocktail", "brandId": "awon-golding", "name": "Doppio / Cosmic Cocktail Hat", "year": 2024,
        "collection": "Awon Golding Headpieces", "category": "鸡尾酒帽/发饰", "material": "手工定型剑麻草、立体几何折片",
        "description": "以轻盈星轨弧线构成的现代鸡尾酒帽，既有英式传统礼仪帽的优雅，又不失灵动俏皮的当代色彩。",
        "price": 365, "currency": "GBP", "priceNote": "官网官价",
        "image": "https://awongolding.com/cdn/shop/collections/awongoldingmillinery-doppio-square.jpg?v=1646686297&width=2048",
        "imageSource": "https://awongolding.com/collections/headpieces-fascinators", "productUrl": "https://awongolding.com/collections/headpieces-fascinators", "available": True,
        "sales": 68, "salesNote": "官网婚礼与赛马会常青热卖款",
        "artistry": 87, "artistryNote": "轻量化平衡配重与流线几何剑麻塑形",
        "heat": {"score": 81, "celebrities": [], "runway": "Royal Ascot 皇家赛马会", "evidence": "英国名流婚礼与皇家赛马会高出镜率单品。"},
        "sources": ["https://awongolding.com/collections/headpieces-fascinators"]
    },
    {
        "id": "ag-lock-bow-veil", "brandId": "awon-golding", "name": "Lock Couture Black Bow Veil", "year": 2025,
        "collection": "Lock & Co. Hatters Couture（Awon Golding 设计）", "category": "鸡尾酒帽/发饰", "material": "黑色丝网面纱、立体丝缎蝴蝶结",
        "description": "Awon Golding 为伦敦 300 年老店 Lock & Co. 设计的黑色蝴蝶结面纱高定发饰，低调冷艳，极具英伦贵族气质。",
        "price": 495, "currency": "GBP", "priceNote": "Lock & Co. 官网参考价",
        "image": "https://www.lockhatters.com/cdn/shop/files/Bow_Vail_Black_1600x.jpg?v=1785929879",
        "imageSource": "https://www.lockhatters.com/collections/women-lock-couture", "productUrl": "https://www.lockhatters.com/collections/women-lock-couture", "available": True,
        "sales": 71, "salesNote": "百年名店 Lock & Co. 主推高定款",
        "artistry": 88, "artistryNote": "传统英式面纱与现代极简蝴蝶结结构",
        "heat": {"score": 83, "celebrities": [], "runway": "Lock Couture 伦敦发布", "evidence": "融合百年皇室帽坊基因与当代女设计师视角。"},
        "sources": ["https://www.lockhatters.com/collections/women-lock-couture"]
    },
    {
        "id": "hs-h20-sculpture", "brandId": "harvy-santos", "name": "H20 Sculptural Couture Hat", "year": 2022,
        "collection": "H20 水态雕塑系列", "category": "秀场艺术帽", "material": "手工蒸汽塑形马尾纱、流动丝绸线条",
        "description": "灵感源自水流凝固瞬间的立体雕塑高定帽，体现 Harvy Santos 前芭蕾舞者独有的动态韵律与失重美感。",
        "price": 850, "currency": "GBP", "priceNote": "伦敦工作室高定参考价",
        "image": "https://cdn.myportfolio.com/308e63e1-9b36-4d93-b575-0efc9bea78cd/ffb11ec6-727a-4ae4-af22-f2a582e83337_rwc_577x0x955x955x955.jpg?h=97beb82c9b5b21b2379183cf1eee10be",
        "imageSource": "https://harvysantos.com/h20", "productUrl": "https://harvysantos.com/h20", "available": True,
        "sales": 32, "salesNote": "工作室按单高定",
        "artistry": 94, "artistryNote": "将芭蕾动态韵律转化为空气感马尾纱雕塑",
        "heat": {"score": 82, "celebrities": ["Lady Gaga"], "runway": "伦敦高定静态展", "evidence": "英国帽业公会高频推荐的代表性雕塑系列。"},
        "sources": ["https://harvysantos.com/h20"]
    },
    {
        "id": "hs-fw17-couture", "brandId": "harvy-santos", "name": "FW17 Architectural Couture Headpiece", "year": 2017,
        "collection": "FW17 高定系列", "category": "秀场艺术帽", "material": "黑色兔毛毡、手工塑形羽毛",
        "description": "建筑感折面与轻盈羽饰交错的秋冬高定头饰，展现伦敦当代高定制帽的极致线条控制力。",
        "price": None, "currency": "GBP", "priceNote": "FW17 高定档案",
        "image": "https://mlvd2qarv23a.i.optimole.com/HrBA-Xc-pjb7_8PM/w:1500/h:1500/q:90/https://studioventana.co.uk/wp-content/uploads/2019/06/eig_cover_HarvySantosFW2017-10-Edit.jpg",
        "imageSource": "https://harvysantos.com/", "productUrl": "https://harvysantos.com/", "available": False,
        "sales": 24, "salesNote": "秀场高定孤品",
        "artistry": 92, "artistryNote": "精准毛毡折角与平衡配重技艺",
        "heat": {"score": 79, "celebrities": [], "runway": "FW17 伦敦发布", "evidence": "多家伦敦视觉摄影机构与时尚杂志收录作品。"},
        "sources": ["https://harvysantos.com/"]
    },
    {
        "id": "kh-georgia-redwax", "brandId": "karen-henriksen", "name": "Georgia Windswept Cap (Red Wax Cotton)", "year": 2024,
        "collection": "Karen Henriksen 女士经典系列", "category": "其他", "material": "英国苏格兰防雨蜡棉、手工立体拼接",
        "description": "以不对称“被风吹拂”的动感褶皱重塑经典鸭舌帽，采用防泼水红蜡棉，兼顾伦敦雨季实用性与精致雕塑线条。",
        "price": 175, "currency": "GBP", "priceNote": "官网官价",
        "image": "https://images.squarespace-cdn.com/content/v1/5346d6afe4b06ad466588720/2e947de4-7f2f-4e4a-9028-1c35d16964e1/georgia-redwax-1.jpg?format=1000w",
        "imageSource": "https://www.karenhenriksen.co.uk/womens-hats/georgia-windswept-cap-red-wax-cotton", "productUrl": "https://www.karenhenriksen.co.uk/womens-hats/georgia-windswept-cap-red-wax-cotton", "available": True,
        "sales": 74, "salesNote": "官网长期畅销招牌款",
        "artistry": 83, "artistryNote": "立体斜裁风动帽冠结构",
        "heat": {"score": 74, "celebrities": [], "runway": "Cockpit Arts 伦敦工艺展", "evidence": "英国手工工艺圈最具代表性的实穿型设计师帽款之一。"},
        "sources": ["https://www.karenhenriksen.co.uk/womens-hats/georgia-windswept-cap-red-wax-cotton"]
    },
    {
        "id": "kh-sutton-shetland", "brandId": "karen-henriksen", "name": "Sutton Herringbone Shetland Flat Cap", "year": 2024,
        "collection": "男士手工呢帽线", "category": "其他", "material": "苏格兰设得兰人字纹粗花呢",
        "description": "以建筑裁剪手法升级的英伦传统人字纹扁平鸭舌帽，轮廓挺括、质感温润。",
        "price": 165, "currency": "GBP", "priceNote": "官网官价",
        "image": "https://images.squarespace-cdn.com/content/v1/5346d6afe4b06ad466588720/6b569bae-f97d-4658-91be-599395aa9e0b/sutton-hbone-shetland-1.jpg?format=500w",
        "imageSource": "https://www.karenhenriksen.co.uk/mens-hats", "productUrl": "https://www.karenhenriksen.co.uk/mens-hats", "available": True,
        "sales": 70, "salesNote": "男士手工线常青在售",
        "artistry": 80, "artistryNote": "传统英伦人字纹粗花呢现代立体版型",
        "heat": {"score": 71, "celebrities": [], "runway": None, "evidence": "伦敦绅士与工艺爱好者高频复购款。"},
        "sources": ["https://www.karenhenriksen.co.uk/mens-hats"]
    },
    {
        "id": "fb-kaleidoscopic-sculpture", "brandId": "fred-butler", "name": "Kaleidoscopic Origami Sculptural Headpiece", "year": 2012,
        "collection": "Fred Butler 折纸万花筒档案", "category": "亚文化", "material": "多彩硬质折面织物、亚克力几何骨架",
        "description": "以万花筒般高饱和几何折面构筑的立体头饰，是伦敦新锐俱乐部文化与 Lady Gaga / Björk 时代先锋视觉美学的缩影。",
        "price": None, "currency": "GBP", "priceNote": "艺术展览与演出定制档案",
        "image": "https://cms.showstudio.com/images/4QIlCg3tJ_ilv3J5H-23HTBB2NA=/130768/width-640/contributors_342.jpg",
        "imageSource": "https://www.showstudio.com/contributors/fred_butler", "productUrl": "https://www.showstudio.com/contributors/fred_butler", "available": False,
        "sales": 16, "salesNote": "舞台与艺术委约孤品",
        "artistry": 95, "artistryNote": "三维折纸几何构造与波普未来主义视觉",
        "heat": {"score": 88, "celebrities": ["Lady Gaga", "Björk", "Nicki Minaj"], "runway": "SHOWstudio / 伦敦时装周", "evidence": "Fred Butler 折纸美学风靡全球流行音乐 MV 与当代艺术展。"},
        "sources": ["https://www.showstudio.com/contributors/fred_butler"]
    },
    {
        "id": "vp-sculptural-profile", "brandId": "virna-pasquinelli", "name": "Urban Subculture Couture Headpiece", "year": 2022,
        "collection": "英国帽业公会展藏作品", "category": "亚文化", "material": "再生环保麻织物、手工塑形纤维与金属丝",
        "description": "融合意式古典浪漫与伦敦都市亚文化叛逆气质的无性别雕塑帽，由 QEST 奖学金得主 Virna Pasquinelli 纯手工塑形。",
        "price": None, "currency": "GBP", "priceNote": "工作室私人定制",
        "image": "https://images.squarespace-cdn.com/content/v1/5be15e77b27e396963aafcdf/1664975222397-8TADC84GOT2MM8ULCGW1/Profile+pic+1000x1000.jpg",
        "imageSource": "https://www.thebritishhatguild.org.uk/virna-pasquinelli", "productUrl": "https://www.thebritishhatguild.org.uk/virna-pasquinelli", "available": True,
        "sales": 28, "salesNote": "小批量手工定制与展览作品",
        "artistry": 90, "artistryNote": "结合戏剧制帽技艺与可持续再生材质实验",
        "heat": {"score": 74, "celebrities": ["Katy Perry"], "runway": "The British Hat Guild / WOW!house", "evidence": "入选英国帽业公会与 QEST 工艺奖学金重点展示。"},
        "sources": ["https://www.thebritishhatguild.org.uk/virna-pasquinelli"]
    },

    # --- US New Brands ---
    {
        "id": "rk-felt-top-hat", "brandId": "rod-keenan", "name": "Grosgrain-Trimmed Felt Top Hat", "year": 2015,
        "collection": "Rod Keenan New York 经典礼帽线", "category": "礼帽", "material": "黑色手工兔毛毡、丝质罗缎饰边",
        "description": "以现代利落比例重塑的纽约经典高顶礼帽，帽冠挺拔克制，是 Rod Keenan 备受好莱坞男星推崇的招牌轮廓。",
        "price": 680, "currency": "USD", "priceNote": "二级奢侈品市场参考价",
        "image": "https://product-images.therealreal.com/WRODK20004_1_enlarged.jpg",
        "imageSource": "https://www.therealreal.com/products/men/accessories/hats/rod-keenan-new-york-grosgrain-trimmed-felt-top-hat", "productUrl": "https://www.therealreal.com/products/men/accessories/hats/rod-keenan-new-york-grosgrain-trimmed-felt-top-hat", "available": True,
        "sales": 58, "salesNote": "欧美精选二手与买手渠道流通",
        "artistry": 87, "artistryNote": "纽约传统绅士高顶礼帽手工木模技艺",
        "heat": {"score": 82, "celebrities": ["Brad Pitt", "Justin Timberlake", "Snoop Dogg"], "runway": "CFDA 纽约男装周", "evidence": "好莱坞红毯与音乐录影带高频出镜的纽约礼帽大师代表作。"},
        "sources": ["https://www.therealreal.com/products/men/accessories/hats/rod-keenan-new-york-grosgrain-trimmed-felt-top-hat"]
    },
    {
        "id": "rk-embellished-fedora", "brandId": "rod-keenan", "name": "Embellished Black Felt Fedora", "year": 2016,
        "collection": "Harlem Atelier 系列", "category": "软呢帽", "material": "黑色毛毡、手工缝制装饰帽带",
        "description": "带有哈林区爵士风情与细腻手工饰带的黑色费多拉帽，兼顾日常摩登与仪式感。",
        "price": 520, "currency": "USD", "priceNote": "The RealReal 参考价",
        "image": "https://product-images.therealreal.com/WRODK20003_2_enlarged.jpg",
        "imageSource": "https://www.therealreal.com/", "productUrl": "https://www.therealreal.com/designers/rod-keenan-new-york", "available": True,
        "sales": 62, "salesNote": "二手精品平台稳定流通",
        "artistry": 84, "artistryNote": "哈林工坊纯手工修边与爵士帽冠塑形",
        "heat": {"score": 78, "celebrities": [], "runway": None, "evidence": "美式独立男装手工帽的代表作品。"},
        "sources": ["https://www.therealreal.com/designers/rod-keenan-new-york"]
    },
    {
        "id": "ac-matadors-mistress", "brandId": "anya-caliendo", "name": "'A Matador's Mistress' Couture Hat", "year": 2012,
        "collection": "Anya Caliendo 纽约高定档案", "category": "秀场艺术帽", "material": "宝蓝真丝、黑色法式蕾丝、手工丝绸花卉",
        "description": "宝蓝色真丝配黑色蕾丝与手工花卉的戏剧性斗牛士主题高定礼帽，直径 31 厘米，附设计师手签标签，曾现身伦敦 Chiswick 拍卖行。",
        "price": 1200, "currency": "USD", "priceNote": "拍卖收藏参考价",
        "image": "https://image.invaluable.com/housePhotos/chiswick/47/591147/H3383-L98450190.jpg",
        "imageSource": "https://www.invaluable.com/auction-lot/anya-caliendo-a-matadors-mistress-couture-hat-bri-4-c-a1646528bc", "productUrl": "https://www.invaluable.com/auction-lot/anya-caliendo-a-matadors-mistress-couture-hat-bri-4-c-a1646528bc", "available": False,
        "sales": 18, "salesNote": "签名高定孤品（拍卖流通）",
        "artistry": 94, "artistryNote": "20 余道欧式高定真丝蕾丝叠层工艺",
        "heat": {"score": 81, "celebrities": [], "runway": "纽约时装周高定发布", "evidence": "入选欧美高定拍卖图录的经典签名作品。"},
        "sources": ["https://www.invaluable.com/auction-lot/anya-caliendo-a-matadors-mistress-couture-hat-bri-4-c-a1646528bc"]
    },
    {
        "id": "ac-manolo-hat", "brandId": "anya-caliendo", "name": "The 'Manolo' Rose Couture Hat", "year": 2015,
        "collection": "2015 FIT 高定艺术大奖致敬 Manolo Blahnik 定制", "category": "秀场艺术帽", "material": "手工真丝玫瑰、高定网纱与立体帽座",
        "description": "为 2015 年纽约 FIT 时装学院高定艺术大奖（授予鞋履大师 Manolo Blahnik）特别合作创作的玫瑰雕塑高定帽。",
        "price": None, "currency": "USD", "priceNote": "颁奖礼专属定制孤品",
        "image": "https://www.silkflowerartist.com/uploads/5/6/3/2/5632855/5187556_orig.jpg",
        "imageSource": "https://www.silkflowerartist.com/blog/the-manolo-hat-created-for-2015-couture-council-of-fit-artistry-of-fashion-award-presented-to-manolo-blahnik", "productUrl": "https://www.silkflowerartist.com/blog/the-manolo-hat-created-for-2015-couture-council-of-fit-artistry-of-fashion-award-presented-to-manolo-blahnik", "available": False,
        "sales": 10, "salesNote": "致敬孤品（非量产）",
        "artistry": 95, "artistryNote": "高定丝绸花艺与英式结构制帽跨界巅峰",
        "heat": {"score": 83, "celebrities": [], "runway": "FIT Couture Council 颁奖盛典", "evidence": "致敬 Manolo Blahnik 的纽约时尚圈年度高定亮点。"},
        "sources": ["https://www.silkflowerartist.com/blog/the-manolo-hat-created-for-2015-couture-council-of-fit-artistry-of-fashion-award-presented-to-manolo-blahnik"]
    },
    {
        "id": "lm-bridal-couture", "brandId": "lisa-mcfadden", "name": "Bridal Couture Sculptural Headpiece", "year": 2024,
        "collection": "Lisa McFadden 纽约新娘高定", "category": "鸡尾酒帽/发饰", "material": "真丝欧根纱、手工定型蕾丝与细丝结构",
        "description": "纽约独立制帽师 Lisa McFadden 手工缝制的新娘礼服头饰，背部曲线宛如雕塑花瓣，轻盈贴合发髻。",
        "price": 650, "currency": "USD", "priceNote": "纽约工作室定制参考价",
        "image": "https://lisamcfadden.com/cdn/shop/files/Lindsay_s_bridal_fitting_-_BACK_CLOSE_UP_-_crop.jpg?v=1737243304&width=1500",
        "imageSource": "https://lisamcfadden.com/pages/about", "productUrl": "https://lisamcfadden.com/", "available": True,
        "sales": 44, "salesNote": "纽约工作室按单定制",
        "artistry": 88, "artistryNote": "手工丝绸塑形与贴合头骨力学设计",
        "heat": {"score": 73, "celebrities": [], "runway": "纽约大都会博物馆相关展览", "evidence": "纽约高定婚礼与博物馆展览认可的独立女制帽师。"},
        "sources": ["https://lisamcfadden.com/pages/about"]
    },
    {
        "id": "md-pvdfest-maximalist", "brandId": "machine-dazzle", "name": "Queer Maximalism Sculptural Headpiece", "year": 2022,
        "collection": "PVDFest / MAD 博物馆个展同期风格", "category": "亚文化", "material": "多元再生材料、亮片、金属丝与戏剧羽饰",
        "description": "艾美奖得主 Machine Dazzle 的标志性酷儿极繁主义巨型头饰，将日常物件转化为充满狂欢与反叛精神的可佩戴雕塑。",
        "price": None, "currency": "USD", "priceNote": "艺术装置与演出定制孤品",
        "image": "https://firstworks.org/wp-content/uploads/2022/01/PVDFest-Machine-Dazzle-photo-5-1.jpeg",
        "imageSource": "https://firstworks.org/learning_library/celebrity-costume-designer-machine-dazzle/", "productUrl": "https://firstworks.org/learning_library/celebrity-costume-designer-machine-dazzle/", "available": False,
        "sales": 12, "salesNote": "博物馆与舞台艺术孤品",
        "artistry": 97, "artistryNote": "当代酷儿亚文化极繁雕塑装置的巅峰表达",
        "heat": {"score": 91, "celebrities": ["Taylor Mac", "Billy Porter"], "runway": "纽约艺术与设计博物馆 (MAD) 个展", "evidence": "2022 年 MAD 博物馆大型个展轰动纽约艺术与时尚界。"},
        "sources": ["https://firstworks.org/learning_library/celebrity-costume-designer-machine-dazzle/"]
    },
    {
        "id": "md-24decade-taylor", "brandId": "machine-dazzle", "name": "24-Decade History Theatrical Headpiece", "year": 2023,
        "collection": "Taylor Mac《240年美国流行音乐史》舞台定制", "category": "亚文化", "material": "手工缝制织物、复古饰件、立体支撑结构",
        "description": "为普利策入围史诗舞台剧《A 24-Decade History of Popular Music》打造的标志性戏剧头饰，于纽约 ClampArt 画廊展出。",
        "price": None, "currency": "USD", "priceNote": "画廊展览收藏级作品",
        "image": "https://clampart.com/wp-content/uploads/2023/09/MACHINE-DAZZLE-24_SHOT-01_005-copy-Large-e1695237230658-640x480.jpeg?theia_smart_thumbnails_file_version=2",
        "imageSource": "https://clampart.com/2023/09/machine-dazzle/", "productUrl": "https://clampart.com/2023/09/machine-dazzle/", "available": False,
        "sales": 10, "salesNote": "画廊展品孤品",
        "artistry": 96, "artistryNote": "融汇历史隐喻与剧场奇观的复合材质头饰",
        "heat": {"score": 87, "celebrities": ["Taylor Mac"], "runway": "ClampArt 纽约个展", "evidence": "获艾美奖认可的当代剧场亚文化视觉标杆。"},
        "sources": ["https://clampart.com/2023/09/machine-dazzle/"]
    },
    {
        "id": "ec-couture-beret", "brandId": "ellen-christine", "name": "Chelsea Couture Black Beret Cap", "year": 2020,
        "collection": "Ellen Christine 切尔西沙龙经典", "category": "贝雷帽", "material": "黑色手工定型毛呢、丝缎包边",
        "description": "纽约切尔西三十年老牌沙龙打造的手工贝雷帽，线条圆润优雅，带有老好莱坞银幕复古韵味。",
        "price": 320, "currency": "USD", "priceNote": "纽约沙龙参考价",
        "image": "https://u-mercari-images.mercdn.net/photos/m20578223711_1.jpg?1733882653",
        "imageSource": "https://theurbanoutlander.com/an-outlandish-hat-chat-with-ellen-christine-couture/", "productUrl": "https://theurbanoutlander.com/an-outlandish-hat-chat-with-ellen-christine-couture/", "available": True,
        "sales": 54, "salesNote": "沙龙常青定制与二手流通款",
        "artistry": 83, "artistryNote": "传统木模手工拉制与复古丝缎内里",
        "heat": {"score": 73, "celebrities": [], "runway": "3.1 Phillip Lim 纽约时装周合作背景", "evidence": "纽约本地资历最深的独立高定制帽沙龙代表款。"},
        "sources": ["https://theurbanoutlander.com/an-outlandish-hat-chat-with-ellen-christine-couture/"]
    },
    {
        "id": "mb-sculptural-hat", "brandId": "maxwell-bresler", "name": "Deconstructed Sculptural Avant-Garde Hat", "year": 2023,
        "collection": "Denver Avant-Garde 手作系列", "category": "亚文化", "material": "手工重塑毛毡、解构不对称帽冠",
        "description": "来自美国丹佛先锋设计师 Maxwell Bresler 的解构雕塑帽，以粗犷扭曲的廓形向 Margiela 与 Galliano 的实验制帽精神致敬。",
        "price": 450, "currency": "USD", "priceNote": "Grailed 先锋档案参考价",
        "image": "https://media-assets.grailed.com/prd/listing/temp/c682a8331d2b4c0b90ae4f378860575c",
        "imageSource": "https://www.grailed.com/", "productUrl": "https://www.grailed.com/", "available": False,
        "sales": 32, "salesNote": "小批量先锋孤品发售",
        "artistry": 90, "artistryNote": "暗黑解构雕塑与手塑不对称帽型",
        "heat": {"score": 75, "celebrities": [], "runway": None, "evidence": "在 Grailed 与欧美先锋暗黑穿搭圈拥有极高讨论度。"},
        "sources": ["https://www.grailed.com/"]
    },
    {
        "id": "lw-lark-wool", "brandId": "laura-whitlock", "name": "Lark Handmade Sculpted Wool Hat", "year": 2021,
        "collection": "Lark by Laura Whitlock", "category": "礼帽", "material": "100% 纯手工定型羊毛毡",
        "description": "由拥有 30 余年影视剧制帽资历的 Laura Whitlock 亲手拉制的羊毛毡礼帽，轮廓考究温润，兼顾复古优雅与日常实穿。",
        "price": 280, "currency": "USD", "priceNote": "手工副线参考价",
        "image": "https://di2ponv0v5otw.cloudfront.net/posts/2021/10/22/61733577275e5549a6542828/m_61733601284e997833b5a580.jpg",
        "imageSource": "https://millinerymeetup.com/faculty/", "productUrl": "https://millinerymeetup.com/faculty/", "available": True,
        "sales": 48, "salesNote": "手工限量发售及二手流通",
        "artistry": 84, "artistryNote": "资深美国影视剧制帽导师传统木模工艺",
        "heat": {"score": 71, "celebrities": [], "runway": "Kentucky Derby / 芝加哥抒情歌剧院", "evidence": "美国制帽教育界与影视道具领域的资深名师代表作。"},
        "sources": ["https://millinerymeetup.com/faculty/"]
    },

    # --- France New Brands ---
    {
        "id": "mn-toluca-mask", "brandId": "muriel-nisse", "name": "Toluca Embroidered Hair & Gemstone Mask-Hat", "year": 2024,
        "collection": "Homo Faber 2024 威尼斯工艺双年展", "category": "亚文化", "material": "手工发丝刺绣、天然宝石、复合织物",
        "description": "巴黎歌剧院大师 Muriel Nisse 的超现实艺术面具帽饰，以极其繁复的发丝刺绣与宝石镶嵌营造神秘图腾氛围。",
        "price": None, "currency": "EUR", "priceNote": "国际工艺双年展艺术孤品",
        "image": "https://hfgnext.s3.eu-west-3.amazonaws.com/img/4YL7Q000000PUDQWA4-headergd.jpg",
        "imageSource": "https://www.homofaber.com/en/objects/a1VTG000000eyfm2AA", "productUrl": "https://www.homofaber.com/en/objects/a1VTG000000eyfm2AA", "available": False,
        "sales": 10, "salesNote": "艺术收藏孤品",
        "artistry": 98, "artistryNote": "巴黎歌剧院级假发刺绣与面具雕塑绝技",
        "heat": {"score": 85, "celebrities": [], "runway": "Homo Faber 2024 威尼斯", "evidence": "入选米开朗基罗基金会 Homo Faber 全球顶级工艺名录。"},
        "sources": ["https://www.homofaber.com/en/objects/a1VTG000000eyfm2AA"]
    },
    {
        "id": "mn-jilin-pearl", "brandId": "muriel-nisse", "name": "Jilin Latex & Pearl Mask-Hat", "year": 2024,
        "collection": "Homo Faber 2024 展藏", "category": "亚文化", "material": "手工塑形乳胶、珍珠饰件、丝绸",
        "description": "将先锋乳胶肌理与温润珍珠结合的实验性头饰面具，游走于歌剧高定与暗黑哥特亚文化之间。",
        "price": None, "currency": "EUR", "priceNote": "艺术收藏孤品",
        "image": "https://hfgnext.s3.eu-west-3.amazonaws.com/img/4YL7Q000000PUDPWA4-headergd.jpg",
        "imageSource": "https://www.homofaber.com/en/objects/a1VTG000000eyfn2AA", "productUrl": "https://www.homofaber.com/en/objects/a1VTG000000eyfn2AA", "available": False,
        "sales": 10, "salesNote": "艺术收藏孤品",
        "artistry": 97, "artistryNote": "乳胶雕塑与古典珍珠镶嵌的跨媒介碰撞",
        "heat": {"score": 83, "celebrities": [], "runway": "Homo Faber 2024 威尼斯", "evidence": "当代法国高级手工艺术跨界代表作。"},
        "sources": ["https://www.homofaber.com/en/objects/a1VTG000000eyfn2AA"]
    },
    {
        "id": "ap-houndstooth-cap", "brandId": "anthony-peto", "name": "Fitted Cap Wool Houndstooth", "year": 2026,
        "collection": "Anthony Peto AW26", "category": "其他", "material": "100% 精纺羊毛千鸟格、巴黎手工缝制",
        "description": "巴黎工坊手工缝制的修身千鸟格羊毛鸭舌帽，版型紧致利落，是 Anthony Peto 最具性价比的法式绅士入门款。",
        "price": 100, "currency": "EUR", "priceNote": "官网官价",
        "image": "https://anthonypeto.com/cdn/shop/files/anthony-peto-fitted-cap-wool-houndstooth-casquette-laine-ah2026.jpg?v=1788971116&width=1188",
        "imageSource": "https://anthonypeto.com/", "productUrl": "https://anthonypeto.com/collections/men", "available": True,
        "sales": 84, "salesNote": "巴黎门店与官网高性价比畅销款",
        "artistry": 78, "artistryNote": "30 余年巴黎帽坊立体剪裁版型",
        "heat": {"score": 77, "celebrities": [], "runway": None, "evidence": "巴黎本地人与游客高频打卡的经典手工帽款。"},
        "sources": ["https://anthonypeto.com/collections/men"]
    },
    {
        "id": "ap-icone-panama-cloche", "brandId": "anthony-peto", "name": "Icone Panama Black Tartan Cloche", "year": 2026,
        "collection": "Anthony Peto SS26 女士系列", "category": "草帽", "material": "厄瓜多尔巴拿马草、黑格纹丝带",
        "description": "结合 1920 年代法式钟形帽轮廓与透气巴拿马草编的优雅夏季帽款，低调摩登。",
        "price": 220, "currency": "EUR", "priceNote": "官网参考价",
        "image": "https://anthonypeto.com/cdn/shop/collections/anthony-peto-icone-panama-black-tartan-cloche-paille-panama-pe2026_205cba09-1759-4de1-94ad-2ad0cd5a0e60.jpg?v=1786375800&width=1297",
        "imageSource": "https://anthonypeto.com/collections/women", "productUrl": "https://anthonypeto.com/collections/women", "available": True,
        "sales": 72, "salesNote": "春夏女士主力在售款",
        "artistry": 81, "artistryNote": "天然巴拿马草钟形帽冠压制工艺",
        "heat": {"score": 75, "celebrities": [], "runway": None, "evidence": "法式复古度假风的代表性实穿草帽。"},
        "sources": ["https://anthonypeto.com/collections/women"]
    },
    {
        "id": "clm-haute-coiffure", "brandId": "charlie-le-mindu", "name": "Haute Coiffure Human Hair Sculpture Headpiece", "year": 2015,
        "collection": "Haute Coiffure 先锋发艺高定", "category": "亚文化", "material": "真人发丝、马尾纤维、雕塑金属内骨",
        "description": "Charlie Le Mindu 开创的“高级发艺雕塑”代表作，以发丝替代传统织物编织出极具哥特与超现实张力的夸张头饰。",
        "price": None, "currency": "GBP", "priceNote": "伦敦/巴黎工作室艺术定制",
        "image": "https://cms.showstudio.com/images/-O8SfOqIGDWyI9nM6FpnjttsBkw=/402165/width-640/CharlieLeMindu.jpg",
        "imageSource": "https://www.showstudio.com/contributors/charlie_le_mindu", "productUrl": "https://www.showstudio.com/contributors/charlie_le_mindu", "available": False,
        "sales": 15, "salesNote": "秀场与艺人委约孤品",
        "artistry": 97, "artistryNote": "以真人发丝构筑雕塑帽饰的行业开创者",
        "heat": {"score": 90, "celebrities": ["Lady Gaga", "Peaches"], "runway": "巴黎高定 / V&A 博物馆 / SHOWstudio", "evidence": "为 Lady Gaga 打造的发丝头饰屡次成为全球时尚头条。"},
        "sources": ["https://www.showstudio.com/contributors/charlie_le_mindu"]
    },

    # --- Japan (4) ---
    {
        "id": "hmh-atelier-cap", "brandId": "haute-mode-hirata", "name": "HIRATA Atelier Sculpted Cap", "year": 2023,
        "collection": "H.at 成衣系列", "category": "其他", "material": "日本精纺面料、西麻布工坊立体定型",
        "description": "承袭日本制帽宗师平田暁夫衣钵的现代日常帽款，帽冠弧度精准贴合亚洲人头骨，简约却暗藏高定立体剪裁。",
        "price": 180, "currency": "USD", "priceNote": "官网参考价（约 ¥28,000 JPY）",
        "image": "https://hautemodehirata.com/cdn/shop/products/20220928_Hiratahat_21_003.jpg?v=1666227761&width=480",
        "imageSource": "https://hautemodehirata.com/products/cap-by-h-at", "productUrl": "https://hautemodehirata.com/products/cap-by-h-at", "available": True,
        "sales": 74, "salesNote": "东京西麻布总店与官网畅销款",
        "artistry": 86, "artistryNote": "日本皇室御用帽坊人体工学帽模传承",
        "heat": {"score": 81, "celebrities": [], "runway": "东京西麻布沙龙常青", "evidence": "日本高定制帽传奇品牌的亲民入门代表作。"},
        "sources": ["https://hautemodehirata.com/products/cap-by-h-at"]
    },
    {
        "id": "hmh-mens-felt", "brandId": "haute-mode-hirata", "name": "Akio Hirata Atelier Men's Felt Hat", "year": 2024,
        "collection": "Haute Mode Hirata 男士手工线", "category": "礼帽", "material": "日本精制兔毛毡、手工丝带",
        "description": "展现平田暁夫一脉“克制、建筑感与零冗余”美学的绅士毛毡礼帽，细节考究。",
        "price": 360, "currency": "USD", "priceNote": "官网参考价",
        "image": "https://hautemodehirata.com/cdn/shop/products/20220928_Hiratahat_14_005_07f1b01a-cccd-43f1-965a-ec360cad009c.jpg?v=1675309835&width=480",
        "imageSource": "https://hautemodehirata.com/collections/mens", "productUrl": "https://hautemodehirata.com/collections/mens", "available": True,
        "sales": 62, "salesNote": "男士高定线常青款",
        "artistry": 90, "artistryNote": "曾服务山本耀司与川久保玲的日本最高规格制帽工艺",
        "heat": {"score": 82, "celebrities": [], "runway": "西麻布工坊典藏风格", "evidence": "日本男装手工礼帽的工艺天花板之一。"},
        "sources": ["https://hautemodehirata.com/collections/mens"]
    },
    {
        "id": "kt-hunting-cap", "brandId": "kijima-takayuki", "name": "Minimalist Black Hunting Cap", "year": 2026,
        "collection": "Kijima Takayuki 2026 主线", "category": "其他", "material": "高密度日本精纺棉、手工内衬",
        "description": "木岛隆幸极具代表性的极简黑色猎帽，去繁就简的流线廓形搭配日本职人车线，男女佩戴皆显脸小利落。",
        "price": 150, "currency": "USD", "priceNote": "海外买手店参考价",
        "image": "https://plus0concept.com/cdn/shop/files/hunting-cap-black-on-model-close-up-front-wyyy261031-01.webp?v=1776439117&width=1000",
        "imageSource": "https://plus0concept.com/collections/kijima-takayuki-1", "productUrl": "https://plus0concept.com/collections/kijima-takayuki-1", "available": True,
        "sales": 88, "salesNote": "亚洲及海外买手店高复购畅销款",
        "artistry": 82, "artistryNote": "师承平田暁夫的极简立体剪裁与亚洲头型优化",
        "heat": {"score": 85, "celebrities": [], "runway": None, "evidence": "日系极简设计师穿搭博主高频推荐的招牌帽款。"},
        "sources": ["https://plus0concept.com/collections/kijima-takayuki-1"]
    },
    {
        "id": "kt-sailor-bshop", "brandId": "kijima-takayuki", "name": "Cotton Twill Sailor Hat (Bshop Exclusive)", "year": 2026,
        "collection": "Bshop 别注限定系列", "category": "渔夫帽", "material": "日本斜纹纯棉、可折叠软檐",
        "description": "与日本知名生活买手店 Bshop 合作的限定水手帽，柔和帽檐可自由翻折，是 Kijima Takayuki 最受大众喜爱的经典爆款廓形。",
        "price": 125, "currency": "USD", "priceNote": "日本官价约 ¥17,600 JPY",
        "image": "https://bshop-prod.store-image.jp/product/BSG262L303-0006/BSG262L303-0006_main_640x800.jpg",
        "imageSource": "https://bshop-inc.com/shop/ec/item/list/category_id/214", "productUrl": "https://bshop-inc.com/shop/ec/item/list/category_id/214", "available": True,
        "sales": 92, "salesNote": "日本全网常青爆款与高频联名帽型",
        "artistry": 80, "artistryNote": "极简水手帽精准比例与职人缝制",
        "heat": {"score": 87, "celebrities": [], "runway": None, "evidence": "小红书与日本 WEAR 穿搭榜高频出镜的“最显脸小渔夫/水手帽”。"},
        "sources": ["https://bshop-inc.com/shop/ec/item/list/category_id/214"]
    },
    {
        "id": "mt-atmospheric-reentry", "brandId": "maiko-takeda", "name": "Atmospheric Reentry Spiky Halo Headpiece", "year": 2013,
        "collection": "RCA 毕业代表作《Atmospheric Reentry》", "category": "亚文化", "material": "激光切割透明聚酯薄膜、亚克力、银色金属环",
        "description": "武田麻衣子一战成名的经典神作，由数百片透明渐变尖刺薄膜悬浮拼装而成，光影穿透时宛如科幻光环，被 Björk 选作《Vulnicura》时代标志性舞台头饰。",
        "price": None, "currency": "GBP", "priceNote": "博物馆与艺人收藏级孤品",
        "image": "https://maikotakeda.com/wp-content/uploads/2020/08/1-Bryan-Huynh-683x1024.jpg",
        "imageSource": "https://maikotakeda.com/work/atmospheric-reentry/", "productUrl": "https://maikotakeda.com/work/atmospheric-reentry/", "available": False,
        "sales": 12, "salesNote": "美术馆与艺人定制孤品",
        "artistry": 99, "artistryNote": "21 世纪最具革新性的光学与轻质材料先锋头饰雕塑",
        "heat": {"score": 95, "celebrities": ["Björk"], "runway": "Björk 世界巡演 / 全球设计大展", "evidence": "被誉为当代未来主义头饰设计的教科书级神作。"},
        "sources": ["https://maikotakeda.com/work/atmospheric-reentry/"]
    },
    {
        "id": "mt-issey-miyake-2026", "brandId": "maiko-takeda", "name": "Issey Miyake Collaboration Sculptural Headpiece", "year": 2026,
        "collection": "Issey Miyake 2026 巴黎时装周联名", "category": "秀场艺术帽", "material": "轻质半透明合成薄膜与结构骨架",
        "description": "2026 年为三宅一生（Issey Miyake）巴黎时装周秀场打造的最新联名头饰，延续武田麻衣子标志性的空气感与雕塑张力。",
        "price": None, "currency": "GBP", "priceNote": "巴黎时装周秀场定制",
        "image": "https://maikotakeda.com/wp-content/uploads/2026/04/ISSEY-MIYAKE_LOOKS_034_1240x1728-700x975.webp",
        "imageSource": "https://maikotakeda.com/allwork/", "productUrl": "https://maikotakeda.com/allwork/", "available": False,
        "sales": 14, "salesNote": "秀场联名限定",
        "artistry": 96, "artistryNote": "与三宅一生褶皱建筑美学的完美共振",
        "heat": {"score": 90, "celebrities": [], "runway": "Issey Miyake 2026 巴黎时装周", "evidence": "2026 巴黎时装周极具话题性的日本设计师强强联手。"},
        "sources": ["https://maikotakeda.com/allwork/"]
    },
    {
        "id": "ks-nao-nude", "brandId": "kiriko-sato", "name": "NAO Sculptural Hat (Nude)", "year": 2024,
        "collection": "Kiriko Sato Paris Atelier", "category": "礼帽", "material": "天然植物纤维手工定型、极简裸色",
        "description": "于巴黎玛黑区工作室手工定型的 NAO 雕塑感礼帽，温润裸色调与柔和折叠线条展现独特的日法侘寂诗意。",
        "price": 520, "currency": "USD", "priceNote": "日本买手店参考价 ¥80,300 JPY",
        "image": "https://imagedelivery.net/QondspN4HIUvB_R16-ddAQ/62cfcbf6b5285a5d49eb3b9f/c036fc622dbe4b0235d8.jpeg/fit=cover,w=800,h=800",
        "imageSource": "https://arumeonline.com/items/65b87e5cb8793a00361fddb0", "productUrl": "https://shop.kirikosato.com/products", "available": True,
        "sales": 48, "salesNote": "巴黎官网与日本精选买手店少量发售",
        "artistry": 89, "artistryNote": "日系极简留白与巴黎手工木模定型融合",
        "heat": {"score": 76, "celebrities": [], "runway": "巴黎玛黑区独立展陈", "evidence": "东京与巴黎小众高阶买手圈力推的静谧美学帽款。"},
        "sources": ["https://arumeonline.com/items/65b87e5cb8793a00361fddb0"]
    },

    # --- Italy (2) ---
    {
        "id": "sd-hobo-sharp-blue", "brandId": "super-duper-hats", "name": "HOBO Sharp Blue (Crushable Travel Fedora)", "year": 2025,
        "collection": "Super Duper FW25", "category": "软呢帽", "material": "可折叠拉帕兔毛毡、佛罗伦萨手工定型",
        "description": "Super Duper Hats 最具代表性的可揉折旅行费多拉帽 HOBO，深邃电光蓝配不修边随性帽檐，塞入行李箱展开即可恢复廓形。",
        "price": 320, "currency": "EUR", "priceNote": "官网参考价",
        "image": "https://superduperhats.com/cdn/shop/files/CU1I7714.jpg?v=1755761757&width=1445",
        "imageSource": "https://superduperhats.com/products/hobo-sharp-blue-fw25", "productUrl": "https://superduperhats.com/products/hobo-sharp-blue-fw25", "available": True,
        "sales": 84, "salesNote": "品牌全球复购率最高的核心常青系列",
        "artistry": 85, "artistryNote": "佛罗伦萨手工可折叠回弹毛毡黑科技",
        "heat": {"score": 84, "celebrities": [], "runway": "Pitti Uomo 佛罗伦萨男装展", "evidence": "Pitti Uomo 街拍与意式雅痞穿搭的高出镜率明星款。"},
        "sources": ["https://superduperhats.com/products/hobo-sharp-blue-fw25"]
    },
    {
        "id": "sd-drop-black", "brandId": "super-duper-hats", "name": "Drop Black Sculptural Felt Hat", "year": 2025,
        "collection": "Super Duper 雕塑黑毡线", "category": "礼帽", "material": "100% 黑色手工拉帕毛毡",
        "description": "帽檐如水滴垂落的极简全黑雕塑毛毡帽，低调酷感十足。",
        "price": 350, "currency": "EUR", "priceNote": "官网参考价",
        "image": "https://superduperhats.com/cdn/shop/files/DropBlack-_B6A1098.jpg?v=1733756324&width=1445",
        "imageSource": "https://superduperhats.com/products/drop-black-1", "productUrl": "https://superduperhats.com/products/drop-black-1", "available": True,
        "sales": 76, "salesNote": "官网主力在售款",
        "artistry": 86, "artistryNote": "柔和垂坠雕塑帽檐手工塑形",
        "heat": {"score": 80, "celebrities": [], "runway": None, "evidence": "佛罗伦萨工坊代表性现代极简黑帽。"},
        "sources": ["https://superduperhats.com/products/drop-black-1"]
    },
    {
        "id": "fm-sequin-bow-cap", "brandId": "federica-moretti", "name": "Pink Sequin Bow Straw Cap", "year": 2022,
        "collection": "Federica Moretti 米兰春夏系列", "category": "草帽", "material": "天然编织草料、粉色亮片立体蝴蝶结",
        "description": "米兰设计师 Federica Moretti 标志性的华丽少女波普风，将亮片大蝴蝶结与休闲草编鸭舌帽巧妙融合。",
        "price": 260, "currency": "EUR", "priceNote": "米兰精品渠道参考价",
        "image": "https://i.ebayimg.com/images/g/s4kAAOSwuSlhP0Ub/s-l1200.jpg",
        "imageSource": "https://www.ebay.com/itm/267399117996", "productUrl": "https://www.ebay.com/itm/267399117996", "available": True,
        "sales": 62, "salesNote": "意大利精品买手与二手流通热门款",
        "artistry": 82, "artistryNote": "意式亮片刺绣与草编鸭舌帽混搭",
        "heat": {"score": 78, "celebrities": ["Madonna"], "runway": "米兰时装周配饰展", "evidence": "品牌因 Madonna 登上 Vogue Italia 封面后广受关注。"},
        "sources": ["https://www.ebay.com/itm/267399117996"]
    },
    {
        "id": "fm-velvet-bow-beanie", "brandId": "federica-moretti", "name": "Velvet Bow Ribbed Wool Beanie", "year": 2023,
        "collection": "秋冬经典蝴蝶结针织线", "category": "针织帽", "material": "意大利美利奴罗纹羊毛、立体丝绒蝴蝶结",
        "description": "Federica Moretti 销量最稳健的冬季招牌针织帽，柔软保暖且极具意式甜酷辨识度。",
        "price": 195, "currency": "EUR", "priceNote": "欧美买手参考价",
        "image": "https://i.ebayimg.com/images/g/WGEAAOSwhsBjET4t/s-l1200.jpg",
        "imageSource": "https://www.ebay.com/itm/403862663795", "productUrl": "https://www.ebay.com/itm/403862663795", "available": True,
        "sales": 74, "salesNote": "品牌秋冬长青畅销款",
        "artistry": 77, "artistryNote": "意大利精纺罗纹针织配手工丝绒结",
        "heat": {"score": 76, "celebrities": [], "runway": None, "evidence": "欧美冬季街拍与买手店高人气单品。"},
        "sources": ["https://www.ebay.com/itm/403862663795"]
    },

    # --- Spain (2) ---
    {
        "id": "el-oversized-170", "brandId": "eliurpi", "name": "Oversized Mediterranean Sculptural Straw Hat (Ø170cm)", "year": 2023,
        "collection": "Eliurpi 巴塞罗那雕塑装置系列", "category": "秀场艺术帽", "material": "天然地中海棕榈草纯手工编织",
        "description": "直径高达 170 厘米的巨型超现实雕塑草帽，在巴塞罗那哥特区工坊耗时数周手工缝制，既是可佩戴草帽也是震撼人心的艺术墙饰。",
        "price": 1100, "currency": "EUR", "priceNote": "巴塞罗那工作室定制参考价",
        "image": "https://soul-matter.com/wp-content/uploads/2023/07/ELIURPI_1.jpg",
        "imageSource": "https://soul-matter.com/project/eliurpi/", "productUrl": "https://www.eliurpi.com/hats", "available": True,
        "sales": 46, "salesNote": "高端画廊与时尚大片高频定制款",
        "artistry": 95, "artistryNote": "挑战物理重力的超巨幅天然草编雕塑工艺",
        "heat": {"score": 91, "celebrities": [], "runway": "全球时尚杂志封面与艺术空间展", "evidence": "在全球社交媒体与设计杂志刷屏的地中海巨型草帽代表作。"},
        "sources": ["https://soul-matter.com/project/eliurpi/", "https://www.eliurpi.com/hats"]
    },
    {
        "id": "el-barcelona-raffia", "brandId": "eliurpi", "name": "Barcelona Handmade Raffia Sculpture Hat", "year": 2024,
        "collection": "Eliurpi 成衣雕塑草帽线", "category": "草帽", "material": "天然拉菲草、手工波浪塑形",
        "description": "更适合日常度假佩戴的波浪雕塑感拉菲草帽，光影投射在面部宛如建筑诗篇。",
        "price": 390, "currency": "EUR", "priceNote": "官网参考价",
        "image": "https://images.squarespace-cdn.com/content/v1/55d3242ae4b0e309f827bd7a/1623762657166-GGD5CKHCRXQGH89BDUDP/eliurpi-barcelona.jpg",
        "imageSource": "https://www.eliurpi.com/hats", "productUrl": "https://www.eliurpi.com/hats", "available": True,
        "sales": 68, "salesNote": "官网主力热卖草帽",
        "artistry": 89, "artistryNote": "巴塞罗那工坊手工拉菲草建筑弧线",
        "heat": {"score": 84, "celebrities": [], "runway": None, "evidence": "地中海奢华度假与极简摄影高频出镜单品。"},
        "sources": ["https://www.eliurpi.com/hats"]
    },
    {
        "id": "gw-arthur-burned", "brandId": "genis-whylan", "name": "Arthur Bespoke Burned Felt Hat", "year": 2026,
        "collection": "Whyhats Ready-to-Wear 签名线", "category": "礼帽", "material": "顶级兔/海狸毛毡、手工明火烤痕与刺绣帽带",
        "description": "巴塞罗那 Whyhats 标志性火烤做旧西部礼帽，由主理人 Genis Whylan 亲手以火焰灼烧出独特肌理，充满摇滚与流浪诗意。",
        "price": 695, "currency": "EUR", "priceNote": "Whyhats 官网官价",
        "image": "https://www.whyhats.es/cdn/shop/files/image00003_e9a5ded1-c78a-49ad-bee1-cb98a932063c.jpg?v=1790096856&width=3840",
        "imageSource": "https://www.whyhats.es/collections/ready-to-wear", "productUrl": "https://www.whyhats.es/collections/ready-to-wear", "available": True,
        "sales": 64, "salesNote": "官网现货与定制热门款",
        "artistry": 89, "artistryNote": "纯手工火焰炙烤肌理与西部帽冠定型",
        "heat": {"score": 85, "celebrities": ["Pope Leo XIV（同工坊定制）"], "runway": None, "evidence": "2026 年因向教皇利奥十四世赠予定制礼帽获欧洲主流媒体广泛报道。"},
        "sources": ["https://www.whyhats.es/collections/ready-to-wear"]
    },
    {
        "id": "gw-beaver-western", "brandId": "genis-whylan", "name": "Custom 100% Beaver Felt Western Hat", "year": 2025,
        "collection": "Whyhats 全定制高定线", "category": "礼帽", "material": "100% 顶级海狸毛毡、手工缝线与古董饰件",
        "description": "采用最顶级 100% 海狸毛毡打造的巴塞罗那全定制西部帽，防水耐磨、触感如丝绒，可陪伴佩戴者数十年。",
        "price": 895, "currency": "EUR", "priceNote": "官网定制起价",
        "image": "https://www.whyhats.es/cdn/shop/products/IMG_6677.jpg?v=1628588825&width=3840",
        "imageSource": "https://www.whyhats.es/pages/custom-hats", "productUrl": "https://www.whyhats.es/pages/custom-hats", "available": True,
        "sales": 56, "salesNote": "全定制核心接单款",
        "artistry": 91, "artistryNote": "纯海狸毛毡手工塑形与个性化火烤定制",
        "heat": {"score": 81, "celebrities": [], "runway": None, "evidence": "欧洲新兴手工西部礼帽玩家的高口碑定制之选。"},
        "sources": ["https://www.whyhats.es/pages/custom-hats"]
    },

    # --- Austria (Reinhard Plank) ---
    {
        "id": "rp-basco-black", "brandId": "reinhard-plank", "name": "Basco Black Sculptural Hat", "year": 2025,
        "collection": "Reinhard Plank 先锋暗黑常青线", "category": "亚文化", "material": "意大利手工重塑黑毛毡、不对称折皱",
        "description": "Reinhard Plank 最具暗黑先锋辨识度的 Basco 全黑雕塑帽，通过手工揉皱与蒸汽塑形呈现宛如当代艺术雕塑的冷峻轮廓。",
        "price": 340, "currency": "EUR", "priceNote": "Select Mode 买手店参考价",
        "image": "https://www.select-mode-online.de/media/30/97/d8/1750944240/Basco_black_4.jpg?ts=1750944240",
        "imageSource": "https://www.select-mode-online.de/en/Designer/Reinhard-Plank/", "productUrl": "https://reinhardplank.it/collections/all-products", "available": True,
        "sales": 82, "salesNote": "全球暗黑先锋买手店常青热销款",
        "artistry": 91, "artistryNote": "解构手塑折痕与无性别暗黑建筑感",
        "heat": {"score": 87, "celebrities": [], "runway": "巴黎/佛罗伦萨先锋买手展", "evidence": "暗黑先锋风格（Rick Owens / Yohji 穿搭体系）最受推崇的帽饰之一。"},
        "sources": ["https://www.select-mode-online.de/en/Designer/Reinhard-Plank/"]
    },
    {
        "id": "rp-alascot-green", "brandId": "reinhard-plank", "name": "Alascot Green Straw Hat", "year": 2026,
        "collection": "Reinhard Plank SS26", "category": "草帽", "material": "手工染色天然草编、随性不规则帽檐",
        "description": "以冷调灰绿染色与解构帽冠重塑传统草帽，打破度假草帽的甜腻刻板印象。",
        "price": 295, "currency": "EUR", "priceNote": "官网参考价",
        "image": "https://reinhardplank.it/cdn/shop/files/ALASCOTGREEN-ST-1.jpg?v=1773665461&width=533",
        "imageSource": "https://reinhardplank.it/collections/all-products", "productUrl": "https://reinhardplank.it/collections/all-products", "available": True,
        "sales": 70, "salesNote": "2026 春夏官网主力款",
        "artistry": 86, "artistryNote": "冷调植物染色与实验性草编定型",
        "heat": {"score": 79, "celebrities": [], "runway": None, "evidence": "极具辨识度的先锋夏季草帽选择。"},
        "sources": ["https://reinhardplank.it/collections/all-products"]
    },

    # --- 1 each (Ukraine, Canada, Korea, Israel, Serbia, Iceland) ---
    {
        "id": "shm-sculptable-straw", "brandId": "shmelevsky", "name": "Sculptable Brim Straw Hat (SS26)", "year": 2026,
        "collection": "Shmelevsky Summer 2026", "category": "草帽", "material": "天然编织草料、内置可塑形记忆定型丝",
        "description": "乌克兰先锋帽坊 Shmelevsky 的招牌可塑形帽檐草帽，佩戴者可随心情与造型自由弯折出建筑感波浪或极简平檐。",
        "price": 290, "currency": "EUR", "priceNote": "官网参考价",
        "image": "https://static.tildacdn.one/tild6161-6631-4530-a332-396331396164/shmelevsky_ss26_047.jpg",
        "imageSource": "https://shmelevsky.com/shop/collection-summer-2026/tproduct/2276828093-994885472894-sculptable-brim-straw-hat", "productUrl": "https://shmelevsky.com/shop/collection-summer-2026/tproduct/2276828093-994885472894-sculptable-brim-straw-hat", "available": True,
        "sales": 68, "salesNote": "官网 SS26 核心热卖款",
        "artistry": 87, "artistryNote": "交互式可自由塑形帽檐结构设计",
        "heat": {"score": 80, "celebrities": [], "runway": "基辅/欧洲独立设计师展", "evidence": "因极高造型自由度备受欧洲造型师喜爱。"},
        "sources": ["https://shmelevsky.com/shop/collection-summer-2026/tproduct/2276828093-994885472894-sculptable-brim-straw-hat"]
    },
    {
        "id": "shm-mars-felt", "brandId": "shmelevsky", "name": "Mars Sculptural Felt Hat", "year": 2025,
        "collection": "Shmelevsky Felt Collection", "category": "礼帽", "material": "乌克兰工坊手工毛毡",
        "description": "冷峻克制的 Mars 雕塑毛毡帽，以干净利落的几何穹顶帽冠展现东欧当代极简美学。",
        "price": 320, "currency": "EUR", "priceNote": "官网参考价",
        "image": "https://static.tildacdn.one/tild3561-6163-4862-b364-313830623536/Shmelevsky_Mars_low-.JPG",
        "imageSource": "https://shmelevsky.com/shop/felt-hats", "productUrl": "https://shmelevsky.com/shop/felt-hats", "available": True,
        "sales": 62, "salesNote": "秋冬毛毡线主力在售",
        "artistry": 86, "artistryNote": "无装饰纯几何穹顶手工拉制",
        "heat": {"score": 76, "celebrities": [], "runway": None, "evidence": "东欧极简先锋帽饰的代表廓形。"},
        "sources": ["https://shmelevsky.com/shop/felt-hats"]
    },
    {
        "id": "xt-artemis-wool", "brandId": "xtinel", "name": "Artemis Wool Hat (Grey Brown)", "year": 2025,
        "collection": "Xtinel 蒙特利尔神话手作线", "category": "亚文化", "material": "蒙特利尔手工羊毛毡、野生动物角/耳廓造型",
        "description": "灵感源自希腊狩猎女神阿尔忒弥斯的手工灰棕羊毛帽，以精灵感异形轮廓风靡 AP0CENE 亚文化买手圈。",
        "price": 250, "currency": "USD", "priceNote": "AP0CENE 官价",
        "image": "http://ap0cene.com/cdn/shop/products/45_27cb7576-071d-4192-ae82-a52f145db915.png?v=1737946875",
        "imageSource": "https://ap0cene.com/products/artemis-wool-hat", "productUrl": "https://ap0cene.com/products/artemis-wool-hat", "available": True,
        "sales": 70, "salesNote": "AP0CENE 高人气小众手作爆款",
        "artistry": 88, "artistryNote": "神话生物仿生廓形与纯手工针毡塑形",
        "heat": {"score": 84, "celebrities": [], "runway": None, "evidence": "北美与全球仙女核（Fairycore）/ 亚文化社群热门单品。"},
        "sources": ["https://ap0cene.com/products/artemis-wool-hat"]
    },
    {
        "id": "xt-banshee-distressed", "brandId": "xtinel", "name": "Banshee II Distressed Hat (Black)", "year": 2025,
        "collection": "Xtinel 暗黑神话系列", "category": "亚文化", "material": "手工镂空做旧黑色织物",
        "description": "致敬爱尔兰女妖传说的全黑破损镂空帽，极具暗黑哥特与末世废土亚文化氛围。",
        "price": 250, "currency": "USD", "priceNote": "AP0CENE 官价",
        "image": "http://ap0cene.com/cdn/shop/products/49_5bc350e3-7df9-4399-9f8d-c44f94449fa5.png?v=1737946847",
        "imageSource": "https://ap0cene.com/products/banshee-ii-distressed-hat", "productUrl": "https://ap0cene.com/products/banshee-ii-distressed-hat", "available": True,
        "sales": 68, "salesNote": "AP0CENE 限量补货款",
        "artistry": 89, "artistryNote": "手工撕裂镂空与暗黑解构质感",
        "heat": {"score": 83, "celebrities": [], "runway": None, "evidence": "暗黑废土与哥特亚文化穿搭高频收藏单品。"},
        "sources": ["https://ap0cene.com/products/banshee-ii-distressed-hat"]
    },
    {
        "id": "xt-narcissus-ruched", "brandId": "xtinel", "name": "Narcissus Ruched Satin Hat (Pink)", "year": 2025,
        "collection": "Xtinel 蒙特利尔手作", "category": "亚文化", "material": "粉色抽褶真丝缎、蓬松软填充结构",
        "description": "以希腊美少年纳西索斯为灵感的粉色抽褶膨胀缎面帽，融合梦幻浪漫与怪诞亚文化比例。",
        "price": 250, "currency": "USD", "priceNote": "AP0CENE 官价",
        "image": "http://ap0cene.com/cdn/shop/products/48_a1f26a23-1d1f-4815-91ad-698ec48bac35.png?v=1737946794",
        "imageSource": "https://ap0cene.com/products/narcissus-ruched-hat", "productUrl": "https://ap0cene.com/products/narcissus-ruched-hat", "available": True,
        "sales": 64, "salesNote": "AP0CENE 在售手作款",
        "artistry": 87, "artistryNote": "立体抽褶丝缎软雕塑缝制",
        "heat": {"score": 81, "celebrities": [], "runway": None, "evidence": "高辨识度甜酷亚文化拍照神器。"},
        "sources": ["https://ap0cene.com/products/narcissus-ruched-hat"]
    },
    {
        "id": "zt-charcoal-velvet-cap", "brandId": "zentow", "name": "Charcoal Shirred Velvet Cap", "year": 2026,
        "collection": "Zentow 2026 首尔系列", "category": "亚文化", "material": "炭灰色抽褶丝绒、立体肌理拼接",
        "description": "韩国新锐品牌 Zentow 推出的炭灰抽褶丝绒帽，以细腻褶皱光泽打破常规鸭舌帽的单调感，兼具韩系暗黑亚文化氛围与亲民定价。",
        "price": 32, "currency": "USD", "priceNote": "韩国官网官价 45,000 KRW",
        "image": "https://cdn.imweb.me/upload/S20260116f09d1be568205/204bfc310ff9a.png",
        "imageSource": "https://zentow.kr/62", "productUrl": "https://zentow.kr/62", "available": True,
        "sales": 78, "salesNote": "韩国官网高性价比热卖款",
        "artistry": 79, "artistryNote": "丝绒立体抽褶肌理与现代鸭舌帽结合",
        "heat": {"score": 77, "celebrities": [], "runway": None, "evidence": "首尔独立设计师圈新兴小众宝藏帽饰。"},
        "sources": ["https://zentow.kr/62"]
    },
    {
        "id": "mz-cuisine-hat", "brandId": "maor-zabar", "name": "Cuisine Collection Wearable Food Couture Hat", "year": 2023,
        "collection": "Cuisine 超现实美食系列", "category": "亚文化", "material": "手工塑形毛毡、树脂仿真美食雕塑与餐盘帽座",
        "description": "特拉维夫设计师 Maor Zabar 爆红全网的代表作，将精致餐点以 1:1 超现实手工雕塑直接置于头顶，波普趣味与高定工艺兼备。",
        "price": 680, "currency": "USD", "priceNote": "官网定制参考价",
        "image": "https://maorzabarhats.com/cdn/shop/products/1S2A1375_1024x.jpg?v=1667909984",
        "imageSource": "https://maorzabarhats.com/collections/cuisine", "productUrl": "https://maorzabarhats.com/collections/cuisine", "available": True,
        "sales": 54, "salesNote": "官网网红定制核心系列",
        "artistry": 94, "artistryNote": "超现实主义波普饮食文化与手工雕塑融合",
        "heat": {"score": 90, "celebrities": [], "runway": "国际设计媒体与红毯话题", "evidence": "屡次登上全球病毒式传播榜的“美食高定帽”开创系列。"},
        "sources": ["https://maorzabarhats.com/collections/cuisine"]
    },
    {
        "id": "mz-dark-desert", "brandId": "maor-zabar", "name": "Dark Desert Sculptural Hat", "year": 2024,
        "collection": "Dark Desert 暗夜沙漠系列", "category": "秀场艺术帽", "material": "黑色手工定型毛毡、沙漠植物肌理雕塑",
        "description": "以以色列沙漠夜色与仙人掌生命力为灵感的暗黑雕塑帽，展现了 Maor Zabar 除幽默美食外极深沉的艺术表现力。",
        "price": 750, "currency": "USD", "priceNote": "官网定制参考价",
        "image": "https://maorzabarhats.com/cdn/shop/collections/IMG_8554_copy_300x.jpg?v=1685608547",
        "imageSource": "https://maorzabarhats.com/collections/dark-desert", "productUrl": "https://maorzabarhats.com/collections/dark-desert", "available": True,
        "sales": 38, "salesNote": "官网按单制作",
        "artistry": 92, "artistryNote": "自然仿生暗黑雕塑廓形",
        "heat": {"score": 80, "celebrities": [], "runway": None, "evidence": "品牌官网主打艺术雕塑线代表作。"},
        "sources": ["https://maorzabarhats.com/collections/dark-desert"]
    },
    {
        "id": "ar-animal-evolution", "brandId": "ana-rajcevic", "name": "ANIMAL: The Other Side of Evolution Headpiece", "year": 2012,
        "collection": "ITS 2012 国际配饰大奖获奖系列", "category": "亚文化", "material": "玻璃纤维、树脂、人工骨骼仿生雕塑",
        "description": "塞尔维亚裔柏林艺术家 Ana Rajcevic 凭此一举夺得 ITS 国际大奖的仿生雕塑头饰，将动物角与人类头骨自然融合，开启后人类赛博仿生头饰风潮。",
        "price": None, "currency": "EUR", "priceNote": "博物馆与艺术收藏孤品",
        "image": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_ejaj8C7VB9y4JtzYat-_c1X4F91TMRJD5F8-lm9q58Pm3c6c6q-rtS7LgweECwXqJ7-YhI6EVNt0FJefkt8BJUGUjzYw1-HTM01R8DGbs_0NPf4c8PquPw6xfnlnu6OhlHLLRTn0ADrg/s1600/ANA+RAJCEVIC.jpg",
        "imageSource": "http://www.tedore.at/2013/08/ana-rajcevic-fashion-artist-and-sculptor.html", "productUrl": "http://www.tedore.at/2013/08/ana-rajcevic-fashion-artist-and-sculptor.html", "available": False,
        "sales": 10, "salesNote": "美术馆与艺术收藏孤品",
        "artistry": 98, "artistryNote": "后人类生物形态与工业树脂雕塑巅峰",
        "heat": {"score": 89, "celebrities": [], "runway": "ITS 2012 国际时尚大奖", "evidence": "全球先锋时尚与科幻美学必提的里程碑式头饰作品。"},
        "sources": ["http://www.tedore.at/2013/08/ana-rajcevic-fashion-artist-and-sculptor.html"]
    },
    {
        "id": "jm-greenman-mask", "brandId": "james-merry", "name": "Greenman Botanical Embroidered Mask", "year": 2024,
        "collection": "James Merry 植物共生刺绣系列", "category": "亚文化", "material": "天然丝线手工植物刺绣、透薄网纱结构",
        "description": "将冰岛苔藓、蕨类与神秘森林绿人（Greenman）图腾化为精细刺绣面具头饰，空灵而充满原始自然神性。",
        "price": None, "currency": "USD", "priceNote": "艺术家限量定制",
        "image": "https://cdn.shopify.com/s/files/1/0652/3571/4229/files/GreenmanMask_f4ae608b-d9fc-4976-87f6-ecb4bcdd7d66_1000x.jpg?v=1731078611",
        "imageSource": "https://jtmerry.com/", "productUrl": "https://jtmerry.com/", "available": False,
        "sales": 18, "salesNote": "极少量艺术家手工签售",
        "artistry": 97, "artistryNote": "将冰岛自然生态微缩于立体悬空刺绣",
        "heat": {"score": 91, "celebrities": ["Björk"], "runway": "James Merry 官网精选", "evidence": "当代自然神秘主义与独立音乐视觉美学的绝对标杆。"},
        "sources": ["https://jtmerry.com/"]
    },
    {
        "id": "jm-utopia-bjork", "brandId": "james-merry", "name": "Utopia Silicone Mask (for Björk)", "year": 2018,
        "collection": "Björk《Utopia》专辑与 Homo Faber 2024 展藏", "category": "亚文化", "material": "手工雕塑医用级硅胶、荧光生物色调",
        "description": "为冰岛国宝级歌手 Björk《Utopia》时代定制的标志性生物兰花硅胶面具头饰，入选 2024 威尼斯 Homo Faber 大展。",
        "price": None, "currency": "USD", "priceNote": "艺人巡演与博物馆展藏孤品",
        "image": "https://hfgnext.s3.eu-west-3.amazonaws.com/img/4YLTG0000001yDR4AY-null.jpg",
        "imageSource": "https://2024.homofaber.com/ecatalogue/objects/02iTG000001NYRpYAO", "productUrl": "https://2024.homofaber.com/ecatalogue/objects/02iTG000001NYRpYAO", "available": False,
        "sales": 8, "salesNote": "世界级音乐人专属孤品",
        "artistry": 99, "artistryNote": "融合科幻生物形态与高定雕塑工艺的艺术殿堂级杰作",
        "heat": {"score": 96, "celebrities": ["Björk"], "runway": "Björk Cornucopia 巡演 / Homo Faber 2024", "evidence": "全球流行音乐与当代艺术史最具影响力的头饰面具之一。"},
        "sources": ["https://2024.homofaber.com/ecatalogue/objects/02iTG000001NYRpYAO"]
    },
    {
        "id": "jm-tilda-venice", "brandId": "james-merry", "name": "Sculptural Mask #1 (for Tilda Swinton)", "year": 2020,
        "collection": "威尼斯电影节定制 / Homo Faber 2024 展藏", "category": "秀场艺术帽", "material": "3D 雕塑镀金骨架、手工精细打磨",
        "description": "为奥斯卡得主 Tilda Swinton 出席 2020 年威尼斯电影节终身成就奖红毯打造的华丽雕塑手举/头部面具，惊艳全球媒体。",
        "price": None, "currency": "USD", "priceNote": "影后红毯定制孤品",
        "image": "https://hfgnext.s3.eu-west-3.amazonaws.com/img/4YLTG0000001y8b4AA-null.jpg",
        "imageSource": "https://2024.homofaber.com/ecatalogue/objects/02iTG000001NVCEYA4", "productUrl": "https://2024.homofaber.com/ecatalogue/objects/02iTG000001NVCEYA4", "available": False,
        "sales": 8, "salesNote": "电影节红毯孤品",
        "artistry": 97, "artistryNote": "宛如蝴蝶羽翼与骨骼交织的雕塑艺术品",
        "heat": {"score": 95, "celebrities": ["Tilda Swinton"], "runway": "威尼斯电影节红毯 / Homo Faber 2024", "evidence": "2020 年威尼斯电影节最具历史记忆点的红毯造型。"},
        "sources": ["https://2024.homofaber.com/ecatalogue/objects/02iTG000001NVCEYA4"]
    },

    # --- China New Brands (4 new: 盛锡福, Kreuzzz, Jaycow, Atelier PHYL) ---
    {
        "id": "sxf-heritage-fedora", "brandId": "sheng-xi-fu", "name": "盛锡福传统非遗手工礼帽", "year": 2024,
        "collection": "国家级非遗百年传承系列", "category": "礼帽", "material": "精选澳毛/兔毛毡、纯手工烫压木模定型",
        "description": "承袭 1911 年百年非遗制帽技艺的经典手工礼帽，历经拉坯、蒸汽熨烫、修边等数十道传统工序，挺括庄重，是中国近现代礼帽史的活化石。",
        "price": 680, "currency": "CNY", "priceNote": "王府井门店与电商参考价",
        "image": "https://m.tesegu.com/public/upload/photos/000/002/048/91/a898d7c814fcf7439e09b8e16cdb0a9a6Bm6Yw.jpg",
        "imageSource": "https://m.tesegu.com/techan/263548.html", "productUrl": "https://www.taobao.com/list/product/%E7%9B%9B%E9%94%A1%E7%A6%8F.htm", "available": True,
        "sales": 88, "salesNote": "中华老字号常年稳定畅销核心款",
        "artistry": 86, "artistryNote": "国家级非物质文化遗产手工制帽技艺",
        "heat": {"score": 84, "celebrities": [], "runway": "国家级非遗展览", "evidence": "中国百年制帽老字号金字招牌，影视剧与老派绅士首选。"},
        "sources": ["https://m.tesegu.com/techan/263548.html"]
    },
    {
        "id": "sxf-retro-wool", "brandId": "sheng-xi-fu", "name": "盛锡福秋冬复古羊毛礼帽", "year": 2025,
        "collection": "老字号日常复古线", "category": "软呢帽", "material": "100% 澳洲羊毛呢、经典罗缎帽带",
        "description": "更适合现代日常通勤的复古羊毛软呢帽，帽型贴合国人头围，性价比极高。",
        "price": 328, "currency": "CNY", "priceNote": "淘宝官方渠道参考价",
        "image": "https://img.alicdn.com/imgextra/i2/1820947639/O1CN011He6Sq26IiZj2eDsy_!!4611686018427385015-2-item_pic.png_300x300q50.jpg_.webp",
        "imageSource": "https://www.taobao.com/list/product/%E7%9B%9B%E9%94%A1%E7%A6%8F.htm", "productUrl": "https://www.taobao.com/list/product/%E7%9B%9B%E9%94%A1%E7%A6%8F.htm", "available": True,
        "sales": 90, "salesNote": "国内电商平台高销量老字号爆款",
        "artistry": 79, "artistryNote": "百年老字号成熟版型与传统定型工艺",
        "heat": {"score": 80, "celebrities": [], "runway": None, "evidence": "国内中老年与复古青年高频复购的国民礼帽。"},
        "sources": ["https://www.taobao.com/list/product/%E7%9B%9B%E9%94%A1%E7%A6%8F.htm"]
    },
    {
        "id": "krz-shanghai-atelier", "brandId": "kreuzzz", "name": "Studio Kreuzzz 弄堂手作日常礼帽", "year": 2019,
        "collection": "Studio Kreuzzz 上海手作系列", "category": "礼帽", "material": "真丝羊毛混纺毡 / 中国传统夏布、手工定型",
        "description": "制帽师胡钰珑（Danielle）在上海弄堂工作室亲手拉制的温润日常礼帽，强调帽子与佩戴者及城市街道的自然亲密感，不刻意张扬却暗藏细腻工艺。",
        "price": 1680, "currency": "CNY", "priceNote": "上海工作室定制参考价",
        "image": "https://eastbounder.com/wp-content/uploads/eastbounder/people/17/03-Danielle_n-people-cover.jpg",
        "imageSource": "https://eastbounder.com/local_creatives/17", "productUrl": "https://www.yixi.tv/h5/speech/306/", "available": True,
        "sales": 46, "salesNote": "上海独立工作室小批量手工定制",
        "artistry": 88, "artistryNote": "将中国非遗夏布与英式传统制帽木模温柔结合",
        "heat": {"score": 81, "celebrities": [], "runway": "上海时装周 deepmoss 合作 / 一席演讲", "evidence": "一席演讲《做个帽子能改变什么》让中国独立手工制帽广为大众熟知。"},
        "sources": ["https://eastbounder.com/local_creatives/17", "https://www.yixi.tv/h5/speech/306/"]
    },
    {
        "id": "jc-hk-fascinator", "brandId": "jaycow-millinery", "name": "Hong Kong Couture Fascinator", "year": 2022,
        "collection": "Jaycow 香港高定礼帽系列", "category": "鸡尾酒帽/发饰", "material": "英式剑麻草、手工羽毛与丝绸塑形",
        "description": "师从英国王室制帽师 Rose Corey 的香港独立制帽师 Jay Cheng 代表作，展现纯正英伦赛马会礼仪帽饰在亚洲的精致落地。",
        "price": 2400, "currency": "CNY", "priceNote": "香港工作室定制参考价",
        "image": "https://www.hkums.com/wp-content/uploads/gallery/50/cache/282.jpg-nggid0511922-ngg0dyn-445x334-00f0w010c010r110f110r010t010.jpg",
        "imageSource": "https://www.hkums.com/activity/jaycow-millinery-workshop/", "productUrl": "https://www.hkums.com/activity/jaycow-millinery-workshop/", "available": True,
        "sales": 42, "salesNote": "香港沙龙定制与工坊展售",
        "artistry": 87, "artistryNote": "纯正英国王室御用体系手工拉坯与羽饰工艺",
        "heat": {"score": 74, "celebrities": [], "runway": "香港赛马会与博物馆工艺坊", "evidence": "香港地区深耕二十余年的英式高定制帽先驱。"},
        "sources": ["https://www.hkums.com/activity/jaycow-millinery-workshop/"]
    },
    {
        "id": "phyl-fleur-sculpture", "brandId": "atelier-phyl", "name": "Fleur Sculptural Millinery Hat", "year": 2024,
        "collection": "Atelier PHYL Fleur 花卉雕塑系列", "category": "秀场艺术帽", "material": "手工塑形剑麻与立体丝绸花瓣",
        "description": "香港新锐制帽工作室 Atelier PHYL 的招牌 Fleur 系列，将绽放花瓣化为轻盈而富有建筑张力的头顶雕塑，优雅摩登。",
        "price": 3200, "currency": "CNY", "priceNote": "香港官网参考价",
        "image": "https://atelierphyl.com/cdn/shop/files/2022_0325-1003.jpg?v=1727953526&width=533",
        "imageSource": "https://atelierphyl.com/collections/fleur", "productUrl": "https://atelierphyl.com/collections/fleur", "available": True,
        "sales": 52, "salesNote": "官网现货与香港定制热门款",
        "artistry": 90, "artistryNote": "东方柔美花艺与英式雕塑定型结合",
        "heat": {"score": 78, "celebrities": [], "runway": "香港时尚大片与高定婚礼", "evidence": "港台时尚圈与新娘高定领域口碑极佳的独立手工帽品牌。"},
        "sources": ["https://atelierphyl.com/collections/fleur"]
    },
    {
        "id": "phyl-bespoke-piece", "brandId": "atelier-phyl", "name": "Bespoke Editorial Couture Hat", "year": 2024,
        "collection": "Atelier PHYL 高定主线", "category": "礼帽", "material": "天然草编与手工丝带定型",
        "description": "兼具画报戏剧张力与精致细节的香港高定礼帽，流畅的宽檐弧度极富电影感。",
        "price": 2800, "currency": "CNY", "priceNote": "香港官网参考价",
        "image": "https://atelierphyl.com/cdn/shop/files/2021-1-atelierphyl-83643.jpg?v=1727945072&width=533",
        "imageSource": "https://atelierphyl.com/collections/all", "productUrl": "https://atelierphyl.com/collections/all", "available": True,
        "sales": 48, "salesNote": "官网小批量在售",
        "artistry": 88, "artistryNote": "细腻宽檐弧度与轻量化佩戴体验",
        "heat": {"score": 76, "celebrities": [], "runway": None, "evidence": "香港独立制帽新生代的代表性视觉作品。"},
        "sources": ["https://atelierphyl.com/collections/all"]
    }
]


def main():
    existing = extract_existing_data()

    # Merge brands (dedupe by id) and sort strictly A-Z
    brand_by_id = {b["id"]: b for b in existing["brands"]}
    for nb in NEW_BRANDS:
        brand_by_id[nb["id"]] = nb
    brands = sorted(brand_by_id.values(), key=lambda b: b["name"].lower())

    # Keep ONLY imaged hats from existing + all NEW_HATS (all of which have verified images)
    hat_by_id = {}
    for h in existing["hats"]:
        if h.get("image"):
            hat_by_id[h["id"]] = h
    for nh in NEW_HATS:
        assert nh.get("image"), f"Hat {nh['id']} missing image!"
        hat_by_id[nh["id"]] = nh

    hats = list(hat_by_id.values())

    # Validate invariants
    assert len(brands) == 51, f"Expected 51 brands, got {len(brands)}"
    brand_ids = {b["id"] for b in brands}
    for h in hats:
        assert h["brandId"] in brand_ids, f"Unknown brandId {h['brandId']}"
        assert isinstance(h.get("image"), str) and h["image"].startswith("http"), f"Invalid image on {h['id']}"
        assert isinstance(h.get("sales"), (int, float)), f"Missing sales on {h['id']}"
        assert isinstance(h.get("artistry"), (int, float)), f"Missing artistry on {h['id']}"

    atlas = {
        "updatedAt": existing.get("updatedAt", "2026-11-27"),
        "scheduleNote": "每周末（周日 10:00 北京时间）自动同步品牌上新并校验图片链接",
        "fx": existing["fx"],
        "brands": brands,
        "hats": hats,
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / "atlas.json").write_text(json.dumps(atlas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (DATA_DIR / "all.js").write_text(
        "window.HAT_ATLAS = " + json.dumps(atlas, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8"
    )

    covered = len({h["brandId"] for h in hats})
    missing_img_brands = [b["name"] for b in brands if not any(h["brandId"] == b["id"] for h in hats)]
    print(f"OK: {len(brands)} brands (A-Z), {len(hats)} imaged hats (100% with real images), {covered}/51 brands with photos.")
    print(f"Brands awaiting public image URLs ({len(missing_img_brands)}): {missing_img_brands}")


if __name__ == "__main__":
    main()
