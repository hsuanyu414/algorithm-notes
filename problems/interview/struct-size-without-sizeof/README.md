---
id: struct-size-without-sizeof
title: Struct size without sizeof
difficulty: Unrated
tags: [Design]
url: 
star: false
summary: 不使用 sizeof() 計算 struct 的大小
date: 2026-10-29
---

# Struct size without sizeof

## 題目
如何在不使用 `sizeof()` 的情況下計算 C/C++ 中 struct 的大小？

## 思路
使用指標，根據方法可以再細分成兩種方式：

1. 建立一 struct 變數 `a`，計算其`+1`後(移動一個 struct 的大小)的位置與本身位置的差值，這個差值就是 struct 的大小。
2. 建立一個包含兩個 struct 元素的陣列 `a_arr[2]`，然後計算 `&a_arr[1]` 與 `&a_arr[0]` 位置的差值，這個差值也是 struct 的大小。(也是計算前後兩個 struct 變數的地址差)

## 筆記
記得在相減時要轉成 `char*` 已獲得以 byte 為單位的差值，否則會得到以 struct 為單位的差值。