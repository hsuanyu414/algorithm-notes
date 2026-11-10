// 3693. Climbing Stairs II
// https://leetcode.com/problems/climbing-stairs-ii/
// Time: O(n)  Space: O(n)

class Solution {
public:
    int climbStairs(int n, vector<int>& costs) {
        vector<int> c(n+1, 0);
        c[1] = costs[0]+(c[0]+1);
        if(n==1) return c[1];
        c[2] = costs[1]+(min(c[0]+4, c[1]+1));
        if(n==2) return c[2];
        for(int i = 3; i <= n ; ++i){
            c[i] = costs[i-1] + min({c[i-3]+9, c[i-2]+4, c[i-1]+1});
        }
        return c[n];
    }
};
