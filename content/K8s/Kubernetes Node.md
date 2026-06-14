---
tags: ["Kubernetes"]
---

# A) Kubernetes Node ?

A Node is a worker machine in [[Kubernetes]] and may be either a virtual or a physical machine, depending on the cluster.

## A.1) Node Overview

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FZGZdvjuYLt.png?alt=media&token=81a5af5e-1f2e-4dc5-a2cf-cdc9974b2466)

* 각 노드는 master 에 의해 관리된다.
	* 하나의 노드는 여러개의 [pods]([[pod(Kubernetes)]]) 을 가지고, the Kubernetes master automatically handles scheduling the pods across the Nodes in the cluster.
	* The Master’s automatic scheduling takes into account the available resources on each Node.
* Every Kubernetes Node runs at least:
	* 각 노드에는 [[kubelet]] 이라는 agent 가 존재하며, 이 Kubelet 이 해당 노드를 관리하고 쿠버네티스 마스터와 통신하는 역할을 함
	* 또한, Node 는 container 운영을 담당하는 docker 또는 containerd 와 같은 툴도 포함해야 한다.
	* A container runtime (like Docker) responsible for pulling the container image from a registry, unpacking the container, and running the application.
* Node 는 [[Kubernetes Master]] 가 제공하는 kubernetes API 를 통해 master 와 통신하며, 최종 사용자 역시 kubernetes API 를 직접 사용해서 cluster 와 상호작용 할 수 있음

# B) Related

# C) References
