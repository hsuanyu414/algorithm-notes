// 287. Find the Duplicate Number
// https://leetcode.com/problems/find-the-duplicate-number/
// Time: O(n)  Space: O(1)

class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int i = 0;
        while(i<nums.size()){
            int target_index = nums[i] - 1;
            if(target_index == i){ // right pos
                ++i;
            }else{                 // wrong pos
                if(nums[target_index] == nums[i]) return nums[i]; // target is already nums[i]
                else swap(nums[i], nums[target_index]);
            }
        }
        return -1;
    }
};