---
id: 3693
title: Climbing Stairs II
difficulty: Medium
tags: [Dynamic Programming]
url: https://leetcode.com/problems/climbing-stairs-ii/
star: false
summary:
date: 2026-11-10
---

# 3693. Climbing Stairs II

## 思路

可以根據題目給的條件，定義一個動態規劃的狀態轉移方程式：

$$
f(n) = \begin{cases}
costs[0] + 1, & n=1 \\
costs[1] + \min(costs[0]+4, costs[0]+1), & n=2 \\
costs[n-1] + \min(f(n-3)+9, f(n-2)+4, f(n-1)+1), & n\geq 3
\end{cases}
$$

並根據此轉移式，計算出最小的花費。

### 複雜度

- 時間：$O(n)$
- 空間：$O(1)/O(n)$ (根據實作)

## 筆記

此題每個階梯的花費都僅須看前面 3 個階梯的花費，所以最少可以使用 4 個變數(前 3 個階梯的花費以及當前階梯的花費)來儲存狀態，達到 $O(1)$ 的空間複雜度，或使用一個長度為 $n+1$ 的陣列來儲存每個階梯的花費，達到 $O(n)$ 的空間複雜度。