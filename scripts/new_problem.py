#!/usr/bin/env python3
"""
建立新題目的資料夾與樣板。

用法：
    python scripts/new_problem.py [--source SRC] [--pattern NAME] [--lang LANG] <id> "<title>" <difficulty> ["<tag1,tag2>"]

    --source   題目來源資料夾，預設 leetcode（例如 interview、codeforces、misc）
    --pattern  解題模式，需對應 patterns/ 內的 name 或 aliases，可用逗號分隔多個
    --lang     解答語言，cpp 或 c，預設 cpp
    difficulty Easy / Medium / Hard / Unrated

範例：
    python scripts/new_problem.py 1 "Two Sum" Easy "Array,Hash Table"
    python scripts/new_problem.py --lang c 1 "Two Sum" Easy "Array,Hash Table"
    python scripts/new_problem.py 1 "Two Sum" Easy "Array,Hash Table" --pattern "Hash Map"
    python scripts/new_problem.py --source interview lru-ttl "LRU Cache with TTL" Medium "Design"
"""
from __future__ import annotations

import argparse
import datetime as dt
import re
import sys

from problems import DIFFICULTIES, ROOT, load_patterns, pattern_lookup

TEMPLATE_DIR = ROOT / "templates"


def slugify(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


def main() -> int:
    ap = argparse.ArgumentParser(usage=__doc__)
    ap.add_argument("id")
    ap.add_argument("title")
    ap.add_argument("difficulty")
    ap.add_argument("tags", nargs="?", default="")
    ap.add_argument("--source", default="leetcode")
    ap.add_argument("--pattern", default="")
    ap.add_argument("--lang", default="cpp", choices=["cpp", "c"])
    args = ap.parse_args()

    difficulty = args.difficulty.capitalize()
    if difficulty not in DIFFICULTIES:
        print(f"difficulty 必須是 {' / '.join(DIFFICULTIES)}")
        return 1

    patterns = [p.strip() for p in args.pattern.split(",") if p.strip()]
    if patterns:
        lookup = pattern_lookup(load_patterns()[0])
        unknown = [p for p in patterns if p.lower() not in lookup]
        if unknown:
            print(f"未知的 pattern：{', '.join(unknown)}（請先在 patterns/ 新增，或加入 aliases）")
            return 1

    source = args.source.lower()
    slug = slugify(args.title)
    if source == "leetcode":
        if not args.id.isdigit():
            print("LeetCode 題目的 id 必須是數字")
            return 1
        folder = f"{int(args.id):04d}-{slug}"
        url = f"https://leetcode.com/problems/{slug}/"
    else:
        folder = slugify(args.id) or slug
        url = ""

    target = ROOT / "problems" / source / folder
    if target.exists():
        print(f"已存在：{target.relative_to(ROOT)}")
        return 1
    target.mkdir(parents=True)

    tags = [t.strip() for t in args.tags.split(",") if t.strip()]
    values = {
        "{{id}}": args.id if not args.id.isdigit() else str(int(args.id)),
        "{{title}}": args.title,
        "{{url}}": url,
        "{{difficulty}}": difficulty,
        "{{tags}}": ", ".join(tags),
        "{{pattern}}": ", ".join(patterns),
        "{{date}}": dt.date.today().isoformat(),
        "{{heading}}": f"{int(args.id)}. {args.title}" if source == "leetcode" else args.title,
    }
    for name in ("README.md", f"solution.{args.lang}"):
        text = (TEMPLATE_DIR / name).read_text(encoding="utf-8")
        for k, v in values.items():
            text = text.replace(k, v)
        (target / name).write_text(text, encoding="utf-8")

    print(f"已建立 {target.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
