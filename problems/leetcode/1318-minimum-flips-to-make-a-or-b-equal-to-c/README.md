---
id: 1318
title: Minimum Flips to Make a OR b Equal to c
difficulty: Medium
tags: [Bit Manipulation]
url: https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/
star: false
summary:
date: 2026-10-24
---

# 1318. Minimum Flips to Make a OR b Equal to c

## 思路

要找出 `a|b==c` 的最小翻轉次數，可以先將 `a|b` 的結果與 `c` 做 `xor`，以下簡稱 `diffmask`，針對 `diffmask` 的每個為 1 的位元，檢查 `a` 跟 `b` 的對應位元，會有三種情況：
- 在 `a` 跟 `b` 中都是 `0` (在 `c` 為 `1`)，需更改 1 次（翻轉其中一個）
- 在 `a` 跟 `b` 中一個是 `0`，一個是 `1` (在 `c` 為 `0`)，需更改 1 次（翻轉是 1 的那個）
- 在 `a` 跟 `b` 中都是 `1` (在 `c` 為 `0`)，需更改 2 次（翻轉兩個）

以上三種情況可以簡化為：
- `diffmask` 每個是 `1` 的位元，就需要翻轉 1 次
- 如果前述為 `1` 的位元，且 `a&b` 的對應位元也是 `1`，則需要額外翻轉 1 次 (其中一次翻轉在前述條件已經計算過了)

並可以列式為
`min_flips = count(diffmask) + count(diffmask & (a & b))`

## 複雜度

- 時間：$O(1)$
- 空間：$O(1)$

## 筆記

