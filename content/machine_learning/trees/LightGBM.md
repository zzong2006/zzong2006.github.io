---
title: "LightGBM"
aliases: []
tags:
  - GBM
---

# A) LightGBM ?

Microsoft 가 만든 [[Gradient Boosting Machine|gradient boosting decision tree]](GBDT) 라이브러리다 (Ke et al., NeurIPS 2017).

GBDT 는 작은 결정 트리를 여러 개 이어 붙여 예측한다. 뒤 트리는 앞 트리들이 틀린 만큼을 고치도록 학습한다. 집값을 예측한다면 다음처럼 오차가 줄어든다.

| 단계 | 예측 | 실제 | 남은 오차 |
| --- | --- | --- | --- |
| 트리 1 | 3.0 억 | 3.5 억 | 0.5 억 |
| 트리 1 + 트리 2 | 3.4 억 | 3.5 억 | 0.1 억 |
| 트리 1 + 트리 2 + 트리 3 | 3.48 억 | 3.5 억 | 0.02 억 |

트리 2 는 남은 오차 0.5 억을, 트리 3 은 남은 0.1 억을 맞추도록 학습한다. 다만 트리 하나의 예측을 그대로 다 더하지 않고 일부만 반영하므로(learning rate), 남은 오차가 한 번에 0 이 되지 않고 조금씩 줄어든다.

LightGBM 도 이 방식은 다른 GBDT 와 같다. 다른 점은 **트리 하나를 만드는 속도** 다. 논문에서는 기존 GBDT 구현보다 학습이 최대 20 배 넘게 빨랐고, 정확도는 거의 같았다.

# B) 학습이 빠른 이유

## B.1) 결정 트리 용어

결정 트리는 질문을 따라 데이터를 묶음으로 나누고, 묶음마다 예측값 하나를 준다. 아래 6 행을 B.2 까지 같은 예로 쓴다.

| 행 | 나이 | 오차 |
| --- | --- | --- |
| 1 | 23 | −2 |
| 2 | 27 | −1 |
| 3 | 31 | −1 |
| 4 | 38 | +1 |
| 5 | 42 | +2 |
| 6 | 45 | +1 |

| 용어 | 뜻 | 예시 |
| --- | --- | --- |
| 행 | 데이터 샘플 하나 | 위 표의 한 줄 |
| feature | 행을 설명하는 열 하나 | 나이 |
| 오차 (gradient) | 지금까지 만든 트리들의 예측이 정답에서 얼마나, 어느 방향으로 벗어났는지 | 행 1 의 −2 |
| hessian | gradient 가 예측에 따라 얼마나 빨리 변하는지 (2 차 미분) | 제곱 오차에서는 모든 행이 1 |
| 분할 조건 (split) | feature 하나와 기준값 하나로 만든, 행을 둘로 나누는 질문 | 나이 < 35 ? |
| 노드 | 트리 안의 한 자리. 그 자리에 도착한 행들을 가진다 | 뿌리 노드에는 행 1 – 6 이 모두 있다 |
| 잎 (leaf) | 더 나누지 않은 노드. 예측값 하나를 가진다 | 행 1, 2, 3 이 든 잎 A |
| 칸 (bin) | feature 값의 범위. 기준값 후보는 칸의 경계다 | 나이 30 – 35 |

트리는 잎 하나(뿌리)에서 시작한다. 잎 하나를 골라 분할 조건으로 둘로 나누는 일을 되풀이하며 자란다.

```mermaid
flowchart TD
    R["뿌리 노드<br/>행 1 – 6"] -->|"35 살 미만"| A["잎 A<br/>행 1, 2, 3"]
    R -->|"35 살 이상"| B["잎 B<br/>행 4, 5, 6"]
```

* 나눈 잎은 질문을 가진 노드가 되고, 그 아래에 새 잎 둘이 생긴다.
* 잎의 예측값은 그 잎에 든 행들의 오차를 메우는 쪽으로 정해진다.
* 예측할 때는 새 행이 질문을 따라 내려가 도착한 잎의 값을 받는다.

## B.2) 분할 조건 하나를 고르는 비용

잎 하나를 나누려면 모든 feature 의 모든 기준값 후보를 시험해 보고, 나눴을 때 오차가 가장 많이 줄어드는 것을 골라야 한다. 이 일은 두 단계다.

| 단계 | 하는 일 | 비용 |
| --- | --- | --- |
| 모으기 | 행을 한 번씩 훑으며, 각 행의 오차를 그 행이 속한 칸에 더한다 | 행 수 × feature 수 |
| 고르기 | 칸별 합만 가지고, 후보마다 왼쪽 · 오른쪽으로 나눴을 때 오차가 얼마나 줄어드는지 계산한다 | 기준값 후보 수 × feature 수 |

B.1 의 뿌리 노드(행 1 – 6)를 나이, 기준값 후보 30 · 35 · 40 으로 나눠 보자.

**모으기**: 행을 위에서부터 한 번 읽으며, 각 행의 오차를 그 행의 나이가 들어가는 칸에 더한다.

| 칸 | 들어온 행 | 오차 합 |
| --- | --- | --- |
| 30 미만 | 1, 2 | −3 |
| 30 – 35 | 3 | −1 |
| 35 – 40 | 4 | +1 |
| 40 이상 | 5, 6 | +3 |

**고르기**: 행은 다시 보지 않고 칸 네 개만 쓴다. 후보마다 왼쪽 칸 합과 오른쪽 칸 합을 내고, 각 쪽 (합)² ÷ 행 수를 더해 점수로 쓴다. 점수가 클수록 나눈 뒤 오차가 많이 줄어든다.

* 실제 식은 행 수 대신 hessian 합으로 나눈다. 제곱 오차에서는 행마다 hessian 이 1 이라 행 수와 같다.
* 정규화 항은 뺐다.

| 기준 | 왼쪽 합 (행 수) | 오른쪽 합 (행 수) | 점수 |
| --- | --- | --- | --- |
| 30 | −3 (2) | +3 (4) | 9/2 + 9/4 = 6.75 |
| 35 | −4 (3) | +4 (3) | 16/3 + 16/3 ≈ 10.7 |
| 40 | −3 (4) | +3 (2) | 9/4 + 9/2 = 6.75 |

"나이 < 35 ?" 가 음수 오차와 양수 오차를 가장 깔끔하게 나누므로 이것을 고른다. B.1 그림의 잎 A · B 가 이렇게 생긴다.

두 단계로 나누는 이유는 비용이다. 모으기 없이 후보마다 행을 다시 훑으면 비용이 행 수 × 후보 수 × feature 수 로 불어난다. 칸별 합을 먼저 만들어 두면 행은 한 번만 보고, 고르기는 칸만 본다.

## B.3) 네 가지 기법의 관계

LightGBM 이 빠른 이유는 네 가지 기법이다. 각 기법은 B.2 비용의 서로 다른 숫자를 줄이고, 앞 기법이 남긴 병목을 뒤 기법이 이어서 줄인다.

| 기법 | 한 줄 요약 | 줄이는 것 | 기본 상태 · 파라미터 |
| --- | --- | --- | --- |
| Histogram | 값을 칸으로 묶고, 칸 경계에서만 자른다 | 기준값 후보 수 | 항상 켜짐. `max_bin` (기본 255) 으로 칸 수만 정한다 |
| GOSS | 이미 잘 맞힌 행은 일부만 본다 | 모으기의 행 수 | 기본 꺼짐. `data_sample_strategy="goss"`, `top_rate`, `other_rate` |
| EFB | 0 이 아닌 값이 같은 행에 함께 나오지 않는 feature 끼리 하나로 묶는다 | 모으기의 feature 수 | 기본 켜짐. `enable_bundle` |
| Leaf-wise | 나눴을 때 효과가 가장 큰 잎 하나만 나눈다 | 같은 정확도에 필요한 분할 수 | 항상 켜짐. `num_leaves` (기본 31), `max_depth` 로 크기만 제한한다 |

* **Histogram 이 바닥에 깔린다**: 기준값 후보가 수십만 개에서 254 개 이하로 줄어 고르기가 싸진다. 그러면 남는 비용은 대부분 모으기(행 수 × feature 수)다.
* **GOSS 와 EFB 는 남은 모으기 비용을 줄인다**: GOSS 는 행 수를, EFB 는 feature 수를 줄인다.
  * LightGBM 논문이 새로 내놓은 것은 이 둘이다. Histogram 과 leaf-wise 는 이전부터 있던 방식을 가져다 썼다.
* **Leaf-wise 는 다른 축이다**: 잎 하나를 나누는 속도가 아니라, 나누는 횟수를 줄인다.

학습 한 번 안에서 각 기법이 도는 자리는 다음과 같다.

```mermaid
flowchart TD
    subgraph pre["학습 전에 한 번"]
        H["Histogram<br/>feature 값을 칸 번호로 바꾼다"] --> E["EFB<br/>겹치지 않는 feature 를 하나로 묶는다"]
    end
    subgraph per["트리마다"]
        G["GOSS<br/>이번 트리에 쓸 행과 가중치를 고른다"] --> N["잎마다 모으기 · 고르기<br/>최고 분할 조건과 점수를 구한다"]
        N --> L["Leaf-wise<br/>점수가 가장 큰 잎 하나를 나눈다"]
        L -->|"새로 생긴 잎 둘"| N
    end
    E --> G
```

* 서로 기대는 지점
  * EFB 는 Histogram 위에서만 돈다. 두 feature 를 묶을 때 칸 번호를 이어 붙이기 때문이다 (B.7).
  * GOSS 는 모으기에 들어가는 행만 바꾼다. 고른 행에 가중치를 곱해 칸에 더할 뿐, 고르기와 leaf-wise 는 그대로다.
  * Leaf-wise 는 칸별 합의 뺄셈(B.4)과 잘 맞는다. 잎을 나눌 때 작은 쪽 자식만 직접 모은다.

![[img-ebfc6376cb.png]]

## B.4) Histogram: 칸 경계에서만 분할

연봉 feature 에 서로 다른 값이 50 만 종류 있다고 하자. 값을 정렬해 두고 이웃한 값 사이를 모두 시험하면 기준값 후보가 50 만 개 가깝게 나온다. XGBoost 의 exact 방식이 이렇게 한다. 서로 다른 값 하나하나가 칸 하나인 셈이다.

LightGBM 은 학습 전에 값을 최대 `max_bin` 개 칸(bin)으로 나눠 둔다. B.2 예시의 칸이 이것이다.

* 후보는 칸 경계뿐이라 기본 설정에서 254 개 이하다.
* 원래 값 대신 칸 번호만 저장하므로 메모리도 줄어든다.
* 대신 칸 안쪽의 세밀한 기준값은 고를 수 없다. `max_bin` 을 키우면 더 세밀해지고 그만큼 느려진다.

잎마다 칸별로 모은 합(오차 합 · hessian 합 · 행 수)을 히스토그램이라 부른다. 히스토그램이 있으면 계산을 한 번 더 아낄 수 있다. 부모 잎의 칸별 합에서 왼쪽 자식의 합을 빼면 오른쪽 자식의 합이 된다.

* 예: 부모의 3 번 칸 합이 10, 왼쪽 자식의 3 번 칸 합이 4 면 오른쪽 자식은 6 이다.
* 그래서 행이 적은 자식 쪽만 직접 모으고, 큰 쪽은 뺄셈으로 얻는다.

## B.5) Leaf-wise: 효과가 가장 큰 잎만 분할

B.1 의 트리에는 잎 A 와 잎 B 가 있다. 다음에 어느 잎을 나눌지 정하는 방식이 둘이다.

* 각 잎에서 B.2 의 모으기 · 고르기로 최고 분할 조건을 찾고, 나눴을 때 점수가 얼마나 오르는지 구한다.
* A 를 나누면 0.2, B 를 나누면 0.9 오른다고 하자 (설명용 숫자).
  * level-wise 는 A 와 B 를 모두 나눈다.
  * leaf-wise 는 B 만 나눈다. 그다음에도 그때 있는 잎 전부를 놓고 다시 하나만 고른다.

잎 4 개짜리 트리를 만드는 두 방식을 비교하면 다음과 같다.

| 방식 | 나누는 순서 | 결과 |
| --- | --- | --- |
| level-wise (XGBoost 기본) | 1 층에서 뿌리를 둘로, 2 층에서 두 노드를 모두 둘로 | 좌우가 고른 트리. 이미 잘 맞는 잎도 나눈다 |
| leaf-wise (LightGBM) | 지금 있는 잎 중 효과가 가장 큰 잎 하나만 나누기를 3 번 | 많이 틀리는 쪽만 깊어진 트리 |

같은 잎 수라면 leaf-wise 가 오차를 더 많이 줄인다. 그래서 같은 정확도에 분할이 덜 든다. `num_leaves` 는 이 잎 수의 상한이다.

대신 한쪽으로만 깊어지므로 데이터가 적으면 [[overfitting|과적합]] 하기 쉽다. `num_leaves` 로 잎 수를 제한하고, 필요하면 `max_depth` 와 `min_data_in_leaf` 를 함께 건다 (C.1 표).

## B.6) GOSS: 잘 맞힌 행은 일부만 사용

B.1 의 오차(gradient)가 크면 많이 틀린 행이고, 작으면 이미 잘 맞힌 행이다. 잘 맞힌 행은 다음 트리가 고칠 것이 적어서 분할을 고를 때 영향이 작다.

[[Gradient-based One-Side Sampling|GOSS]] 는 이 점을 이용해 모으기에 쓰는 행을 줄인다. 행 10 만 개, 기본값(`top_rate` 0.2, `other_rate` 0.1)이면 다음과 같다.

1. gradient 크기 순으로 줄 세워 상위 20% 인 2 만 행은 모두 쓴다.
2. 나머지 8 만 행에서 전체의 10% 인 1 만 행만 무작위로 뽑는다.
3. 뽑은 1 만 행에는 가중치 8 을 곱한다. 1 만 × 8 = 8 만이라 버린 행의 몫까지 대신한다.

결과적으로 10 만 행 대신 3 만 행으로 분할을 계산한다. 가중치를 곱하지 않으면 잘 맞힌 행이 실제보다 적게 반영되어 데이터 분포가 틀어진다.

## B.7) EFB: 겹치지 않는 feature 묶기

EFB(Exclusive Feature Bundling)는 0 이 아닌 값이 같은 행에 함께 나오지 않는 feature 들을 하나로 묶는다. feature 수가 줄면 모으기 비용(행 수 × feature 수)이 준다.

**묶을 수 있는 경우**: 색깔을 one-hot 으로 펼친 feature 3 개를 보자.

| 행 | 빨강 | 파랑 | 초록 | 합친 feature |
| --- | --- | --- | --- | --- |
| 1 | 1 | 0 | 0 | 1 |
| 2 | 0 | 0 | 1 | 3 |
| 3 | 0 | 1 | 0 | 2 |
| 4 | 0 | 0 | 0 | 0 |

* 어느 행에서도 둘 이상이 동시에 0 이 아닌 일이 없다. 이런 feature 들을 서로 배타적(exclusive)이라고 한다.
* 배타적인 feature 는 하나로 합쳐도 정보가 사라지지 않는다. 합친 값 1, 2, 3 이 어느 원래 feature 에서 왔는지 그대로 알 수 있다.

**겹치는 경우**: 위 표에 나이를 더하면 다음과 같다.

| 행 | 나이 | 빨강 | 파랑 |
| --- | --- | --- | --- |
| 1 | 23 | 1 | 0 |
| 2 | 27 | 0 | 0 |
| 3 | 31 | 0 | 1 |

* 나이는 모든 행에서 0 이 아니라서 빨강 · 파랑과 겹친다. 합치면 행 1 에서 나이 23 과 빨강 1 을 한 칸에 담을 수 없다.
* 기본 설정(`max_conflict_rate` 0.0)에서는 한 행이라도 겹치는 feature 끼리는 묶지 않는다. 나이는 혼자 남고, 빨강 · 파랑 · 초록만 묶인다.
* `max_conflict_rate` 를 올리면 겹치는 행이 그 비율 이하인 feature 도 묶는다. 겹친 행에서는 값 일부를 잃는 대신 더 빨라진다.

**묶음을 정하는 법**: 어떤 feature 끼리 묶어야 묶음 수가 가장 적은지 찾는 문제는 NP-hard 라서 greedy 로 근사한다.

* 0 이 아닌 값이 많은 feature 부터 차례로 본다.
* 이미 만든 묶음 중 겹침이 허용치 이하인 곳이 있으면 거기에 넣고, 없으면 새 묶음을 만든다.

**칸 번호 합치기**: 값이 여러 개인 feature 를 합칠 때는 뒤 feature 의 칸 번호에 앞 feature 의 칸 수만큼 더해 겹치지 않게 한다 (B.3 그림 ④ 에서 f2 에 5 를 더한 것).

* 예: feature A 의 칸이 0 – 9, B 의 칸이 0 – 19 면 B 를 10 – 29 로 밀어 칸 30 개짜리 히스토그램 하나로 만든다.

**효과가 큰 데이터**: one-hot 이나 단어 빈도처럼 0 이 대부분인 sparse feature 가 수만 개 있을 때 효과가 크다. 대부분 0 이 아닌 dense feature 는 서로 다 겹쳐서 묶을 것이 거의 없다.

## B.8) 지금의 XGBoost 와 비교

위 기법 중 일부는 XGBoost 에도 들어갔다. 같은 설정으로 맞추면 속도 차이는 예전보다 작고, 데이터와 파라미터에 따라 결과가 달라진다.

| 비교 항목 | LightGBM | XGBoost |
| --- | --- | --- |
| 기준값 후보 | 칸 경계 (histogram) | 2.0 부터 기본값(`tree_method="auto"`)이 histogram. exact 도 고를 수 있다 |
| 트리 성장 | leaf-wise | 기본은 level-wise. `grow_policy="lossguide"` 로 leaf-wise 가능 |
| 행 샘플링 | GOSS 를 고를 수 있다 | 무작위 subsample. GPU 에서는 gradient 크기 기반 샘플링(`sampling_method="gradient_based"`)도 가능 |
| sparse 열 | EFB 로 묶는다 | 묶지 않는다. 결측 · 0 인 값을 왼쪽과 오른쪽 중 어디로 보낼지 따로 학습한다 (sparsity-aware split) |

# C) 쓸 때 주의할 점

## C.1) 과적합을 막는 파라미터

leaf-wise 성장 때문에 데이터가 적으면 과적합하기 쉽다. LightGBM 문서도 작은 데이터에서는 `num_leaves` 를 줄이고 `min_data_in_leaf` 를 키우라고 권한다.

| 파라미터 | 기본값 | 정하는 것 | 과적합 시 조정 |
| --- | --- | --- | --- |
| `num_leaves` | 31 | 트리 하나의 잎 수 상한 | 줄인다 |
| `min_data_in_leaf` (`min_child_samples`) | 20 | 잎 하나에 들어가야 하는 최소 행 수 | 키운다 |
| `max_depth` | -1 (제한 없음) | 트리 깊이 상한. 한쪽으로만 깊어지는 것을 막는다 | 건다 |
| `feature_fraction` (`colsample_bytree`) | 1.0 | 트리마다 쓰는 feature 비율 | 줄인다 |
| `learning_rate` · `num_iterations` (`n_estimators`) | 0.1 · 100 | 트리 하나를 얼마나 반영할지, 트리를 몇 개 만들지 | 학습률을 낮추고, 검증 점수가 더 나아지지 않으면 트리 추가를 멈춘다 (early stopping) |

괄호 안은 scikit-learn 방식 API(`LGBMClassifier` 등)에서 쓰는 이름이다.

## C.2) scikit-learn 방식 API

`lgb.LGBMClassifier` · `lgb.LGBMRegressor` 는 scikit-learn 과 같은 `fit` / `predict` 인터페이스다. `lgb.Dataset` 을 만들 필요 없이 pandas DataFrame 이나 numpy 배열을 바로 넣는다. DataFrame 의 `category` 타입 열은 자동으로 categorical feature 로 처리한다.

클래스 불균형이 있으면 `class_weight="balanced"` 로 드문 클래스에 큰 가중치를 줄 수 있다.

* 가중치는 전체 행 수 ÷ (클래스 수 × 그 클래스의 행 수) 다.
* 예: 1 만 행 중 양성이 100 행이면 양성은 10,000 ÷ (2 × 100) = 50, 음성은 10,000 ÷ (2 × 9,900) ≈ 0.505 다.
* 양성을 더 잘 잡게 되지만, 학습 분포가 바뀌어 양성의 예측 확률이 실제보다 높게 나온다. 확률값을 그대로 써야 하면 [[probability calibration|보정]] 을 거친다.

## C.3) Boosting 방식

`boosting` 파라미터로 GBDT(기본), DART, random forest 를 고른다. 예전에는 GOSS 도 `boosting="goss"` 로 골랐지만, 4.0 부터는 행 샘플링 방식으로 분리되어 `data_sample_strategy="goss"` 로 지정한다. 순위 학습용 목적 함수(`objective="lambdarank"`)도 기본으로 들어 있다 ([[LambdaRank]]).

# D) 한계: ID 사이의 관계 학습

트리의 질문은 언제나 열 하나만 본다. "이 행의 user_id 가 {user_A, user_C} 중 하나인가?" 는 물을 수 있지만, "user_A 와 user_B 가 비슷한가?" 는 물을 수 없다. 그래서 사용자 ID · 상품 ID 를 넣어도 트리 모델은 어떤 ID 끼리 비슷한지 배우지 못한다.

ID 처럼 범주가 많은 열(`max_cat_to_onehot`, 기본 4 개 초과)을 LightGBM 은 다음처럼 나눈다.

1. ID 마다 "모델이 지금 이 ID 의 행을 어느 쪽으로 얼마나 틀리고 있나" 를 숫자 하나로 낸다 (gradient 합 ÷ hessian 합).
2. 이 숫자로 ID 를 줄 세운다.
3. 줄의 한 지점을 잘라 두 무리로 나눈다.

| ID | 1 단계 숫자 |
| --- | --- |
| user_B | -0.6 |
| user_D | -0.1 |
| user_A | 0.4 |
| user_C | 0.5 |

위 예에서는 user_D 와 user_A 사이를 잘라 {user_A, user_C} 와 나머지로 나눌 수 있다.

user_A 와 user_C 가 한 무리가 된 이유는 1 단계 숫자가 비슷했기 때문뿐이다. 둘이 같은 상품을 샀는지, 취향이 비슷한지는 모델이 모른다.

* 행이 적은 ID 는 이 숫자가 들쭉날쭉해서 믿기 어렵다.
* 처음 보는 ID 는 숫자가 없어서 쓸 정보가 없다.

임베딩을 쓰는 신경망(MLP 등)은 다르다. ID 마다 벡터를 두고 학습하면서, 비슷한 행동을 한 ID 의 벡터를 서로 가깝게 만든다. 행이 적은 user_A 도 비슷한 user_B 에게서 배운 정보를 나눠 쓴다.

| 비교 항목 | LightGBM (결정 트리) | MLP (임베딩) |
| --- | --- | --- |
| ID 를 쓰는 방식 | ID 마다 오차 통계를 내서 무리를 나눈다 | ID 마다 벡터를 두고 학습한다 |
| 학습하는 관계 | feature 와 target 사이 | feature 와 target 사이 + ID 끼리의 유사도 |
| 행이 적은 ID | 통계가 불안정해 거의 쓸모없다 | 비슷한 ID 의 정보를 빌려 쓴다 |

그래서 ID 를 트리 모델에 넣을 때는 ID 자체보다 ID 의 통계(과거 클릭률, 구매 수 등)를 feature 로 만들어 넣는 일이 많다.

# E) Feature Importance

LightGBM 은 feature 중요도를 두 가지로 낸다.

| `importance_type` | 계산 |
| --- | --- |
| `split` (기본값) | 그 feature 로 분할한 횟수 |
| `gain` | 그 feature 로 분할해서 줄어든 오차의 합 |

두 값은 순위가 서로 다를 수 있다.

| feature | 분할 횟수 | 분할 한 번에 줄어든 오차 | `split` | `gain` |
| --- | --- | --- | --- | --- |
| A | 10 번 | 0.1 | 10 | 1.0 |
| B | 2 번 | 3.0 | 2 | 6.0 |

`split` 은 A 를, `gain` 은 B 를 더 중요하다고 본다. `split` 은 분할이 오차를 얼마나 줄였는지 보지 않기 때문이다. 보통 `gain` 을 더 믿을 만한 지표로 쓴다.

[[random forest]] 의 기본 중요도(scikit-learn 의 `feature_importances_`)는 분할로 줄어든 불순도의 평균이다. 원리는 LightGBM 의 `gain` 과 같지만, 두 모델의 값을 그대로 비교하면 안 된다.

| 비교 항목 | Random Forest | LightGBM |
| --- | --- | --- |
| 트리 관계 | 서로 독립 ([[bagging]]) | 앞 트리의 오차를 이어 받음 ([[boosting]]) |
| 분할 기준 | 불순도(Gini, entropy) 감소 | gradient 로 계산한 오차 감소 |
| 중요도 분포 | 트리마다 feature 를 무작위로 골라 여러 feature 에 퍼지는 편 | 오차를 가장 잘 줄이는 소수 feature 에 몰리는 편 |

두 방식 모두 값 종류가 많은 feature(ID 등)를 실제보다 중요하게 보는 경향이 있다. 자를 수 있는 곳이 많아서, 우연히 오차를 크게 줄이는 자리도 찾기 쉽기 때문이다. feature 의 실제 기여를 보려면 permutation importance 나 SHAP 을 함께 본다.

# F) Related

[[Gradient Boosting Machine]], [[Extreme Gradient Boosting|XGBoost]], [[GBM comparison]]

# G) References

* [LightGBM: A Highly Efficient Gradient Boosting Decision Tree (Ke et al., NeurIPS 2017)](https://papers.nips.cc/paper_files/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html)
* [LightGBM Features](https://lightgbm.readthedocs.io/en/latest/Features.html)
* [LightGBM Parameters](https://lightgbm.readthedocs.io/en/latest/Parameters.html)
* [XGBoost - Tree Methods](https://xgboost.readthedocs.io/en/stable/treemethod.html)
* [scikit-learn - Permutation feature importance](https://scikit-learn.org/stable/modules/permutation_importance.html)
* [Understanding LightGBM Parameters (and How to Tune Them) - neptune.ai](https://neptune.ai/blog/lightgbm-parameters-guide)
