---
tags: ["KDD", "bias", "fairness", "paper_review", "popularity_bias", "recommendation_system", "y2021"]
---

paper link

# A) Related Work

기존의 모든 [[popularity bias]] 연구들은 static 추천 task 를 기반으로 진행했지만, 실제 real-world 에서는 dynamic recommendation 형태를 띈다.

이 연구는 dynamic recommendation 에서의 popularity bias 를 조사하였음

# B) Empirical Study

## B.1) Compare Two Negative Sampling Strategies

considers all unclicked items as candidate negative samples

# C) Debiasing Approaches

model bias 를 줄임으로써 popularity bias 를 완화하는 방법을 소개

## C.1) By Dynamically Reducing Model Bias

[[Collaborative filtering via high-dimensional regression#Scaling method]]

## C.2) By False Positive Correction (FPC)

기존 방법들은 true positive (i.e. clicks) 만을 활용 했는데, false positive signal 을 고려하지 않음 (i.e. item 이 추천되었지만 클릭되지 않은 case. 즉, vimp).

인기 있는 아이템은 자주 추천되었을 것이고, 결과적으로 popularity bias 는 false positive signal 과 correlation 이 존재한다.

사용자 $u$ 와 아이템 $i$ 의 연관 점수 $\widehat{r}_{u, i}$ 를 예측해보자.

우선 학습 모델한테서 predicted score $\widehat{r}_{u, i}^{(m o d e l)}$ 를 얻었다고 가정한다.

이제, $i$ 가 $u$ 에게 $F$ 번 추천되었지만 한번도 클릭하지 않았다고 가정해보자. 그리고 $F$ 번의 추천동안 그 아이템이 위치한 position $\left\{k_{1}, k_{2}, \ldots, k_{F}\right\}$ 이 존재한다고 가정한다.

$$
 P\left(r_{u, i}=1 \mid c_{k_{1}}=0, \ldots, c_{k_{F}}=0\right)=1-\frac{1-\theta_{u, i}}{\prod_{f=1}^{F}\left(1-\delta_{k_{f}} \theta_{u, i}\right)}
$$

* $\delta_{k_{f}}=1 / \log _{2}\left(1+k_{f}\right)$ : positional bias
* $\theta_{u, i}=\widehat{r}_{u, i}^{(\operatorname{model})}$ : user $u$ 가 item $i$ 를 좋아할 확률 ($P\left(r_{u, i}=1\right)=\theta_{u, i}$)
…

제안된 이 방법의 단점은 $\widehat{r}_{u, i}^{(m o d e l)}$ 값을 활용하는 것이라, 만약 모델 자체가 bias 가 있다면 제안된 방법 역시 bias 가 껴들을 수 밖에 없는 방법이라는 것이다.

그래서 $\widehat{r}_{u, i}^{(m o d e l)}$ 를 얻기 위해서는 기존의 debiasing 방법을 활용해서 학습한 모델을 이용 하라고 언급하고 있다 (..)

### C.2.1) My Opinion

[[Stargate]] 의 seen decay 옵션과 비슷한 느낌인데, 기존 seen decay 를 대체할 정도인지는 확신이 안선다. 그리고 초기 추천 시 인기정도를 조절할 필요가 있어보인다.

# D) Debiasing Experiments

## D.1) Impacts of Four Bias Factors

### D.1.1) Impact of Model Bias

학습 데이터의 density 가 높을수록 popularity bias 가 높아졌다가 낮아지는 모습을 보임

그러나 대부분의 학습 데이터는 dense 하지 않으므로, bias 가 낮아지는 것은 기대하기 힘듦
