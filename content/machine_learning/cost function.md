---
title: "cost function"
tags: ["machine_learning", "deep_learning", "calculus", "differentitation"]
aliases: ["objective function", "loss function", "비용 함수"]
---

# 1. Cost Function ?

# 2. Cost Function 을 최소화 한다는 것의 직관적 이해

[[linear regression]] 의 Cost Function $J(\theta_0,\theta_1)$  

* 가설 $h$ 의 정확도를 측정하기 위해 사용하는 함수

$$
\displaystyle \underset{\theta_0,\theta_1}{minimize}\ J(\theta_0,\theta_1)=\frac{1}{2m}\sum^{m}_{i=1}(h_\theta(x^{(i)})-y^{(i)})^2
$$

* $(x^{(i)},y^{(i)})$ 형식으로 $i$ 번째 training 데이터를 표현
* $m$ 은 training 데이터의 개수 (# of training examples)
* 수식을 $2$ 로 나누는 것은 [[gradient descent]] 계산 시, 미분 term 을 구하는데 편리해지기 때문
	* > The mean is halved $\left(\frac{1}{2}\right)$ as a convenience for the computation of the gradient descent, as the derivative term of the square function will cancel out the $\left(\frac{1}{2}\right)$ term.

$J(\theta_0,\theta_1)$ 를 간소화해서 $\theta_0$ 을 $0$ 이라 하자. 즉, $J(\theta_1)$ 을 최소화하는 문제로 바꿔보자:

$$
\displaystyle J({\theta}_1)=\frac{1}{2m}\sum^{m}_{i=1}(h_{\theta}(x^{(i)})-y^{(i)})^2=\frac{1}{2m}\sum^{m}_{i=1}({\theta}_1x^{(i)}-y^{(i)})^2
$$

아래의 왼쪽 그림은 예측 모델 $h_\theta(x)=\theta_1x$ 그리고 오른쪽은 비용 함수 $J({\theta}_1)$ 이다.

* ![img](https://i.loli.net/2020/09/21/hYT3EF8lOCDLaZA.png)

		- 학습 데이터는 $\theta_1=1$일 때의 모델 $h$와 정확하게 직선상에 일치하고, 오른쪽 그림에 $(\theta_1,J(\theta_1))$은 $(1,0)$으로 표기된다.

* 이후 계속 $J(\theta_1)$ 를 그려보면 다음과 같다.
	* ![img](https://i.loli.net/2020/09/21/Kcgs7mowzE6ALnf.png)
	* ![img](https://i.loli.net/2020/09/21/eCiF4aHw7pPQnbr.png)
		* 비용 함수를 최소화 하는 것이 목적이므로, $\theta_1=1$ 을 선택하고, 이를 [[global minimum]] 이라 부른다.
* 이제 $\theta_0=0$ 이었던, $\theta_0$ 를 다시 사용해보자.
	* 더 이상 $J(\theta_0,\theta_1)$ 은 일반적인 선 그래프로 표현하기 힘들다.
	* 두 개의 features($\theta_0,\theta_1$) 를 사용하는 경우, 등고선 (contour plot) 을 사용한다.
		* ![img](https://i.loli.net/2020/09/21/yLlMfOEQit6xceA.png)

모델 $h_\theta(x)$ 가 학습 데이터에 더욱 적합해질수록, $J(\theta_0,\theta_1)$ 값은 등고선의 중심에 다가간다.

* ![img](https://i.loli.net/2020/09/21/9zHTwKDbg1WnxhJ.png)

# 3. L1 Loss and [[L2 Loss]]

* 실제 값 $y_i$ 와 예측값 $f(x_i)$ 사이의 관계
* L1 Loss

$$
\displaystyle L=\sum_{i=1}^{n}\left|y_{i}-f\left(x_{i}\right)\right|
$$

* [[L2 Loss]]
	* $\displaystyle L=\sum_{i=1}^{n}\left(y_{i}-f\left(x_{i}\right)\right)^{2}$
* [[L2 Loss]] 는 [[outlier]] 의 변화에 민감하다. 반면 L1 Loss 는 outlier 에 대해서 상대적으로 안정된 값을 보여준다. 아마 그 이유는 차이를 제곱 (square) 하기 때문이 아닐까 생각해본다.

*

# 4. Cost Vs Loss Function?

* Loss function 은 단일 training example 에 대한 prediction 과 ground truth 값의 차이를 의미한다.
* Cost function 은 모든 training examples 들에 대한 loss function 의 평균 값을 의미한다.

# 5. Related

# 6. References
