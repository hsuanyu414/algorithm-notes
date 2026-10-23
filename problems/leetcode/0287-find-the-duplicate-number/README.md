---
id: 287
title: Find the Duplicate Number
difficulty: Medium
tags: [Array, Two Pointers, Floyd's Cycle Finding Algorithm]
url: https://leetcode.com/problems/find-the-duplicate-number/
star: false
summary:
date: 2026-10-23
---

# 287. Find the Duplicate Number

## 思路
### Cyclic Sort （此方法會修改原陣列）
因為已知是在一 `n+1` 長度的陣列中放入 `[1, n]` 這 `n` 個數字，所以必然會有一個以上重複的數字，此時可以使用 Cyclic Sort 試圖將每個數字放到對應的 `index` 上，若發現某個數字不在對應的 `index` 上且要交換時發現該位置的數字已經是該數字，則該數字即為重複的數字

### Floyd's Cycle Finding Algorithm
將 `index` 視為節點，將 `index->nums[index]` 看作是圖中的邊，可以發現:
- 每個節點恰有一條出邊，且只會指向 `[1, n]`
    - 從節點 0 出發一直走，因為節點數有限，必然會走進某個 cycle
- 節點 0 不會被任何節點指向，因此不在 cycle 上
    - 從 0 出發一定會先經過一段尾巴才進入 cycle
- Cycle 的入口即為重複的數字

```
e.g. 
nums = [1, 3, 4, 2, 2]
index:  0  1  2  3  4

graph:
0 -> 1 -> 3 -> 2 -> 4
               ^    |
               |____|
```

## 複雜度

- 時間：$O(n)$
- 空間：$O(1)$

## 筆記
- Follow up: (from leetcode)
    - How can we prove that at least one duplicate number must exist in nums?
        - 因為陣列的長度為 $n + 1$，而陣列中的數字範圍為 $[1, n]$，根據鴿籠原理，至少有一個數字會重複出現