---
layout: default
title:  "Association Rule Learning"
category: Machine Learning
order: 18.2
---

연관 규칙 학습은 데이터베이스에 존재하는 변수들 간의 연관성을 발견하는 방법이다.

연관 규칙은 일반적으로 다음과 같이 표기된다.

$$
\{\text { onions, potatoes }\} \Rightarrow\{\text { burger }\}
$$

* 위 규칙은, 어떤 고객이 양파와 감자를 함께 샀다면, 햄버거도 같이살 확률이 높다는 것을 의미한다.

이러한 정보를 기반으로 마켓팅 활동에 대한 결정을 내린다.



## 정의

$$I=\left\{i_{1}, i_{2}, \ldots, i_{n}\right\}$$ 는 items이라 불리는 $n$개의 이진 속성들을 의미한다.

* 아래 테이블 예시를 통해서 $I=\{$ milk, bread, butter, beer, diapers $\}$ 로 표현된다.

$$D=\left\{t_{1}, t_{2}, \ldots, t_{m}\right\}$$ 는 database라 불리는 transactions의 집합을 의미한다.

* 아래 테이블 예시를 통해서 transaction $t_1$는 milk 와 bread item으로 구성되있음을 알 수 있다.

$D$ 에 존재하는 각 transaction은 고유 ID와 $I$ 에 존재하는 items의 부분 집합을 포함한다.

* ID = 1인 $t_1$은 $\{$ milk, bread $\}$ 라는 $I$의 부분 집합을 가진다.

규칙은 다음과 같은 암묵적 형태로 표현된다: $X \Rightarrow Y$, where  $X, Y \subseteq I$

* 또한 규칙은 특정 집합과 하나의 item에 대해서만 정의된다: $X \Rightarrow i_{j}$ for $i_{j} \in I$
* $\{$ butter, bread $\} \Rightarrow\{\mathrm{milk}\}$ 는 butter와 bread가 같이 구매되면, 해당 고객은 milk 도 함께 산다는 규칙을 의미한다.

<img src="https://i.loli.net/2020/11/28/axr1LiHj569Ugcp.png" alt="image-20201128180606645" style="zoom: 80%;" />

## Useful Concepts

모든 규칙들이 각각 얼마나 중요한지 알 수 있는 방법이 존재한다면, 특정 임계치를 정해서 그 임계치 이상을 가진 규칙들만 중요한 규칙으로 고려할 수 있을 것이다.



### Support (지지도)

support 값은 그 itemset이 얼마나 데이터베이스에 자주 등장하는지 나타내는 지표다.

itemset $X$ 에 대한 $T$의 support는 $X$를 포함한 transactions $t$의 비율에 비례한다.

$$
\operatorname{supp}(X)=\frac{|\{t \in T ; X \subseteq t\}|}{|T|}
$$

* 예를 들어 itemset $X=\{$ beer, diapers $\}$ 의 support 값은 0.2 (=1/5) 이다. 왜냐하면 오직 5개의 transactions중 $t_3$ 만 해당 itemset 을 포함하기 때문이다.

### Confidence

confidence는 그 규칙이 참(true)로 여겨지는 빈도를 나타내는 지표다.

$X \Rightarrow Y$ 에 대한 confidence 값은 itemset $X$ 를 포함하면서 동시에 itemset $Y$를 포함하는 transactions의 비율에 비례한다.

$$
\operatorname{conf}(X \Rightarrow Y)=\frac{\operatorname{supp}(X \cup Y)}{\operatorname{supp}(X)}
$$

* 예를 들어, $\{$ butter, bread $\} \Rightarrow\{\mathrm{milk}\}$ 에 대한 confidence 값은 1.0 (=0.2/0.2) 이다. 즉, butter와 bread를 사는 고객은 반드시 100% 확률로 milk를 같이 산다는 의미다.
* $X \cup Y$ 는 itemset 간 합집합을 의미한다.

### Lift

lift 규칙은 다음과 같이 정의된다.

$$
\operatorname{lift}(X \Rightarrow Y)=\frac{\operatorname{supp}(X \cup Y)}{\operatorname{supp}(X) \times \operatorname{supp}(Y)}
$$

* 예를 들어, $\{$ milk, bread $\} \Rightarrow\{$ butter $\}$ 의 lift 값은 $\frac{0.2}{0.4 \times 0.4}=1.25$ 이다.

lift 값에 대한 해석은 1을 기준으로 달라진다.

* 만약 lift 값이 1이면, $X$ 와 $Y$에 관련된 이벤트가 각각 독립되었다는 것을 의미한다. 
* 만약 lift 값이 1 미만이면, 두 이벤트가 서로 양의 상관 관계를 가짐을 알 수 있다. 즉, 한쪽 itemset 이 등장할 수록, 대응되는 itemset 이 동시에 등장할 확률이 높다.
* 만약 lift 값이 1 이상이면, 두 이벤트가 서로 음의 상관 관계를 가짐을 알 수 있다. 즉, 한쪽 itemset 이 등장할 수록, 대응되는 itemset 이 동시에 등장할 확률이 낮다.



## Process

연관 규칙들은 일반적으로 사용자가 정의한 최소 support 값과 최소 confidence 값을 동시에 만족시킬 수 있는 규칙을 의미한다. 해당 규칙들을 생성하는 과정은 두 step으로 분리된다.

1. 최소 support 임계치(threshold)는 데이터베이스에 존재하는 frequent itemset들을 전부 찾기위해 사용된다.  
2. 최소 confidence 제약(constraint)은 (1)에서 찾은 frequent itemset으로부터 규칙을 형성하기 위해 사용된다.

과정 (2)는 상당히 직관적이지만, (1)에 대해서는 많은 연산량이 요구된다. $I$ 에 존재하는 $n$개의 item들에 대한 frequent itemset을 찾는 것은 $2^n-1$ 개의 경우의 수를 고려해야 한다(empty set 제외).

이러한 많은 경우의 수를 효율적으로 고려하기 위해서 support 값의 downward-closure 속성(또는 anti-monotonicity 라고 부름)을 활용하는데, 이것은 어떤 itemset 이 frequent 하지 않으면, 해당 itemset을 포함하는 모든 superset(초집합)도 frequent하지 않다는 특성을 의미한다.



## Algorithms

아래 주어진 알고리즘은 frequent itemset 을 효율적으로 찾기위한 알고리즘이다. 해당 알고리즘은 오직 frequent itemset을 찾는 과정에만 관여하기 때문에, 이후 찾은 itemset 에 기반하여 최소 confidence 값을 만족하는 규칙들을 찾는 것은 여러분들의 몫이다.

### Apriori algorithm



### Eclat algorithm



### FP-growth algorithm