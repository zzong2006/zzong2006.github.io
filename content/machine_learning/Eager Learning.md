---
tags: ["machine_learning"]
---

# Eager Learning ?

일반적인 학습 과정으로, training 데이터로 일정 기간 학습시킨 후, 학습시킨 모델을 기반으로 테스트 데이터를 적용하는 방법

training 데이터는 학습 시에만 메모리에 보관되며 학습 이후에는 training 데이터를 메모리에서 제거한다.

이후, test 데이터를 분류 또는 예측할 때만 test 데이터를 메모리에 적재한다.

# Vs. Lazy Learning

Eager Learning 은 [[Lazy learning]] 보다 메모리를 효율적으로 사용할 수 있다. 하지만 메모리 적재 시간이 필요하므로, [[Lazy learning]] 보다 학습 시간이 오래 걸린다.

# Related

# References
