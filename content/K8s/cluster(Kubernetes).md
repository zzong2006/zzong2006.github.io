---
title: "cluster(Kubernetes)"
tags: ["Kubernetes"]
aliases: ["cluster"]
---

# A) Kubernetes Cluster ?

[[Kubernetes]] coordinates a highly available cluster of computers that are connected to work as a single unit.

# B) Cluster Diagram

![](https://i.imgur.com/uX9aqpq.png)

* A Kubernetes cluster consists of two types of resources
	* [[Kubernetes Master]]: The **Control Plane**(또는 master 라 불림) coordinates the cluster
		* The Control Plane is responsible for managing the cluster.
		* 실행 중인 Application 을 호스팅하는데 사용되는 클러스터와 노드를 관리
		* Application 을 쿠버네티스에 배포한다는 것은 “master 에 application container 를 구동하라고 지시하는 것”과 일맥상통 함
			* master 는 container 를 [[cluster(Kubernetes)]] 의 어느 노드에 구동시킬지 스케줄링함
	* **Nodes** are the workers that run applications
		* Keyword: [[Kubernetes Node]]
		* Node:: 쿠버네티스 클러스터 내에서 worker 머신으로써 동작하는 VM 또는 물리적인 컴퓨터
		* 쿠버네티스 클러스터는 운영 트래픽 처리를 위해 최소 세 대의 노드를 가져야 함

# C) 클러스터 구축 방법

* Minikube 이용하는 방법
	* Minikube 는 로컬 머신에 VM 을 구축하여 하나의 노드로 구성된 간단한 클러스터를 배포하는 가벼운 쿠버네티스 구현체임
* 클라우드 플랫폼의 VM 을 이용하여 구축하는 방법
* 라즈베이파이 보드를 구매하여 클러스터를 구축

# D) Related

# E) References
