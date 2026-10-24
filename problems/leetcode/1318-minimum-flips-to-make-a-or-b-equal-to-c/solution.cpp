// 1318. Minimum Flips to Make a OR b Equal to c
// https://leetcode.com/problems/minimum-flips-to-make-a-or-b-equal-to-c/
// Time: O(1)  Space: O(1)

class Solution {
public:
    int minFlips(int a, int b, int c) {
        int ordiff = (a|b)^c;
        int both1 = (a&b);
        return __builtin_popcount(ordiff)+__builtin_popcount(ordiff&both1); 
    }
};
