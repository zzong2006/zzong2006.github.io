---
title: "buffer"
tags: operating_system 
aliases: ["버퍼"]
---

# Buffer ?

버퍼는 CPU 와 보조 기억 장치에서 사용되는 임시 저장 공간을 의미한다.

버퍼는 CPU 내부에 있는 cache memory 보다는 느리지만 보조 기억 장치보다 훨씬 빠른 주기억 장치 (RAM) 을 사용한다.

보조기억장치는 주기억장치의 버퍼로 마련해둔 공간에 데이터를 쌓아둔다. CPU 는 작업을 처리하고 버퍼에 데이터가 어느정도 쌓이면 한꺼번에 가져와서 처리를 수행한다. 즉, 버퍼라는 것은 속도차가 큰 두 대상이 IO 를 수행할 때, 효율성을 위해 사용하는 임시 저장공간으로 생각할 수 있다.

# References

* https://dololak.tistory.com/84
