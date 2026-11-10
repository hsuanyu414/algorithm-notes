// 3693. Climbing Stairs II
// https://leetcode.com/problems/climbing-stairs-ii/
// Time: O(n)  Space: O(1)

class Solution {
public:
    int climbStairs(int n, vector<int>& costs) {
        int dp_3 = INT_MAX-9, dp_2 = INT_MAX-9, dp_1 = 0, cur = 0; 
        // as dp[i-3], dp[i-2], dp[i-1], dp[i]
        for(int i = 0 ; i < n  ; ++i){
            cur = costs[i]+min({dp_3+9, dp_2+4, dp_1+1});
            dp_3 = dp_2, dp_2 = dp_1, dp_1 = cur;
        }
        return cur;
    }
};
