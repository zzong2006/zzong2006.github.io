---
title: "Gradient Boosting Machine"
tags: ["ensemble", "machine_learning"]
aliases: ["GBM", "gradient boosting"]
---

# A) Gradient Boosting Machine ?

Gradient Boosting Algorithm (GBM) 은 [[regression]] 또는 [[classification]] 을 수행할 수 있는 예측모형이며 예측모형의 [[ensemble]] 방법론 중 [[boosting]] 계열에 속하는 알고리즘

여러개의 weak models 을 조합해서 하나의 결과를 만든다. 일반적으로 [[Decision Tree]]s 를 많이 사용하며, 이 경우 알고리즘 이름은 gradient-boosted trees 로 불리게 된다. 일반적으로 [[random forest]] 보다 성능이 좋다고 알려져 있다.

## A.1) Introduction

다른 boosting 방식과 동일하게, gradient boosting 도 반복적인 과정을 통해 약한 모델들을 하나의 강한 모델로 합치게 된다. 가장 쉽게 설명할 수 있는 것은 [[least squares estimation]] 환경으로, 모델 $F$ 에게 [[machine_learning/mean squared error|MSE]] $\frac{1}{n} \sum_{i}\left(\hat{y}_{i}-y_{i}\right)^{2}$ 를 최소화하는 출력 $\hat{y}=F(x)$ 을 가지도록 학습시키는 것이다.

이제 gradient boosting 알고리즘이 $M$ 스테이지를 반복한다고 해보자. 각 스테이지 $m$ ($1 \leq m \leq M$) 의 불완전한 모델을 $F_{m}$ 라고 표현하자. $m$ 이 낮을 경우, 이 모델은 아마도 $\hat{y}_{i}=\bar{y}$ 와 같은 출력을 내보낼 것이다 (관측된 결과의 평균 값).

$F_{m}$ 의 성능을 올리기 위해 새로운 추정 모델 $h_{m}(x)$ 을 더해줘야 한다. 즉,  

$$
F_{m+1}\left(x_{i}\right)=F_{m}\left(x_{i}\right)+h_{m}\left(x_{i}\right)=y_{i}
$$

또는,  

$$
h_{m}\left(x_{i}\right)=y_{i}-F_{m}\left(x_{i}\right)
$$

로 표현할 수 있다.  
결과적으로, **gradient boosting 은 $h_{m}$ 를 [[residual]] $y_{i}-F_{m}\left(x_{i}\right)$ 에 대하여 학습한다고 볼 수 있다.**

주어진 모델에 대한 residuals $h_m(x_i)$ 이 클수록 $F\left(x_{i}\right)$ 에 대한 MSE loss function 의 negative gradients 가 커진다.  

$$
L_{\mathrm{MSE}}=\frac{1}{n} \sum_{i=1}^{n}\left(y_{i}-F\left(x_{i}\right)\right)^{2}
$$

$$
-\frac{\partial L_{\mathrm{MSE}}}{\partial F\left(x_{i}\right)}=\frac{2}{n}\left(y_{i}-F\left(x_{i}\right)\right)=\frac{2}{n} h_{m}\left(x_{i}\right)
$$

그래서 gradient boosting 은 [[gradient descent]] 알고리즘의 특수한 방식중 하나라고 볼 수 있다.

## A.2) 특징

모든 decision tree 의 노드들은 전체 feature 들 중에서 각기 다른 subset 을 이용하여 학습했기 때문에, 모든 weak models 들은 서로 다르며, 데이터에 대한 다방면의 것들을 학습할 수 있다.

또한, 새롭게 학습되는 tree 들은 이전 tree 에서 발생한 error 들을 고려하여 학습한다. 즉, gradient boosting algorithm 에서는 tree 들이 sequential 하게 학습한다고 생각할 수 있다.

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

Gradient boosting 은 [[Learning-to-Rank|LTR]] 에서 사용할 수 있다.

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

[[Naïve Bayes]] 와 같은 naive 한 기술은 collinear feature 에 취약하다. 왜냐하면 feature 간 독립적이라는 가정을 만족하지 못하기 때문이다.

[[k-Nearest Neighbors|KNN]] 방식도 대용량 데이터셋에 대해서 쉽게 overfitting 되는 문제가 있다.

## F.4) Decision Tree 와 비교

의사 결정 나무 자체는 데이터에 쉽게 overfitting 될 수 있다. 단일 tree 로는 깊이를 제한하면서 이런 문제를 어느정도 해소할 수 있지만, 복잡한 deicison boundary 를 학습할 수 없다.

# G) Related

# H) References

* https://en.wikipedia.org/wiki/Gradient_boosting
 * https://3months.tistory.com/368
 * [Overall explanation (super easy)](https://www.analyticsvidhya.com/blog/2020/02/4-boosting-algorithms-machine-learning/)
 * [A Gentle Introduction to Gradient Boosting: ppt](https://www.ccs.neu.edu/home/vip/teach/MLcourse/4_boosting/slides/gradient_boosting.pdf)

네, LambdaMART 가 어떻게 학습하고 추론하는지 단계별로, 최대한 이해하기 쉽게 설명해 드리겠습니다.

핵심은 **‘LambdaRank 의 목표 설정 방식’**과 ‘MART(Gradient Boosting) 의 학습 엔진’ 이 두 가지를 합친 것입니다.

한 줄 요약: 여러 명의 전문가 (결정 트리) 가 팀을 이뤄, 이전 전문가가 만든 랭킹의 실수 (람다 그래디언트) 를 다음 전문가가 보완해나가는 방식으로 학습하는 모델

🌳 학습 (Training) 과정: 전문가 팀을 만드는 법

LambdaMART 의 학습은 여러 개의 약한 학습기 (보통 결정 트리, Decision Tree) 를 반복적으로 만들어 강력한 하나의 앙상블 (Ensemble) 모델로 합치는 과정입니다.

Step 1: 초기 모델 생성 (시작은 미미하게)

 * 아무것도 학습하지 않은 상태에서 시작합니다. 모든 문서에 대해 그냥 ‘0 점’을 예측하는 아주 단순한 모델 (F\_0) 을 만듭니다.
Step 2: ‘실수’ 정의 및 계산 (가장 똑똑한 부분: Lambda Gradient)
 * 현재 모델 (F\_0) 로 각 쿼리에 대한 문서들의 점수를 예측합니다. (처음엔 모두 0 점이겠죠.)
 * 이 예측 점수로 매긴 순위가 실제 정답 순위와 얼마나 다른지, 즉 ‘실수’를 계산해야 합니다.
 * 이때 ‘실수’를 단순한 점수 차이로 계산하지 않고, LambdaRank 의 핵심 아이디어인 ‘람다 그래디언트 (Lambda Gradient)’를 사용합니다.
   * 람다 그래디언트란? “특정 문서의 점수를 약간 올렸을 때, 전체 랭킹 리스트의 품질 (NDCG 점수) 이 얼마나 변하는가?”를 나타내는 값입니다.
   * 예시: 10 위 문서를 9 위로 올리는 것보다, 2 위 문서를 1 위로 올리는 것이 전체 랭킹 품질에 훨씬 큰 영향을 줍니다. 따라서 1 위와 2 위 문서 쌍에 대한 람다 그래디언트 값이 더 크게 계산됩니다.
 * 이 람다 그래디언트는 이제 **“다음 전문가 (트리) 가 배워야 할 목표 (정답지)”**가 됩니다.
Step 3: 실수를 보완하는 다음 전문가 (트리) 학습
 * 새로운 결정 트리 (Tree\_1) 를 학습시킵니다.
 * 입력: 각 문서의 피처 (feature)
 * 목표: Step 2 에서 계산한 ‘람다 그래디언트’ 값을 예측하도록 학습시킵니다.
 * 즉, 이 새로운 트리 (Tree\_1) 는 어떤 문서의 점수를 ‘많이’ 올려야 하고, 어떤 문서의 점수를 ‘적게’ 올려야 하는지 (또는 내려야 하는지) 를 배우게 됩니다. 랭킹 품질을 높이는 방향을 학습하는 셈입니다.
Step 4: 전문가 팀 업데이트
 * 기존 모델 (F\_0) 에 방금 만든 새로운 트리 (Tree\_1) 의 예측 결과를 더해 모델을 업데이트합니다. (F\_1 = F\_0 + \\nu \\cdot Tree\_1)
   * ν(nu, 학습률) 는 새로운 트리의 영향력을 조절하는 값입니다. 너무 큰 변화를 주지 않고 점진적으로 개선하기 위해 사용합니다.
 * 이제 모델 (F\_1) 은 초기 모델 (F\_0) 보다 조금 더 나은 랭킹을 만들 수 있게 되었습니다.
Step 5: 반복
 * 지정된 횟수 (예: 100 번) 만큼 Step 2 ~ Step 4 를 계속 반복합니다.
 * 두 번째 트리는 F\_1 모델의 실수를 보완하고, 세 번째 트리는 F\_2 모델의 실수를 보완하는 식으로 점차 정교해집니다.
 * 이렇게 100 개의 트리가 만들어지면, 이들 전체가 하나의 강력한 ‘전문가 팀’, 즉 LambdaMART 모델이 됩니다.
🚀 추론 (Inference) 과정: 새로운 문제에 답하는 법
학습이 완료된 LambdaMART 모델로 새로운 쿼리에 대한 문서 순위를 매기는 과정은 훨씬 간단합니다.
Step 1: 순위를 매길 문서 목록 입력
 * 새로운 쿼리와 함께 순위를 매겨야 할 문서 목록 (예: 20 개의 검색 결과 후보) 이 들어옵니다.
Step 2: 전문가 팀의 점수 합산
 * 목록에 있는 각 문서를 학습된 LambdaMART 모델 (100 개의 트리 앙상블) 에 통과시킵니다.
 * 각 문서는 100 개의 트리를 모두 거치면서 각각의 트리로부터 예측 점수를 받습니다.
 * 한 문서가 100 개의 트리로부터 받은 모든 점수를 합산하여 최종 점수를 계산합니다.
   * 최종 점수 (문서 A) = Tree_1(A) + Tree_2(A) + … + Tree_100(A)
Step 3: 최종 랭킹 결정
 * 모든 문서에 대해 계산된 최종 점수를 기준으로 내림차순 정렬합니다.
 * 점수가 가장 높은 문서가 1 위, 그다음이 2 위… 이렇게 최종 랭킹이 결정됩니다.
요약 비교
| 구분 | 학습 (Training) | 추론 (Inference) |
|---|---|---|
| 목표 | 랭킹 품질 (NDCG) 을 최대화하는 트리 앙상블 모델 만들기 | 새로운 문서 목록의 최적 순위 매기기 |
| 핵심 과정 | 1. 람다 그래디언트 계산 (실수 정의)<br>2. 그래디언트를 예측하는 트리 학습<br>3. 트리를 앙상블에 추가<br>4. 반복 | 1. 각 문서를 모든 트리에 통과시켜 점수 받기<br>2. 트리들의 점수를 모두 합산하여 최종 점수 계산<br>3. 최종 점수로 정렬 |
| 계산 복잡도 | 높음 (반복적으로 그래디언트 계산 및 트리 생성) | 낮음 (학습된 모델로 점수 계산 후 정렬만 수행) |

네, 람다 그래디언트 (Lambda Gradient) 가 구체적으로 어떻게 계산되는지, 핵심 아이디어와 함께 단계별로 설명해 드리겠습니다. 약간의 수식이 포함되지만, 각 수식이 어떤 의미를 갖는지에 집중하시면 쉽게 이해하실 수 있습니다.

핵심 아이디어: 미분 불가능한 지표를 위한 ‘가상의 그래디언트’

가장 먼저 알아야 할 점은, 우리가 최종 목표로 삼는 NDCG 와 같은 랭킹 지표는 미분이 불가능하다는 것입니다. 문서 두 개의 순서가 바뀌면 NDCG 값은 뚝 떨어지거나 쑥 올라가는, 계단처럼 생긴 불연속적인 (non-differentiable) 함수입니다. 따라서 일반적인 경사 하강법 (Gradient Descent) 을 직접 적용할 수 없습니다.

LambdaRank 의 천재적인 아이디어는 여기서 나옵니다.

“진짜 그래디언트를 계산할 수 없다면, 우리가 원하는 방향과 크기를 갖는 ‘가상의 그래디언트’를 만들어서 사용하자!”

이 가상의 그래디언트가 바로 ‘람다 그래디언트’이며, 다음과 같은 두 가지 정보를 모두 담도록 설계되었습니다.

 * 방향 (Direction): 어떤 문서 쌍 (i, j) 에 대해, 모델의 점수 (s_i) 를 높여야 하는가, 낮춰야 하는가? (RankNet 의 아이디어 활용)
 * 크기 (Magnitude): 이 문서 쌍의 순서를 바로잡는 것이 전체 랭킹 품질 (NDCG) 에 얼마나 중요한가?
람다 그래디언트 계산 과정 (Step-by-Step)
특정 쿼리에 대한 한 쌍의 문서 $(U_i, U_j)$ 가 있다고 가정해 보겠습니다. (실제 정답은 U_i 가 U_j 보다 더 관련도가 높습니다. 즉, y_i > y_j)
Step 1: ‘방향’ 계산 - Pairwise 비용 함수 기울기
이 부분은 LambdaRank 의 전신인 RankNet 에서 가져온 아이디어입니다.
 * 모델이 예측한 두 문서의 점수를 s_i, s_j 라고 합시다.
 * 두 점수의 차이를 이용해, 모델이 “문서 i 가 j 보다 관련도가 높다”고 예측할 확률 (P_{ij}) 을 시그모이드 함수로 계산합니다.
   P_{ij} = \frac{1}{1 + e^{-\sigma(s_i - s_j)}}
 * 이 예측이 얼마나 틀렸는지를 나타내는 비용 (Cross-Entropy) 을 미분하면, 점수 s_i 에 대한 기울기 (그래디언트) 의 일부를 얻을 수 있습니다. 이 값은 모델이 예측한 순서가 실제 정답과 얼마나 다른지에 따라 결정됩니다.
   \frac{\partial C}{\partial s_i} = \frac{-\sigma}{1 + e^{\sigma(s_i - s_j)}}
 * 의미: 이 값은 “현재 모델의 예측 (s_i, s_j) 을 보니, 정답 (y_i > y_j) 을 맞추려면 s_i 의 점수를 올려야 한다”는 방향을 알려줍니다.
Step 2: ‘크기’ 계산 - |\Delta NDCG|
이 부분이 바로 LambdaRank 의 혁신적인 부분입니다.
 * 현재 모델의 예측 점수로 정렬된 랭킹 리스트의 전체 NDCG 값을 계산합니다.
 * 이제, 딱 두 문서 U_i 와 U_j 의 위치만 서로 바꿨다고 가정하고, 바뀐 리스트의 NDCG 값을 다시 계산합니다.
 * 두 NDCG 값의 차이의 절댓값, 즉 $|\Delta NDCG_{ij}|$ 를 계산합니다.
   |\Delta NDCG_{ij}| = |NDCG_{\text{original}} - NDCG_{\text{swapped}(i,j)}|
 * 의미: 이 값은 “문서 i 와 j 의 순서를 바로잡는 것이 전체 랭킹 품질에 얼마나 큰 영향을 미치는가?”를 나타내는 **중요도 (크기)**입니다. 랭킹 상위권에 있는 중요한 문서 쌍일수록 이 값은 커집니다.
Step 3: ‘방향’과 ‘크기’의 결합 (람다 그래디언트 완성)
이제 위에서 구한 두 가지 요소를 곱합니다. 이것이 바로 문서 쌍 $(U_i, U_j)$ 에 대한 람다 그래디언트입니다.
\lambda_{ij} = \frac{\partial C}{\partial s_i} \times |\Delta NDCG_{ij}| = \frac{-\sigma}{1+e^{\sigma(s_i-s_j)}} |\Delta NDCG_{ij}|
 * 이 값은 s_i 를 업데이트하는 데 사용됩니다. (s_j 에 대한 그래디언트는 부호만 반대입니다.)
 * 최종 의미: “모델의 예측이 틀렸으니 (\frac{\partial C}{\partial s_i}), 그게 전체 랭킹에 미치는 영향 (|\Delta NDCG_{ij}|) 만큼 강하게 점수를 업데이트해라!”
Step 4: 최종 그래디언트 계산 (문서 단위로 합산)
실제 학습에서는 특정 문서 하나 (U_i) 에 대한 최종 람다 그래디언트 (\lambda_i) 가 필요합니다. 이는 해당 문서가 포함된 모든 쌍에 대한 그래디언트를 합산하여 구합니다.
\lambda_i = \sum_{j} \lambda_{ij}
 * 쉽게 말해: 문서 i 가 이겨야 할 모든 문서들 (y_i > y_j) 로부터는 점수를 올리라는 힘 (그래디언트) 을 받고, 문서 i 에게 져야 할 모든 문서들 (y_i < y_j) 로부터는 점수를 내리라는 힘을 받습니다. 이 모든 힘들을 합산한 것이 최종 \lambda_i 가 됩니다.
이 \lambda_i 가 바로 LambdaMART 학습 과정에서 다음 트리가 예측해야 할 목표값 (pseudo-response) 이 되는 것입니다.
결론
람다 그래디언트는 RankNet 의 안정적인 Pairwise 그래디언트 (방향) 와 랭킹 지표의 변화량 (크기) 을 영리하게 곱한 것입니다. 이 간단한 ‘곱셈’ 아이디어 하나로, 미분이 불가능했던 랭킹 지표를 경사 하강법 기반의 부스팅 모델 (MART) 에서 최적화할 수 있게 만든, 매우 우아하고 강력한 해결책이라고 할 수 있습니다.
