---
tags: ["server", "inference"]
---

# A) Kernel Fusion ?

GPU 는 Kernel 단위로 연산이 이루어 지게 됩니다. 예를 들어 우리가 두개의 텐서를 서로 MatMul 후에 Add 하는 연산을 수행할 때, Matmul Kernel, Add Kernel 이렇게 두개의 커널을 실행하게 됩니다. 이때 두개의 커널을 실행하는 대신 두개의 커널을 MatmulAdd 라는 하나의 커널로 합쳐 실행하는 것을 Kernel Fusion 이라고 합니다.

![](https://i.imgur.com/5DGOTtY.png)

# B) Why We Need Kernel Fusion?

위 예시에서 Matmul Kernel 의 결과를 메모리에 저장하고 Add Kernel 이 다시 메모리에 저장된 결과를 불러와 연산에 사용해야 하는 overhead 가 발생하는데, kernel 내에서 sharedmemory 나 register 를 공유해 이러한 overhead 를 제거할 수 있습니다.

Kernel Fusion 은 주어진 연산 그래프가 있을 때 잘 알려진 패턴이 보이면 이를 Fused 된 Kernel 로 교체하여 성능 최적화를 만들어냅니다. 이 기법은 학습/평가시에 모두 적용할 수 있음으로 딥러닝 모델 사용시에 매우 유효한 최적화 전략 중 하나입니다.

Kernel Fusion 을 수행하는 방법으로는 직접 Kernel 을 CUDA C++ 로 작성하는 방법이 있고, [[TensorRT]] 와 같이 자동으로 Kernel Fusion 을 지원하는 툴들을 이용하여 학습된 모델을 최적화 하는 방법도 있습니다.

# C) Related

# D) References

[새로운 루다를 지탱하는 모델 서빙 아키텍처 — 3편: 안정적인 LLM 서비스를 위한 서빙 최적화 기법 – 스캐터랩 기술 블로그](https://tech.scatterlab.co.kr/serving-architecture-3/)
