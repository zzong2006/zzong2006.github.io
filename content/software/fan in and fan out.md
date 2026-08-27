---
tags: ["software_design"]
---

# A) Fan in and Fan out ?

## A.1) Fan in

어떤 모듈을 제어 (호출) 하는 모듈의 수  
하나의 모듈이 제어받는 상위 모듈의 수

## A.2) Fan out

어떤 모듈에 의해 제어 (호출) 되는 모듈의 수  
하나의 모듈이 제어하는 하위 모듈의 수

시스템 복잡도 최적화를 위해서는 fan in 은 높게, fan out 은 낮게 설계해야 한다.

# B) 예시

![|600](https://i.imgur.com/QW2dXye.png)

# C) References
