---
title: "Isotonic Regression"
tags: linear_regression 
aliases: []
---

# A) Isotonic Regression ?

입력이 커질 때 출력이 줄지 않는다(단조 증가)는 조건만 지키면서, 관측값과의 제곱 오차가 가장 작은 함수를 찾는 회귀다. 직선이나 S 자 같은 모양을 미리 정하지 않는다. 결과는 계단 모양 함수가 된다.

$$
\min_{f} \sum_i \left(y_i - f(x_i)\right)^2 \quad \text{subject to} \quad x_i \le x_j \Rightarrow f(x_i) \le f(x_j)
$$

| 기호 | 의미 |
| --- | --- |
| $x_i$ | 입력. 보정에서는 모델이 낸 점수 |
| $y_i$ | 관측값. 보정에서는 0 또는 1 라벨 |
| $f(x_i)$ | 학습한 계단 함수의 값. 보정에서는 보정된 확률 |

머신러닝에서는 주로 [[probability calibration|확률 보정]] 에 쓴다. 모델 점수를 $x$, 실제 라벨을 $y$ 로 두고 학습하면 $f$ 가 "이 점수를 받은 사례 중 실제 양성 비율" 을 근사한다. 점수가 높을수록 양성 비율도 높다는 가정 하나만 두므로, 원래 점수가 어떤 모양으로 틀어져 있어도 따라간다.

# B) PAV 알고리즘

해는 pool adjacent violators(PAV)로 구한다. 점수 순으로 라벨을 늘어놓고, 앞보다 작은 값이 나오면 그 둘을 한 블록으로 합쳐 평균으로 바꾼다. 합친 블록이 다시 앞 블록보다 작으면 또 합친다. 끝까지 가면 블록 평균이 오름차순인 계단이 남는다.

점수 0.1 부터 0.6 까지 6 개 사례의 라벨이 `0, 1, 0, 0, 1, 1` 이라고 하자.

1. `0` 다음 `1` 은 오름차순이라 그대로 둔다.
2. `1` 다음 `0` 은 감소라서 합친다. 블록 `[1, 0]` 의 평균은 0.5 다.
3. 다음 `0` 이 0.5 보다 작아 다시 합친다. 블록 `[1, 0, 0]` 의 평균은 1/3 이다.
4. 앞 블록 `[0]` 의 평균 0 보다 1/3 이 크므로 더 합치지 않는다.
5. 남은 `1, 1` 은 1/3 보다 커서 그대로 둔다.

![[img-52d5a2b2d6.png]]

보정 결과는 `0, 0.33, 0.33, 0.33, 1, 1` 이다. 점수 0.2, 0.3, 0.4 가 같은 확률 1/3 을 받는다. 원래는 다른 점수였던 사례가 같은 값이 되므로, 동점이 생겨 AUC 가 조금 바뀔 수 있다.

계단은 학습 데이터의 블록 경계에서만 바뀐다. 데이터가 적으면 블록이 몇 개뿐이라 계단이 거칠고, 우연히 생긴 라벨 순서에 맞춰 과적합한다. 이럴 때는 파라미터 두 개만 학습하는 Platt scaling 이 더 안정적이다.

# C) scikit-learn 에서 쓰기

```python
from sklearn.isotonic import IsotonicRegression

# 검증 데이터의 모델 점수와 라벨로 보정 함수를 학습한다
iso = IsotonicRegression(out_of_bounds="clip", y_min=0.0, y_max=1.0)
iso.fit(val_scores, val_labels)

calibrated = iso.predict(test_scores)
```

`out_of_bounds="clip"` 은 학습 때 본 점수 범위 밖의 입력을 양 끝 값으로 자른다. 기본값 `"nan"` 이면 범위 밖 점수에 NaN 을 돌려준다. 분류 모델을 통째로 감싸고 싶으면 `CalibratedClassifierCV(method="isotonic")` 를 쓴다.

# D) References

- [scikit-learn - Isotonic regression](https://scikit-learn.org/stable/modules/isotonic.html)
- [scikit-learn - Probability calibration](https://scikit-learn.org/stable/modules/calibration.html)
- [\[ICR IARC, 2023\] EDA and Submission (Kaggle)](https://www.kaggle.com/code/sergiosaharovskiy/icr-iarc-2023-eda-and-submission#Base-XGB-Model)
