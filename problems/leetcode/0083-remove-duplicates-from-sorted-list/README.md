---
id: 83
title: Remove Duplicates from Sorted List
difficulty: Easy
tags: [Linked List]
pattern: []
url: https://leetcode.com/problems/remove-duplicates-from-sorted-list/
star: false
summary:
date: 2026-10-22
---

# 83. Remove Duplicates from Sorted List

## 思路

使用 `prev` 跟 `curr` 兩個指標追蹤前後節點，當 `curr` 的值等於 `prev` 的值時，將 `prev.next` 指向 `curr.next`（刪除 `curr` 節點）

## 複雜度

- 時間：$O(n)$
- 空間：$O(1)$

## 筆記

