// Struct size without sizeof
#include <bits/stdc++.h>

using namespace std;

struct A {
    int a;
    char b;
    double c;
};

typedef struct A A;

int main() {
    // approach 1: using pointer arithmetic
    A a;
    int size = (char*)(&a + 1) - (char*)(&a);
    cout << "Size of struct A: " << size << endl;

    // approach 2: using array of struct
    A a_arr[2];
    int size_arr_element = (char*)(&a_arr[1]) - (char*)(&a_arr[0]);
    cout << "Size of struct A using array: " << size_arr_element << endl;

    // note: when forget to cast to char*, the result will be the number of struct A, not the size in bytes;
    int size_without_cast = (&a + 1) - (&a);
    cout << "Size of struct A without (char*): " << size_without_cast << endl;
    return 0;
}