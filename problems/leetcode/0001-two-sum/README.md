---
id: 1
title: Two Sum
difficulty: Easy
tags: [Array, Hash Table]
url: https://leetcode.com/problems/two-sum/
star: false
summary: 一次遍歷，用 hash map 記錄「還需要的數字」
date: 2026-10-17
---

# 1. Two Sum

## 思路

遍歷每個數字 `x` 時，把「還需要的數字」`target - x` 存進 hash map，對應到 `x` 的索引。之後只要遇到某個數字已經在 map 裡，就代表它跟先前某個數字可以湊成 `target`。

一次遍歷就能找到答案，而且是先查再存，不會把同一個元素用兩次。

## 複雜度

- 時間：O(n)
- 空間：O(n)

## 筆記

- 也可以反過來存「看過的數字 → 索引」，再查 `target - x` 在不在 map 裡，兩種寫法等價。
- 暴力法 O(n²)；排序後用雙指標 O(n log n)，但會失去原始索引，需要額外保存。