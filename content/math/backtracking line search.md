---
title: "backtracking line search"
tags: ["optimization"]
---

# 1. Backtracking line search ?

[[gradient descent]] 에서 고정 step size 를 사용하게 되면 진행 속도가 항상 동일하기 때문에, 경사가 가파른 구간에서는 최적점을 지나쳐서 진동할 수 있으며 경사가 평평한 구간에서는 진행이 느려질 수가 있다. 따라서, 곡면의 특성에 맞춰 속도를 조절하면서 진행해야 수렴도 보장되고 수렴 속도도 높아진다. 이와 같이 곡면의 특성에 맞춰 step size 를 적응적으로 선택하는 방법 중 하나가 **backtracking line search**이다.

이 방법을 간단하게 말하면, 다음 위치를 결정할 때 현재 위치에서 한 step 을 가보고 너무 많이 갔다고 판단하면 다시 되돌아 오는 방법이다.

다음 그림은 backtracking line search 로 다음 step 을 결정하는 방식을 보여준다.  

![|600](https://i.imgur.com/epjbGYS.png)

# 2. Related

# 3. References

* https://convex-optimization-for-all.github.io/contents/chapter06/2021/03/20/06_02_02_backtracking_line_search/
