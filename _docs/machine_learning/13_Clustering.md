---
layout: default
title:  "Clustering"
category: Machine Learning
order: 13
---

다차원(high dimensional) 데이터를 이용한 클러스터링은 의미없을 수 있다(may be meaningless). 왜냐하면 **가장 가까운 이웃 간 거리와 이웃들 간 평균 거리의 비율이 차원이 증가할수록 1로 빠르게 접근하기 때문**이다. 즉, 가까운 이웃과 먼 이웃의 구분이 힘들어진다는 의미가 된다.

## K-means Clustering

시간 복잡도 $O(kNrD)$

* $k$ : 클러스터 개수 (사용자에 의해 정의됨)
* $N$ : 객체 개수
* $r$: 수렴할때 까지 반복한 iteration 횟수
* $D$ : 객체의 차원 수 (window를 이용한 clustering의 경우, window 길이)

### K-means optimization object

k-means clustering도 cost function(distortion)이 존재함

* $$
  J(c^{(1)},\cdots,c^{(m)},\mu_1,\cdots,\mu_k)=\frac{1}{m}\sum^m_{i=1}||x^{(i)}-\mu_{c}(i)||^2
  $$

* 이 값은 K가 증가할수록, 항상 감소함

  * 만약, K가 증가했는데 이전보다 cost가 증가할 경우, 그것은 local minima에 빠진것
  * center를 re-initialize한다. 


해당 function을 minimizing 하는 것이 K-means clustering의 목적 

#### 실루엣(Silhouette)

클러스터의 데이터가 얼마나 잘 분류되었는지 수치적으로 확인할 수 있는 값

-1 부터 1의 값을 가지며, 높을수록 데이터(object)가 클러스터에 잘 매치된다는 의미를 가짐

* Distortion과의 비교
  * 실루엣 측정값은 데이터 자체에 대한 클러스터 할당의 적합성을 판단하는 것
  * distortion은 전반적인 데이터와 클러스터 중심 간 거리를 계산
  * 하지만 둘 다 heuristic 하다는 사실은 같음

$$
{\displaystyle s(i)={\frac {b(i)-a(i)}{\max\{a(i),b(i)\}}}}
$$

  * $a(i)$는 같은 클러스터 내부에 있는 모든 데이터들 사이의 **평균** 거리, 특정 데이터 $i$가 얼마나 클러스터에 잘 할당되었는지 확인하는 값임
  * $b(i)$는 $i$와 다른 클러스터 중, **가장 가까운** 클러스터에 속한 다른 데이터들 간의 **평균** 거리 

###  Random Initialization

$K<m$인 경우 전체 $m$개의 데이터 중 distinct한 random data를 center로 선택

Center를 어떻게 초기화하냐에 따라서 cluster의 결과가 달라질 수 있음
* Local optima
* 여러번 random initializing을 수행해서 최적의 solution을 찾음

#### K-means++

* center 초기값 선택 알고리즘
  1. 처음의 임의의 데이터 하나를 중심으로 선택
  2. 선택한 중심과 데이터의 가장 가까운 거리 $D(x)$를 찾고, $D(x)^2$에 비례한 거리에 위치해 있는 데이터 중 확률 분포에 기반하여 임의의 데이터를 뽑아 중심점으로 추가
  3. 2를 K 개의 중심을 찾을 때까지 반복 

### Choosing the Number of Clusters

Elbow Method

<img src="https://i.loli.net/2020/10/17/csmb7X1knSRgMYe.png" alt="image-20201017211129012" style="zoom:80%;" />

#### K-median clustering algorithm

* 클러스터의 중심을 구하기 위해 평균 대신 중간점을 사용하는 방식
* k-means와 다르게 L2-norm 뿐만 아니라 임의의 거리 함수에 대해서도 동작한다.

## Hierarchical clustering

객체 간 pairwise distance matrix를 이용해서, 비슷한 객체 간 중첩된 계층 그룹을 생성하는 방법 

두 가지 방법이 존재한다.

1. Agglomerative: Bottom-up 방식, 각 객체를 개별적 클러스터에 속하게 만들고, 비슷한 클러스터 간 합치면서 최종적으로 하나의 클러스터가 생성될 때 까지 반복
2. Divisive: Top-down 방식, 모든 객체들을 하나의 클러스터에 넣고, 각 객체가 개별적인 클러스터에 속할 때 까지 클러스터의 분할을 반복 

장점

* 클러스터의 개수와 같은 parameter를 사용자가 부여하지 않아도 된다.

단점

* quadratic 계산 복잡도($O(N^2)$)로 인해 작은 데이터셋에만 한정적으로 적용될 수 있다.

### Linkage criteria

Hierarchical clustering은 객체 간 유사도 뿐만 아니라 집합(또는 클러스터) 간 유사도 역시 계산할 필요성이 있는데, 이를 linkage criteria 라고 부른다.

아래는 두 집합 $A$와 $B$ 간 사용할 수 있는 linkage criteria의 일부를 나타낸다.

|                 Names                  |               Formula                |
| :------------------------------------: | :----------------------------------: |
| Maximum or complete-linkage clustering | $\max \{d(a, b): a \in A, b \in B\}$ |
|  Minimum or single-linkage clustering  | $\min \{d(a, b): a \in A, b \in B\}$ |

