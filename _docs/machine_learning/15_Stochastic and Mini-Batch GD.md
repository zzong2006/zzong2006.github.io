---
layout: default
title:  "Stochastic and Mini-Batch GD"
category: Machine Learning
order: 16
---

## Stochastic Gradient Descent (SGD)

일반적인 Batch Gradient Descent(BGD)를 이용한 Linear Regression은 다음과 같다.

* 모델

  * $$
    h_\theta(x) = \sum^{n}_{j=0}{\theta_j x_j}
    $$

* 비용 함수

  * $$
    J_\text{train}(\theta) =
    \frac{1}{2m}\sum_{i=1}^{m}{(h_\theta(x^{(i)})-y^{(i)})^2}
    $$

* 학습 방법 (iteration 개수만큼 반복)

* $$
  \quad \theta_j := \theta_j-\alpha \frac{1}{m}\sum_{i=1}^{m} \left( h_\theta\left( x^{(i)} \right) - y^{(i)} \right) x_j^{(i)}
  $$


이 방법의 큰 단점은 $m$이 매우 클 때 (약 300,000,000),  **학습 속도가 느리다**는 것이다.

Batch 라 불리는 이유는 한꺼번에 모든 학습 데이터에 대한 derivative를 계산하기 때문이다.

SGD는 단일 training example에 대한 cost를 정의한다.

* $$
  \textrm{cost}(\theta, (x^{(i)}, y^{(i)}))=\frac{1}{2}(h_\theta(x^{(i)}) - y^{(i)})^2
  $$


이를 이용해 BGD의 비용함수를 정의할 수 있다.

* $$
  J_\mathrm{train}(\theta)=\frac{1}{m}\sum_{i=1}^{m}\mathrm{cost}(\theta, (x^{(i)}, y^{(i)}))
  $$

SGD 수행 방법

1. dataset를 임의로 shuffle한다(섞는다).
   * shuffle의 이유는 데이터 자체가 특정한 structure를 가질 수 있기 때문이다(e.g. 시간 순서).
   * 편향되지 않은 데이터에 대한 true gradient를 얻기 위해서 데이터를 섞어줘야한다.
2. **각 training example**에 대하여 model의 모든 features를 업데이트 한다. 즉,             
   ![image-20201018172431535](https://i.loli.net/2020/10/18/PjsdN2oHkIyuGJC.png)
3. 이 역시도 (2)를 iteration 개수만큼 반복한다.


## Mini-Batch Gradient Descent

Mini-batch GD: Use $b$ examples in each iteration where $b<m$ is the mini-batch size (e.g. $b=10$ and $m=100$)
* Batch GD: Use all $m$ examples in each iteration
* Stochastic GD: Use $1$ example in each iteration

![image-20201018174133889](https://i.loli.net/2020/10/18/6TQ7IVo4YRJBcuv.png)

## Stochastic Gradient Descent Convergence

Batch gradient descent가 converge하는 것을 확인하기 위해서는 비용함수 $J_{train}(\theta)$의 값을 GD를 수행할 때마다 그려주면 되었다.

하지만 training example $m$이 매우 큰 상황이라면, SGD를 사용할 것이고, 이것이 올바르게 수렴하는지 확인하는 방법 다음과 같다.

* 우선, SGD 과정에서 $\theta$를 업데이트 하기 전에, $cost(\theta, (x^{(i)},y^{(i)}))$를 계산한다.

* $$
  \text{cost}(\theta, (x^{(i)}, y^{(i)})) = \frac{1}{2}(h_\theta(x^{(i)})-y^{(i)})^2
  $$

* 그리고, 1000 iterations 마다, 지금까지 계산한 $cost(\theta, (x^{(i)},y^{(i)}))$중 마지막 1,000개의 training example에 대한 평균을 plotting 한다.

  * 여기서 1000은 임의의 숫자다. 다른 값으로 정해도 상관없음
  * ![image-20201018175915168](https://i.loli.net/2020/10/18/WsJ8ORkF7Na4CnX.png)
  * 위 cost graph에서 파란색은 1000개의 training examples에 대한 plotting, 초록색은 5000개에 대한 plotting을 나타냄 (많은 samples의 개수가 더 smooth하게 converge 한다.)
  * ![image-20201018180218405](https://i.loli.net/2020/10/18/rQ7nNeyAfXC82Vk.png)
  * cost가 역으로 증가하면 learning rate $\alpha$ 값을 증가시킨다. 



 