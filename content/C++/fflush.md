---
title: "fflush"
tags: ["function", "Cpp"]
---

# `fflush`

`fflush` 함수는 `stdio.h` 에 선언되어 있는 C 표준 함수

`int fflush( FILE *stream );`

`stream` 에 대한 버퍼의 데이터를 꺼내어 출력 스트림에 쏟아붓는 (flush) 함수이다. 대표적인 출력 스트림은 `stdout`, `stderr` 가 있다.

## 예시

```c++
fflush(stdout)
```

`stdout`(표준 출력 버퍼) 에 있는 데이터를 꺼내어 출력 스트림에 입력

# References
