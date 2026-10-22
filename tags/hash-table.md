---
name: Hash Table
aliases: [Hash Map, HashMap, 雜湊表, unordered_map]
summary: 用空間換時間，O(1) 查詢「看過什麼」
---

# Hash Table

## 什麼時候用

- 需要快速判斷某個值 / 狀態「是否出現過」
- 計數、分組（anagram、頻率統計）
- 前綴和 + hash map：找和為 K 的子陣列

## 模板

**邊走邊查：找配對**（[1. Two Sum](https://leetcode.com/problems/two-sum/)）

```cpp
unordered_map<int, int> need;  // 還需要的數字 -> 需要它的索引
for (int i = 0; i < n; ++i) {
    if (need.count(nums[i]) == 1) return {need[nums[i]], i};
    need[target - nums[i]] = i;  // 先查再插入，避免和自己配對
}
```

## 注意事項

- `need[key]` 在 key 不存在時會插入預設值 0；只想查詢、不想插入時用 `count` 或 `find`。
- 自訂型別（如 `pair`）當 key 需要提供 hash，或改用 `map`。