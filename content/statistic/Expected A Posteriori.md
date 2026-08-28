---
title: "Expected A Posteriori"
---


---
tags:
alias: EAP
---

# A) Expected A Posteriori(EAP) 란?

참고: [Toward data science](https://radiant-brushlands-42789.herokuapp.com/radiant-brushlands-42789.herokuapp.com/towardsdatascience.com/mle-map-and-bayesian-inference-3407b2d6d4d9)

---

EAP 는 [[Bayesian inference]] 를 통해 구한 사후분포 $f(\theta\mid D)$ 의 [[statistic/expectation|expected value]], 즉 기대값을 계산하는 방법입니다. 이는 MLE 나 [[maximum a posteriori probability]] 와 같이 하나의 값을 추정하는 point estimation 기법 중 하나입니다.

수식으로 표현하면 다음과 같습니다.

$$
\hat{\theta}_{EAP}=E[\theta\mid D]=\int_{\theta} \theta P(\theta\mid D) d\theta
$$

---

## A.1) 예시

“예시: [[Binomial Distribution]] 을 따르는 likelihood 와 beta distribution 을 따르는 prior 의 경우”를 참고합니다.

이 경우, EAP 는 다음과 같이 계산됩니다.

$$
\begin{align}
\hat{\theta}_{EAP}
&= \int_{\theta} \theta P(\theta|D) d\theta \\[1.5ex]
&= \int_{0}^{1} \theta \frac{\Gamma(n+\alpha+\beta)}{\Gamma(k+\alpha)\Gamma(n-k+\beta)} \cdot \theta^{k+\alpha-1} (1-\theta)^{n-k+\beta-1} d\theta \\[2ex]
&= \frac{\Gamma(n+\alpha+\beta)}{\Gamma(k+\alpha)\Gamma(n-k+\beta)}
    \int_{0}^{1}\!\! \theta^{k+\alpha}(1-\theta)^{n-k+\beta-1}\, d\theta
\end{align}
$$

여기서 [엘룰러 적분](https://en.wikipedia.org/wiki/Euler_integral) 의 첫 번째 종류와 Gamma 함수 ($\Gamma(n) = (n-1)!$) 의 정의를 응용하면, 위 식은 아래처럼 정리할 수 있습니다.

$$
\begin{align}
\hat{\theta}_{EAP}
&= 
   \frac{\Gamma(n+\alpha+\beta)}{\Gamma(k+\alpha)\Gamma(n-k+\beta)}
   \cdot
   \frac{
       \Gamma(k+\alpha+1)\,\Gamma(n-k+\beta)
   }{
       \Gamma(n + \alpha + \beta + 1)
   }
\\[2ex]
&=
  \frac{
      (k + \alpha)
      }{
      n + \alpha + \beta
  }
\end{align}
$$

---

즉, 이 예시에서 EAP 추정치는 관측된 성공 횟수 $k$ 에 prior 의 파라미터 $\alpha$ 를 더하고, 시행 횟수 $n$ 에 prior 의 파라미터 $(\alpha + \beta)$ 를 더한 값으로 나타낼 수 있습니다.

# B) References
