---
tags: ["Kubernetes"]
aliases: ["control plane", "Kubernetes Control Plane", "master node"]
---

# A) Kubernetes Master ?

Kubernetes Master 는 예전 문서에서 control plane 을 부르던 표현이다. 최신 Kubernetes 문맥에서는 master 라는 말보다 **control plane** 이 더 권장된다.

Control plane 은 cluster 의 원하는 상태를 기록하고, 실제 cluster 상태가 그 상태에 가까워지도록 조정한다. application container 를 직접 실행하는 쪽은 [[Kubernetes Node|worker node]] 이고, control plane 은 scheduling, API 처리, 상태 저장, controller 동작을 담당한다.

# B) 주요 구성 요소

| 구성 요소 | 역할 |
| --- | --- |
| kube-apiserver | cluster API 진입점 |
| etcd | cluster 상태 저장소 |
| kube-scheduler | pod 를 실행할 node 선택 |
| kube-controller-manager | desired state 와 actual state 를 맞추는 controller 실행 |

# C) Node 와의 관계

[[Kubernetes Node]] 는 실제 workload 를 실행한다. control plane 은 node 위에 어떤 [[pod(Kubernetes)|pod]] 를 띄울지 결정하고, kubelet 은 node 내부에서 그 결정을 실제 container 실행으로 반영한다.

# D) Related

* [[cluster(Kubernetes)]]
* [[Kubernetes Node]]
* [[kubelet]]

