---
title: "permutation importance"
aliases: []
tags:
  - feature_engineering
---

집값 예측 모델을 다 만들었다고 하자. 모델은 면적 · 연식 · 현관문 색을 보고 값을 매긴다. 이 모델이 어떤 feature 에 기대고 있는지 알고 싶다.

**permutation importance 는 feature 하나를 망가뜨렸을 때 모델이 얼마나 더 틀리는지로 그 feature 의 중요도를 잰다.** 망가뜨리는 방법은 그 feature 의 값을 집끼리 무작위로 섞는(permutation) 것이다.

# A) feature 하나를 섞어 보기

검증용 집 4 채가 있다. 모델의 예측은 실제 가격과 평균 950 만 원 차이 난다.

| 집 | 면적 (평) | 연식 (년) | 현관문 | 실제 가격 (억) | 예측 (억) |
| --- | --- | --- | --- | --- | --- |
| 1 | 20 | 20 | 빨강 | 2.3 | 2.2 |
| 2 | 25 | 5 | 파랑 | 3.2 | 3.3 |
| 3 | 30 | 15 | 파랑 | 3.5 | 3.4 |
| 4 | 35 | 2 | 빨강 | 4.5 | 4.42 |

면적 열만 섞어 30, 20, 35, 25 로 바꾸고 다시 예측해 보자. 다른 열과 실제 가격은 그대로 둔다.

- 집 1 은 20 평인데 30 평으로 들어가서, 예측이 2.2 억에서 3.2 억으로 뛴다.
- 집 4 는 35 평인데 25 평으로 들어가서, 예측이 4.42 억에서 3.42 억으로 떨어진다.
- 평균 오차가 950 만 원에서 6,950 만 원으로, 6,000 만 원 늘었다.

다른 feature 도 하나씩 섞어 본다.

- **면적을 섞으면 오차가 6,000 만 원 는다**: 모델이 면적에 크게 기댄다.
- **연식을 섞으면 2,100 만 원 는다**: 기대긴 하지만 면적보다 덜하다.
- **현관문 색을 섞으면 그대로다**: 모델이 이 feature 를 쓰지 않는다.

이렇게 늘어난 오차가 그 feature 의 중요도다. 이 모델에서는 면적, 연식, 현관문 색 순으로 중요하다.

- 실제로는 한 번만 섞으면 우연히 덜 섞일 수도 있어서, 여러 번 섞어 평균한다.

**다시 학습할 필요가 없다.** feature 를 빼고 모델을 새로 학습하는 대신, 이미 학습한 모델에 섞은 데이터를 넣어 예측만 다시 한다. 그래서 모델 종류와 상관없이 쓸 수 있다.

# B) 쓸 때 주의할 점

**학습 데이터가 아니라 검증 데이터로 잰다.**

- 과적합한 모델은 학습 데이터에만 있는 우연한 패턴까지 외운다. 예를 들어 학습 데이터에서 우연히 빨간 현관문 집이 비쌌다면, 모델이 그것을 외울 수 있다.
- 학습 데이터로 재면 외운 패턴이 깨지니 현관문 색이 중요해 보인다.
- 검증 데이터에는 그 패턴이 없으니 현관문 색의 중요도가 0 근처로 나온다.
- 검증 데이터에서 섞었더니 오히려 오차가 줄었다면, 모델이 그 feature 에서 잡음을 배웠다는 신호다.

**서로 닮은 feature 가 있으면 둘 다 덜 중요해 보인다.**

- 면적을 평과 ㎡ 로 두 번 넣었다고 하자.
- 평을 섞어도 모델은 ㎡ 로 면적을 알 수 있어서 오차가 조금만 는다. ㎡ 를 섞을 때도 마찬가지다.
- 그래서 둘 다 중요도가 낮게 나오지만, 실제로 면적은 매우 중요하다.
- 닮은 feature 는 하나만 남기거나, 함께 섞어서 잰다.

**중요도가 높다는 것이 "그 feature 가 집값을 결정한다" 는 뜻은 아니다.** 이 모델이 예측할 때 그 feature 에 기댄다는 뜻일 뿐이다.

# C) 다른 중요도와 비교

- **트리 모델의 기본 중요도(split · gain)**: 학습 중에 그 feature 로 몇 번, 얼마나 나눴는지 센다. 값 종류가 많은 feature 를 실제보다 중요하게 보기 쉽다 ([[LightGBM]] 의 Feature Importance 절).
- **permutation importance**: 섞었을 때 예측 오차가 실제로 얼마나 느는지 잰다. 모델 전체에 대해 feature 마다 숫자 하나를 준다.
- **[[shapley additive explanations|SHAP]]**: 집 한 채의 예측값을 feature 별 몫으로 나눈다. 집마다 값이 나오고, 이를 평균하면 전체 중요도도 된다.

# D) 부록: 코드

scikit-learn 의 `permutation_importance` 로 잰다.

```python
from sklearn.inspection import permutation_importance

result = permutation_importance(
    model, X_val, y_val,
    scoring="neg_mean_absolute_error",  # 높을수록 좋은 점수
    n_repeats=10,                       # 몇 번 섞어 평균할지
    random_state=0,
)
result.importances_mean  # feature 별로 섞었을 때 점수가 떨어진 양의 평균
```

- 본문 예시의 모델은 `예측 = 1.0 + 0.1 × 면적 − 0.04 × 연식` (억) 이다. 현관문 색은 쓰지 않는다.

# E) Related

[[shapley additive explanations]], [[LightGBM]]

# F) References

* [Beware Default Random Forest Importances - explained.ai](https://explained.ai/rf-importance/index.html)
* [scikit-learn - Permutation feature importance](https://scikit-learn.org/stable/modules/permutation_importance.html)
