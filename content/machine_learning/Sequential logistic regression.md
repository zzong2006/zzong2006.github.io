---
title: "Sequential logistic regression"
tags: ["linear_regression"]
---

# Sequential Logistic Regression ?

Bayesian 형식으로 표현된 [[logistic regression]] 의 likelihood 는 다음과 같다.

$$
P(s\mid \mathrm{pa},\theta)=g\left((2s-1)\sum_{j}\theta_{j}x_{j}\right)
$$

* $g(\cdot)$ 은 [[sigmoid function]]: $g(x)=\left(1+e^{-x}\right)^{-1}$
* $s$ 는 binary response variable (`0` 은 노출 그리고 `1` 은 클릭)
* $\mathrm{pa}=\left\{x_{1},\ldots,x_{n}\right\}$: context vector

parameter $\theta$ 의 prior distribution 는 Gaussian pdf $\mathcal{N}(\mu,\Sigma)$ 를 따른다고 한다면, posterior 는 다음과 같이 계산된다.

$$
P(s \mid \mathrm{pa})=\int P(s \mid \mathrm{pa}, \theta) P(\theta) d \theta
$$

Sequential Logisitc Regression 은 매 time step $n$ 마다 example $\left\{x_{n},s_{n}\right\}$ 들을 입력받는다고 할때, Gaussian posterior 확률 분포 $P\left(\theta\mid D^{1},\ldots,D^{T}\right)$ 를 계산하는 것이 목적이다 (여기서 $D^{t}=\left\{s^{t},x_{1}^{t},\ldots,x_{n}^{t}\right\}$ 는 $t$ time step 에 받은 context 및 reward)

# 학습 방안

Logistic regression 은 non-linear 하기 때문에 true posterior 를 계산하는 것은 analytically not feasible 하다. 그래서 아래와 같은 방법들로 posterior 를 approximate 하는 접근 방법을 택한다.

## Laplace Approximation

[[Laplace approximation]] 은 S-L approximation 으로 표현되며, prior mean ($\mu$) 을 중심으로 하는 log-likelihood 를 local quadratic approximation 으로 표현한다. 그리고 해당 Log-likelihood 의 solution 을 [[Newton-Raphson method#Second-order method]] 방식을 통해 찾아낸다.

이 방식은 adjustable 한 parameter 가 없기 때문에 variational 한 방식보다 간단하지만, posterior 추정에 덜 정확한 결과를 낸다는 실험적인 내용이 있다.

### Update Equation (ver. 1)

$$
\begin{gathered}
\Sigma_{\text {post }}^{-1}=\Sigma^{-1}+\hat{p}(1-\hat{p}) x x^{\top} \\
\mu_{\text {post }}=\mu+(s-\hat{p}) \Sigma_{\text {post }} x
\end{gathered}
$$

* $\hat{p}=g\left(\mu^{T} x\right)$

위의 식 유도는 다음을 참고할 것: [generalized linear model - Why using Newton's method for logistic regression optimization is called iterative re-weighted least squares? - Cross Validated](https://stats.stackexchange.com/questions/344309/why-using-newtons-method-for-logistic-regression-optimization-is-called-iterati)

### Update Equation (ver. 2)

$$
\begin{gathered}
\bar{\Sigma}=\Sigma-\left(\frac{\check{p}(1-\check{p})}{1+\check{p}(1-\check{p}) \sigma^{2}}\right)(\Sigma t)(\Sigma t)^{\top} \\
\check{p}=P\left(\hat{Z}_{t}=1 \mid \mu\right)=g\left(\mu^{T} x\right) \\
\sigma^{2}=t^{\prime} \Sigma t \\
\tilde{\mu}=\mu+(z-\check{p}) \bar{\Sigma} t
\end{gathered}
$$

첫번째 식에 [[Sherman–Morrison formula]] 를 적용하면 두번째 식을 얻을 수 있다.

## Variational Approximation

$P(s\mid\mathrm{pa},\theta)$ 를 [[variational inference|varitional approximation]] 으로 치환하여 posterior 의 parameter 는 Gaussian 으로 남기고, posterior 계산은 각 observations 을 통해 evidence 를 순차적으로 계산함으로써 계산할 수 있다.

우선 variational transformation 은 다음과 같이 이루어진다

$$
\begin{aligned}P(s\mid\mathrm{pa},\theta)=g\left(X_{s}\right)&\geq g(\xi)\exp\left\{\left(X_{s}-\xi\right)/2+\lambda(\xi)\left(X_{s}^{2}-\xi^{2}\right)\right\}=P(s\mid\mathrm{pa},\theta,\xi)\end{aligned}
$$

* $X_{s}=(2s-1)\sum_{j}\theta_{j}x_{j}$ 이고, $\lambda(\xi)=[1/2-g(\xi)]/2\xi$ 이다.
* $\xi$ 는 variational parameter 이다.

### Update Equations

$$
\begin{gathered}
\Sigma_{\text {post }}^{-1}=\Sigma^{-1}+2|\lambda(\xi)| x x^{T} \\
\mu_{\text {post }}=\Sigma_{\text {post }}\left[\Sigma^{-1} \mu+(s-1 / 2) x\right]
\end{gathered}
$$

* $x=\left[x_{1}\ldots x_{n}\right]^{T}$ 는 context vector
* $\lambda(\xi)=[1/2-g(\xi)]/2\xi$

$\xi$ (크시) 의 경우 다음과 같이 업데이트 할 수 있다.

$$
\xi^{2}=E\left\{\left(\sum_{j}\theta_{j}x_{j}\right)^{2}\right\}=x^{T}\Sigma_{post}x+\left(x^{T}\mu_{post}\right)^{2}
$$

* a multivariate normal approximation to the posterior density
* 어떤 posterior 를 mean $\tilde{\mu}$ 이고 covariance matrix $\bar{\Sigma}$ 이 Gaussian approximation 으로 보이면 다음과 같음
	- 
* $\sigma^{2}=t^{\prime}\Sigma t$ 는 $\theta(t,\alpha)=\alpha^{\prime}t$ 의 prior variance 라고 한다.
* $\check{p}$ 는 direct estimate 로, 다음과 같이 계산된다

$$
\check{p}=\check{p}\left(Z=1\mid x_{\mathrm{pa}\left(v\right)}\right)=e^{\prime}/\left(1+e^{\prime}\right)
$$

# References

1. [Sequential Updating of Conditional Probabilities on Directed Graphical Structures](https://sci-hub.se/https://doi.org/10.1002/net.3230200507)
2. [Sequential Bayesian computation of logistic regression models](https://www.researchgate.net/publication/3794405_Sequential_Bayesian_computation_of_logistic_regression_models)
3. [A variational approach to Bayesian logistic regression models and their extensions](http://proceedings.mlr.press/r1/jaakkola97a/jaakkola97a.pdf)
	* 개인적으로 가장 잘 정리된 내용인것 같음
4. [Dynamic Logistic Regression](https://sci-hub.se/10.1109/IJCNN.1999.832603)
5. https://stats.stackexchange.com/questions/81740/recursive-online-regularised-least-squares-algorithm
6. 
