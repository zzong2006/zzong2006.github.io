---
title: "K-means"
tags: ["machine_learning", "clustering"]
aliases: ["k-means clustering"]
---

# A) K-means ?

## A.1) 시간 복잡도

 $$
 O(kNrD)
 
$$

* $k$ : 클러스터 개수 (사용자에 의해 정의됨)
* $N$ : 객체 개수
* $r$: 수렴할때 까지 반복한 iteration 횟수
* $D$ : 객체의 차원 수 (window 를 이용한 clustering 의 경우, window 길이)

## A.2) Optimization Object

k-means clustering 도 cost function([[distortion]]) 이 존재한다. 해당 cost function 을 minimizing 하는 것이 K-means clustering 의 목적이다.

$$
\displaystyle J(c^{(1)},\cdots,c^{(m)},\mu_1,\cdots,\mu_k)=\frac{1}{m}\sum^m_{i=1}||x^{(i)}-\mu_{c}(i)||^2
$$

cost function 값은 K 가 증가할수록, 항상 감소한다. 만약, K 가 증가했는데 이전보다 cost 가 증가할 경우, 그것은 local minima 에 빠진 것이기 때문에 center 를 초기화한다.

# B) Center Initialization

## B.1) Random

$K<m$ 인 경우 전체 $m$ 개의 데이터 중 distinct 한 random data 를 center 로 선택

Center 를 어떻게 초기화하냐에 따라서 cluster 의 결과가 달라질 수 있음

* Local optima
* 여러번 random initializing 을 수행해서 최적의 solution 을 찾음

Choosing the Number of Clusters: [[Elbow Method]]

## B.2) K-means++

center 초기값 선택 알고리즘이다.

1. 처음의 임의의 데이터 하나를 중심으로 선택
2. 선택한 중심과 데이터의 가장 가까운 거리 $D(x)$ 를 찾고, $D(x)^2$ 에 비례한 거리에 위치해 있는 데이터 중 확률 분포에 기반하여 임의의 데이터를 뽑아 중심점으로 추가
3. 2 를 K 개의 중심을 찾을 때까지 반복

# C) EM Algorithm 과의 관계

K-means 알고리즘은 [[machine_learning/optimization/EM algorithm|EM]] 알고리즘의 간단한 버전이라고 볼 수 있다.

* Expectation: The first step is to assign a cluster to every point, which is the **E** step of EM algorithm.
	* Expectation of the log-likelihood given the parameters.
* Maximization: the second step is to update the center of each cluster, which is the **M** step of EM algorithm.
	* Maximization of the parameters with respect to the log-likelihood.

## C.1) K-means 동작 방식의 원리

K-means 에서는 centroid 들의 좌표를 계산할 때, assign 된 data point 들의 평균값으로 centroid 를 정한다. 왜 그럴까?

다음과 같은 log-likelihood 가 있다고 가정하자.

$$
\displaystyle J=\sum_{n=1}^{N}\sum_{k=1}^{K}r_{nk}\left\|x_{n}-\mu_{k}\right\|^{2}
$$

위 수식에서 $\mu_k$ 는 $k$ 번째 클러스터의 중심 좌표, $r_{nk}$ 는 $k$ 번째 클러스터에 속하는지의 여부를 나타내는 $n$ 번째 data point: $r_{nk}\in(0,1)$ 를 의미한다.

EM algorithm 에 따라서 log-likelihood 를 최대화 하는 방향으로 parameters(centroids) $\mu_k$ 를 정해야 하므로, $J$ 를 미분하면 다음과 같다.

$$
\begin{aligned}\frac{dJ}{d\mu_{k}}&=\frac{d}{d\mu_{k}}\sum_{n=1}^{N}\sum_{k=1}^{K}r_{nk}\left\|x_{n}-\mu_{k}\right\|^{2}\\&=\frac{d}{d\mu_{k}}\sum_{n=1}^{N}r_{nk}\left\|x_{n}-\mu_{k}\right\|^{2}=\sum_{n=1}^{N}-2r_{nk}\left(x_{n}-\mu_{k}\right)\\&=-2\left(-\sum_{n=1}^{N}r_{nk}\mu_{k}+\sum_{n=1}^{N}r_{nk}x_{n}\right)=0\end{aligned}
$$

중간에 $\sum_{k=1}^{K}$ 값이 사라지는 이유는 $\mu_k$ 에 대해서 미분하므로, $k$ 와 관련없는 값은 상수로 사라지기 때문이다. 즉, $k=1\sim K$ 까지 값을 대입하므로, $k$ 와 더이상 관련이 없는 상수가 된다.

최종적으로 $\displaystyle\mu_{k}=\frac{\sum_{n=1}^{N}r_{nk}x_{n}}{\sum_{n=1}^{N}r_{nk}}$ 가 되는데, 이 식을 자세히보면 centroid 는 $k$ 번째 cluster 에 속하는 모든 data point 들의 평균을 의미한다.

# D) Related

# E) References
