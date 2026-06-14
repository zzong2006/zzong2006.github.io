---
tags: ["metrics"]
aliases: ["RSE"]
---

# A) Residual Standard Error, RSE ?

$$
\displaystyle\mathrm{RSE}=\sqrt{\frac{1}{n-p-1} \cdot \mathrm{RSS}}
$$

$p$ 는 모델의 변수 개수 그리고 $n$ 은 데이터 개수이며, [[residual sum of squares|RSS]] 는 다음과 같다.

$$
\operatorname{RSS}=\sum_{i=1}^{n}\left(y_{i}-\hat{y}_{i}\right)^{2}
$$

# B) RSE 가 필요한 이유

우리가 어떤 데이터와 label 의 관계를 생각할 때, 선형 모델로 학습을 하더라도 그것이 반드시 선형일 수 없기에 노이즈가 껴있다: $Y=\beta_{0}+\beta_{1}X+\epsilon$

그래서 학습된 (선형) 모델이 적합한지 판단하기 위해서는 각 계수의 [[standard error]] 를 구하면 되는데, 이때 $\sigma^{2}=\operatorname{Var}(\epsilon)$ 의 값이 필요하다.

실제 데이터에 대한 function 을 모르기 때문에, [[standard error]] 를 구하기 위해 필요한 $\sigma^2$ 은 실질적으로 계산할 수 없다. 그래서, RSE 를 통해 $\sigma$ 를 추정한다.

# C) Related

* [[R-squared]]
* [[residual sum of squares]]
