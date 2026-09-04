---
title: "silhouette score"
aliases: ["실루엣 점수"]
tags:
  - clustering
  - metrics
---

# A) Silhouette Score ?

[[clustering]] 적용 후, 데이터가 얼마나 잘 분류되었는지 수치적으로 확인할 수 있는 값

$$
{\displaystyle s(i)={\frac{b(i)-a(i)}{\max\{a(i),b(i)\}}}}
$$

$-1$ 부터 $1$ 의 값을 가지며, 높을수록 데이터 (object) 가 클러스터에 잘 매치된다는 의미를 가짐

## A.1) Notations

* $a(i)$ 는 같은 클러스터 내부에 있는 모든 데이터들 사이의 **평균** 거리
	* 특정 데이터 $i$ 가 얼마나 클러스터에 잘 할당되었는지 확인하는 값임
* $b(i)$ 는 $i$ 와 다른 클러스터 중, **가장 가까운** 클러스터에 속한 다른 데이터들 간의 **평균** 거리

# B) II. vs. Distortion

* 차이점
	* 실루엣 측정값은 데이터 자체에 대한 클러스터 할당의 적합성을 판단하는 것
	* [[distortion]] 은 전반적인 데이터와 클러스터 중심 간 거리를 계산한다
* 공통점
	* 둘 다 heuristic 하다
