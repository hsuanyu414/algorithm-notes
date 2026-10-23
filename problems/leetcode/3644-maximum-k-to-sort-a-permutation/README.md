---
id: 3644
title: Maximum K to Sort a Permutation
difficulty: Medium
tags: [Array, Bit Manipulation]
url: https://leetcode.com/problems/maximum-k-to-sort-a-permutation/
star: false
summary:
date: 2026-10-23
---

# 3644. Maximum K to Sort a Permutation

## 思路

因為每個不在正確位置上的數字都需要被交換至少一次，所以 `k` 的最大值為所有不在正確位置上的數字做 `&` 運算的結果。

## 複雜度

- 時間：$O(n)$
- 空間：$O(1)$

## 筆記

- 如何判定陣列是否已經排序
    - 用一個 `boolean` 變數 `sorted`，初始化為 `true`，遍歷陣列，若有任何一個數字不在正確位置，則將 `sorted` 設為 `false`
    - 先把 `k` 初始化為 `-1`，根據 `k` 最後的值會有兩種情況：
        - 若陣列中有不在正確位置的數字，`k` 與其中某些數字做 `&` 運算後，`k` 必為一個非負整數（因為陣列中所有數字都是非負整數，sign bit 必然會被 `&` 掉）
        - 反之，若陣列中所有數字都在正確位置，`k` 會維持為 `-1`