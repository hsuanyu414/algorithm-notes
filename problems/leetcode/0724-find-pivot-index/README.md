---
id: 724
title: Find Pivot Index
difficulty: Easy
tags: [Array, Prefix Sum]
url: https://leetcode.com/problems/find-pivot-index/
star: false
summary:
date: 2026-11-21
---

# 724. Find Pivot Index

## 思路

### prefix sum
- 先計算一個 prefix sum array，跟 sum
    - prefix sum[i] = nums[0] + nums[1] + ... + nums[i-1]
    - sum = nums[0] + nums[1] + ... + nums[n-1]
- 之後對每個 index i，檢查 prefix sum[i] 是否等於 sum - prefix sum[i] - nums[i]
    - 第一次找到的 i 就是答案，若都沒有找到，回傳 -1

#### 複雜度

- 時間：$O(n)$
- 空間：$O(n)$

## 筆記

### O(1) space optimization
- 此題可以直接僅使用兩個變數 `sum` 跟 `left`
    - `sum` 儲存整個 `nums` 的總和
    - `left` 儲存從 `0` 到 `i-1` 的總和
    - 每次迭代
        - 先檢查當前 `left` 是否等於 `sum - left - nums[i]`
        - 若是，回傳 `i`
        - 若否，更新 `left` 為 `left + nums[i]`
    - 若迭代完都沒有找到，回傳 `-1`
- 此方法可以將空間複雜度降為 $O(1)$