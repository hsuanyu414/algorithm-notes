---
id: 34
title: Find First and Last Position of Element in Sorted Array
difficulty: Medium
tags: [Binary Search]
url: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
star: false
summary: 用 lower bound 和 upper bound 找出 target 第一次和最後一次出現的位置
date: 2026-10-27
---

# 34. Find First and Last Position of Element in Sorted Array

## 思路

同時尋找第一個和最後一個出現的目標值，使用二分搜尋法。
我們可以使用兩次二分搜尋法，第一次尋找第一個出現的目標值，第二次尋找最後一個出現的目標值。
1. 使用第一次二分搜尋法尋找 lower bound 以找到第一個出現的目標值
    - 看 target 是否存在
        - lower bound 的 index 是否在範圍內
        - 若在範圍內，看 `nums[index]` 是否等於目標值
    - 若不存在，直接回傳 `[-1, -1]`
    - 若存在，繼續下一步，尋找最後一個出現的目標值
2. 使用第二次二分搜尋法尋找 upper bound 以找到最後一個出現的目標值的下一個位置
    - 因已知 target 存在，所以找到的 upper bound 的 `index-1` 即為最後一個出現的目標值的 index

## 複雜度

- 時間：$O(\log n)$
- 空間：$O(1)$

## 筆記

第二次二分搜尋法尋找 upper bound 時，因前一步驟已經找到 lower bound，所以可以直接從 lower bound 作為左邊界開始尋找 upper bound，這樣可以減少搜尋範圍。
