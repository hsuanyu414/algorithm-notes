# Algorithm Notes

![C++](https://img.shields.io/badge/-C%2B%2B-00599C?logo=cplusplus) ![C](https://img.shields.io/badge/-C-A8B9CC?logo=c)

演算法解題紀錄，收錄 LeetCode 與面試實際遇到的題目。每題附上解題思路與複雜度分析，並用標籤分類；常見解法另外整理成模板。

## Repo 結構

```
problems/
├── leetcode/<題號>-<slug>/    # LeetCode
└── interview/<slug>/          # 面試實際遇到的題目
    ├── README.md              # 題目資訊（front matter）+ 解題筆記
    └── solution.cpp           # 解答，可以有多份（例如 iterative / recursive）
tags/                          # （選填）標籤說明與模板
site/                          # 網站前端（GitHub Pages）
scripts/                       # 新增題目、產生網站
templates/                     # 新題目的樣板
```

## 新增題目

以 [1. Two Sum](https://leetcode.com/problems/two-sum/) 為例，會建立 `problems/leetcode/0001-two-sum/`，內含筆記與解答樣板：

```bash
# C++
python scripts/new_problem.py 1 "Two Sum" Easy "Array,Hash Table"
# C
python scripts/new_problem.py --lang c 1 "Two Sum" Easy "Array,Hash Table"
# 面試題（放在 problems/interview/）
python scripts/new_problem.py --source interview lru-ttl "LRU Cache with TTL" Medium "Design"
```

## 標籤

每題在 README 的 front matter 用 `tags` 標記，可以有多個，例如 `tags: [Array, Hash Table]`。

- 每個標籤在網站上都有自己的頁面，列出所有有這個標籤的題目，不需要額外設定。
- 想為某個標籤補上說明或模板，就新增 `tags/<slug>.md`（例如 `tags/hash-table.md`），內容會顯示在該標籤頁的上方。
- 說明檔可以用 `aliases` 設定同義詞，例如 `Hash Map`、`雜湊表` 都會歸到 Hash Table。
- 只差在大小寫或寫法的標籤（`hash table`、`Hash-Table`）會自動合併，build 時會提醒統一寫法。

## 本機預覽網站

```bash
python scripts/build_site.py
python -m http.server -d _site 8000   # 開啟 http://localhost:8000
```

push 到 `main` 後，GitHub Actions 會自動重新部署網站。
