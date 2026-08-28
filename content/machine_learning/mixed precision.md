---
title: "mixed precision"
---

# A) Mixed Precision ?

mixed precision 은 모델 학습시 FP16, FP32 `부동 소수점` 유형을 상황에 따라 유연하게 사용하여 학습을 더 빠르게 실행하고 메모리를 적게 사용하는 방법이다. Forward, Backward Propagation 은 모두 FP16 으로 연산하고, weight 를 업데이트 할 때에는 다시 FP32 로 변환하여 계산한다.

![](https://i.imgur.com/fTr4I8z.png)

# B) 장점

* 기존 FP32 로 학습한 것 대비, 정확도의 손실이 없거나 오히려 향상됨
* 메모리가 절반으로 줄어들어, 배치 사이즈를 늘리거나, 더 큰 모델을 학습할 수 있음

# C) References
