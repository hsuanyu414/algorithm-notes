// 724. Find Pivot Index
// https://leetcode.com/problems/find-pivot-index/
// Time: O(n)  Space: O(n)

class Solution {
public:
    int pivotIndex(vector<int>& nums) {
        int n = nums.size(), sum = 0;
        vector<int> lsum(n, 0);
        for(int i = 1 ; i < n ; ++i) lsum[i] = lsum[i-1]+nums[i-1];
        sum = lsum[n-1]+nums[n-1];
        for(int i = 0 ; i < n ; ++i){
            if(lsum[i] == sum-nums[i]-lsum[i]) return i;
        }
        return -1;
    }
};
