---
tags: ["statistic", "linear_regression"]
aliases: ["R2", "coefficient of determination"]
---

# A) R-squared ?

$$
R^{2}=\frac{\mathrm{TSS}-\mathrm{RSS}}{\mathrm{TSS}}=1-\frac{\mathrm{RSS}}{\mathrm{TSS}}
$$

* TSS(total sum of squares): $\operatorname{TSS}=\sum\left(y_{i}-\bar{y}\right)^{2}$
* [[residual sum of squares|RSS]]: $\operatorname{RSS}=\sum_{i=1}^{n}\left(y_{i}-\hat{y}_{i}\right)^{2}$

TSS 는 regression 전에 확인할 수 있는 variability (변동성) 의 양이고, RSS 는 regression 을 통해 설명하지 못하는 variability 의 양이다. 즉, $\mathrm{TSS}-\mathrm{RSS}$ 는 **regression 을 통해 설명할 수 있는 변동성의 양**을 의미한다.

그리고, $R^2$ 값은 $X$ 를 통해 설명할 수 있는 $Y$ 의 변동성 비율을 나타낸다.

# B) 해석

An $R^2$ statistic that is close to $1$ indicates that a large proportion of the variability in the response is explained by the regression.

A number near $0$ indicates that the regression does not explain much of the variability in the response; 이 결과는 linear 모델이 적합하지 않거나 error variance $σ^2$ 가 너무 높다는 뜻일수도 있다 (아니면 둘 다).

# C) Application

* [[linear regression]] 의 경우, $R^2$ 값은 데이터가 얼마나 선형 모델에서 왔는지를 측정하는 기준이 된다.
	* 예를 들어, 공부 시간과 성적이 선형 관계에 있다고 가정하고, 해당 데이터를 학습한 선형 모델의 R-squared 값이 $0$ 에 가깝에 나왔다고 한다면, 학습된 모델이 문제가 있다고 볼 수 있을 것이다.
* 모델의 변수 선택의 기준으로 활용할 수 있다.
	* 예시) A, B, C 변수를 사용하여 모델을 구성했을 때 $R^2$ 값이 0.5 이고, A, B 변수를 사용하면 $R^2$ 값이 0.48 인 경우, C 변수는 그다지 큰 쓸모는 없다.
	* 다만, 실제로 해당 변수가 유효한지는 [[p-value]] 를 통해 더블 체크할 필요가 있다. (우연한 결과인지? 아니면 실제로 유효하지 않은지?)

# D) 한계

모델의 변수가 추가 될 때마다 학습 데이터에 대한 R-squared 값은 증가하기 때문에, 크게 변별력은 없다.

* R-squared 값이 너무 높으면 [[overfitting]] 의심 가능

# E) Adjusted R-squared

모델 변수가 늘어날때마다 증가하는 RSS 값에 패널티를 주기위해, $d$ 개의 변수에 대한 adjusted R-squared 값은 다음과 같다.

$$
R^{2}=1-\frac{\operatorname{RSS} /(n-d-1)}{\operatorname{TSS} /(n-1)}
$$

* $n$ 은 데이터 갯수

RSS 값과 다르게 $\frac{\mathrm{RSS}}{n-d-1}$ 값은 모델의 변수가 많아질수록 높아지거나 낮아질 수 있다.

# F) References
