---
title: "Container and container orchestrator"
tags: ["Kubernetes"]
---

# Container and Container Orchestrator ?

# Virtual Machine 과 Container 의 차이점

* VM 가상화는 일반적으로 linux kernel 위에 hypervisor 가 올라가고, 그 위에 guest OS 와 사용자 app 이 올라감
* 반면, container 는 linux kernel 에 내장되어 있는 namespace 와 cgroup 등을 활용하여 host 의 kernel 을 공유하기 때문에 좀 더 가벼운 가상 환경을 구성할 수 있음

# Container Orchestration

* Docker 는 하나의 머신에서만 유효한 도구
	* 대규모 서비스를 배포하려면 다수의 머신에서 workload 를 분산할 필요가 있기에 도커로는 무리임
* container orchestration 도구들이 하는 역할
	* 여러 컴퓨터의 클러스터에 어떻게 container instance 를 provision 할 것인지
	* 배포된 후 container 가 어떻게 서로 검색하고 통신할 수 있을 것인지
	* container 규모를 확장 및 축소하기 위해서는 어떻게 해야 하는지
	* 각 container 의 상태를 어떻게 모니터링 해야하는지
* DKOS2 는 MESOS 를 사용했지만, DKOS3 는 [[Kubernetes]] 로 전환되었음
* 

# Related

# References
