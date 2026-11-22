// 2124. Check if All A's Appears Before All B's
// https://leetcode.com/problems/check-if-all-a-s-appears-before-all-b-s/
// Time: O(n)  Space: O(1)

class Solution {
public:
    bool checkString(string s) {
        int idx = 0;
        while(s[idx]=='a' && idx<s.size()) ++idx;
        while(s[idx]=='b' && idx<s.size()) ++idx;
        return idx==s.size();
    }
};
