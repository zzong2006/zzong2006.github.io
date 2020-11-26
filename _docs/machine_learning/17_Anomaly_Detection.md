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

학습 데이터: $$\left\{x^{(1)}, \ldots, x^{(m)}\right\}$$ (Each example is $x \in \mathbb{R}^{n}$) 가 주어졌을 때, $p(x)$를 추정하는 방법

$$
\begin{array}{l}
p(x) \\
=p\left(x_{1} ; \mu_{1}, \sigma_{1}^{2}\right) p\left(x_{2} ; \mu_{2}, \sigma_{2}^{2}\right) p\left(x_{3} ; \mu_{3},  \sigma_{3}^{2}\right) \cdots p\left(x_{n} ; \mu_{n},  \sigma_{n}^{2}\right) \\
=\prod_{i=1}^{n} p\left(x_{j} ; \mu_{j}, \sigma_{j}^{2}\right)
\end{array}
$$



## Anomaly Detection algorithm

1. anomalous의 기준이 된다고 생각하는 features $x_i$를 고른다.

2. parameter 학습(계산) $\mu_{1}, \ldots, \mu_{n}, \sigma_{1}^{2}, \ldots, \sigma_{n}^{2}$


$$
\begin{aligned}
\mu_{j} &=\frac{1}{m} \sum_{i=1}^{m} x_{j}^{(i)} \\
\sigma_{j}^{2} &=\frac{1}{m} \sum_{i=1}^{m}\left(x_{j}^{(i)}-\mu_{j}\right)^{2}
\end{aligned}
$$

3. 새로운 example $x$가 주어졌을 때, $p(x)$를 계산한다.

$$
p(x)=\prod_{j=1}^{n} p\left(x_{j} ; \mu_{j}, \sigma_{j}^{2}\right)=\prod_{j=1}^{n} \frac{1}{\sqrt{2 \pi} \sigma_{j}} \exp \left(-\frac{\left(x_{j}-\mu_{j}\right)^{2}}{2 \sigma_{j}^{2}}\right)
$$

4. 만약 $p(x) \lt \varepsilon$ 이면 anomaly이다.

<img src="https://i.loli.net/2020/10/31/5KMr7mgeyHPbDzN.png" alt="image-20201031012809984" style="zoom: 67%;" />

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

## Anomaly Detection vs Supervised Learning

Anomaly Detection 

* positive examples 에 대한 데이터 수가 매우 작고, negative examples이 매우 많을 경우
  * positive 는 normal 현상, negative 는 anomalous 현상

Supervised Learning

* positive 와 negative 둘 다 데이터 수가 충분히 많을 때

세상에는 매우 많은 종류의 anomalies가 존재한다. 모델이 학습한 데이터에 대한 anomalies는 이후 anomalies와 많이 다를 수 있다.

## Choosing What Features to Use

gaussian 분포가 아닌 데이터를 gaussian 분포 형태로 맞추는 방법

* $log$, $sqrt$ 등 ..

![image-20201102182312443](https://i.loli.net/2020/11/02/cCNxkbQy1OnhrIL.png)

### Error analysis for anomaly detection

normal examples이 많고, anomalous examples들은 적을 때, anomaly 데이터인데도 불구하고 normal로 처리해버리는 모델들이 있다.

그럴 때는 새로운 feature들을 추가해서 detection의 성능을 증가시킨다.

![image-20201102182440640](https://i.loli.net/2020/11/02/4Xgvlm8nZOKYCpx.png)

## Multivariate Gaussian Distribution

각 차원에 대한 개별적인 gaussian distribution model을 만드는 것은 좋지 않다. 

![image-20201102221326007](https://i.loli.net/2020/11/02/XSfL53n1RIhd2D7.png)

* 위 그림에서 왼쪽 위에 있는 x 표시의 example은 2차원에서는 anomaly인데도 불구하고, 각 $x_1$ 과 $x_2$ 에서는 normal example로 분류된다.

Multivariate Gaussian Normal distribution은 모든 차원의 gaussian model을 하나로 관리한다.

![image-20201102221555439](https://i.loli.net/2020/11/02/9jFdQYkGOuVXJy3.png)

얻어진 $\mu$와 $\Sigma$는 값에 따라 아래 그림과 같은 모양을 가진다.

![image-20201102221650885](https://i.loli.net/2020/11/02/8K3o7thTMc4DeOL.png)

![image-20201102221700839](https://i.loli.net/2020/11/02/OrV4tW8YKbNdZLx.png)

### Anomaly Detection using the Multivariate Gaussian Distribution

Multivariate Gaussian Distribution 를 이용해서 anomaly detection을 수행하는 방법에 대해서 알아보자.

1. model $p(x)$를 fit 한다.

$$
\begin{aligned}
\mu &=\frac{1}{m} \sum_{i=1}^{m} x^{(i)} \\
\Sigma &=\frac{1}{m} \sum_{i=1}^{m}\left(x^{(i)}-\mu\right)\left(x^{(i)}-\mu\right)^{T}
\end{aligned}
$$

2. 새로운 $x$가 입력되면, 다음을 계산한다.

$$
p(x)=\frac{1}{(2 \pi)^{\frac{n}{2}}|\Sigma|^{\frac{1}{2}}} \exp \left(-\frac{1}{2}(x-\mu)^{T} \Sigma^{-1}(x-\mu)\right)
$$

3. 만약 $p(x) \lt \varepsilon$을 만족하면, anomaly이다.

### Relationship to original model

사실 기존의 방식과 비교하면, 여러 모델의 확률을 곱한 것과 비슷하다.

$$
p(x)=p\left(x_{1} ; \mu_{1}\sigma_{1}^{2}) \times p\left(x_{2} ; \mu_{2},\sigma_{2}^{2}) \times \cdots \times p\left(x_{n} ; \mu_{n}, \sigma_{n}^{2}\right)\right.\right.
$$
완전히 같은 경우는, 공분산 행렬 $\Sigma$을 구했을 때, 대각선 성분 외에 나머지가 0인 경우다.(완전히 차원 간 linear independent한 경우)

![image-20201102225108211](https://i.loli.net/2020/11/02/gyuNdfj8c42nQOx.png)



| Original Model                                               | Multivariate Gaussian                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| $p\left(x_{1} ; \mu_{1}, \sigma_{1}^{2}\right) \times \cdots \times p\left(x_{n} ; \mu_{n}, \sigma_{n}^{2}\right)$ | ![image-20201102225237204](https://i.loli.net/2020/11/02/aw6pZCDxUBIfOec.png) |
| anomaly를 효과적으로 잡아내기 위해서, 수동으로 feature를 만들어내야 함 | 공분산 행렬을 구함으로써, 자동으로 feature 간 관계를 찾아낼 수 있음 |
| 낮은 복잡도                                                  | 높은 복잡도 (공분산 행렬 계산)                               |
| training set size $m$이 적어도 괜찮음                        | 공분산 행렬의 역행렬을 계산해야 하기 때문에, $m > n$을 반드시 만족해야하며, feature 간 linear indepence 한 경우에도 $\Sigma$ 의 역행렬이 존재하지 않을 수 있음 |

