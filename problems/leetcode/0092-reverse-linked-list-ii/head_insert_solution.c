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
 
    struct ListNode *start_prev = &dummy;
    for(int i = 0 ; i < left-1 ; ++i) start_prev = start_prev->next;
    struct ListNode *start = start_prev->next;
 
    for(int i = left ; i < right ; ++i){
        struct ListNode *temp = start->next;
        start->next = temp->next;
        temp->next = start_prev->next;
        start_prev->next = temp;
    }
 
    return dummy.next;
}
