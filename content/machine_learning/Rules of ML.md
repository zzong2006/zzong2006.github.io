---
title: "Rules of ML"
tags: ["tech_blog", "machine_learning", "Google", "lessons"]
---

구글에서 제공하는 머신러닝을 활용할때 알아야할 규칙들

좋은 product 를 만들기 위해서는 “”.. ?

# A) Before Machine Learning

**(1) ML 없이 product 를 런칭하는 것을 두려워 하지 말라.**

ML 은 좋지만 데이터가 필요하다. 이론적으로 다른 문제로부터 데이터를 얻어와서 새로운 product 를 위한 모델을 만들 수 있지만, 이런짓은 일반적으로 휴리스틱보다 못하다. 만약 당신이 ML 을 통해서 100% 향상이 있다고 생각한다면, 휴리스틱은 50% 정도는 보장해줄 것이다.

예를 들어, 앱 마켓에서 앱들을 랭킹하는 문제를 푼다면, 설치 횟수와 같은 휴리스틱한 방법으로 랭킹을 정할 수 있을 것이다.

만약 product 에 ML 이 반드시 필요하지 않다고 한다면,데이터가 모이기 전까진 ML 을 사용하지 말라.

**(2) 먼저 metrics 을 디자인하고 구현하라.**

당신의 ML 시스템이 어떤 일을 할지 정의하기 전에, 현재 시스템에 대해서 최대한 조사하라. 문제를 찾고싶다면 metrics 을 추가하여 확인하라 !

**(3) 복잡한 휴리스틱 대신 ML 을 선택하라.**

복잡한 휴리스틱은 유지하기 어렵다. 데이터를 확보하고 뭘 달성할지 기본적인 아이디어가 있다면 ML 로 넘어가라.

# B) ML Phase 1: 첫번째 파이프라인

1. 첫 모델은 단순하게, 그리고 적합한 인프라를 찾아라.
첫 모델은 당신의 product 의 매우 큰 boost 를 가져다 줄것이다. 그래서 fancy 할 필요는 없다. 그러나 인프라 이슈는 기대한것보다 더 많이 마주치게 될 것이다.

2. 인프라를 ML 과 독립적으로 테스트하라.
3. 파이프라인을 복사하는 과정에서 데이터 손실을 주의하라.
4. 휴리스틱들을 feature 로 전환하거나 외부적으로 다뤄라.

## B.1) 모니터링

1. 시스템의 최신성 (freshness) 이 얼마나 필요할지 파악하라.
2. 모델을 출하하기 전에 문제를 미리 파악하라.
사용자가 이슈를 마주하기 전에 sanity 체크를 수행하라. 많은 팀들이 계속적으로 [[ROC Curve]] 를 통해 모델을 체크하고 있다.

3. 조용한 실패를 주시하라.
4. feature columns 에 대한 소유자를 정하고 문서화를 시도하라.
시스템이 커지면 매우 많은 feature column 들이 존재하게 된다. 그리고 각 column 을 누가 만들고 유지하는지 알 필요가 있다. 물론 많은 column 이 이름을 통해 의미를 대략적으로 파악할 수 있지만, 어떤 feature 인지, 어디서 왔는지, 어떻게 도움이 될 것인지와 같은 더욱 디테일한 설명이 있으면 좋다.

## B.2) 첫번째 목적

시스템에 대한 많은 metrics 또는 measurements 이 존재하지만, ML 알고리즘은 종종 하나의 objective, 즉, 알고리즘이 최적화하려는 하나의 값만을 가지게 된다. 그래서 metrics 과 objectives 는 서로 다른데, metrics 은 시스템이 리포트하는 값들로, 중요할수도 중요하지 않을수도 있다.

1. 직접적으로 최적화하려는 objective 를 너무 깊이 생각하지 말라.
직접적으로 최적화하지 않아도 영향을 받는 metrics 은 많다. 예를 들어, 어떤 사이트에 대한 클릭 횟수랑 소비 시간을 늘리고 싶다면, click 횟수만 최적화 하더라도 소비 시간이 늘어날 것이다.
그래서, 만약 모든 metrics 이 함께 증가할 수 있는 경우라면, 서로 다른 metrics 에 대해 밸런싱하는 것을 너무 깊이생각하지 말고 단순화해라. 그러나 이 규칙을 통해 선을 넘지는 말라.

2. 관측가능하고, 간단하고, 속성화 (atrributable) 할 수 있는 metric 을 첫번째 objective 로 잡아라.
ML objective 는 쉽게 측정이 가능하고 “true” objective 에 대한 [[proxy]] 여야 한다.

3. 해석가능한 모델로 시작해서 디버깅을 쉽게 하라.
[[linear regression]], [[logistic regression]], 그리고 Poisson regression 들은 확률 모델로부터 직접적으로 영감을 받는 것 들이다. 각 prediction 은 어떤 확률이나 기대값으로 해석이 가능하다.

4. Policy 레어이에 있는 스팸 필터링과 퀄리티 랭킹을 분리하라.

# C) ML Phase 2: Feature Engineering

1. 런칭할 계획
2. 더 이상 사용하지 않는 feature 는 정리해라.
사용하지 않는 feature 들은 기술적 부채를 야기한다.

## C.1) 시스템의 Human 분석

기존 모델을 어떻게 확인하고 발전시킬 수 있을 것인가? 이를 위해 피해야할 여러 안티패턴들이 존재한다.

1. 당신은 일반적인 end user 가 아니다.

## C.2) 학습 - 서빙 Skew

1. 데이터를 임의로 버리지 말고 importance weight sample 을 하라.

# D) ML Phase 3: 느린 성장, 최적화 정제, 그리고 복잡한 모델들

두번째 phase 가 끝날쯤이면, metrics 간 tradeoff 가 시작된다: 실험에서 어떤 것들은 오르고, 어떤 것들은 떨어진다. 이때 gain 을 획득하기 어려워지므로, ML 은 더 복잡해져야 한다. 이 phase 에서 소개하는 규칙은 phase 1, 2 보다는 덜 practical 하다. Phase 3 에 도달하는 팀들은 일반적으로 자신만의 길을 찾아간다.

1. 만약 정리되지 않은 objective 가 이슈라면, 새로운 feature 에 시간을 낭비하지 말아라.
2. 만약 성능이 일정하다면, 기존 signal 에 대한 정제보다는 퀄리티있는 새로운 정보를 찾아라.

# E) Others

다른 source 를 공부하면서 알게된 내용들을 적는다.

1. sophisticated algorithm $≤$ simple learning algorithm + good training data

# F) References

* https://developers.google.com/machine-learning/guides/rules-of-ml?hl=ko
