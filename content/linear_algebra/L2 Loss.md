---
tags: ["machine_learning", "loss_function", "linear_algebra"]
aliases: ["squared loss", "L2 loss"]
---

# A) L2 Loss ?

L2 Loss 는 예측값과 정답의 차이를 제곱해서 penalty 를 주는 [[machine_learning/loss function|loss function]] 이다.

$$
L = \sum_{i=1}^{n}(y_i - \hat{y}_i)^2
$$

오차를 제곱하기 때문에 큰 오차에 훨씬 강한 penalty 를 준다. 그래서 regression 에서 자주 쓰이지만, [[outlier]] 가 있으면 loss 가 특정 sample 에 크게 끌릴 수 있다.

# B) MSE 와의 관계

[[machine_learning/mean squared error|MSE]] 는 L2 Loss 를 sample 수로 평균낸 형태로 볼 수 있다.

$$
\operatorname{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2
$$

최적화 관점에서는 상수 배율이 gradient 방향을 바꾸지는 않으므로, 논문이나 구현에서는 squared loss, L2 loss, MSE 를 문맥에 따라 거의 비슷하게 부르는 경우가 많다.

# C) L1 Loss 와 비교

| 구분 | 형태 | 특징 |
| --- | --- | --- |
| L1 Loss | $|y-\hat{y}|$ | outlier 에 비교적 덜 민감 |
| L2 Loss | $(y-\hat{y})^2$ | 큰 오차를 강하게 줄이도록 학습 |
