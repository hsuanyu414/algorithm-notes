// 1071. Greatest Common Divisor of Strings
// https://leetcode.com/problems/greatest-common-divisor-of-strings/
// Time: O(m+n)  Space: O(m+n) (from str1+str2)

class Solution {
public:
    int gcd(int a, int b){
        if(b==0) return a;
        return gcd(b, a%b);
    }
    string gcdOfStrings(string str1, string str2) {
        if(str1+str2 != str2+str1) return "";
        return str1.substr(0, gcd(str1.size(), str2.size()));
    }
};
