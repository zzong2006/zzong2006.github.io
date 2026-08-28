---
title: "Inorder Search"
---
* Inorder Search 는 root 를 중간 단계에서 search 하는 방식이다.
	1. Traverse the left subtree
	2. Visit the root.
	3. Traverse the right subtree

# A) 예시

![[img-7bc456ab0e.gif|Example Tree]]
	- Inorder (Left, Root, Right)
		- 4 2 5 1 3

# B) Recursion 없이 Inorder Search 구현하는 방법: Stack 사용

 1. stack `S` 을 생성하고, root 를 현재 노드 `curr` 로 설정한다.
 2. `curr` 이 `None` 이 될 때까지 `S` 에 `curr` 을 넣고, `curr = curr.left` 를 수행
 3. `curr=None` 이고 stack 에 노드가 하나라도 있을 경우 다음을 수행
	* stack 에서 `pop` 해서 노드 하나 (`item`) 를 꺼낸다.
	* 꺼낸 node 의 value 를 출력하고, `curr` 을 꺼낸 노드의 오른쪽 (`item.right`) 으로 설정한다.
	* 이제 다시 (2) 로 돌아가서 `curr` 의 왼쪽 자식 노드를 계속 넣는다.

# C) 코드

```python
def inOrder(root):
    current = root
    stack = [] # initialize stack
    done = 0
     
    while True:         
        # Reach the left most Node of the current Node
        if current is not None:
            stack.append(current)
            current = current.left
		elif(stack):
            current = stack.pop()
            print(current.data, end=" ") # Python 3 printing
            current = current.right
 		else:
            break
```
