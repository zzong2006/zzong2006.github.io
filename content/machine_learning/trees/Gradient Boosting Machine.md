---
title: "Gradient Boosting Machine (GBM)"
tags:
  - ensemble
  - machine_learning
aliases: ["GBM", "gradient boosting"]
---

# A) Gradient Boosting Machine

집값을 예측한다고 하자. 처음에는 모든 집을 평균값으로 예측하고, 남은 오차를 맞추는 결정 트리를 하나 더한다. 그러고도 남은 오차는 다음 트리가 맞춘다. 이렇게 앞 트리들이 틀린 만큼을 다음 트리가 고치도록 트리를 차례로 더해 가는 모델이 gradient boosting machine(GBM)이다.

GBM 은 [[ensemble]] 중 [[boosting]] 계열이고, [[regression|회귀]] 와 [[classification|분류]] 에 모두 쓴다. 더해 가는 모델로는 거의 항상 [[Decision Tree|결정 트리]] 를 쓰며, 이때는 gradient boosted decision tree(GBDT) 라고도 부른다.

## A.1) 남은 오차를 맞추는 트리를 차례로 더한다

실제 가격이 3.5 억인 집 하나를 따라가 보자.

- 처음 예측은 전체 집값의 평균인 3.0 억이다. 0.5 억이 모자란다.
- 트리 1 은 집마다 "실제 가격 − 지금 예측", 즉 남은 오차([[residual]])를 정답으로 삼아 학습한다. 이 집에 0.4 억을 예측했다면 더한 예측은 3.4 억이다.
- 트리 2 는 남은 0.1 억을 정답으로 삼아 학습한다.

$m$ 번째 트리 $h_m$ 을 더하는 한 단계는 다음과 같다. $F_{m-1}$ 은 트리 $m-1$ 개까지 더한 지금의 예측이다.

$$
F_m(x) = F_{m-1}(x) + \nu\, h_m(x)
$$

실제로는 트리의 예측을 그대로 더하지 않고 learning rate $\nu$ (보통 0.1 이하)를 곱해 조금씩 더한다. 트리 하나가 오차를 한 번에 다 고치려다 학습 데이터의 우연한 흔들림까지 맞추는 것을 막는다 (아래 Shrinkage 절).

## A.2) 이름에 gradient 가 붙은 이유

**"남은 오차를 맞춘다" 는 제곱 오차를 쓸 때만 성립하는 특별한 경우다.** 일반적으로 다음 트리가 맞추는 값은 손실을 지금 예측으로 미분한 값의 반대 방향(negative gradient)이다.

$$
r_i = -\frac{\partial L\big(y_i, F(x_i)\big)}{\partial F(x_i)}
$$

이 $r_i$ 를 pseudo-residual 이라 부른다. 제곱 오차 $L = \frac{1}{2}(y - F)^2$ 를 넣으면 $r_i = y_i - F(x_i)$ 로, 앞에서 본 남은 오차와 같아진다.

**손실을 바꾸면 다음 트리가 맞출 값도 바뀐다.** 집이 한 달 안에 팔렸는지(1) 아닌지(0)를 맞히는 분류 문제로 바꿔 보자.

- 모델 출력 $F$ 는 [[logit]] 이고, 팔릴 확률은 $p = \sigma(F)$ 다.
- 손실은 log loss $L = -[\,y \log p + (1-y)\log(1-p)\,]$ 다.
- 이를 $F$ 로 미분하면 $r_i = y_i - p_i$ 다. [[logistic regression]] 의 gradient 와 같은 식이다.

| 집 | 실제 $y$ | 지금 예측 $p$ | 다음 트리가 맞출 값 $y - p$ |
| --- | --- | --- | --- |
| 가 | 1 | 0.20 | +0.80 |
| 나 | 0 | 0.90 | −0.90 |
| 다 | 1 | 0.95 | +0.05 |

**크게 틀린 집일수록 다음 트리가 크게 고친다.** 가와 나는 반대 방향으로 크게 움직이고, 이미 잘 맞힌 다는 거의 그대로 둔다.

랭킹 손실을 쓰면 문서 쌍의 순서를 바꿨을 때 NDCG 가 얼마나 변하는지로 이 값을 정한다. 아래 LambdaMART 절이 그 경우다.

## A.3) 함수 공간에서의 gradient descent

보통의 [[gradient descent]] 는 모델 파라미터를 negative gradient 방향으로 옮긴다. GBM 은 옮기는 대상이 파라미터가 아니라 **학습 샘플마다의 예측값 $F(x_i)$ 자체**다. 그래서 GBM 을 함수 공간에서의 gradient descent 라고 부른다.

- **트리는 그 방향을 처음 보는 입력까지 넓히는 역할을 한다**: $r_i$ 는 학습 샘플에서만 계산된다. 트리는 비슷한 집끼리 같은 잎에 묶어 같은 값을 주므로, 처음 보는 집에도 어느 쪽으로 고칠지 알려 준다.
- **learning rate 는 보폭, 트리 수는 걸음 수다**: 보폭을 줄이면 같은 거리를 가는 데 트리가 더 많이 든다.
- **실제로는 2차 미분까지 쓴다**: XGBoost 와 LightGBM 은 gradient 와 함께 2차 미분(hessian)을 써서 각 잎의 값을 정한다. 식은 [[LightGBM]] 부록에 있다.

## A.4) 특징

- **트리를 차례로 학습한다**: 앞 트리들의 예측이 있어야 다음 트리가 맞출 값이 정해지므로, 트리끼리는 동시에 만들 수 없다.
  - 트리 하나 안에서 가장 좋은 분할을 찾는 계산은 병렬로 돌린다.
- **얕은 트리를 많이 쌓아 bias 를 줄인다**: 트리 하나는 몇 단계짜리 얕은 트리라 혼자서는 너무 단순하다. 이를 차례로 더해 복잡한 모양을 만든다.
  - 같은 얕은 트리 100 개를 [[bagging]] 으로 평균하면 bias 가 거의 그대로지만, boosting 으로 더하면 크게 준다. 수치는 [[bagging]] 노트의 bagging 과 boosting 비교 절에 있다.
- **분기마다 feature 일부만 쓰는 것은 선택 사항이다**: [[random forest]] 처럼 feature 를 무작위로 일부만 보는 설정(scikit-learn `max_features`, XGBoost `colsample_bytree`, LightGBM `feature_fraction`)이 있지만, 기본값은 모든 feature 를 본다.

# B) Regularization

[[overfitting]] 을 막기위해 학습 과정에서 제한을 걸 수 있다.

자연스러운 방법 중 하나는 gradient boosting iteration 수 $M$ 값을 조절하는 것이다. $M$ 의 값이 높으면 overfitting 위험성이 있다. 적절한 $M$ 값은 validation data set 을 통해 결정할 수 있다.

또 다른 방법은 tree 의 깊이를 조절하는 것이다. 깊이가 깊을수록 모델이 overfitting 될 수 있다.

## B.1) Shrinkage

GB 방식에서 [[regularization]] 을 적용하는 다른 방법은 update 방식을 아래와 같이 조절하는 것이다.  

$$
F_{m}(x)=F_{m-1}(x)+\nu \cdot \gamma_{m} h_{m}(x), \quad 0<\nu \leq 1
$$

여기서 parameter $\nu$ 를 learning rate 라 부른다.

경험적으로 작은 learning rate (대략 $\nu<0.1$) 가 모델의 generalization 을 크게 향상시킨다고 알려져 있다. 하지만 낮은 learning rate 는 더 많은 iteration 이 필요하므로 계산 비용도 같이 오른다.

# C) Usage

Gradient boosting 은 [[Learning-to-Rank|LTR]] 에서 사용할 수 있다. 대표적인 예가 [[LambdaMART]] 다.

# D) 단점

boosting 방식은 decision tree 나 linear regression 과 같은 weak learner 의 정확도를 향상시킨다고 알려져있지만, 이 방식은 해석 정도 (interpretability) 를 감소시킨다. 예를 들어, 단순한 한개의 결정 트리의 길을 따라 내려가는건 쉽지만, 수백 또는 수천개의 트리의 길을 따라 내려가는건 어렵다.

performance 와 해석을 둘 다 잡기위해 하나의 decision tree 로 압축하는 기법을 사용하기도 한다. 다만, 큰 계산 비용이 요구되며 방식도 복잡하다.

# E) GBM 을 구현한 Python Packages

GBM 은 계산량이 상당히 많이 필요한 알고리즘이기 때문에, 이를 하드웨어 효율적으로 구현하는 것이 필요하다. 아래 패키지들은 모두 GBM 을 효율적으로 구현하려고한 [[Python]] 패키지들이라고 볼 수 있다. 즉, GBM 의 variants 라고 볼 수 있다.

 * [[Extreme Gradient Boosting|XGBoost]]
 * [[LightGBM]]
 * [[CatBoost]]

# F) GBM Vs other ML Methods

왜 GBM 은 다른 ML 방식 대비 강점이 있는가? 특히 Kaggle 과 같은 ML 대회에서 왜 잘 먹히는가?

그 이유는 GBM 과 같은 방식이 적은 비용의 data cleaning 과 pre-processing 이 요구되며, 중간 크기의 데이터 사이즈를 가지는 문제에 잘 어울리기 때문이다.

## F.1) Kernel Machine 과 비교

non-linear kernel 을 사용하는 SVM 은 높은 차원에서 복잡한 decision boundaries 를 학습할 수 있다. 하지만 observation 에 따른 비용이 $O(n^2)$ 만큼 빠르게 늘어나는 문제가 있어서 확장성이 떨어진다.

## F.2) 신경망과 비교

신경망은 데이터에 내재된 계층적 개념을 학습하여 복잡한 표현 (representation) 을 가능하도록 도와주기 때문에 높은 성능을 보여준다. 이 의미는 신경망이 복잡한 함수들이나 decision boundaries 를 학습할 수 있다는 것이다.

그러나 그만큼 신경망은 데이터가 매우 많지 않다면 쉽게 overfitting 되는 문제가 있다. 그래서 구글과 페이스북같은 거대 기업은 deep learning 으로 재미를 보지만, Kaggle 과 같은 데이터셋 사이즈로는 강력하지 못하다.

## F.3) Naive 기술과 비교

[[Naive Bayes]] 와 같은 naive 한 기술은 collinear feature 에 취약하다. 왜냐하면 feature 간 독립적이라는 가정을 만족하지 못하기 때문이다.

[[k-Nearest Neighbors|KNN]] 방식도 대용량 데이터셋에 대해서 쉽게 overfitting 되는 문제가 있다.

## F.4) Decision Tree 와 비교

의사 결정 나무 자체는 데이터에 쉽게 overfitting 될 수 있다. 단일 tree 로는 깊이를 제한하면서 이런 문제를 어느정도 해소할 수 있지만, 복잡한 decision boundary 를 학습할 수 없다.

# G) LambdaMART

[[LambdaMART]] 는 [[LambdaRank]] 의 학습 목표(lambda gradient)와 MART(gradient boosting) 의 학습 방식을 합친 랭킹 모델이다.

- 결정 트리를 하나씩 추가하면서, 이전 트리까지 만든 랭킹의 오차(lambda gradient)를 다음 트리가 보완한다.

## G.1) 학습 과정

여러 개의 weak learner(보통 결정 트리)를 반복해서 만들고, 이를 하나의 ensemble 모델로 합친다.

1. **초기 모델 생성**: 모든 문서에 0 점을 예측하는 단순한 모델 $F_0$ 에서 시작한다.
2. **lambda gradient 계산**: 현재 모델로 각 쿼리의 문서 점수를 예측하고, 그 점수로 매긴 순위가 정답 순위와 얼마나 다른지 계산한다.
	- 오차를 단순한 점수 차이로 보지 않고 lambda gradient 로 계산한다.
	- lambda gradient 는 특정 문서의 점수를 조금 올렸을 때 전체 랭킹 품질(NDCG)이 얼마나 변하는지를 나타낸다.
3. **다음 트리 학습**: 새 결정 트리 $\text{Tree}_1$ 이 각 문서의 feature 를 입력받아 2 단계의 lambda gradient 를 예측하도록 학습한다.
	- 이 트리는 어떤 문서의 점수를 많이 올리고, 어떤 문서의 점수를 적게 올리거나 내릴지를 배운다.
4. **모델 업데이트**: 기존 모델에 새 트리의 예측을 더한다.
	- $F_1 = F_0 + \nu \cdot \text{Tree}_1$
	- $\nu$ 는 learning rate 다. 한 번에 큰 변화를 주지 않고 점진적으로 개선하려고 쓴다.
5. **반복**: 지정한 횟수(예: 100 번)만큼 2–4 단계를 반복한다.
	- 두 번째 트리는 $F_1$ 의 오차를, 세 번째 트리는 $F_2$ 의 오차를 보완한다.
	- 이렇게 만든 트리 100 개 전체가 LambdaMART 모델이다.

2 단계의 예로, 10 위 문서를 9 위로 올리는 것보다 2 위 문서를 1 위로 올리는 쪽이 랭킹 품질에 훨씬 큰 영향을 준다. 그래서 1 위와 2 위 문서 쌍의 lambda gradient 가 더 크게 계산된다.

## G.2) 추론 과정

학습이 끝난 모델로 새 쿼리의 문서 순위를 매기는 과정은 훨씬 단순하다.

1. **문서 목록 입력**: 새 쿼리와 함께 순위를 매길 문서 목록(예: 검색 결과 후보 20 개)이 들어온다.
2. **점수 합산**: 각 문서를 트리 100 개에 모두 통과시키고, 트리별 예측 점수를 합쳐 최종 점수를 낸다.

$$
\text{score}(A) = F_0(A) + \nu \sum_{m=1}^{100} \text{Tree}_m(A)
$$

3. **정렬**: 최종 점수를 기준으로 내림차순 정렬한다. 점수가 가장 높은 문서가 1 위가 된다.

## G.3) 학습과 추론 비교

| 구분 | 학습 (Training) | 추론 (Inference) |
|---|---|---|
| 목표 | 랭킹 품질(NDCG)을 최대화하는 트리 ensemble 만들기 | 새 문서 목록의 순위 매기기 |
| 주요 과정 | 1. lambda gradient 계산<br>2. lambda gradient 를 예측하는 트리 학습<br>3. 트리를 ensemble 에 추가<br>4. 반복 | 1. 각 문서를 모든 트리에 통과시켜 점수 받기<br>2. 트리 점수를 합산해 최종 점수 계산<br>3. 최종 점수로 정렬 |
| 계산 복잡도 | 높음 (반복해서 gradient 계산과 트리 생성) | 낮음 (점수 계산 후 정렬만 수행) |

## G.4) Lambda gradient 계산

NDCG 같은 랭킹 지표는 미분할 수 없다. 두 문서의 순서가 바뀌면 값이 계단처럼 뛰는 불연속(non-differentiable) 함수라서, [[gradient descent]] 를 바로 적용할 수 없다.

LambdaRank 는 진짜 gradient 대신, 원하는 방향과 크기를 갖는 가상의 gradient 를 만들어 쓴다. 이것이 lambda gradient 이고, 두 가지 정보를 담는다.

- **방향 (direction)**: 문서 쌍 $(i, j)$ 에서 모델 점수 $s_i$ 를 올려야 하는지 내려야 하는지 나타낸다. [[RankNet]] 의 아이디어를 쓴다.
- **크기 (magnitude)**: 이 문서 쌍의 순서를 바로잡는 일이 전체 랭킹 품질(NDCG)에 얼마나 중요한지 나타낸다.

한 쿼리의 문서 쌍 $(U_i, U_j)$ 가 있고, 정답상 $U_i$ 가 $U_j$ 보다 관련도가 높다($y_i > y_j$)고 하자.

### G.4.1) 방향: pairwise cost 의 gradient

RankNet 에서 가져온 부분이다.

- 모델이 예측한 두 문서의 점수를 $s_i, s_j$ 라 한다.
- 점수 차이에 sigmoid 를 씌워, 모델이 "문서 $i$ 가 $j$ 보다 관련도가 높다" 고 예측할 확률 $P_{ij}$ 를 계산한다.

$$
P_{ij} = \frac{1}{1 + e^{-\sigma(s_i - s_j)}}
$$

- 이 예측의 cross-entropy cost $C$ 를 $s_i$ 로 미분하면 gradient 의 일부를 얻는다. 이 값은 모델이 예측한 순서가 정답과 얼마나 다른지에 따라 정해진다.

$$
\frac{\partial C}{\partial s_i} = \frac{-\sigma}{1 + e^{\sigma(s_i - s_j)}}
$$

- 이 값은 정답($y_i > y_j$)을 맞추려면 $s_i$ 를 올려야 한다는 방향을 알려 준다.

### G.4.2) 크기: NDCG 변화량

LambdaRank 가 새로 더한 부분이다.

- 현재 모델의 예측 점수로 정렬한 랭킹 리스트의 NDCG 를 계산한다.
- 두 문서 $U_i$ 와 $U_j$ 의 위치만 서로 바꾼 리스트의 NDCG 를 다시 계산한다.
- 두 값 차이의 절댓값을 구한다.

$$
|\Delta NDCG_{ij}| = |NDCG_{\text{original}} - NDCG_{\text{swapped}(i,j)}|
$$

- 이 값은 문서 $i$ 와 $j$ 의 순서를 바로잡는 일이 랭킹 품질에 미치는 영향, 즉 중요도다.
- 랭킹 상위에 있는 문서 쌍일수록 이 값이 커진다.

### G.4.3) 방향과 크기의 결합

두 요소를 곱하면 문서 쌍 $(U_i, U_j)$ 의 lambda gradient 가 된다.

$$
\lambda_{ij} = \frac{\partial C}{\partial s_i} \times |\Delta NDCG_{ij}| = \frac{-\sigma}{1 + e^{\sigma(s_i - s_j)}} \, |\Delta NDCG_{ij}|
$$

- 이 값으로 $s_i$ 를 업데이트한다. $s_j$ 에 대한 gradient 는 부호만 반대다.
- 모델의 예측이 틀린 정도($\partial C / \partial s_i$)에, 그 오류가 랭킹 전체에 미치는 영향($|\Delta NDCG_{ij}|$)만큼 가중치를 준다.

### G.4.4) 문서 단위 합산

실제 학습에는 문서 하나 $U_i$ 의 lambda gradient $\lambda_i$ 가 필요하다. 해당 문서가 들어간 모든 쌍의 값을 합산해 구한다.

$$
\lambda_i = \sum_{j} \lambda_{ij}
$$

- 문서 $i$ 가 이겨야 할 문서들($y_i > y_j$)에게서는 점수를 올리는 힘을 받는다.
- 문서 $i$ 가 져야 할 문서들($y_i < y_j$)에게서는 점수를 내리는 힘을 받는다.
- 이 힘을 모두 합한 값이 $\lambda_i$ 이고, LambdaMART 에서 다음 트리가 예측할 목표값(pseudo-response)이 된다.

정리하면 lambda gradient 는 RankNet 의 pairwise gradient(방향)에 랭킹 지표의 변화량(크기)을 곱한 값이다. 이 곱셈 덕분에 미분할 수 없는 랭킹 지표를 gradient boosting 기반 모델(MART)로 최적화할 수 있다.

# H) References

* https://en.wikipedia.org/wiki/Gradient_boosting
 * https://3months.tistory.com/368
 * [Overall explanation (super easy)](https://www.analyticsvidhya.com/blog/2020/02/4-boosting-algorithms-machine-learning/)
 * [A Gentle Introduction to Gradient Boosting: ppt](https://www.ccs.neu.edu/home/vip/teach/MLcourse/4_boosting/slides/gradient_boosting.pdf)
