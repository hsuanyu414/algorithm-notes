---
id: 206
title: Reverse Linked List
difficulty: Easy
tags: [Linked List]
url: https://leetcode.com/problems/reverse-linked-list/
star: false
summary:
date: 2026-11-05
---

# 206. Reverse Linked List

## 思路
### 迴圈解法
使用三個指標，`prev`、`curr` 跟 `temp`，分別表示前一個節點、目前節點、以及暫存當前節點的下一個節點。

將 `prev` 初始化為 `null`，`curr` 初始化為 `head`。

使用 while 遍歷 Linked List，每經過一個點，都
1. 反轉當前節點的指向
    1. 先將 `curr->next` 暫存到 `temp`
    2. 將 `curr->next` 指向 `prev`
2. 將 `prev` 跟 `curr` 往前移動
    1. 將 `prev` 指向 `curr`
    2. 將 `curr` 指向 `temp`(即原先的下一個節點)   

結束時，`prev` 會指向新的 head，回傳 `prev` 即可。

#### 複雜度
- 時間：$O(n)$
- 空間：$O(1)$

### 遞迴解法
沿 Linked List 遞迴到最後一個節點
- 若 Linked List 為空 (`head == null`) 或到了最後一個節點 (`head->next == null`)，回傳 `head`
- 對於其他節點
    1. 將當前節點下一個節點的 `next` 指向自己(反轉指向) 
    2. 將當前節點的 `next` 指向 null

結束時，每層遞迴都會回傳最後一個節點，最終回傳的就是新的 head。

#### 複雜度
- 時間：$O(n)$
- 空間：$O(n)$ (遞迴呼叫的堆疊空間)

## 筆記

