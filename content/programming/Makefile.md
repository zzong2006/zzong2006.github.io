---
title: "Makefile"
tags: C++ 
aliases: []
---

# Makefile ?

컴파일 과정을 적은 파일

# 구조

Makefile 은 대상 (Target), 의존 관계 (Dependency), 명령 (Recipe) 의 세 가지로 이뤄진다.

* Target: 빌드 대상 이름
* dependency: 대상을 만들 때 의존되는 파일들
* recipe: 빌드 대상을 생성하는 명령. 명령을 쓸 때 반드시 tab(`\t`) 키로 띄어준 후에 써야한다.

아래는 세가지 요소를 어떤식으로 적어야 하는지 그 예시이다.

```plain text
<target> : <dependency>
(tab)<Recipe>
```

# References
