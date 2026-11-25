---
id: 1071
title: Greatest Common Divisor of Strings
difficulty: Easy
tags: [String, LeetCode 75, Euclidean Algorithm]
url: https://leetcode.com/problems/greatest-common-divisor-of-strings/
star: false
summary:
date: 2026-11-25
---

# 1071. Greatest Common Divisor of Strings

## 思路

### 解法一
兩字串 `str1`, `str2` 的 `str1+str2==str2+str1` 成立，iff 兩字串有最大公因數字串存在，且最大公因數字串長度為 `gcd_len = gcd(len(str1), len(str2))`。
又因為最大公因數字串長度為 `gcd_len`，所以最大公因數字串為 `str1.substr(0, gcd_len)`。

#### 複雜度
- 時間：$O(m+n)$
- 空間：$O(m+n)$ (源自於 `str1+str2` 與 `str2+str1` 的比較)

### 解法二(空間複雜度優化)
我們可以先假設 `str1`, `str2` 的最大公因數字串存在，先計算 `gcd_len = gcd(len(str1), len(str2))`，然後分別檢查 `str1`, `str2` 是否可以被 `str1.substr(0, gcd_len)` 整除，可以減少方法一中 `str1+str2` 與 `str2+str1` 的比較所需的空間。

另外，計算 `gcd` 時可以使用迴圈取代遞迴，將空間複雜度從 $O(\log(\min(m, n)))$ 降至 $O(1)$。

#### 複雜度
- 時間：$O(m+n)$
- 空間：$O(1)$

## 筆記
