---
title: "Embarrassingly Shallow Autoencoders for Sparse Data"
aliases: ["EASE"]
tags:
  - WWW
  - deep_learning
  - linear_regression
  - paper_review
  - y2019
---

# Abstract

이 논문에서는 추천 시스템에서 sparse data 를 linear model 로 학습하는 방안을 제시했다. 학습에 사용한 training objective 는 closed-form solution 으로 표현될 수 있다. 실험 결과 SOTA CF 방식보다 더 나은 ranking accuracy 를 보였다. 여기서 CF 방식은 deep non-linear model 도 포함한다.

# Introduction

추천 영역에서는 hidden layer 의 개수가 작은 경우에 오히려 추천 accuracy 성능이 높았다. 이러한 결과에 영감을 받아서, 논문에서는 hidden layer 가 존재하지 않는 linear model 을 고안했다.

해당 모델은 [[autoencoder|오토인코더]] 의 학습 방식을 보인다. 즉, 유저가 아이템을 선택했는지 안했는지 여부를 보이는 이진 데이터를 입력으로 받고, output 은 이를 reproduce 하게 학습한다. 그래서 이 논문에서 제안된 모델은 Embarrassingly Shallow AutoEncoder (거꾸로 EASE 라고 부름)

# 모델

## (1) 모델 정의

모델은 sparse matrix $X \in \mathbb{R}^{|\mathcal{U}| \times|\mathcal{I}|}$ 를 입력 데이터로 받는다. 그리고 weight matrix $B \in \mathbb{R}^{|\mathcal{I}| \times|\mathcal{I}|}$ 를 학습시키는데 목적을 둔다. 이는 이웃 기반 (neighborhood-based) 접근 방식과 유사하다.

$B$ 는 $\operatorname{diag}(B)=0$ 와 같은 제약 조건이 붙는다. 그 이유는 오토인코더 학습에서 $B=I$ 와 같은 trivial solution 으로 수렴하는 것을 막기 위해서다. 이러한 제약 조건은 [[SLIM - Sparse Linear Methods for Top-N Recommender Systems|SLIM]] 에서도 명시되어 있으며, 핵심적인 내용이다.

사용자 $u \in \mathcal{U}$ 에 대한 item $j \in \mathcal{I}$ 의 predicted score 는 다음과 같이 [[dot product]] 로 계산할 수 있다.

$$
S_{u j}=X_{u, \cdot \cdot} \cdot B \cdot, j
$$

여기서 $X_{u,}$ 는 row $u$ 이고, $B \cdot, j$ 는 column $j$ 이다.

## (2) 모델 학습

$B$ 를 학습 시키기 위한 [[convex function|convex]] objective 는 다음과 같다.

$$
\begin{array}{cc}\min _{B} & \|X-X B\|_{F}^{2}+\lambda \cdot\|B\|_{F}^{2} \\ \text { s.t. } & \operatorname{diag}(B)=0\end{array}
$$

### Closed-Form Solution

[[Lagrange multiplier method]] 를 활용하여 $\operatorname{diag}(B)=0$ 제한을 수식에 포함시킬 수 있다.

$$
L=\|X-X B\|_{F}^{2}+\lambda \cdot\|B\|_{F}^{2}+2 \cdot \gamma^{\top} \cdot \operatorname{diag}(B)
$$

여기서 벡터 $\gamma=\left(\gamma_{1}, \ldots, \gamma_{\mid I} \mid\right)^{\top}$ 는 라그랑지안 multipliers 를 의미한다.

$L$ 값을 최소화하기 위해서 미분 값을 0 으로 두면 weight matrix 추정값 $\hat{B}$ 은 다음과 같이 표현된다.

$$
\hat{B}=\left(X^{\top} X+\lambda I\right)^{-1} \cdot\left(X^{\top} X-\operatorname{diagMat}(\gamma)\right)
$$

여기서 diagMat 은 대각 행렬이라는 의미다.

$\hat{P} \triangleq\left(X^{\top} X+\lambda I\right)^{-1}$ 로 가정할 경우, 아래와 같이 정리할 수 있다.

$$
\begin{aligned} \hat{B} &=\left(X^{\top} X+\lambda I\right)^{-1} \cdot\left(X^{\top} X-\operatorname{diagMat}(\gamma)\right) \\ &=\hat{P} \cdot\left(\hat{P}^{-1}-\lambda I-\operatorname{diagMat}(\gamma)\right) \\ &=I-\hat{P} \cdot(\lambda I+\operatorname{diagMat}(\gamma)) \\ &=I-\hat{P} \cdot \operatorname{diagMat}(\tilde{\gamma}) \end{aligned}
$$

마지막 줄의 vector $\tilde{\gamma}$ 는 $\tilde{\gamma} \triangleq \lambda \overrightarrow{1}+\gamma$ 이다 ($\overrightarrow{1}$ 는 one vector).

이제 $\operatorname{diag}(\hat{B})=0$ 의 제한 조건을 위 마지막 수식에 대입하면 다음과 같이 표현할 수 있다.

$$
0=\operatorname{diag}(\hat{B})=\overrightarrow{1}-\operatorname{diag}(\hat{P}) \odot \tilde{\gamma}
$$

여기서 $\odot$ 는 [[Hadmard product]] 이고, 위 수식을 풀면 $\tilde{\gamma}=\overrightarrow{1} \oslash \operatorname{diag}(\hat{P})$ 로 표현된다. 결과적으로 다음과 같은 closed-form 해를 얻는다.

$$
\hat{B}=I-\hat{P} \cdot \operatorname{diagMat}(\overrightarrow{1} \oslash \operatorname{diag}(\hat{P}))
$$

정리하면, 학습된 가중치는 다음과 같이 표현할 수 있다.

$$
\hat{B}_{i, j}= \begin{cases}0 & \text { if } i=j \\ -\frac{\hat{P}_{i j}}{\hat{P}_{j j}} & \text { otherwise. }\end{cases}
$$

$\hat{P}$ 나 $B$ 를 구하려는 수식을 보면 item-item 행렬인 [[Gram matrix]] $G \triangleq X^{\top} X$ 로 부터 계산되어 진다는 것을 확인할 수 있다. $X$ 가 sparse binary matrix 라면, $G$ 는 사실상 co-occurrence matrix 이며, $G_{i j}$ (co-occurence count) 의 불확실 정도는 [[Poisson distribution]] 의 [[standard deviation]] $\sqrt{G_{i j}}$ 를 따른다. 결과적으로 $G_{i j}$ 값이 충분히 커진다면 $G$ 와 $B$ 의 추정값의 에러는 작아질 것이다.

흥미로운 사실은 $G$ 의 원소값은 다음과 같은 두 요소에 의해서 커질 수 있다 (불확실 정도 감소): (1) $X$ 가 dense 할 경우 (2) $X$ 에 포함된 유저가 많을 경우. 특히 (2) 의 경우는 상당히 유용한데, 개개인의 상호작용이 작을지어라도 유저 수가 충분히 많다면 $B$ 의 추정값에 대한 불확실 정도에는 영향을 미치지 않는다는 것이다.

## (3) Algorithm

이 논문은 특이하게 numpy 로 구성된 Python 알고리즘을 적어놨다.

입력값이 $X$ 가 아니라 $G=X^{\top} X$ 을 입력으로 받는다. 그래서 대용량 데이터의 경우도 전처리를 통해서 계산 비용을 아낄 수 있다 (입력 데이터 사이즈가 $|\mathcal{I}| \times|\mathcal{I}|$ 이므로).

![|560](https://i.imgur.com/UX6Ze4y.png)

## (4) 계산 비용

Gram matrix 의 역행렬 계산으로 $\mathcal{O}\left(|\mathcal{I}|^{3}\right)$ 의 계산 비용이 발생한다. 여기서 Coppersmith-Winograd 알고리즘을 사용하면 $O\left(|\mathcal{I}|^{2.376}\right)$ 의 계산비용이 발생한다.

# References

* [Embarrassingly Shallow Autoencoders for Sparse Data 모델이 희소 데이터에 강한 이유](https://glanceyes.tistory.com/entry/Embarrassingly-Shallow-Autoencoders-for-Sparse-Data-%EB%AA%A8%EB%8D%B8%EC%9D%B4-%ED%9D%AC%EC%86%8C-%EB%8D%B0%EC%9D%B4%ED%84%B0%EC%97%90-%EA%B0%95%ED%95%9C-%EC%9D%B4%EC%9C%A0)
