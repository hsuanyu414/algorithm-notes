// 1071. Greatest Common Divisor of Strings
// https://leetcode.com/problems/greatest-common-divisor-of-strings/
// Time: O(m+n)  Space: O(1)

class Solution {
public:
    int gcd(int a, int b){
        while(b){
            int temp = a%b;
            a = b;
            b = temp;
        }
        return a;
    }
    string gcdOfStrings(string str1, string str2) {
        int ans_size = gcd(str1.size(), str2.size());
        for(int i = 0 ; i < str1.size() ; i+=ans_size){
            for(int j = 0 ; j < ans_size ; ++j){
                if(str1[i+j] != str1[j]) return "";
            }
        }
        for(int i = 0 ; i < str2.size() ; i+=ans_size){
            for(int j = 0 ; j < ans_size ; ++j){
                if(str2[i+j] != str1[j]) return "";
            }
        }
        return str1.substr(0, ans_size);
    }
};