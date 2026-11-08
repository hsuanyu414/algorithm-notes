---
id: 92
title: Reverse Linked List II
difficulty: Medium
tags: [Linked List]
url: https://leetcode.com/problems/reverse-linked-list-ii/
star: false
summary:
date: 2026-11-07
---

# 92. Reverse Linked List II

## 思路
觀察題目要求，可以抓出幾個重要節點 
- `start_prev`：反轉區間的前一個節點
- `start`：反轉區間的第一個節點
- `end`：反轉區間的最後一個節點
- `end_next`：反轉區間的下一個節點

以下範例
``` 
     1     ->    2    ->    3    ->    4    ->     5
start_prev     start       ...        end       end_next

// 反轉後會變成
     1     ->    4    ->    3    ->    2    ->     5
start_prev      end        ...       start      end_next 
```


### 反轉法
此想法為使用一般反轉 linked list 的方法，僅需特別注意反轉前後的連結關係

到了 `start` 節點時，先將 `start_prev` 跟 `start` 暫存下來

之後就是一般的 linked list 反轉，使用 `curr` 跟 `prev` 反轉 `right-left+1` 次

反轉完該區間後
- 將 `start_prev`(1) 指向 `prev`(4) (`prev` 在經過指定次數的反轉後，會指向 `end`(4))
- 將 `start`(2) 指向 `curr`(5) (`curr` 在經過指定次數的反轉後，會指向 `end_next`(5))

#### 複雜度
- 時間：$O(n)$
- 空間：$O(1)$

### 重新插入法(較佳)
此方法的想法為，固定 `start_prev` 與 `start`

每次都將 `start` 的下一個節點抽出來，重新插到 `start_prev` 後，如下所示：

```
// 原 Linked List
     1     ->    2    ->    3    ->    4    ->     5
start_prev     start       ...        

// 抽出 3(start.next)，插入到 1(start_prev) 後面，將其指向 2(start) 
     1     ->    3    ->    2    ->    4    ->     5
start_prev                start
```

反轉時遵照以下步驟，進行 `right-left` 次：
1. 先將下一個要抽出的節點 `start.next`(3) 記錄下來，稱 `temp`。
2. 將 `start`(2) 指向 `temp.next`(4)
3. 將 `temp`(3) 指向 `start_prev.next`(2)
4. 將 `start_prev`(1) 指向 `temp`(3) 

#### 複雜度
- 時間：$O(n)$
- 空間：$O(1)$

## 筆記
當 `left` 為 1 時，`start_prev` 會是 `NULL`，因此需要引入一個 dummy node，將其指向 `head`，這樣就可以統一處理 `start_prev` 的連結問題，僅需統一回傳 `dummy.next` 即可。