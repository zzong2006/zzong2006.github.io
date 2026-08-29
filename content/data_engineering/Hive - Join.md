---
title: "Hive - Join"
aliases: []
tags:
  - hive
---
Hive에서 조인 명령을 실행할때, 크기가 작은 테이블은 메모리에 캐시하고 크기가 큰 테이블은 맵퍼로 흘려 보낼 수 있다. 하이브는 메모리에 캐시한 작은 테이블로 부터 일치하는 모든 것을 찾아 낼 수 있기 때문에 맵에서 모든 조인을 할 수 있다. 이렇게 하면 일반 조인 시나리오에서 필요한 리듀스 단계를 제거할 수 있다.

데이터가 작을 수록 맵 사이드 조인은 일반 조인보다 효율이 좋다. 리듀스 단계를 제거할 뿐만 아니라 맵 단계 역시 줄어들기 때문이다.맵 사이드 조인을 활성화 하기 위해서는 hive.auto.convert.join 속성을 true로 설정해야한다. 기본값은 false 이다. 맵 사이드 조인을 사용하기 위한 테이블 크기 임계치는 hive.mapjoin.smalltable.filesize 속성값을 설정한다. 단위는 바이트 이다.

## Z.1) Reference

[Title Unavailable \| Site Unreachable](https://m.blog.naver.com/sqlmvp/222045140809)
