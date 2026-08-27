---
tags: ["recommendation_system"]
aliases: ["POI 추천"]
---

# 1. POI Recommendation ?

* [[POI]] 추천은 지역 기반 소셜 네트워크 (Location Based Social Network, LBSN) 의 관련 데이터나 사용자의 과거 체크인 이력을 활용해서, 사용자에게 적합한 미래의 POI 를 제공하는 문제를 말한다.
* $N$ 명의 LBSN 사용자 집합 $U=\left\{u_{1},u_{2},\ldots u_{N}\right\}$ 와 LBSN 의 $M$ 개의 POIs 들이 포함된 집합 $P=\left\{p_{1},p_{2},\ldots p_{M}\right\}$ 이 존재한다고 하자.
* 사용자 간 연결이 포함된 집합 $\ddot{U}=\left\{\left\langle u_{i},u_{j}\right\rangle\mid u_{i},u_{j}\in U\right\}$ 이 존재할 수 있다.
* 각 [[POI]] $p$ 는 위도 $x_p$, 경도 $y_p$, 그리고 POI semantics 을 표현하는 attributes 의 한 집합 $W_p$ 이 코드화되어 있다.
	* 이러한 정보들을 일반적으로 user check-in 정보라고 한다.
	* POI semantics features 에는 POIs 생성 날짜, check-in 횟수, geolocations (latitude, longitude), 사용자 reviews 등 이 존재한다.

# 2. Related
