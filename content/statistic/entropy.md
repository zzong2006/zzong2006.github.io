---
title: "entropy"
tags: ["statistic", "information_theory"]
---

# Entropy ?

entropy 란 불확실성 (uncertainty) 에 대한 척도이며, 다음과 같이 계산된다.

$$
\displaystyle H(q)=-\sum_{c=1}^{C}q\left(y_{c}\right)\log\left(q\left(y_{c}\right)\right)
$$

위 식에서 $C$ 는 category 의 갯수이고, $q$ 는 사건의 확률질량함수 ([[Probability Mass Function]]) 이다.

# 예시

가방 안에 빨간공만 들어있다고 하자. 이 경우, 불확실성은 없다. 왜냐하면 어떤공을 꺼내도 빨간 공이기 때문이다. 따라서 이 경우 entropy 는 $0$ 이다.

# 특징

entropy 는 예측하기 쉬운 일에서보다, 예측하기 힘든일에서 더 높다.

예 2) 가방 안에 빨간공과 녹색공이 20:80 으로 들어있는 경우

$$
H(q)=-(0.2log(0.2)+0.8log(0.8))=0.5
$$

예 3) 빨간공과 녹색공 비율이 99:1 인 경우

$$
H(q)=-(0.99*log(0.99)+0.01log(0.01))=0.02
$$

# Related

# References
