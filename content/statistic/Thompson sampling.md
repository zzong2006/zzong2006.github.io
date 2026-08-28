---
title: "Thompson sampling"
aliases: ["TS", "Posterior Sampling", "톰슨 샘플링"]
---

# A) 톰슨 샘플링이란

Thompson sampling(또는 TS) 은 [[Multi-Armed Bandit]] 의 exploration-exploitation 딜레마를 해결하기 위한 휴리스틱 policy 의 일종이다.

## A.1) 내용

Arm 의 posterior $P$ 에서 draw 한 $p_i$ 로 arm 을 선택한다.  
prior 가 [[statistic/Beta distribution]] 이라고 가정할 때, 시간 $t$, arm $i$ 에 대한 베타 분포의 parameter $\theta_{i,t}$ 는 $(\alpha_{i,t},\beta_{i,t})$ 로 표현될 수 있다. 그리고 [[conjugate prior]] 특성에 따라, 관측 값 $c_i\in\{0,1\}$ 에 따른 사후 확률 분포는 아래와 같다.

$$
c\theta_{i,t}=\left(\alpha_{i,t}+c_{i},\beta_{i,t}+1\right)
\left(p_{i}\mid c_{i}\right)\sim\operatorname{Beta}\left(\alpha_{i,t}+c_{i},\beta_{i,t}+1\right)$$

$c_i$ 는 클릭이 되었느냐 ($0$) 되지 않았느냐 ($1$) 라는 binary 형태를 띔
[Beta Distribution: notion link](https://www.notion.so/Beta-Distribution-52f42fdada5141f691e2e179999e562d)
- 시간 $t$에서 arm $i$에 대한 베타 분포의 평균 $\mu_{i,t}$과 표준편차 $\sigma_{i,t}$도 다음과 같이 계산할 수 있다.
- $\displaystyle{\mu_{i,t}=\alpha_{i,t}/\left(\alpha_{i,t}+\beta_{i,t}\right)}$
- $\displaystyle{\sigma_{i,t}=\left(\alpha_{i,t}/\beta_{i,t}\right)\left(1-\alpha_{i,t}/\beta_{i,t}\right)/\left(\beta_{i,t}+1\right)}$

# B) [[Recommendation System|RS]]의 Thompson Sampling
- [[recommendation_system/Recommendation System|RS]]에 대한 Multi-Armed Bandit에는 다음과 같은 가정이 존재한다.
- 컨텐츠를 통해 사용자들이 클릭을 시도할수록, 보상이 주어지고, 결과적으로 분포에 대한 parameter가 수렴함
- 하지만 서비스에 따라서 수렴하는 속도가 다름: 일반적으로 노출 횟수가 많고 콘텐츠 갯수가 작을수록 수렴 속도가 매우 빠름 (e.g. 카카오톡 카페 글 추천)
- 만약 수렴이 빠른 경우, 언제 수렴이 완료되는지 자동적으로 파악하고, 그것을 조정할 수 있도록 유도하는 것이 핵심
- 구성된 분포의 분산이 높을수록, explore에 가깝고, 낮을수록 exploit에 가까움
# C) References
* [Blog: Thompson sampling for contextual bandits](https://gdmarmerola.github.io/ts-for-contextual-bandits/)
