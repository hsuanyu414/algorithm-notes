---
name: Linked List
aliases: [Linked List]
summary: 一種資料結構，由節點組成，每個節點包含資料和指向下一節點的指標
---

# Linked List

## 什麼時候用
- 需要頻繁地在資料的開頭或中間插入或刪除元素
- 不需要知道資料的大小，可以動態地增加或減少元素

## 類型
- Singly Linked List: 每個節點只包含一個指向下一個節
    ```c=
    struct Node {
        int data;
        struct Node* next;
    };
    ```
- Doubly Linked List: 每個節點包含指向下一個節點和前一個節點的指標
    ```c=
    struct Node {
        int data;
        struct Node* next;
        struct Node* prev;
    };
    ```
以下範例為 Singly Linked List 為例


## 常見操作
### 新增: $O(1)$
- 在開頭新增節點
    ```c=
    void push(Node** head_ref, int new_data) {
        Node* new_node = (Node*)malloc(sizeof(Node)); 
        new_node->data = new_data;
        new_node->next = (*head_ref);
        (*head_ref) = new_node;
    }
    ```
- 在中間新增節點
    ```c=
    void insertAfter(Node* prev_node, int new_data) {
        if (prev_node == NULL) return;
        Node* new_node = (Node*)malloc(sizeof(Node));
        new_node->data = new_data;
        new_node->next = prev_node->next;
        prev_node->next = new_node;
    }
    ```
### 刪除: $O(1)$
```c=
void deleteNode(Node** head_ref, Node* del) {
    if (*head_ref == NULL || del == NULL) return;
    if (*head_ref == del) *head_ref = del->next;
    Node* temp = *head_ref;
    while (temp->next != NULL && temp->next != del) {
        temp = temp->next;
    }
    if (temp->next == NULL) return;
    temp->next = del->next;
    free(del);
}
``` 
### 查找: $O(n)$
```c=
Node* search(Node* head, int key) {
    Node* current = head;
    while (current != NULL) {
        if (current->data == key) return current;
        current = current->next;
    }
    return NULL;
}
```

### 反轉: $O(n)$
ref: [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
```c=
Node* reverse(Node* head) {
    Node* prev = NULL;
    Node* curr = head;
    Node* temp = NULL;
    while (curr != NULL) {
        temp = curr->next; // 暫存下一個節點
        curr->next = prev; // 反轉指向
        prev = curr;       // 移動 prev
        curr = temp;      // 移動 curr
    }
    return prev; // 新的頭節點
}
```
