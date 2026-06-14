---
title: "TOROS"
tags: ["work", "kakao", "recommendation_system"]
---

# A) TOROS ?

토로스 (TOROS) 는 카카오의 자체 개발 인공지능 추천 플랫폼이다.

## A.1) 구현 언어

대부분은 [[Python]] (Python 2) 으로 작성되고, 일부 모듈은 C/C++ 로 작성

### A.1.1) Why Python?

* 빠른 개발 속도 (C++ 에 비해 매우 빠름) 및 저렴한 유지 비용
* 폭 넓은 라이브러리, full-stack 개발을 위해 다양한 라이브러리가 요구되는데 Python 이 적합함
* 활발한 커뮤니티
* 확장성, Python 표준이 C-based (CPython) 이므로, C/C++ 의 유명 라이브러리를 가져다 Python 에 쉽게 적용할 수 있음

### A.1.2) Why Python2?

* 처음에 Python2 에서 시작했다가, Python3 가 나왔는데, Python2 에서 지원되는 library 가 3 에서는 지원되지 않는 것이 많음

# B) TOROS 의 시스템 구성

## B.1) Service Layer

* 하나의 서비스에 여러 추천 기능이 포함되어 있습니다.
* 이벤트 (events): 사용자와 아이템 간의 상호작용을 의미합니다. 예를 들어, 추천된 결과를 클릭하거나 무시하는 경우, 좋아요/싫어요 표시 등이 있습니다.

## B.2) Front App

* 필요한 추천 결과를 TOROS 에서 가져와 사용합니다.

## B.3) App Layer

* Back-end Storage Layer 에서 필요한 모든 자원을 가져와 추천을 수행합니다. 예를 들어, 아이템 특징 (item features) 과 사용자 특징 (user features) 을 조합하여 사용합니다.
* App layer 입장에서는 추천에 필요한 모든 데이터가 준비되어 있다고 가정합니다.

## B.4) Kafka Layer

* Service layer 에서 이벤트가 발생하면, 이에 따른 적절한 액션을 다른 레이어에서 취하도록 알립니다. 이는 event driven architecture 를 따릅니다.

# C) Related

# D) References
