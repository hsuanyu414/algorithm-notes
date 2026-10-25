// 70. Climbing Stairs
// https://leetcode.com/problems/climbing-stairs/
// Time: O(n)  Space: O(1)

class Solution {
public:
    int climbStairs(int n) {
        if(n<=2) return n;
        int prev2 = 1, prev1 = 2, curr = 0;
        for(int i = 3 ; i <= n ; ++i){
            curr = prev1+prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return curr;
    }
};