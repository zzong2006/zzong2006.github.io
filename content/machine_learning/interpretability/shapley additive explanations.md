---
title: "shapley additive explanations"
tags:
  - machine_learning
aliases: ["SHAP"]
---

집값 예측 모델이 어떤 집을 3.7 억으로 예측했다. 이 모델이 내놓는 예측의 평균은 3.0 억이다. **이 집은 왜 평균보다 0.7 억 비싸게 나왔을까?**

SHAP(SHapley Additive exPlanations)은 이 0.7 억을 feature 별 몫으로 나눠 준다. 예를 들어 "넓어서 +0.45 억, 역세권이라 +0.25 억" 처럼 나누고, 몫을 모두 더하면 정확히 0.7 억이 된다.

# A) 몫을 나누는 방법

설명을 위해 모델이 feature 두 개만 본다고 하자. 넓은지(30 평 이상)와 역세권인지(역까지 걸어서 5 분 이내)다. 집은 네 종류이고 데이터에 같은 수만큼 있다.

| | 역세권 아님 | 역세권 |
| --- | --- | --- |
| 좁음 | 2.5 억 | 2.7 억 |
| 넓음 | 3.1 억 | 3.7 억 |

- 좁고 역세권이 아닌 집에서 넓기만 하면 0.6 억, 역세권이기만 하면 0.2 억 오른다.
- 그런데 둘 다면 0.8 억이 아니라 1.2 억이 오른다. 넓은 집이 역세권이면 더 비싸지는 효과가 따로 있다.
- 그래서 넓고 역세권인 집(3.7 억)의 0.7 억을 어떻게 나눌지가 애매하다.

**feature 를 하나씩 알려 주면서 예측이 얼마나 움직이는지 본다.** 아직 모르는 feature 는 데이터 전체로 평균을 낸다.

- 아무것도 모르면 네 종류의 평균 3.0 억이다.
- 넓다는 것만 알면 넓은 집 두 종류의 평균 3.4 억이다.
- 역세권이라는 것만 알면 역세권 두 종류의 평균 3.2 억이다.
- 둘 다 알면 3.7 억이다.

**알려 주는 순서에 따라 몫이 달라진다.**

- 넓다를 먼저 알려 주면, 넓다가 3.0 → 3.4 억으로 +0.4 억, 역세권이 3.4 → 3.7 억으로 +0.3 억을 가져간다.
- 역세권을 먼저 알려 주면, 역세권이 3.0 → 3.2 억으로 +0.2 억, 넓다가 3.2 → 3.7 억으로 +0.5 억을 가져간다.
- 같은 feature 라도 나중에 알려 줄 때 0.1 억을 더 받는다. 둘이 함께 있을 때 생기는 효과를 뒤에 온 쪽이 가져가기 때문이다.

**SHAP 은 가능한 모든 순서에서 받은 몫을 평균한다.**

- 넓다는 0.4 억과 0.5 억의 평균인 0.45 억을 받는다.
- 역세권은 0.3 억과 0.2 억의 평균인 0.25 억을 받는다.
- 둘을 더하면 0.7 억으로, 이 집의 예측 3.7 억과 평균 3.0 억의 차이와 정확히 같다.

이렇게 나눈 몫을 게임 이론에서 Shapley value 라 부른다. 여러 사람이 함께 번 돈을, 각자 들어온 순서에 상관없이 공평하게 나누는 방법이다. SHAP 은 feature 를 사람으로, 예측값을 번 돈으로 본다.

# B) 집마다 다른 몫

집 두 채의 몫을 그리면 다음과 같다. 평균 예측 3.0 억에서 출발해 feature 몫만큼 오르내리고, 끝이 그 집의 예측값이다. 주황은 값을 올린 몫, 파랑은 내린 몫이다.

![[img-39b62599e2.png]]

- 넓고 역세권인 집은 두 몫이 모두 양수라 3.7 억이 된다.
- 좁고 역세권이 아닌 집은 좁아서 −0.35 억, 역세권이 아니라서 −0.15 억이 붙어 2.5 억이 된다.
- 몫이 음수라는 것은 그 feature 때문에 평균보다 싸게 예측됐다는 뜻이다.

**집마다 몫의 크기를 평균하면 feature 전체의 중요도가 된다.**

- 네 종류 집에서 부호를 뗀 몫을 평균하면 넓다는 0.4 억, 역세권은 0.2 억이다.
- 이 모델에서는 넓은지가 역세권인지보다 두 배 중요하다.
- [[permutation importance]] 는 모델 전체에 대해 feature 마다 숫자 하나를 준다. SHAP 은 집 한 채마다 "왜 이 값인지" 를 설명하고, 평균하면 전체 중요도도 준다.

# C) 쓸 때 주의할 점

**SHAP 값은 원인이 아니라 모델의 계산을 나눈 것이다.** "넓어서 +0.45 억" 은 모델이 그렇게 계산했다는 뜻이다. 실제로 집을 넓히면 0.45 억 오른다는 뜻은 아니다.

**feature 가 많으면 순서가 너무 많다.**

- feature 가 10 개면 알려 주는 순서가 360 만 가지가 넘는다.
- 실제로는 트리 모델이면 TreeSHAP 이 순서를 다 돌지 않고도 정확한 값을 빠르게 구한다.
- 다른 모델은 일부 순서만 뽑아 근사한다 (KernelSHAP).

**서로 닮은 feature 가 있으면 몫이 예상과 다르게 나뉠 수 있다.**

- 면적을 평과 ㎡ 로 두 번 넣었다고 하자. 면적의 몫이 둘에게 나뉘어, 둘 다 실제보다 작아 보일 수 있다.
- 모르는 feature 를 평균으로 채울 때 "20 평인데 115 ㎡" 같은 실제로 없는 집이 섞이기도 한다.
- 실제로는 모르는 feature 를 채우는 방법이 몇 가지 있고, 방법에 따라 몫이 조금씩 다르다.

# D) 부록: 식과 코드

## D.1) Shapley value

feature 전체 집합을 $N$, feature 집합 $S$ 만 알 때의 예측을 $v(S)$ 라 하면, feature $i$ 의 몫은 다음과 같다.

$\phi_i = \sum_{S \subseteq N \setminus \{i\}} \dfrac{|S|!\,(|N|-|S|-1)!}{|N|!}\,\big(v(S \cup \{i\}) - v(S)\big)$

- 「$i$ 를 넣기 직전까지 알려 준 feature 가 $S$ 인 순서」 의 비율로 가중 평균한 것이다.
- 본문 예에서 넓다의 몫은 $\frac{1}{2}(3.4 - 3.0) + \frac{1}{2}(3.7 - 3.2) = 0.45$ 다.
- 몫을 모두 더하면 $v(N) - v(\varnothing)$, 곧 그 집의 예측과 평균 예측의 차이가 된다.

## D.2) 코드

```python
import shap

explainer = shap.TreeExplainer(model)   # LightGBM · XGBoost 같은 트리 모델
sv = explainer(X)                       # 집마다 feature 별 몫
shap.plots.waterfall(sv[0])             # 집 한 채의 몫 (본문 그림과 같은 모양)
shap.plots.bar(sv)                      # 부호를 뗀 몫의 평균 = 전체 중요도
```

- LightGBM 은 shap 없이도 `model.predict(X, pred_contrib=True)` 로 같은 몫을 준다. 마지막 열이 평균 예측(기준값)이다.

# E) Related

[[permutation importance]], [[LightGBM]]

# F) References

* [A Unified Approach to Interpreting Model Predictions (Lundberg & Lee, NeurIPS 2017)](https://papers.nips.cc/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html)
* [From local explanations to global understanding with explainable AI for trees (Lundberg et al., Nature Machine Intelligence 2020)](https://www.nature.com/articles/s42256-019-0138-9)
* [SHAP documentation](https://shap.readthedocs.io/en/latest/)
