---
title: "teacher forcing"
tags: ["deep_learning"]
---

# A) Teacher Forcing ?

[[Recurrent Neural Network|RNN]] 을 학습하는 방법 중 하나

학습 과정에서는 ground truth $\boldsymbol{y}^{(t)}$ 를 $\boldsymbol{h}^{(t+1)}$ 의 입력값으로 넣어준다. 테스트 과정에서는 $\boldsymbol{y}^{(t)}$ 대신 $\boldsymbol{o}^{(t)}$ 값을 넣어준다.

![|400](https://i.imgur.com/YcXNBQl.png)

# B) Pros and Cons

## B.1) 장점

학습 속도가 빠르다.

## B.2) 단점

배포 과정에서는 ground truth 를 알 수 없으므로 성능이 불안정하다.

# C) References
