---
title: "namespace(C++)"
tags:
  - Cpp
aliases: [이름 공간, namespace]
---

# A) namespace(C++) ?

어떤 정의된 객체에 대해 어디 소속인지 지정해주는 것

어떤 헤더 파일에 namespace 를 지정한다면, 다른 파일에서 해당 헤더 파일을 include 하여 가져온다음 namespace 내부의 변수나 함수를 사용하는 경우, `namespace::name` 과 같이 변수나 함수의 이름 `name` 을 namespace 뒤에 붙여준다.

`std` 도 namespace 이다. 그래서 `std::cout` 의 `cout` 은 `iostream` 헤더파일의 `std` namespace 안에 정의되어 있는 것이다. 정확히는 `ostream` 클래스의 객체다.

# B) Namespace without name

namespace 에 이름을 설정하지 않아도 되는데, 이런 경우 해당 공간을 정의한 파일 내에서 밖에 접근하지 못한다. static 키워드를 사용한 것과 같은 효과를 낸다고 한다.

예시

```C++
#include <iostream>

namespace {
// 이 함수는 이 파일 안에서만 사용할 수 있습니다.
// 이는 마치 static int OnlyInThisFile() 과 동일합니다.
int OnlyInThisFile() {}
}
```

# C) References

* [씹어먹는 C++ - <1 - 2. 첫 C++ 프로그램 분석하기>](https://modoocode.com/136)
