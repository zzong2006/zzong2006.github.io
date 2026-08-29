---
title: "Doubly robust joint learning for recommendation on data missing not at random"
tags: paper_review bias recommendation_system ICML y2019
aliases: ["DRJL"]
---

# A) 한줄 요약

[[missing not at random|MNAR]] 인 평점 데이터에서 편향 없는 추정을 얻기 위해, 오차 예측 모델과 성향 점수 모델을 함께 학습시키는 doubly robust 방법을 제안한다. Wang et al., ICML 2019.

# B) 배경: 두 갈래의 보정

관측된 평점만으로 학습하면 편향이 그대로 들어간다. 이를 보정하는 방법이 크게 둘 있다.

**[[inverse propensity scoring weighting, IPW|IPS]]** — 관측될 확률의 역수로 가중치를 준다. 성향 점수가 정확하면 편향이 없지만, 확률이 작은 샘플에 큰 가중치가 붙어 분산이 커진다.

**error imputation (EIB)** — 관측되지 않은 칸의 오차를 예측 모델로 채워 넣는다. 분산은 작지만 그 예측 모델이 틀리면 편향이 남는다.

둘 다 각자의 모델이 정확해야 한다는 조건에 걸려 있다.

# C) Doubly Robust

두 방법을 결합해서, **둘 중 하나만 맞아도** 편향이 없어지도록 만든다. 이 성질을 doubly robust 라고 부른다.

$$
\hat{\mathcal{E}}_{DR} = \frac{1}{|\mathcal{D}|}\sum_{(u,i) \in \mathcal{D}} \left( \hat{e}_{ui} + \frac{o_{ui}(e_{ui} - \hat{e}_{ui})}{\hat{p}_{ui}} \right)
$$

| 기호 | 의미 |
| --- | --- |
| $e_{ui}$ | 실제 예측 오차 (관측된 경우에만 알 수 있다) |
| $\hat{e}_{ui}$ | imputation 모델이 예측한 오차 |
| $o_{ui}$ | 관측 여부 (0 또는 1) |
| $\hat{p}_{ui}$ | 추정한 성향 점수 |

식의 구조가 성질을 그대로 보여준다. 첫 항은 모든 칸에 대해 예측 오차를 채워 넣은 것이고, 둘째 항은 관측된 칸에서 그 예측이 틀린 만큼을 IPS 방식으로 보정하는 항이다.

- $\hat{e}$ 가 정확하면 둘째 항의 분자가 0 이 되어 $\hat{p}$ 가 틀려도 상관없다
- $\hat{p}$ 가 정확하면 둘째 항이 첫 항의 오차를 정확히 상쇄한다

# D) Joint Learning

제목의 joint learning 은 예측 모델과 imputation 모델을 번갈아 함께 학습시키는 절차를 가리킨다. imputation 모델을 미리 따로 학습해 고정해 두는 대신, 예측 모델이 갱신되면 그 오차 분포도 달라지므로 imputation 도 함께 갱신한다.

두 모델이 서로의 출력을 보며 수렴하는 구조라, imputation 이 현재 예측 모델의 실제 오차에 맞춰지고 그만큼 보정이 정확해진다.

# E) 실무적 시사점

성향 점수 추정과 오차 예측 중 어느 하나를 완벽하게 맞추기 어렵다는 것이 현실적인 전제다. doubly robust 는 그 전제 위에서 "둘 다 어느 정도만 해도 된다" 는 여지를 준다.

무작위 노출로 얻은 소량의 편향 없는 데이터가 있으면 성향 점수 추정의 기준으로 쓸 수 있고, 그 방향의 후속 연구가 이어졌다.

# F) References

* [\[1902.08419\] Doubly Robust Joint Learning for Recommendation on Data Missing Not at Random](https://arxiv.org/abs/1902.08419)
