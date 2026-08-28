---
title: "FP-Tree Mining"
tags: ["association_rules"]
---

# A) FP-Tree Mining ?

![[img-70b9e6f191.jpg]]

![](https://i.imgur.com/JemZrWP.png)

각 table 의 item 에 해당하는 subtree 만 구성하여 frequency 를 만족하는 item 을 찾는다.

subtree 를 구성하는 방법은 각 item 에 대한 node pointer 를 통해, root node 로 올라가면서 만나는 node 의 item 들을 subtree 의 일부로 생각하는 것이다. 예를 들어, 위 그림에서 item $m$ 을 기준으로 생각했을 때, 상위 root 로 올라가면서 만나는 $a$, $c$, $f$ 를 subtree 의 노드로 지정한다 ($b$ 는 count 가 1 이므로 무시한다.)

# B) References
