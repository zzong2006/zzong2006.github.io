---
layout: post
date:   2020-09-30 
title: "Machine Learning: Support Vector Machine (SVM)"
categories: machinelearning
series: 10
---

## Alternative view of logistic regression

* Logistic regression 식을 바꾸는 방식으로 Support Vector Machine(SVM)의 식을 구성할 수 있다.

* activation function이 sigmoid 함수인 logistic regression의 loss function $L$을 생각해보자.

  * $$
    L = -(y\log{h_\theta(x)} + (1-y)\log(1-h_\theta(x))) \\
    $$
    
  * $$
    h_\theta(x)=\frac{1}{1+e^{-\theta^T{x}}}
    $$
  
* 
* 이 함수는 $y=1$의 경우 $h_\theta(x) $는 1에 가까워야 할 것이고, 이는 $\theta^Tx \gg 0$를 만족해야 한다.
  
* 반대로, $y = 0$의 경우 $h_\theta(x)$는 0에 가까워야 할 것이고, 이는 $\theta^Tx \ll 0$을 만족해야 한다.
  
* ![image-20201017142027540](https://i.loli.net/2020/10/17/ZQwpr3gtTiAYeMO.png)
  
* $y$의 두가지 경우에 대해서 $L$의 graph를 다음과 같이 바꿔보자.

  *  $y=1$일 때, $L=-\log(h_\theta(x))$ 를 $cost_1(z)$로 바꾼다 ($z=\theta^Tx$).     
    ![image-20201017142449497](https://i.loli.net/2020/10/17/XLPFVAqBwrS9CQg.png)
  *  $y=0$일 때, $L=-\log(1-h_\theta(x))$ 를 $cost_0(z)$로 바꾼다 ($z=\theta^Tx$).    
    ![image-20201017142458354](https://i.loli.net/2020/10/17/WZVaNSJ4fBFMwx2.png)

* 결과적으로 regularization term까지 포함한 logistic regression의 cost function은 다음과 같이 바뀔 수 있다.

  * Logistic regression

    * $$
    \displaystyle\mathop{\mbox{min}}_\theta\ \frac{1}{m}\left[\sum_{i=1}^{m}y^{(i)}\text{cost}_1(\theta^Tx^{(i)}) + (1-y^{(i)}) \text{cost}_0(\theta^Tx^{(i)})\right]+\frac{\lambda}{2m}\sum_{j=1}^n\theta^2_j
    $$

  * Support Vector Machine

    * 

    $$
    \displaystyle\mathop{\mbox{min}}_\theta\ C\left[\sum_{i=1}^{m}y^{(i)}\text{cost}_1(\theta^Tx^{(i)}) + (1-y^{(i)}) \text{cost}_0(\theta^Tx^{(i)})\right]+\frac{1}{2}\sum_{j=1}^n\theta^2_j
    $$

    * 여기서 $C=\frac{1}{\lambda}$일 경우 Logistic regression의 식과 동일한 최적화 $\theta$값을 가질 것이다. 

## SVM Decision Boundary

* Logistic regression과 마찬가지로, SVM도 $y^{(i)}=1$일 경우와 $y^{(i)}=0$일 경우로 나눠볼 수 있다.

  * SVM의 decision boundary를 다시 살펴보자.
    $$
    \displaystyle\mathop{\mbox{min}}_\theta\ C\left[\sum_{i=1}^{m}y^{(i)}\text{cost}_1(\theta^Tx^{(i)}) + (1-y^{(i)}) \text{cost}_0(\theta^Tx^{(i)})\right]+\frac{1}{2}\sum_{j=1}^n\theta^2_j
    $$

  *  $y^{(i)}=1$ 의 경우는 $\theta^Tx^{(i)} \ge 1$ 를 만족해야 한다 ($cost_1(z)$ 그림 참조).

  *  $y^{(i)}=0$ 의 경우는 $\theta^Tx^{(i)} \le -1$ 를 만족해야 한다 ($cost_0(z)$ 그림 참조).

  * 각각의 경우를 고려하면, SVM 은 아래와 같이 심플하게 표현된다($cost_1(z)$ 또는 $cost_0(z)$가 0이 되므로).

    * $$
      \displaystyle\mathop{\mbox{min}}_\theta\ C*0+\frac{1}{2}\sum_{j=1}^n\theta^2_j = \displaystyle\mathop{\mbox{min}}_\theta\sum_{j=1}^n\theta^2_j
      $$

* 이제 위 식이 무슨 의미를 가지는지 생각해보자.

### Inner product of vector

* 우선, 벡터의 내적에 대해 이해할 필요가 있다.

* 2차원 벡터 $u$와 $v$의 내적은 $v$에서 $u$로 내린 projection $p$의 길이와 $\|u\|$ 값을 곱한것과 같다.

  * $$
    u^T=[u_1, u_2], v^T=[v_1 ,v_2]
    $$

  * ![image-20201017143855025](https://i.loli.net/2020/10/17/DC9VTfaOMpE5W3d.png)

  * $$
    u^Tv=p\cdot||u||=u_1v_1+u_2v_2=v^Tu
    $$

* SVM Decision Boundary도 $\theta$라는 vector와 $x^{(i)}$라는 벡터의 내적이라고 생각할 수 있다.

  * ![image-20201017144249003](https://i.loli.net/2020/10/17/5Zaxcd8TP4qOAsS.png)

  * $$
    \theta^Tx^{(i)}=p^{(i)}\cdot||\theta||=\theta_1x^{(i)}_1+\theta_2x^{(i)}_2
    $$

  * ![image-20201017144421290](https://i.loli.net/2020/10/17/bZ6OBTlKNv1VE27.png)

## Large Margin Intuition

* SVM은 분류된 점에 대해서 가장 가까운 학습 데이터와 가장 먼 거리를 가지는 boundary를 찾는다.
* 만약, 그러지 못한(먼 거리를 가지지 못한) boundary를 가진다면, 어떻게 되는가?
  * ![image-20201017144944717](https://i.loli.net/2020/10/17/Nre5SMko3LYEA7t.png)
  * 위의 그림에서 O와 X는 boundary에 상당히 가깝다. 
  * boundary와 수직인 $\theta$와 각 data들 $x^{(i)}$의 내적을 고려할 경우 $p^{(i)}$ 값은 상당히 작으므로, 올바른 분류를 위해서는 $\|\theta\|$가 커야한다.
    * 올바른 분류란, O와 X를 위해 $p^{(i)} \cdot \|\theta\| \ge 1$ 또는 $p^{(i)} \cdot \|\theta\| \le -1$를 만족해야 하는 것을 의미한다.
  * 그런데, $\|\theta\|$가 커지면, cost function이 커지므로, 이를 최소화 하는 방향으로 boundary를 조정하게 된다.
* 최적의 boundary는 아래와 같이 만들어 진다.
  * ![image-20201017145328233](https://i.loli.net/2020/10/17/Nn9pmXZELHryhW8.png)
  * 위 그림에서 O와 X는 boundary에 충분히 멀다.
  * boundary와 수직인 $\theta$와 각 data들 $x^{(i)}$의 내적을 고려할 경우 $p^{(i)}$ 값은 상당히 크므로, 올바른 분류를 위해서는 $\|\theta\|$가 작아야한다.
  * $\|\theta\|$가 작아지면, cost function도 작아지므로, SVM이 올바르게 학습되는 것을 확인할 수 있다.

## Kernels

* 추가적인 features들을 활용해서 complex non-linear boundary를 구성할 수 있게 도와주는 function
* 대표적으로 gaussian kernel이 있다.

### Gaussian Kernel

* 
* exp(−2*σ*2∥*x*1−*l*(1)∥) 