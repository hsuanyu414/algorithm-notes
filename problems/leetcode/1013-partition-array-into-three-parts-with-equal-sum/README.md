---
id: 1013
title: Partition Array Into Three Parts With Equal Sum
difficulty: Easy
tags: [Array, Greedy]
url: https://leetcode.com/problems/partition-array-into-three-parts-with-equal-sum/
star: false
summary:
date: 2026-11-21
---

# 1013. Partition Array Into Three Parts With Equal Sum

## 思路

直接計算陣列總和與每個 partition 的目標值，然後從頭開始累加，當累加值等於目標值時，從下一個 index 開始繼續累加，成功累加兩次且最後 index 並非停在陣列尾端，則表示可以成功 partition 成三個部分

## 複雜度

- 時間：$O(n)$
- 空間：$O(1)$

## 筆記

