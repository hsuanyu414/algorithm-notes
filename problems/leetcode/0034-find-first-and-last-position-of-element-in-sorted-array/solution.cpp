// 34. Find First and Last Position of Element in Sorted Array
// https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
// Time: O(log n)  Space: O(1)

class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int l = 0, r = nums.size();
        while(l<r){
            int m = l+(r-l)/2;
            if(nums[m]<target) l=m+1;
            else r=m;
        }
        if(l==nums.size() || nums[l]!=target) return {-1, -1};
        int ans_l = l;
        r = nums.size();
        while(l<r){
            int m = l+(r-l)/2;
            if(nums[m]<=target) l=m+1;
            else r=m;
        }
        return {ans_l, l-1};
    }
};
