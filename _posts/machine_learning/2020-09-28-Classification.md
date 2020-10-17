---
layout: post
date:   2020-09-28 11:50:00
title: "Classification"
categories: machinelearning
series: 6
---

# Classification and Representation

* 일반적인 분류 문제: $y \in \{0,1\}$ ($0$ 은 Negative Class, $1$은 Positive Class)

  * E-mail: 스팸 yes or no?
  * 온라인 거래: 사기 yes or no?
  * Tumor: 양성 or 음성?

* Linear Regression 으로는 위 분류 문제들을 풀어내기가 힘들다.   
  아래의 그림의 경우 linear model $h_\theta(x)=\theta^Tx$가 magenta 색에서 잘 분리하는 듯 보였지만, outlier의 등장에 취약한 모습을 보인다.  
  ![image-20200929000946847](https://i.loli.net/2020/09/28/HY9mdTgvWO8p6lB.png)

* 분류 문제를 해결하는 모델을 logistic regression model 이라고 하는데, 이 모델 $h_\theta(x)$는 linear model을 non-linear model로 바꾼것과 같다.   
  $$
  \begin{align*}& h_\theta (x) = g ( \theta^T x ) \newline \newline& z = \theta^T x \newline& g(z) = \dfrac{1}{1 + e^{-z}}\end{align*}
  $$
  
  위에서 $g(z)$ 를 sigmoid function 또는 logistic function 이라고 부른다.
  
* Sigmoid function은 다음과 같이 생겼다. 약 -4.5 이하로는 무조건 0을, 4.5 이상으로는 무조건 1의 값을 가진다.  
    ![img](https://i.loli.net/2020/09/28/U5eOaNMiSQZd3IH.png)
  
* 이러한 값의 분포 ($0 \le h_\theta(x)\le 1$)를 보고 생각해보면,  $ h_\theta(x)$는 입력에 대한 최종 결정이 $1$일 확률을 정해주는 것이라고 생각할 수 있다.

  * 예를 들어, 최상단의 종양 그래프에서 $ h_\theta(x) = 0.7$ 이면, 종양이 양성($1$)일 확률이 70%나 된다는 것이다.

  * 이것을 조건부 확률로 표현하면 다음과 같다. $0$이 될 확률과 $1$이 될 확률을 합치면 1의 값이 된다.       
    $$
    \begin{align*}& h_\theta(x) = P(y=1 | x ; \theta) = 1 - P(y=0 | x ; \theta) \newline& P(y = 0 | x;\theta) + P(y = 1 | x ; \theta) = 1\end{align*}
    $$
    

### Decision boundary

* Decision boundary는 $y$가 0인지 1인지 결정하는 영역을 나누는 선이다.

* 모델 $h_\theta(x)$이 가지는 값의 의미를 정확히 판단하기 위해서, 다음과 같은 규칙을 정했다고 하자.   
  $$
  \begin{align*}& h_\theta(x) \geq 0.5 \rightarrow y = 1 \newline& h_\theta(x) < 0.5 \rightarrow y = 0 \newline\end{align*}
  $$

  * 위의 식에 사용된 모델은 언급 했다시피 sigmoid function $g(z)$를 사용한다. 그래서, $h_\theta(x) \ge 0.5$ 라는 의미는 다음과 같다.     
    $$
    \begin{align*}& g(z) \geq 0.5 \newline& when \; z \geq 0\end{align*}
    $$

    * 왜 $z \ge 0$ 인가? 그 이유는 식 $g(z) = \dfrac{1}{1 + e^{-z}}$ 에서 찾을 수 있다.   
      $$
      \begin{align*}z=0, e^{0}=1 \Rightarrow g(z)=\dfrac{1}{1 + e^{0}}=1/2\newline z \to \infty, e^{-\infty} \to 0 \Rightarrow g(z)=\dfrac{1}{1 + e^{-\infty}}=1 \newline z \to -\infty, e^{\infty}\to \infty \Rightarrow g(z)=\dfrac{1}{1 + e^{\infty}}=0 \end{align*}
      $$

  * 다시 $h_\theta(x) \ge 0.5$ 라는 의미를 해석해보자.   
    $$
    \begin{align*}& h_\theta(x) = g(\theta^T x) \geq 0.5 \newline& when \quad \theta^T x \geq 0 \; \text{,which means that..} \newline &
    \
    \theta^T x \geq 0 \Rightarrow y = 1 \newline&
    \theta^T x < 0 \Rightarrow y = 0 \newline &
    \end{align*}
    $$
  
* 위와 같은 이해를 기반으로, 다음과 같은 decision boundary를 생각해볼 수 있다.

  * Predict $y=1$ if $h_\theta(x)= g(\theta_0 + \theta_1x_1+\theta_2x_2) \ge 0.5 \Rightarrow -3+x_1+x_2 \ge 0$   
    ($\theta_0 = -3, \theta_1 = 1, \theta_2 =1$)   
    ![image-20200929003231626](https://i.loli.net/2020/09/28/9yp8qukCSBZLmXE.png)
  * Predict $y=1$ if $h_\theta(x)= g(\theta_0 + \theta_1x_1+\theta_2x_2+\theta_3x_2^2+\theta_4x_2^2) \ge 0.5 \Rightarrow -1+x_1^2+x_2^2 \ge 0$   
    ($\theta_0 = -1, \theta_1 = 0, \theta_2 =0, \theta_3=1, \theta_4=1$)  
    ![image-20200929003459783](https://i.loli.net/2020/09/28/Fru7E8caqKbx13L.png)

# Logistic Regression Model

* 이제 logistic regression model을 파악했으니, 이 모델의 비용 함수(cost function)에 대해 생각해보자.
  * Cost function과 loss function의 차이점?
    * Loss function은 단일 training example에 대한 prediction과 ground truth값의 차이를 의미하고, Cost function은 모든 training examples들에 대한 loss function 의 평균 값을 의미한다.
    * 