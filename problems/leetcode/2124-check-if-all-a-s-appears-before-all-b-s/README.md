---
id: 2124
title: Check if All A's Appears Before All B's
difficulty: Easy
tags: [String]
url: https://leetcode.com/problems/check-if-all-a-s-appears-before-all-b-s/
star: false
summary:
date: 2026-11-22
---

# 2124. Check if All A's Appears Before All B's

## 思路
根據題目要求，要求字串的形式必然為 `a*b*`，所以可以用兩個 while 迴圈，先走完所有的 a，再走完所有的 b，最後檢查是否走到字串結尾即可。

## 複雜度

- 時間：$O(n)$
- 空間：$O(1)$

## 筆記

