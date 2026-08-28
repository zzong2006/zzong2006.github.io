---
title: "bootstrapping"
aliases: ["bootstrapped", "bootstrap", "부트스트랩", "부트스트래핑"]
tags:
  - ensemble
  - statistic
  - sampling
  - reinforcement_learning
---

> The bootstrap is a method to derive the distribution of an estimator by data resampling.

# A) Bootstrapping?

통계랑이나 모델 파라미터 (모수) 의 [[sampling distribution]] 를 추정하는 쉽고 효과적인 방법이다.

주어진 표본에서 추가적으로 표본을 복원 (with replacement) 추출하고, 각 표본에 대한 통계량을 계산하거나 모델을 구성한다 (=a statistical procedure that resamples a single dataset to create many simulated samples).

![](https://i.imgur.com/Z6gwVmj.png)

Bootstrap methods are alternative approaches to traditional hypothesis testing and are notable for being easier to understand and valid for more conditions.

## A.1) 특징

[[central limit theorem]] 을 이용한 방법이기 때문에, 데이터나 표본 통계량이 정규분포를 따라야 한다는 가정이 필요하지 않다.

# B) Bootstrap Algorithm

크기 $n$ 의 샘플의 평균을 구하는 bootstrap 재표본추출 알고리즘

1. 복원 추출을 $n$ 번 반복한다.
2. 재표본추출된 값의 평균을 기록한다.
3. 1 ~ 2 단계를 $R$ 번 반복한다 (많을수록 정확).
4. $R$ 개의 결과를 사용하여

	* 표준 편차 (표본 평균의 [[standard error|표준 오차]]) 를 계산한다.
	* 히스토그램 또는 boxplot 을 그린다.
	* [[confidence interval]] 을 찾는다.
	* $x\%$ 신뢰 구간이란, 표본 통계량의 bootstrap 표본 분포의 90% 를 포함하는 구간을 말한다.

표본 크기 $n$ 과 관심 있는 표본 통계량이 주어졌을 때, bootstrap 신뢰 구간을 구하는 법

1. 데이터에서 복원추출 방식으로 크기 $n$ 인 표본을 뽑는다 (재표본추출).
2. 재표본추출한 표본에 대해 원하는 통계량을 기록한다.
3. $1\sim2$ 단계를 $R$ 번 반복한다.
4. $x\%$ 신뢰구간을 구하기 위해, $R$ 개의 재표본 결과의 분포 양쪽 끝에서 $[(100-x)/2]\%$ 만큼 잘라낸다.

	* 90% 의 경우 양쪽 끝에서 5% 씩 잘라냄

5. 절단한 점들은 x% bootstrap 신뢰 구간의 양 끝점이다.

# C) Bootstrapping in RL

[[state-value function]] $v(s)$ 를 업데이트 하기 위해서는 이전에 계산된 $v(s)$ 을 활용하여 추정 값을 반복적으로 계산할 수 있다. 이러한 과정을 bootstrapping 이라 한다.

다만, 이렇게 수행하는 방식은 states 가 너무 많은 경우 실행이 불가능하다.

많은 [[Reinforcement Learning]] 방법은 [[RL/DP (Reinforcement Learning)|DP]] 에서 요구되는 완전하고 정확한 환경 모델 ([[Markov Decision Process|MDP]]) 없이도 bootstrapping 을 수행한다.

# D) Related

[[bagging]]
