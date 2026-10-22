---
id: 204
title: Count Primes
difficulty: Medium
tags: [Array, Math]
url: https://leetcode.com/problems/count-primes/
star: false
summary:
date: 2026-10-22
---

# 204. Count Primes

## 思路

使用埃拉托色尼篩法做篩選

## 複雜度

- 時間：$O(n \log \log n)$
- 空間：$O(n)$

## 筆記

- 中間過程可做一些簡單優化
    1. 尋找 $n$ 內（包含 $n$）的質數，只需對小於 $\sqrt{n}$ 的質數進行篩選，因為大於 $\sqrt{n}$ 的質數的倍數已經被小於 $\sqrt{n}$ 的質數標記過了。
        - 實務上會使用 `for (int i = 2; i * i < n; ++i)` 來做迴圈，避免使用 `sqrt` 函數。
    2. 如對於每個質數 $p$，只需從 $p*p$ 開始標記其倍數，因為小於 $p$ 的倍數已經被其他質數標記過了。
- 進階篩法可參考歐拉篩（線性篩）