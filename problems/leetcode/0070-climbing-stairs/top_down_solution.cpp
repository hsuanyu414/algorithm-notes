// 70. Climbing Stairs
// https://leetcode.com/problems/climbing-stairs/
// Time: O(n)  Space: O(n)

class Solution {
public:
    unordered_map<int, int> cache;
    int climbStairs(int n) {
        if(n==1) return 1; // 1
        else if(n==2) return 2; // 1, 1 or 2
        else if(cache.count(n)==1) return cache[n];
        int ans = climbStairs(n-1)+climbStairs(n-2);
        cache[n] = ans;
        return ans;
    }
};
