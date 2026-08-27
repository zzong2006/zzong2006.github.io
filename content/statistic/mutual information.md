---
tags: ["information_theory", "statistic"]
aliases: ["MI"]
---

# A) Mutual Information

Mutual Information(MI)은 두 random variable이 **얼마나 많은 정보를 공유하는지** 를 측정한다. 조금 더 직관적으로 말하면, $X$를 알게 되었을 때 $Y$에 대한 불확실성이 얼마나 줄어드는지를 보는 값이다.

두 변수가 완전히 독립이면 $X$를 알아도 $Y$에 대해 새로 알게 되는 것이 없다. 이때 MI는 `0`이다. 반대로 $X$를 알면 $Y$를 꽤 잘 예측할 수 있다면 MI는 커진다.

다만 MI는 보통 `0~1` 사이의 score가 아니다. log base를 2로 쓰면 단위는 bit, 자연로그를 쓰면 nat이 되고, 값의 크기는 변수 자체의 entropy scale에 따라 달라진다. 그래서 feature selection에서 MI를 볼 때도 "1에 가까우면 좋다"처럼 읽기보다는, **같은 설정에서 feature들 사이의 상대적인 의존성** 을 비교하는 용도로 보는 편이 안전하다.

# B) 직관

MI는 "같이 자주 나타나는가?"만 보는 값이 아니다. 핵심은 **독립이라고 가정했을 때 기대되는 발생 확률과 실제 joint probability가 얼마나 다른가** 다.

예를 들어 어떤 feature $X$와 class label $Y$가 독립이라면 다음이 성립한다.

$$
p(x,y) = p(x)p(y)
$$

이 경우 $x$가 관찰되었다는 사실은 $y$의 확률을 바꾸지 않는다. 그래서 공유하는 정보량은 없다.

반대로 $p(x,y)$가 $p(x)p(y)$보다 자주 나타나는 조합이 많다면, $X$를 관찰하는 것이 $Y$를 추론하는 데 도움이 된다. MI는 이런 차이를 전체 가능한 값에 대해 평균낸 값이다.

# C) 정의

두 변수 $X$, $Y$의 mutual information은 joint distribution과 marginal distribution의 곱 사이의 [[KL-Divergence]]로 정의할 수 있다.

$$
I(X;Y)=D_{\mathrm{KL}}\left(P_{X,Y}\|P_X P_Y\right)
$$

여기서:

| 기호 | 의미 |
| --- | --- |
| $P_{X,Y}$ | $X$와 $Y$의 [[joint distribution]] |
| $P_X$, $P_Y$ | 각각의 marginal distribution |
| $P_XP_Y$ | 두 변수가 독립이라고 가정했을 때의 joint distribution |
| $D_{\mathrm{KL}}$ | 두 distribution이 얼마나 다른지 재는 값 |

즉, MI는 **실제 joint distribution이 독립 가정과 얼마나 멀리 떨어져 있는지** 를 재는 값이다. 두 변수가 독립이면 $P_{X,Y}=P_XP_Y$가 되므로 KL-Divergence도 `0`이 된다.

## C.1) Discrete Case

이산 변수에서는 다음처럼 쓴다.

$$
I(X;Y)=\sum_x \sum_y p(x,y)\log\frac{p(x,y)}{p(x)p(y)}
$$

안쪽의 log 항은 특정 outcome pair $(x,y)$의 [[information_theory/pointwise mutual information|PMI]]다.

$$
\operatorname{pmi}(x;y)=\log\frac{p(x,y)}{p(x)p(y)}
$$

따라서 MI는 PMI를 joint probability $p(x,y)$로 가중 평균한 값으로 볼 수 있다.

$$
I(X;Y)=\mathbb{E}_{(x,y)\sim p(x,y)}[\operatorname{pmi}(x;y)]
$$

PMI가 특정 pair 하나의 연관성을 본다면, MI는 변수 전체 수준에서 $X$와 $Y$가 얼마나 의존적인지를 본다.

# D) Entropy로 보는 MI

MI는 [[conditional entropy]]와 [[joint entropy]]로도 표현할 수 있다.

$$
\begin{aligned}
I(X;Y)
&= H(X)-H(X\mid Y) \\
&= H(Y)-H(Y\mid X) \\
&= H(X)+H(Y)-H(X,Y)
\end{aligned}
$$

첫 번째 식을 말로 풀면 이렇다.

> $Y$를 알고 난 뒤 줄어든 $X$의 불확실성이 $X$와 $Y$가 공유하는 정보량이다.

$H(X)$는 $X$ 자체의 불확실성이고, $H(X\mid Y)$는 $Y$를 알고 난 뒤에도 남아 있는 $X$의 불확실성이다. 따라서 둘의 차이가 크면 $Y$가 $X$를 설명하는 데 도움이 된다는 뜻이다.

# E) 주요 성질

| 성질 | 의미 |
| --- | --- |
| Non-negative | $I(X;Y)\ge 0$ |
| Symmetric | $I(X;Y)=I(Y;X)$ |
| Independence | $X$와 $Y$가 독립이면 $I(X;Y)=0$ |
| Upper bound | 이산 변수에서는 $I(X;Y)\le \min(H(X), H(Y))$ |
| No direction | MI는 의존성의 강도를 재지만, 인과 방향을 알려주지는 않는다 |

MI가 대칭이라는 점은 중요하다. $I(X;Y)$와 $I(Y;X)$는 같다. 그래서 MI만으로는 "$X$가 $Y$의 원인이다" 같은 방향성을 말할 수 없다.

# F) Correlation과 비교

[[correlation]]과 MI는 모두 두 변수의 관계를 보는 지표지만, 읽는 방식이 다르다.

| 관점 | Correlation | Mutual Information |
| --- | --- | --- |
| 잡아내는 관계 | 주로 선형 관계 | 선형/비선형 의존성 모두 가능 |
| 부호 | 양/음의 방향이 있음 | 방향이나 부호가 없음 |
| 독립 판단 | correlation이 0이어도 독립이라고 단정할 수 없음 | MI가 0이면 독립 |
| 해석 난이도 | 비교적 직관적 | estimator와 scale에 주의 필요 |

예를 들어 $Y=X^2$처럼 비선형 관계가 강한 경우, Pearson correlation은 낮게 나올 수 있다. 하지만 $X$를 알면 $Y$에 대한 정보가 분명히 생기므로 MI는 이런 의존성을 포착할 수 있다.

대신 MI는 "양의 관계인지 음의 관계인지"를 말해주지 않는다. 관계의 방향이나 형태를 보고 싶다면 scatter plot, partial dependence, SHAP, calibration plot 같은 다른 확인이 필요하다.

# G) Feature Selection에서 쓰는 법

Feature selection에서는 feature $X_j$와 target $Y$ 사이의 MI를 계산해서, target에 대한 정보가 많은 feature를 찾는다.

$$
I(X_j;Y)
$$

이 값이 크다는 것은 해당 feature를 알 때 target에 대한 불확실성이 더 많이 줄어든다는 뜻이다. classification에서는 `mutual_info_classif`, regression에서는 `mutual_info_regression` 같은 구현을 사용할 수 있다.

다만 실무에서는 몇 가지를 조심해야 한다.

1. MI는 보통 univariate score다. 각 feature와 target의 단일 관계를 보므로, feature끼리 중복된 정보를 들고 있는지는 잘 보지 못한다.
2. MI가 낮다고 바로 쓸모없는 feature라고 단정하면 위험하다. 다른 feature와 조합될 때만 의미가 생기는 interaction feature일 수 있다.
3. Continuous variable의 MI는 estimation 방식에 민감하다. binning, kNN estimator, sample size에 따라 값이 달라질 수 있다.
4. Feature cardinality가 높은 경우 MI가 유리하게 나올 수 있다. 필요하면 normalized MI나 validation 성능으로 다시 확인한다.

그래서 MI는 "최종 판단"이라기보다 feature 후보를 좁히는 빠른 신호로 보는 편이 좋다. 점수가 높은 feature를 고른 뒤에는 모델 성능, leakage 여부, feature importance, 실제 데이터 분포를 같이 확인해야 한다.

# H) 한 줄 요약

MI는 두 변수가 독립일 때 기대되는 joint distribution과 실제 joint distribution의 차이를 재는 값이다. $X$를 알면 $Y$의 불확실성이 얼마나 줄어드는지로 읽으면 가장 자연스럽다.

# I) References

- Thomas M. Cover, Joy A. Thomas, "Elements of Information Theory", 2nd Edition.
- Scikit-learn Docs, "mutual_info_classif". https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.mutual_info_classif.html
- Scikit-learn Docs, "mutual_info_regression". https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.mutual_info_regression.html
