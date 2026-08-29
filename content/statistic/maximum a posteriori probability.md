---
title: "maximum a posteriori probability"
tags:
  - statistic
  - bayesian_inference
aliases: ["MAP"]
---

# Maximum a Posteriori Probability ?

MAP(maximum a posteriori probability) estimate is an estimate of an unknown quantity, that equals the [mode]([[mode]]) of the posterior distribution.

$$
\theta_{\mathrm{MAP}}=\underset{\theta}{\operatorname{argmax}}\left(\log (g(\theta))+\sum_{i=1}^n \log \left(f\left(X_i \mid \theta\right)\right)\right)
$$

# MLE 와 MAP 비교

## 공통점

[[Maximum Likelihood Estimation|MLE]] and MAP are method of estimating parameters of statistical models. 구해진 parameter 는 a singe fixed value 이므로 MLE 와 MAP 는 point estimator 로 생각할 수 있다.

## 차이점

MAP 는 prior 를 고려하여 parameter 를 계산한다.

# MAP Examples

## Example 1) MAP Estimation for the Binomial Distribution

리버풀이 $n$ 경기에서 $k$ 이길 확률이 [[Binomial Distribution]] 을 따르고, 해당 분포가 parameter $\theta$ 를 가질때, 다음과 같이 표현될 수 있다.

$$
P(k \text{wins out of} n \text{matches} \mid\theta)\\=P(D\mid\theta)=\left(\begin{array}{l}n\\k\end{array}\right)\theta^{k}(1-\theta)^{n-k}
$$

여기서 $D$ 는 관측된 데이터로, 38 경기 중 30 경기를 이겼다고 가정해보자.

[[Maximum Likelihood Estimation]] 을 통한 $\theta$ 는 likelihood function $P(D|\theta)$ 를 $\theta$ 에 대해 미분함으로써 계산된다.

$$
\begin{aligned}\frac{dP(D\mid\theta)}{d\theta}&=\left(\begin{array}{l}n\\k\end{array}\right)\left(k\theta^{k-1}(1-\theta)^{n-k}-(n-k)\theta^{k}(1-\theta)^{n-k-1}\right)\\&=\left(\begin{array}{l}n\\k\end{array}\right)\theta^{k-1}(1-\theta)^{n-k-1}(k(1-\theta)-(n-k)\theta)\\&=0\end{aligned}
$$

위 식을 풀면 $\theta$ 는 $\displaystyle\frac{k}{n}$ 일 때, likelihood 함수가 최대화된다. 물론 $\theta$ 가 0 또는 1 일 때도 미분의 결과가 0 이 나오지만, 이는 최소값이다.

* $k=30$ 이고, $n=38$ 이므로 $\theta=0.789$ 이다.
* [[Maximum Likelihood Estimation]] 는 보다시피 데이터가 큰 경우에는 잘 동작하지만, 데이터가 적으면 제대로 동작하지 않는다.
	* $k=2,n=2$ 면, 100% ?
* MLE 의 단점을 보완하기 위해, MAP 를 이용하여 $\theta$ 를 찾아보자.
	* 리버풀의 이길 확률 (prior) 은 지난 시즌을 고려했을 때 약 50% 라고 가정하자
	* 그리고 이미 전적 ($D$) 을 알고있으므로, 이 두가지를 활용한 $\theta$ 를 고려한다고 했을 때, $P(\theta|D)$ 라는 posterior 확률을 활용하게 된다.
	* MAP estimation 은 이 $P(\theta|D)$ 를 최대화 하는 $\theta$ 를 찾는 것이다.
	* [[Bayes theorem]] 에 의해
	* $P(\theta\mid D)=\frac{P(D \mid \theta)P(\theta)}{P(D)}$ 로 계산된다.
		* 여기서 $P(D)$ 는 evidence 로, 상수 취급되기 떄문에 $\theta$ 를 구하는데 관련이 없어서 생략할 수 있다.
	* 계산의 단순성을 위해서 binomial distribution 을 따르는 likelihood $P(D|\theta)$ 의 conjugate prior 는 beta distribution 이므로, $P(\theta)$ 는 Beta distribution 을 따른다고 설정할 수 있다.

 $$
P(\theta)=\frac{\Gamma(\alpha+\beta)}{\Gamma(\alpha)\Gamma(\beta)}\theta^{\alpha-1}(1-\theta)^{\beta-1}
$$

여기서 $\alpha$ 와 $\beta$ 는 hyperparameter 다. 이 값들은 data 에 의해 결정되지 않고, 주관적으로 정해서 prior knowledge 를 표현할 수 있다.

		* 이제 최대화해야될 $P(D\mid\theta)P(\theta)$을 계산해보자.

			* $\begin{aligned}P(D\mid\theta)P(\theta)&=\left(\begin{array}{l}n\\k\end{array}\right)\theta^{k}(1-\theta)^{n-k}\frac{\Gamma(\alpha+\beta)}{\Gamma(\alpha)\Gamma(\beta)}\theta^{\alpha-1}(1-\theta)^{\beta-1}\\&=\left(\begin{array}{l}n\\k\end{array}\right)\frac{\Gamma(\alpha+\beta)}{\Gamma(\alpha)\Gamma(\beta)}\theta^{k+\alpha-1}(1-\theta)^{n-k+\beta-1}\end{aligned}$

		* 위 식을 $\theta$에 대해 미분하면 $\displaystyle\theta=\frac{k+\alpha-1}{n+\alpha+\beta-2}$가 나온다.

		* 결과적으로 $\alpha=10\text{and}\beta=10$인 경우, 39/56 으로, $\theta=0.696$이 나온다.

## Example 2) MAP Estimation for the Bernoulli Distribution

동전 던지기를 할 때, 만약 앞면 또는 뒷면이 연속적으로 나온 상태에서 [[Maximum Likelihood Estimation]] 를 적용한 경우, 확률이 $\theta=0$ 또는 $\theta=1$ 와 같은 극단적인 case 가 발생할 수 있다.

이러한 overfitting 을 막기 위해, [[statistic/Beta distribution]] 을 활용하여 prior 로 설정한다.

$$
p(\theta)=\operatorname{Beta}(\theta\mid a,b)
$$

즉, log likelihood 더하기 log prior 는 다음과 같다.

$$
\begin{aligned}LL(\theta)&=\log p(\mathcal{D}\mid\theta)+\log p(\theta)\\&=\left[N_{1}\log\theta+N_{0}\log(1-\theta)\right]+[(a-1)\log(\theta)+(b-1)\log(1-\theta)]\end{aligned}
$$

* $N_1,N_0$ 는 각각 동전의 앞면과 뒷면이 나온 횟수
* 여기서 log prior 의 Beta function 은 상수이므로 생략할 수 있다

$\theta$ 에 대해서 풀면, MAP estimate 는 $\displaystyle\theta_{\text{map}}=\frac{N_{1}+a-1}{N_{1}+N_{0}+a+b-2}$ 값을 얻는다.

# Mode 와 MAP 관계

The estimate by MAP is the [mode]([[mode]]) of the posterior distribution.

여기서 posterior distribution 은 [[Bayesian inference]] 를 통해 계산할 수 있다.

# Related

[[Expected A Posteriori|EAP]]

# References

* [Toward Data Science](https://radiant-brushlands-42789.herokuapp.com/towardsdatascience.com/a-gentle-introduction-to-maximum-likelihood-estimation-and-maximum-a-posteriori-estimation-d7c318f9d22d)
* [https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/ppt/22-MAP.pdf](https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/ppt/22-MAP.pdf)
