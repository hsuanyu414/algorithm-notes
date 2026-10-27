// 35. Search Insert Position
// https://leetcode.com/problems/search-insert-position/
// Time: O(log n)  Space: O(1)

class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int l = 0, r = nums.size();
        while(l<r){
            int m = l+(r-l)/2;
            if(nums[m]<target) l = m+1;
            else r = m;
        }
        return l;
    }
};
