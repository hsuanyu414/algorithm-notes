---
id: 289
title: Game of Life
difficulty: Medium
tags: [Array, Simulation]
url: https://leetcode.com/problems/game-of-life/
star: false
summary:
date: 2026-10-31
---

# 289. Game of Life

## 思路

因為要根據周圍(8 neighbors)的狀態來決定下一個狀態，且如果直接更新當前細胞的狀態，有可能會影響到其他細胞的判斷，所以理論上需要一個額外的空間來存放下一個狀態，但又希望能在原地更新，所以使用以下思路：

因原始 `board` 的資料型態為 `int`，且題目中只會有 `0` 與 `1`，所以可以使用數字的最低兩個 bit 存放下列資訊：
- `bit 0` 判斷原始狀態（即原本的 `0` 或 `1`）
- `bit 1` 來存放下一個狀態

讀取的時候僅看 `bit 0`，寫入時則將下一個狀態寫入 `bit 1`，因此讀取跟寫入不會互相影響。

在遍歷完所有細胞後，再將每個細胞的狀態右移一位（去除原始狀態，讓 `bit 1` 的值成為新的狀態）即為最終結果。

## 複雜度

- 時間：$O(m * n)$
- 空間：$O(1)$

## 筆記

