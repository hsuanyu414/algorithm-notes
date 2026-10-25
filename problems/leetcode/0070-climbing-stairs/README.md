---
id: 70
title: Climbing Stairs
difficulty: Easy
tags: [Dynamic Programming]
url: https://leetcode.com/problems/climbing-stairs/
star: false
summary:
date: 2026-10-25
---

# 70. Climbing Stairs

## 思路

將問題轉化為動態規劃問題，定義 `dp[i]` 為爬到第 `i` 階樓梯的方法數。由於每次可以爬 1 或 2 階，因此有遞推關係式：
$$
dp[i] =
\begin{cases}
1, & i = 1 \\
2, & i = 2 \\
dp[i-1] + dp[i-2], & i \ge 3
\end{cases}
$$

並根據以上遞推關係式，可使用遞迴(top-down)或迭代(bottom-up)的方式來解決此問題。
### 遞迴(top-down)
-對於 $i>=3$ ，爬到第 `i` 階樓梯的方法數等於爬到第 `i-1` 階樓梯的方法數加上爬到第 `i-2` 階樓梯的方法數，並使用快取減少重複計算

#### 複雜度
- 時間：$O(n)$
- 空間：$O(n)$

### 迭代(bottom-up)
對於 $i>=3$ ，`dp[i] = dp[i-1] + dp[i-2]`，他僅依賴於前兩個狀態，所以可以使用迭代的方式計算，僅使用兩個變數來儲存前兩個狀態，進一步節省空間

#### 複雜度
- 時間：$O(n)$
- 空間：$O(1)$


## 筆記

