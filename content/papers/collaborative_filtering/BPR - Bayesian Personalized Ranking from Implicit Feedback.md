---
title: "BPR - Bayesian Personalized Ranking from Implicit Feedback"
tags: ["BPR", "MF", "implicit_feedback", "collaborative_filtering", "paper_review", "recommendation_system"]
---

# A) Abstract

* Item recommendation 문제를 풀기 위한 기존 방식들: [[matrix factorization]], adaptive-[[k-Nearest Neighbors]] 등은 ranking 을 위한 optimzation 에 바로 사용되지 못하고 있음
* 해당 논문에서는 개인화 랭킹을 위한 최적화 기준인 BPR-Opt 를 제시 ([[maximum a posteriori probability|MAP]] 활용)
	* 또한, BPR-Opt 에 관련된 모델을 학습하는 알고리즘 LearnBPR 도 제시
* 기존 방식들 (MF, kNN) 에 LearnBPR 을 적용하는 사례를 보임
	* Pointwise approaches considers a single interaction at a time and train a classifier or a regressor to predict individual preferences.

# B) Introduction

BPR-Opt 를 최적화 하는것은 [[ROC Curve]] 의 넓이를 최대화 하는것과 같다.

LearnBPR 알고리즘 제시: bootstrap sampling (of training triples) 을 이용한 [[stochastic gradient descent]] 기반의 방법

# C) Related Works

SVD 를 통한 MF 는 [[overfitting]] 에 취약하다는 문제점이 있다. 이를 해결하기 위해 a regularized least-square optimization with case weights (WR-MF) 를 제안한다.

해당 논문은 offline learning 을 메인으로 다룬다.

## C.1) Personalized Ranking

이 논문은 implicit feedback 으로 부터 ranking 추론이 진행된다는 시나리오를 가정한다.

이 implicit feedback 은 오직 positive feedback 만 있다고 주장 (그 외에는 관찰되지 않은 user-item pair)

# D) Formalization

$(U\times I)$ 크기의 implicit matrix $S$ 대신, item 간 사용자 선호도를 표현할 수 있는 matrix 를 사용자마다 만든다. 즉, 전체 training dataset $D_{S}$ 은 $U\times I\times I$ 의 크기를 가진다.

$$
D_{S}:=\left\{(u,i,j)\mid i\in I_{u}^{+}\wedge j \in I \backslash I_{u}^{+}\right\}
$$

* $(u,i,j)\in D_{S}$ 의 의미는 $u$ 는 $i$ 를 $j$ 보다 선호한다는 의미를 가짐

## D.1) $S$ -> $D_{S}$ Figure

![[img-946376ea41.png||400]]
이렇게 하면, 단순히 특정 유저가 implicit feedback (click) 이 없다고 해서 전체가 모두 negative feedback 로 처리되는 것을 막을 수 있음

# E) Bayesian Personalized Ranking (BPR) Loss

베이지안 관점에서 모든 아이템 $i\in I$ 에 대해서 올바른 랭킹을 찾는 것은 다음과 같은 [[posterior]] 확률을 최대화 하는 것과 같다

$$
p\left(\Theta\mid>{}_{u}\right)\propto p\left(>{}_{u}\mid\Theta\right)p(\Theta)
$$

$\Theta$ 는 임의의 추천 모델의 parameter 를 의미하고, $>_u$ 는 사용자 $u$ 에 대한 전체 아이템의 적절한 개인화된 랭킹 결과를 의미한다. prior $p(\Theta)$ 는 평균이 0 이고 분산은 $\Sigma_{\Theta}$ 라는 convariance matrix 를 가지는 [[Gaussian distribution|normal distribution]] 이다. 분산 행렬의 경우 간단히 $\Sigma_{\Theta}=\lambda_{\Theta} I$ 로 표현할 수 있다.

위 식을 개인화 추천을 위한 일반적인 최적화 식으로 바꾸면 아래와 같다.

$$
\begin{aligned} \mathrm{BPR-OPT}: & =\ln p\left(\Theta \mid>_u\right) \\ & =\ln p\left(>_u \mid \Theta\right) p(\Theta) \\ & =\ln \prod_{(u, i, j \in D)} \sigma\left(\hat{y}_{u i}-\hat{y}_{u j}\right) p(\Theta) \\ & =\sum_{(u, i, j \in D)} \ln \sigma\left(\hat{y}_{u i}-\hat{y}_{u j}\right)+\ln p(\Theta) \\ & =\sum_{(u, i, j \in D)} \ln \sigma\left(\hat{y}_{u i}-\hat{y}_{u j}\right)-\lambda_{\Theta}\|\Theta\|^2\end{aligned}
$$

위에서 $D:=\left\{(u, i, j) \mid i \in I_u^{+} \wedge j \in I \backslash I_u^{+}\right\}$ 는 학습 데이터이고, $i$ 는 유저 $u$ 가 좋아하는 아이템, $j$ 는 좋아하는 아이템은 아닌 아이템을 의미한다 (싫어한다는 의미는 아니다).
만약, BPR 이 최적화되었다면, 유저가 아이템 $i$ 에 대한 평가가 $\hat{y}_{u i}$ 당연히 $j$ 에 대한 평가 $\hat{y}_{u j}$ 보다는 높게 나와야 할것이다. 결과적으로 위의 BPR 식은 점점 최대화가 되는 것이다.

# F) Implementation

mxnet 으로 구현한 BPR loss 가 있어서 가져왔다. 읽는데 라이브러리의 영향은 없다. [[regularization]] 부분은 제외된듯.

```python
class BPRLoss(gluon.loss.Loss): 
   def __init__(self, weight=None, batch_axis=0, **kwargs):  
      super(BPRLoss, self).__init__(weight=None, batch_axis=0, **kwargs)
      
   def forward(self, positive, negative): 
      distances = positive - negative 
      loss = - np.sum(np.log(npx.sigmoid(distances)), 0, keepdims=True) 
      return loss
```

## F.1) Using Hinge Loss

[[hinge loss]] 를 이용해서 BPR loss 를 구현해도 비슷한 효과를 얻을 수 있다.

$$
\sum_{(u, i, j \in D)}\left(\max \left(m-\hat{y}_{u i}+\hat{y}_{u j}\right), 0\right)
$$

여기서 $m$ 은 margin size 라고 한다. 위 식을 최소화하는 방향으로 생각하면 positive item 은 가까워지고, negative item 은 서로 밀어내려한다.

구현은 간단하다.

```python
def forward(self, positive, negative, margin=1): 
   distances = positive - negative 
   loss = np.sum(np.maximum(- distances + margin, 0)) return loss
   return loss
```

# G) Related

[[personalized ranking model]]

# H) References

* [recommenders-dive.pdf](https://bjpcjp.github.io/pdfs/math/recommenders-dive.pdf)
* Paper: https://arxiv.org/ftp/arxiv/papers/1205/1205.2618.pdf
* others
	* https://d2l.ai/chapter_recommender-systems/ranking.html
