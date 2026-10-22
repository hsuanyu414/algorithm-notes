#!/usr/bin/env python3
"""
產生 GitHub Pages 用的靜態網站到 _site/。

    site/                前端（index.html、app.js、style.css、vendor/）→ 原樣複製
    _site/data/index.json             全部題目的 metadata（列表頁、篩選用）
    _site/data/p/<key>.json           單題的筆記與解答程式碼（點進去才載入）
    _site/data/tag/<slug>.json        標籤說明（只有 tags/<slug>.md 有內容的標籤才會產生）

用法：
    python scripts/build_site.py
    python -m http.server -d _site 8000   # 本機預覽 http://localhost:8000
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
from collections import Counter

from problems import ROOT, SOURCES, load_problems

SITE_SRC = ROOT / "site"
OUT = ROOT / "_site"


def write_json(path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def detect_github() -> str:
    """找出這個 repo 的 GitHub 網址，帳號或 repo 改名後不需要手動修改。

    1. GitHub Actions 上：從內建環境變數 GITHUB_REPOSITORY（owner/repo）組出網址
    2. 本機：從 git remote origin 解析（支援 https 與 ssh 格式）
    """
    repo = os.environ.get("GITHUB_REPOSITORY")
    if repo:
        server = os.environ.get("GITHUB_SERVER_URL", "https://github.com")
        return f"{server}/{repo}"
    try:
        url = subprocess.run(["git", "remote", "get-url", "origin"], cwd=ROOT,
                             capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return ""
    m = re.search(r"github\.com[:/]([^/]+/[^/]+?)(?:\.git)?/?$", url)
    return f"https://github.com/{m.group(1)}" if m else ""


def main() -> int:
    config = json.loads((ROOT / "site.json").read_text(encoding="utf-8"))
    # site.json 有手動填 github 就用它，否則自動偵測
    config["github"] = config.get("github") or detect_github()
    problems, tags, errors = load_problems()
    for e in errors:
        print(f"[warn] {e}", file=sys.stderr)

    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(SITE_SRC, OUT)
    (OUT / ".nojekyll").touch()   # 讓 GitHub Pages 不經過 Jekyll 處理

    tag_count = Counter(s for p in problems for s in p.tags)
    tag_diff: dict[str, Counter] = {s: Counter() for s in tags}
    for p in problems:
        for s in p.tags:
            tag_diff[s][p.difficulty] += 1

    used_sources = [s for s in dict.fromkeys(p.source for p in problems)]
    index = {
        "config": config,
        "generated": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "sources": [{"key": s, "name": SOURCES.get(s, s)} for s in used_sources],
        "tags": [
            {"slug": t.slug, "name": t.name, "summary": t.summary, "aliases": t.aliases,
             "body": bool(t.body), "count": tag_count[t.slug], "diff": dict(tag_diff[t.slug])}
            for t in sorted(tags.values(), key=lambda x: (-tag_count[x.slug], x.name.lower()))
        ],
        "problems": [
            {
                "key": p.key, "source": p.source, "id": p.id, "num": p.num,
                "title": p.title, "difficulty": p.difficulty, "tags": p.tags,
                "url": p.url, "star": p.star,
                "summary": p.summary, "date": p.date, "note": p.has_note,
            }
            for p in problems
        ],
    }
    write_json(OUT / "data" / "index.json", index)

    for p in problems:
        write_json(OUT / "data" / "p" / f"{p.key}.json", {
            "body": p.body,
            "folder": p.folder,
            "solutions": [
                {**s, "code": (ROOT / s["path"]).read_text(encoding="utf-8")}
                for s in p.solutions
            ],
        })

    for t in tags.values():
        if t.body:
            write_json(OUT / "data" / "tag" / f"{t.slug}.json", {"body": t.body})

    with_body = sum(1 for t in tags.values() if t.body)
    print(f"網站已產生於 {OUT.relative_to(ROOT)}/（{len(problems)} 題、{len(tags)} 個標籤，其中 {with_body} 個有說明）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
