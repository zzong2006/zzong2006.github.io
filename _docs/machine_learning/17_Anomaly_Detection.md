---
layout: default
title:  "Anomaly Detection"
category: Machine Learning
order: 17
---

Problem statement of the Anomaly Detection

$$
\begin{aligned}
&\text { Dataset: }\left\{x^{(1)}, x^{(2)}, \ldots, x^{(m)}\right\}\\
&\text { Is } x_{\text {test}} \ \text {anomalous? }
\end{aligned}
$$

###  Anomaly detection example

Fraud Detection

* $x^{(i)}$ is features of user $i$'s activities
* Model $p(x)$ from data
* $p(x) \lt \varepsilon$ 인 경우를 체크하여 비정상적인 활동을 감지

 Monitoring computers in a data center

* $x^{(i)}$ is features of machine $i$
* $x_1$ :메모리 사용량, $x_2$ :초당 디스크 액세스 횟수 …

## Gaussian (Normal) distribution

$x \in \mathbb{R}$ 라고 하자. $x$는 평균이 $\mu$고, 분산이 $\sigma^2$인 distributed gaussian이라고 한다면, 다음과 같이 표현된다.

$$
x \sim \mathcal{N}\left(\mu, \sigma^{2}\right) 
$$

그리고 parameter인 $\mu$와 $\sigma$에 따라서 가우시안 확률 밀도(Gaussian probability density)는 다음과 같이 변한다.

![image-20201031001345543](https://i.loli.net/2020/10/30/3NiLzqvkfbmc2AZ.png)

### Parameter estimation

주어진 데이터셋 $\left\{x^{(1)}, x^{(2)}, \ldots, x^{(m)}\right\} \quad x^{(i)} \in \mathbb{R}$에 대하여 가우시안 분포에 대한 parameter들을 예측하는 것

![image-20201031001855566](https://i.loli.net/2020/10/30/kQxnFt2HiKCVlcI.png)

$$
\mu=\frac{1}{m} \sum_{i=1}^{m} x^{(i)}
$$

$$
\sigma^{2}=\frac{1}{m} \sum_{i=1}^{m}\left(x^{(i)}-\mu\right)^{2}
$$

데이터셋이 너무 적으면, $\frac{1}{m}$에서 $m$ 대신, $m-1$를 사용하기도 한다. 거의 차이가 없음

### Density estimation

학습 데이터: $\left\{x^{(1)}, \ldots, x^{(m)}\right\}$ (Each example is $x \in \mathbb{R}^{n}$) 가 주어졌을 때, $p(x)$를 추정하는 방법
$$
\begin{array}{l}
p(x) \\
=p\left(x_{1} ; \mu_{1}, \sigma_{1}^{2}\right) p\left(x_{2} ; \mu_{2}, \sigma_{2}^{2}\right) p\left(x_{3} ; \mu_{3},  \sigma_{3}^{2}\right) \cdots p\left(x_{n} ; \mu_{n},  \sigma_{n}^{2}\right) \\
=\prod_{i=1}^{n} p\left(x_{j} ; \mu_{j}, \sigma_{j}^{2}\right)
\end{array}
$$

## Anomaly Detection algorithm

1. anomalous의 기준이 된다고 생각하는 features $x_i$를 고른다.

2. parameter 학습 $\mu_{1}, \ldots, \mu_{n}, \sigma_{1}^{2}, \ldots, \sigma_{n}^{2}$

   * $$
     \begin{aligned}
     \mu_{j} &=\frac{1}{m} \sum_{i=1}^{m} x_{j}^{(i)} \\
     \sigma_{j}^{2} &=\frac{1}{m} \sum_{i=1}^{m}\left(x_{j}^{(i)}-\mu_{j}\right)^{2}
     \end{aligned}
     $$

3. 새로운 example $x$가 주어졌을 때, $p(x)$를 계산한다.

   * $$
     p(x)=\prod_{j=1}^{n} p\left(x_{j} ; \mu_{j}, \sigma_{j}^{2}\right)=\prod_{j=1}^{n} \frac{1}{\sqrt{2 \pi} \sigma_{j}} \exp \left(-\frac{\left(x_{j}-\mu_{j}\right)^{2}}{2 \sigma_{j}^{2}}\right)
     $$

4. 만약 $p(x) \lt \varepsilon$ 이면 anomaly이다.

![image-20201031012809984](https://i.loli.net/2020/10/31/5KMr7mgeyHPbDzN.png)

## Evaluating an Anomaly Detection System

Anomaly Detection System을 구성하기 위한 단계

![image-20201031020648666](https://i.loli.net/2020/10/31/SW3cQqs9PAEvBNi.png)

1. 우선 정상적인(not anomalous) 학습 데이터들을 이용하여 $p(x)$를 찾는다.
2. label된 cross validation set 으로 시스템을 평가하여 성적이 좋은 모델만 추려냄
   * $(x_{c v}^{(1)}, y_{c v}^{(1)}), \ldots,(x_{c v}^{(m_{c v})}, y_{c v}^{(m_{c v})})$
3. 마지막으로 test set으로 평가
   * $(x_{\text {test}}^{(1)}, y_{\text {test}}^{(1)}), \ldots,(x_{\text {test}}^{(m_{\text {test}})}, y_{\text {test}}^{(\text {mtest})})$

### 시스템을 평가하는 방법

Accuracy와 같은 평가 방법은 좋지않다. 왜냐하면 cross validation set과 test set의 anomalous 비율이 normal에 비해 매우 작으므로 올바른 성능을 평가하기 힘들기 때문이다.

![image-20201031020403217](https://i.loli.net/2020/10/31/q6NIHOjPRTaus1F.png)

#### 추천하는 evaluation metrics

- True positive, false positive, true negative, false negative

- Precision/Recall

  - $$
    \text { Precision }=\frac{\text {True Positive}}{\text {True Positive }+\text {False Positive}}
    $$

  - $$
    \text {Recall}=\frac{\text {True Positive}}{\text {True Positive }+\text {False Negative}}
    $$

- $F_1$-score

  - $$
    \text { FlScore }=\frac{2}{\frac{1}{\text { Preciston }}+\frac{1}{\text { Recall }}}
    $$

이제 이 metrics들을 통해 threshold $\varepsilon$을 계산할 수 있는데, 그 이유는 높은 성능을 내는 system이 사용한 $\varepsilon$을 찾으면 되기 때문이다.