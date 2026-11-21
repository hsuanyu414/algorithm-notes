// 724. Find Pivot Index
// https://leetcode.com/problems/find-pivot-index/
// Time: O(n)  Space: O(1)

class Solution {
public:
    int pivotIndex(vector<int>& nums) {
        int n = nums.size(), left = 0, sum = 0;
        for(int i = 0 ; i < n ; ++i) sum += nums[i];
        for(int i = 0 ; i < n ; ++i){
            if(left == sum-nums[i]-left) return i;
            left += nums[i];
        }
        return -1;
    }
};
