// 287. Find the Duplicate Number
// https://leetcode.com/problems/find-the-duplicate-number/
// Time: O(n)  Space: O(1)

class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int fast = 0, slow = 0;
        do{
            fast = nums[nums[fast]];
            slow = nums[slow];
        }while(fast!=slow);
        int start = 0;
        while(start!=slow){
            start = nums[start];
            slow = nums[slow];
        }
        return start;
    }
};