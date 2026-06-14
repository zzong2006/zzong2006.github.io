---
title: "Generative Adversarial Network"
tags: ["deep_learning", "generative_model"]
aliases: ["GAN"]
---

# A) GAN ?

Generative Adversarial Network 의 [[RL/value function]]  

$$
\displaystyle\min_{G}\max_{D}V(D,G)=\mathbb{E}_{x\sim\operatorname{P_{data(x)}}}[\log D(x)]+\mathbb{E}_{z\sim P_z(z)}[\log(1-D(G(z)))]
$$

[[cross-entropy]] 를 활용한 [[RL/value function]] 이다.

## A.1) Notations

* $y=1$ 은 실제 데이터, $y=0$ 은 fake 데이터
* $D(x)$ 는 실제 데이터 $x$ 에 대한 discriminator 의 예측 확률 값 (fake or not)
* $G(z)$ 는 generator 가 만들어낸 fake 데이터
* 일반적으로 [[Gaussian distribution]] 에 의거한 noise $z$ 를 통해 fake 데이터를 생성한다.  
* $D(G(z))$ 는 fake 데이터에 대한 discriminator 의 예측 확률 값 (fake or not)

# B) Discriminator 입장에서 Value Function 바라보기

Discriminator $D$ 는 [[RL/value function]] 을 최대화 시켜야 한다.

만약 $D$ 가 아주 잘 분류한다면, $D(x)=1,D(G(z))=0$ 을 만족할 것이고, [[RL/value function]] 은 $0$ 이 될 것이다.  
근데 $0$ 이 [[RL/value function]] 에서 최댓값인 이유는 log 함수를 그려보면 알 수 있다.  

![Logarithm - Wikipedia| 400](https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Binary_logarithm_plot_with_ticks.svg/300px-Binary_logarithm_plot_with_ticks.svg.png)  

* $D$ 는 확률을 예측하기 때문에 반드시 0 에서 1 사이의 값을 출력한다 ([[sigmoid function]]).  
* 1 보다 낮은 값을 log 로 계산하게 되면 음의 값이 나오므로, $0$ 이 [[RL/value function]] 에서 가능한 최댓값이다.  
	* Generator 입장에서 [[RL/value function]] 바라보기  
		* Generator $G$ 는 [[RL/value function]] 을 최소화 시켜야 한다.  
		* 만약 $G$ 가 아주 잘 생성한다면, $D(x)=0,D(G(z))=1$ 을 만족할 것이고, [[RL/value function]] 은 $-\infty$ 가 될 것이다.  
		* $D$ 의 입장과 반대로 $G$ 는 가능한 최솟값을 이루는 것이다.

# C) Related

# D) References
