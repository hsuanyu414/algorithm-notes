---
name: Binary Search
aliases: [Binary Search, 二分搜尋法]
summary: 用二分搜尋法找出目標值的位置，時間複雜度 O(log n)
---

# Binary Search

## 什麼時候用

- 目標值在有序資料中，想要快速找出目標值的位置
    - 或先排序再找目標值
- 廣義來說，只要資料有「單調性」，就可以使用二分搜尋法
    - 例如：一個陣列每個元素 `i` 在函式 check(i) 結果為 `F, F, F, T, T, T`，想要找出第一個 `T` 的位置

## 模板

```cpp
// assume nums to be a sorted vector<int>
int left = 0, right = n;
while (left < right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] < target) {
        left = mid + 1;
    } else {
        right = mid;
    }
}
// 根據 left 的值以及 nums[left] 是否等於 target 來判斷 target 是否存在
if (left == nums.size() || nums[left] != target) {
    return -1;  // target not found
} else {
    return left;  // target found at index left
}
```

## 注意事項

- `mid` 的計算方式若要避免 overflow，可以使用 `mid = left + (right - left) / 2`，而不是 `mid = (left + right) / 2`
- `left` 和 `right` 的初始值可以是 `[0, n)` 或 `[0, n-1]`，但要注意在 while loop 中的條件以及更新方式
    - 主要差別為使用 `[0, n)`，表示 `right` 是「不包含」的，反之代表包含，體現在 while loop 的條件以及更新方式上
        - 若使用 `[0, n)`，則 while loop 的條件為 `left < right`，更新方式為 `left = mid + 1` 或 `right = mid`
        - 若使用 `[0, n-1]`，則 while loop 的條件為 `left <= right`，更新方式為 `left = mid + 1` 或 `right = mid - 1`