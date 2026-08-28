---
title: "Improving Pairwise Learning for Item Recommendation from Implicit Feedback"
tags: ["WSDM", "paper_review", "recommendation_system", "y2014"]
---

# A) Abstract

* Pairwise 알고리즘 학습에서 사용하는 SGD (with uniformly drawn pairs) 방식은 아이템의 인기 정도가 tailed 분포를 따른다면 학습이 매우 느려진다는 점을 보임
* 이러한 문제를 극복하기 위해서 non-uniform item sampler 를 제안
	* 해당 sampler 는 문맥 기반에 기반하고, 정보량이 높은 pair 들을 많이 추출하여 수렴 속도를 높임
* 또한, 제안한 방식이 많은 추천 모델들에게 적용될 수 있음을 보임
* Introduction
	* implicit feedback 의 특징은 한 가지 class(positive) 만 있다는 것인데, 선택되지 않은 모든 아이템에 대해서는 해당 유저가 관심이 없다고 판단함
	* [[BPR - Bayesian Personalized Ranking from Implicit Feedback]] 에서 사용하는 uniform sampling pairs 가 낮은 convergence 를 가짐을 보임
		* [[vanishing gradients]] 문제로 인해 SGD 업데이트가 거의 효과가 없음을 주장
		* 왜냐하면 uniform 하게 샘플링 된 negative item 은 대부분 올바르게 관찰된 아이템보다는 낮게 rank 되므로, 해당 pair 의 gradient 에서는 거의 $0$ 값을 가지게 되어있음
	* a non-uniform sampling distribution 방식을 제안
		* It adapts both to the context and the current state of learning
* Problem statement
	* Ranking from Implicit Feedback
		* $S\subset C\times I$: 관찰된 action 들의 집합
			* $C$ 는 context 집합 (e.g. users, location, mood, time)
			* $I$ 는 item 집합 (e.g. movies)
		* 각 context 에 대해서 item 들의 ranking $\hat{r}$ 을 찾는것이 목적: $\hat{r}:I\timesC\rightarrow\{1,\ldots,|I|\}$
			* $\hat{r}(i\midc)$ 는 $c$ 가 주어졌을 때, 아이템 $i$ 의 rank
		* ranking function 은 일반적으로 scoring function $\hat{y}(i\midc)$ 에 의해 모델링 됨
			* 해당 scoring function 은 모델 parameter $\Theta$ 를 가짐
		* 즉, rank $\hat{r}$ 은 scoring function $\hat{y}(i\midc)$ 을 통해 정렬되어 계산됨
: $\hat{r}(i\midc):=|\{j:\hat{y}(j\midc)\geq\hat{y}(i\midc)\}|$
	* Pairwise Learning from Implicit Feedback
		* model parameter $\Theta$ 의 값은 implicit feedback data $S$ 를 통해 학습함
			* 학습을 위해, 선택된 아이템들 $I^{+}(c):=\{i:(i,c)\inS\},c\inC$ 와 남은 아이템들 $I\backslashI^{+}(c)$ 을 구분하는 방식인 pairwise 학습 방식을 주로 사용
		* 문맥 $c$ 에 대해서, 아이템 $i$ 가 아이템 $j$ 보다 더 선호된다면 $i\succ_{c}j$ 로 표기한다.
		* 그리고, $i$ 는 선택된 아이템이고, $j$ 는 선택되지 않은 아이템일 때, 다음을 만족한다
: $i\succ_{c}j\Leftrightarrowi\inI^{+}(c)\wedgej\inI\backslashI^{+}(c)$
		* 모든 pairwise preferences 의 집합은 $D_{S}\subseteqC\timesI\timesI$ 는 다음과 같이 정의된다
: $(c,i,j)\inD_{S}:\Leftrightarrowi\inI^{+}(c)\wedgej\inI\backslashI^{+}(c)$
		* pairwise preference 와 model 간 연결점은 scoring function $\hat{y}$ 로 표현할 수 있다
: $p\left(i\succ_{c}j\right):=\sigma(\hat{y}(i\midc)-\hat{y}(j\midc))$
			* $\sigma$ 는 [[sigmoid function]]
		* 목적은 다음과 같은 올바른 preference 순서에 대한 likelihood 를 최대화 하는 것
: $\displaystyle\underset{\Theta}{\operatorname{argmax}}\prod_{(c,i,j)\inD_{S}}p\left(i\succ_{c}j\right)$
			* [[statistic/negative log likelihood|NLL]] 로 표현하면 다음과 같다: $\displaystyle\mathrm{NLL}:=-\sum_{(c,i,j)\inD_{S}}\ln\sigma(\hat{y}(c,i)-\hat{y}(c,j))$
		* SGD learning
			* $\displaystyle\frac{\partial\mathrm{NLL}}{\partial\theta}=\sum_{(c,i,j)\inD_{S}}(1-\sigma(\hat{y}(c,i)-\hat{y}(c,j)))\frac{\partial(\hat{y}(c,i)-\hat{y}(c,j))}{\partial\theta}$
			* $\left|D_{S}\right|$ 의 값이 크기 때문에, $(c,i,j)\inD_{S}$ pair 를 sampling 해서 SGD step 을 수행한다.
				* $(c,i)\inS$ 의 sampling 을 먼저 수행하고, a negative item $j\inI\backslashI^{+}(c)$ 을 sampling 함
		* BPR Algorithm Figure
			* ![[img-f5873d798d.png]]
	* Issues in Tailed Item Distributions
		* Gradient Magnitude: $\Delta_{c,i,j}$
			* $\Delta_{c,i,j}$ 는 모델 parameter $\Theta$ 학습에 큰 영향을 미친다
: $\Delta_{c,i,j}:=(1-\sigma(\hat{y}(c,i)-\hat{y}(c,j)))=\left(1-p\left(i\succ_{c}j\right)\right)$
			* 만약, $i$ 가 올바르게 할당되어 $j$ 보다 높은 점수를 가진게 당연하다면, $\Delta_{c,i,j}$ 는 당연히 $0$ 에 가깝게 될 것이고, 학습이 거의 진행되지 않을 것이다.
				* 반대의 상황이라면, 해당 값은 $1$ 에 가깝게 나올것이다.
* Improved item sampling: negative item 을 위한 non-uniform samplers 을 제안
	* Static & Global Sampling
		* popular 한 item 들을 oversampling 하는 것
			* empirical sampling distribution
: $p(j\midc)\propto\left|\left\{\left(c^{\prime},j^{\prime}\right)\inS:j=j^{\prime}\right\}\right|$
			* 구현) $S$ 로 부터 uniform 하게 observation $\left(c^{\prime},j\right)$ 을 뽑고, $c^{\prime}$ 을 버린다음 $j$ 를 negative item 으로 사용함
		* parametreic sampling
			* E.g. Geometric distribution
: $p(j\midc)=\gamma(1-\gamma)^{r(j)},\quad\gamma\in(0,1)$
				* $r(j)$ 는 global popularity ranking 에 따른 item $j$ 의 rank
		* 어떤 distribution 방식을 사용하던 결과는 거의 똑같다.
			* 다만, 구현은 the empirical distribution 쪽이 더 쉬움
	* Adaptive & Context-dependent Sampling
		* $p(j\midc)\propto\left|\left\{\left(c^{\prime},j^{\prime}\right)\inS:c=c^{\prime},j=j^{\prime}\right\}\right|=\delta((c,j)\inS)$
		* negative item $j$ 가 높은 순위에 있을수록 ($\hat{r}(j\midc)$ 의 rank 값이 작을수록) ,$\Delta_{c,i,j}$ 크기 역시 커지는데, 이를 반영하는 sampling distribution 은 다음과 같다
: $p(j\midc)\propto\exp(-\hat{r}(j\midc)/\lambda),\quad\lambda\in\mathbb{R}^{+}$
			* score $\hat{y}(j\midc)$ 대신 rank 를 사용하는 이유는 rank 는 절대값이고, score 는 상대적 값이기 때문이다.

# D) References

* http://webia.lip6.fr/~gallinar/gallinari/uploads/Teaching/WSDM2014-rendle.pdf
