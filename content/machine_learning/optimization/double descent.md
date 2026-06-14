---
title: "double descent"
tags: ["deep_learning"]
---

# A) Double Descent ?

모델이 무거울수록 오래 학습할수록 성능이 좋아진다.

![](https://i.imgur.com/rnwKWer.png)

“We increase model size, performance first gets worse and then gets better. Moreover, we show that double descent occurs not just as a function of model size, but also as a function of the number of training epochs.”

model size 가 커지면 처음엔 나빠지지만 결국에 다시 좋아진다 라는 것이고 이러한 현상을 double descnet 라고 부릅니다. 이 현상은 2018 년도 Belkin 이라는 사람에 의해 처음 제시되었습니다. 그리고 이 현상은 model size 뿐만이 아니라 training epoch 에 의해서도 영향을 받는다라고 저자들은 주장합니다.

# B) Related

# C) References

* [[딥러닝 논문 리뷰] Deep Double Descent : Where Bigger Models And More Data Hurt](https://bluediary8.tistory.com/59)
* Deep Double Descent : Where Bigger Models And More Data Hurt
