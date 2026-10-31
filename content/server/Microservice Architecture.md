---
title: "Microservice Architecture"
tags: 
aliases:
  - MSA
---

# A) MSA ?

마이크로서비스 아키텍처(MSA)는 하나의 큰 애플리케이션을 작은 애플리케이션 여러 개로 쪼개, 변경과 조합이 가능하도록 만든 아키텍처다.

* 작은 레고 블록(microservice)을 하나씩 붙여 큰 결과물을 만드는 레고 놀이와 비슷하다.

## A.1) Monolithic Architecture 와 한계

Monolithic Architecture 는 소프트웨어의 모든 구성 요소가 한 프로젝트에 통합된 형태다.

* 아직 많은 소프트웨어가 monolithic 형태로 구현돼 있다.
* 소규모 프로젝트에는 구조가 간단하고 유지보수가 쉬운 monolithic architecture 가 훨씬 합리적이다.

일정 규모 이상의 서비스나 개발자 수백 명이 투입되는 프로젝트에서는 monolithic architecture 의 한계가 뚜렷하다.

* 서비스·프로젝트가 커질수록 변경 영향도와 전체 시스템 구조를 파악하기 어렵다.
* 빌드·테스트·배포 시간이 기하급수적으로 늘어난다.
* 서비스 일부만 scale-out 하기 어렵다.
* 일부의 장애가 전체 서비스 장애로 이어지는 경우가 생긴다.

![[img-9249da3c93.png]]
