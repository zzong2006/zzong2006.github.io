---
title: "federated learning"
tags:
  - machine_learning
  - recommendation_system
aliases: []
---

# A) Federated Learning ?

> 데이터를 하나의 저장소로 모으지 않고 모델을 학습할 수 없을까?

데이터를 특정 서버에 모으지 않고 개인 디바이스에서 학습하는 방식으로, 데이터 이동 이슈를 해소하기 위한 방안으로 많이 연구되고 있다.

# B) Federated Recommender System (FedRec)

다수의 참여자 (party) 가 데이터 공유를 제한적으로 수행해서 학습하는 추천 시스템

## B.1) (1) Horizontal FedRec

1. 추천 아이템 풀은 공유하지만, 사용자 풀은 거의 공유하지 않음
2. 사용자의 소비 로그를 하나의 시스템으로 모으지 않고 추천해야 하는 시나리오.
3. Framework
	1. 중앙 시스템은 공유하는 아이템에 대한

아이템 풀이 많아질수록 취약해질 것 같다는 생각이 있음

## B.2) (2) Vertical FedRec

추천 아이템 풀이나 사용자 feature 데이터는 거의 공유하지 않지만, 사용자는 대부분 공유하는 시나리오

## B.3) (3) Transfer FedRec

사용자도 거의 겹치지 않고, 추천 아이템 풀도 거의 겹치지 않는 추천 시나리오.

# C) References
