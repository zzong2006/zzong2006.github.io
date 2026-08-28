---
title: "reference(C++)"
tags: ["Cpp"]
aliases: ["참조자", "reference"]
---

# A) reference(C++) ?

`int` 형 변수의 참조자를 만들고 싶을 때에는 `int&` 를, `double` 의 참조자를 만드려면 `double&` 로 하면 됩니다. 심지어 `int*` 와 같은 포인터 타입의 참조자를 만드려면 `int*&` 로 쓰면 됩니다.

# B) Vs. Pointer

레퍼런스와 포인터는 상당히 유사하지만 차이점이 있다.

1. 레퍼런스는 정의 시에 반드시 누구를 refer 하는지 명시해야 한다. 예를 들어 `int& p;` 와 같은 선언은 불가능하다. 반대로 포인터의 경우는 가능하다.
2. 레퍼런스가 한 번 정해지면 그 이후로는 다른 변수를 참조할 수 없다. 다음의 예시를 참고하자.

```C++
int a = 10;
int &another_a = a; // another_a 는 이제 a 의 참조자!

int b = 3;
another_a = b; // b의 값 3을 a에 할당한것과 마찬가지, 즉, a = b 이다.
```

# D) References

* [씹어먹는 C++ - <2. C++ 참조자(레퍼런스)의 도입>](https://modoocode.com/141)
