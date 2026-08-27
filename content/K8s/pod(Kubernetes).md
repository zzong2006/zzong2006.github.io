---
tags: ["Kubernetes"]
aliases: ["pod"]
---

# A) Kubernetes Pod ?

A Pod is the basic execution unit of a [[Kubernetes]] application.

Pods that are running inside Kubernetes are running on a private, isolated network.

Pod 은 [[Kubernetes]] 의 추상화된 개념으로, 한 개 이상의 (Docker 와 같은)application containers 들의 집합으로 볼 수 있다. 그리고, 해당 집합의 container 들은 resource 를 공유한다.

![[img-ac2f9b03ef.png]]

# B) Pod 자원 요소들

Those resources include:

* Shared storage, as Volumes
* Networking, as a unique cluster IP address
	* Each Pod in a Kubernetes cluster has a unique IP address, even Pods on the same Node
	* Although each Pod has a unique IP address, those IPs are not exposed outside the cluster without a [[service(Kubernetes)]].
* Information about how to run each container, such as the container image version or specific ports to use
* Pods are the atomic unit(최소 단위) on the Kubernetes platform.
* Kubernetes 에서 [[deployment(Kubernetes)]] 를 생성하면, 해당 deployment 는 container 내부에서 container 와 함께 pod 를 생성함
* 각 pod 는 스케줄링된 노드와 묶여지게 되며, 이는 소멸되거나 삭제되기 전까지 그 노드에서 유지된다는 의미를 가진다.

# C) [[Kubernetes Node]] 와의 관계

    - pod는 언제나 node 상에서 동작함
    - 하나의 노드는 여러개의 pod를 가질 수 있으며, [[Kubernetes Master]]는 클러스터 내 node를 통해 pod에 대한 스케줄링을 자동으로 처리함

# D) Pods in the [[cluster(Kubernetes)]]

By default they are visible from other pods and services within the same kubernetes cluster, but not outside that network.

	- The `kubectl` command (`kubectl proxy`) can create a proxy that will forward communications into the cluster-wide, private network.

	- Pods 간 통신

		- Pod는 각각 내부 IP 주소를 가지고 내부에서는 서로의 IP 주소를 통해 서비스([[service(Kubernetes)]], 노드 내 discovery와 routing 담당)을 경유해서 통신할 수 있다.

		- 하지만, 사용자 app을 외부로 노출해서 traffic을 처리할 수 있도록 하기 위해서는 ingress와 ingress controller가 필요하다.

			- ingress controller의 경우, loadbalancer로 주로 nginx를 사용

		- 즉, 클라이언트의 요청이 들어오면, loadbalancer가 ingress node로 traffic을 할당하고, 해당 ingress node가 service를 통해서 (명시적으로) worker node 내 pod로 접근한다.

* Pods 생성하기
	* Usually you don’t need to create Pods directly, even singleton Pods.
		* Instead, create them using workload resources such as Deployment or Job.
	* When we create a Deployment on Kubernetes, that Deployment creates Pods with containers inside them
* Pods 관련 정보
	* A Pod always runs on a [[Kubernetes Node|Node]].
		* When a worker [[Kubernetes Node|Node]] dies, the Pods running on the [[Kubernetes Node|Node]] are also lost.
	* Kubernetes Pods are mortal.
		* Pods 은 생명 주기를 가지는데, worker node 가 죽으면 node 상에서 동작하는 pod 또한 종료된다.
		* ReplicaSet 은 application 이 지속적으로 동작할 수 있도록 새로운 pod 를 생성하여 클러스터를 동적으로 미리 지정해 둔 상태로 되돌린다.

# E) References
