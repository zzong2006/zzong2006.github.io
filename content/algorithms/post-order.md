---
title: "post-order"
tags:
  - algorithm
  - tree
aliases: [postorder Search, Postorder Search]
---

# A) Post-Order Traversal

Post-order traversal은 [[algorithms/Tree Traversal|tree traversal]]에서 **왼쪽 subtree → 오른쪽 subtree → 현재 node** 순서로 방문하는 방식이다. 자식 node를 모두 처리한 뒤 parent를 처리하므로, tree를 아래에서 위로 접어 올리는 계산에 잘 맞는다.

# B) 언제 쓰나

Expression tree를 계산하거나, directory tree를 삭제하거나, dependency graph에서 하위 작업을 먼저 끝내야 하는 경우에 자연스럽다. DFS 구현에서는 recursive call을 모두 마친 뒤 현재 node를 결과에 추가하면 post-order가 된다.

# References
