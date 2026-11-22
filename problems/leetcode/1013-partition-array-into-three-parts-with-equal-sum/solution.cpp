// 1013. Partition Array Into Three Parts With Equal Sum
// https://leetcode.com/problems/partition-array-into-three-parts-with-equal-sum/
// Time: O(n)  Space: O(1)

class Solution {
public:
    bool canThreePartsEqualSum(vector<int>& arr) {
        int sum = 0, left = 0, target = 0;
        for(int i = 0 ; i < arr.size() ; ++i){
            sum += arr[i];
        }
        if(sum%3!=0) return false;
        else target = sum/3;
        for(int i = 0 ; i < arr.size() ; ++i){
            left += arr[i];
            if(left == target){
                int inner_left = 0;
                for(int j = i+1 ; j < arr.size() ; ++j){
                    inner_left += arr[j];
                    if(inner_left == target && j!=arr.size()-1) return true;
                }
            }
        }
        return false;
    }
};
