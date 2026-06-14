---
title: "law of total probability"
tags: ["statistic"]
---

# A) Law of Total Probability ?

# B) 정리 (다른 이름으로는 [[marginalization]])

## B.1) 이산형 경우

* $P(A)=\sum_{n}P(A,B)=\sum_{n}P\left(A\mid B_{n}\right)P\left(B_{n}\right)$

## B.2) 연속형 경우

* $\displaystyle p(x)=\int_{y}p(x,y)dy=\int_{y}p(x\mid y)\cdotp(y)dy$

# C) 응용 사례

## C.1) Joint Distribution $P(a,b,c,d)$ 에서 $P(b)$ 를 찾는 방법

$$
P(b)=\sum_{a}\sum_{c}\sum_{d}P(a,b,c,d)
$$

## C.2) $P(c\mid b)$ 를 구하는 방법

$$
P(c\mid b)=\sum_{a}\sum_{d}P(a,c,d\mid b)=\frac{1}{P(b)}\sum_{a}\sum_{d}P(a,c,d,b)
$$

여기서, $1/\mathrm{P}(\mathrm{b})$ 는 [[normalizing constant]] 입니다.

# D) 예시 설명

두 공장에서 전구를 생산합니다. X 공장에서 만든 전구는 99% 확률로 5,000 시간 이상 작동하고, Y 공장에서 만든 전구는 95% 확률로 5,000 시간 이상 작동합니다. X 공장은 전체 전구의 60%, Y 공장은 40% 를 공급한다고 가정할 때, 구입한 전구가 5,000 시간 이상 작동할 확률은 다음과 같습니다:

$$
\begin{aligned}
    P(A) &= P \left( A \mid B_X \right) \cdot P \left( B_X \right) + P \left( A \mid B_Y \right) \cdot P \left( B_Y \right) \\ 
    &= \frac{99}{100} \cdot \frac{6}{10} + \frac{95}{100} \cdot \frac{4}{10} = \frac{594+380}{1000} = \frac{974}{1000} = 0.974 \\ 
& 
\end{aligned}
$$

즉, 각 구입한 전구가 97.4% 확률로 5,000 시간 이상 작동합니다.

여기서 $P(B_n)$ 은 구입한 전구가 n 공장에서 생산될 확률을 의미하고, $P(A|B_n)$ 은 n 공장에서 생산된 전구가 5,000 시간 이상 작동할 확률을 의미합니다.

# E) [[conditional probability]] 에 적용되는 Law of Total Probability

* $P(A|C)=∑_n P(A|C∩B_n) P(B_n|C)$

# F) Related

# G) References
