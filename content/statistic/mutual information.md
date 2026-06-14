---
title: "mutual information"
tags: ["information_theory", "statistic"]
aliases: ["MI"]
---

# A) Mutual Information ?

mutual information 은 $X$ 와 $Y$ 간 정보를 얼마나 공유하는지를 측정한다: 즉, 한쪽 변수를 앎으로써 다른 변수에 대한 불확실성을 얼만큼 줄일 수 있는지의 척도가 된다.

예를 들어, $X$ 와 $Y$ 가 서로 독립이라, $X$ 를 아는것이 $Y$ 에 대한 정보를 전혀 주지 않고, 그 반대도 성립한다면 mutual information 의 값은 `0` 이다.

[[feature selection]] 에서 MI 값을 주로 참조하기도 하는데, 만약 [[classification]] 문제를 풀때 class 변수와 feature 변수간 MI 값이 1 에 너무 가까우면 활용도가 높다고 생각할 수 있다.

# B) 정의

$$
I(X;Y)=D_{\mathrm{KL}}\left(P_{(X,Y)}\|P_{X}\otimes P_{Y}\right)
$$

$D_{\mathrm{KL}}$ 은 [[KL-Divergence]], $P_{(X,Y)}$ 는 [[joint distribution]] and $P_X$ 와 $P_Y$ 는 marginal distributions  

## B.1) 이산 case

$$
\displaystyle I(A;B)=\sum_{a\in A}\sum_{b\in B}P(a,b)\cdot\text{pmi}(a;b)
$$

pmi 는 [[pointwise mutual information]] 이고, $P(a,b)$ 는 a, b 가 동시에 일어날 확률을 의미  

Target 과 feature 간 얼마나 연관이 있는지 (feature utility) 알려주는 metric 을 Mutual Information(MI) 이라고 한다.  

# C) 특성

* MI 값은 항상 nonnegative 이다: $\mathrm{I}(X;Y)\geq0$
* symmetric: $\mathrm{I}(X;Y)=\mathrm{I}(Y;X)$

# D) [[correlation]] 과 비교

MI 는 correlation 과 비슷한 개념이다. 하지만 선형 관계에 대해서만 판단할 수 있는 correlation 과 달리, MI 는 선형 관계가 아닌 어떠한 관계도 그 상관의 정도를 측정할 수 있다.

하지만 univariate metric 이기 때문에, target 과 feature 의 단일 관계를 파악할 수 있을뿐, feature 간 관계들을 전반적으로 파악하기는 어렵다.

# E) 구현

scikit-learn 에서 구현체를 참고할 수 있다.

[sklearn.feature\_selection.mutual\_info\_classif — scikit-learn 1.2.2 documentation](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.mutual_info_classif.html)

# F) Relationship

Relation to [[conditional entropy]] and [[joint entropy]]  

$$
\begin{aligned}\mathrm{I}(X;Y)&\equiv\mathrm{H}(X)-\mathrm{H}(X\midY)\\&\equiv\mathrm{H}(Y)-\mathrm{H}(Y\midX)\\&\equiv\mathrm{H}(X)+\mathrm{H}(Y)-\mathrm{H}(X,Y)\\&\equiv\mathrm{H}(X,Y)-\mathrm{H}(X\midY)-\mathrm{H}(Y\midX)\end{aligned}
$$

$H(X)$ 와 $H(Y)$ 는 marginal entropy, 그리고 $\mathrm{H}(X\midY)$ 와 $\mathrm{H}(Y\midX)$ 는 conditional entropy 이며, $\mathrm{H}(X,Y)$ 는 joint entropy 를 의미한다.

* Relation to [[KL-Divergence]]
	* mutual information 은 marginal distributions 의 곱 $p_X\cdotp_Y$ 과 [[joint distribution]] $p_{(X,Y)}$ 의 KL-Divergence 이다  
: $\mathrm{I}(X;Y)=D_{\mathrm{KL}}\left(p_{(X,Y)}\|p_{X}p_{Y}\right)$

		* 더욱이, $p_{X\midY=y}(x)=p_{(X,Y)}(x,y)/p_{Y}(y)$ 를 conditional mass 또는 density function 이라고 가정하자. 그렇다면, 다음과 같이 표현할 수 있다  
: $\displaystyle\mathrm{I}(X;Y)=\mathbb{E}_{Y}\left[D_{\mathrm{KL}}\left(p_{X\midY}\|p_{X}\right)\right]$

* [[MI]] 점수 측정하기
	* Scikit-learn 에서 제공하는 `feature_selection` 패키지를 활용하면 [[MI]] 점수를 구할 수 있다.
* 주의할 점
	* MI 점수가 낮다고 무작정 쓸모없는 feature 라고 단정지을 수 없다. 데이터 시각화를 통해서 실제로 확인을 해보는 이중 확인 과정을 거쳐야 한다.

# G) Related

# H) References
