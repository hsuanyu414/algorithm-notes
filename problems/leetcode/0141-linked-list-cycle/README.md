---
id: 141
title: Linked List Cycle
difficulty: Easy
tags: [Linked List, Two Pointers]
url: https://leetcode.com/problems/linked-list-cycle/
star: false
summary: 判斷 Linked List 中是否存在環
date: 2026-11-09
---

# 141. Linked List Cycle

## 思路

此題目為 Floyd's Cycle Detection Algorithm

可以設兩指標 `fast` 與 `slow`，並在 `fast` 跟 `fast->next` 都不為 `null` 的情況下進行迴圈，`fast` 每次走兩步，`slow` 每次走一步。

分成兩種情況：
- 有環
    - 在 `slow` 進到 cycle 時，就變成 `fast` 跟 `slow` 都在 cycle 中，兩者間的距離未知，但每次 `fast` 都會比 `slow` 多走一步(距離也減少1步)，最終會在 cycle 中相遇
- 沒有環
    - `fast` 會先走到最後並跳出迴圈

## 複雜度

- 時間：$O(n)$
- 空間：$O(1)$

## 筆記

### Hash Set Solution
- 也可以使用 Hash Set 儲存已經走過的節點
    - 此方法最為直覺，但空間複雜度會上升到 $O(n)$
