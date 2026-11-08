// 92. Reverse Linked List II
// https://leetcode.com/problems/reverse-linked-list-ii/
// Time: O(n)  Space: O(1)

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
struct ListNode* reverseBetween(struct ListNode* head, int left, int right) {
    if(head==NULL || left==right) return head;
    struct ListNode dummy;
    dummy.next = head;

    struct ListNode *prev = &dummy, *curr = NULL;
    for(int i = 0 ; i < left-1 ; ++i) prev = prev->next;
    curr = prev->next;

    struct ListNode *start_prev = prev, *start = curr;
    prev = NULL;
    for(int i = left ; i <= right ; ++i){
        struct ListNode *temp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = temp;
    } 
    start_prev->next = prev;
    start->next = curr;

    return dummy.next;
}