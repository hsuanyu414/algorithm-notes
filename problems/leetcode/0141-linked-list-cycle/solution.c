// 141. Linked List Cycle
// https://leetcode.com/problems/linked-list-cycle/
// Time: O(n)  Space: O(1)

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
bool hasCycle(struct ListNode *head) {
    struct ListNode *fast = head, *slow = head;
    while(fast != NULL && fast->next != NULL){
        fast = fast->next->next;
        slow = slow->next;
        if(fast == slow) return true;
    }
    return false;
}
