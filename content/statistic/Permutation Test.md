---
title: "Permutation Test"
tags: ["hypothesis_test"]
aliases: ["순열 검정"]
---

# A) Permutation Test ?

비모수 통계 기법 중 순열 검정 (permutation test) 을 이용하면 데이터의 모집단 분포가 정규분포를 따르지 않거나 특이한 통계량을 사용하더라도 표본 집단간 비교를 수행할 수 있다

두 표본 집단이 하나의 모집단에서 나왔다는 [[null hypothesis|귀무가설]] 이 참이라면, **두 그룹 안에 있는 샘플들을 교환한 뒤 통계적으로 검증해도 여전히 두 그룹간에는 차이가 없어야 한다**. 이 부분이 순열 검정의 핵심이다.

순열 검정은 샘플들을 섞어가면서 통계량을 여러번 추출하고, 추출된 통계량들의 값의 분포를 확인해보면서 원래 주어진 데이터에서 계산한 통계량과 비교한다.

순열 검정 과정을 통해서 얻어진 결과가 기존 결과와 차이가 없다면, 관찰된 차이가 우연히 일어날 수 있는 범위에 있다는 의미가 된다. 하지만, 그 반대의 경우 기존 결과는 우연이 아니므로 통계적으로 유의미하다 ([[statistical significance]]) 라고 명할 수 있다.

# B) 절차

[[AB Test]] 와 비슷하게 A 와 B 그룹을 비교한다고 가정한다.

1. A 와 B 에 대한 통계량 차이를 계산한다.
2. 두 그룹에 대한 결과를 섞어서 하나의 데이터셋으로 만든다.
3. replacement 없이 데이터를 꺼내서 A 와 B 를 구성한다.

# C) Vs. Bootstrap

부트스트랩도 permutation test 와 유사하게 추정량 (estimator) 에 대한 분포를 확인하게 해주는 비모수 통계 기법이다.

다음은 순열 검정과 부트스트랩의 두 가지 차이점이다.

1. [[bootstrapping|bootstrap]] 은 estimator 의 [[confidence interval]] 을 확인하기 위한 목적으로 주로 사용되는 반면, Permutation test 는 null hypothesis 를 test 하기 위해 만들어졌다.
2. 수행 과정 상에서는 Bootstrap 은 중복을 허용하는 resampling 을 수행하는 반면 permutation test 는 중복없는 재배열을 수행한다는 차이점이 있다.

# D) 순열 검정 ?

[[AB Test]] 를 위한 방법 중 하나

## D.1) 절차 (순열 반복)

1. 그룹 A 와 그룹 B 의 결과를 하나로 합친다.
	* 이렇게 하는 이유는 그룹들에 적용된 방식의 결과가 서로 다르지 않다는 [[null hypothesis]] 를 적용한 것임
2. 이후 그룹 A 와 동일한 크기의 표본을 무작위로 비복원 추출한다.
	* 이럴 경우, 다른 그룹 (B) 의 데이터를 포함할 수 있다.
3. 나머지 데이터에서 그룹 B 와 동일한 크기의 샘플을 무작위로 비복원 추출한다.
4. 추출된 재표본에 대해서 metrics 들을 재계산하고 기록한다 (여기까지가 순열 반복의 한 싸이클)
5. (1 ~ 5) 의 과정을 $R$ 번 반복하여 검정 통계량의 순열 분포를 얻는다.

# E) Related

# F) References

* https://angeloyeo.github.io/2021/10/28/permutation_test.html
