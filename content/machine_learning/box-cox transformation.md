---
title: "box-cox transformation"
tags: ["feature_engineering"]
aliases: ["Power Transformation"]
---

# A) Box-cox Transformation ?

데이터를 [[Gaussian distribution|정규 분포]] 에 가깝게 만들어 주는 변환 방법

$x>0$ 에 대하여 box-cox 변환은 다음을 만족하도록 한다.

$$
g(x):= \begin{cases}\displaystyle \frac{x^{\lambda}-1}{\lambda} & , \lambda \neq 0 \\ \log x & , \lambda=0\end{cases}
$$

여기서 $\lambda$ 는 변환이 필요한지의 여부를 나타내며, 주로 $\lambda=0,1,2$ 를 고려한다.

$\displaystyle \lim _{\lambda \rightarrow 0} \frac{x^{\lambda}-1}{\lambda}=\log x$ 를 만족하므로, $g_{0}(x)=\log (x)$ 는 변환이 필요하다고 생각할 수 있다.

# B) References

* https://freshrimpsushi.github.io/posts/box-cox-transformation/
