---
title: "Kubernetes"
aliases: ["쿠버네티스", "k8s"]
tags:
  - Kubernetes
---

# A) Kubernetes ?

[[Kubernetes]] is a portable, extensible, open-source platform for managing containerized workloads and services, that facilitates both declarative configuration and automation.

대규모 실운영 환경에서 컨테이너를 효율적으로 관리할 수 있는 container orchestrator

쿠버네티스는 application 컨테이너를 클러스터 ([[cluster(Kubernetes)]]) 에 분산시키고 스케줄링하는 일을 좀 더 효율적으로 자동화함

Containerization helps package software to serve these goals, enabling applications to be released and updated without downtime.

# B) Kubernetes 의 특징

* 네트워크, 스토리지 등 다양한 클라우드 리소스를 개발자가 제어하고 자동화할 수 있다는 점
* 따로 Internal API 가 존재하지 않고, 모든 API 가 열려있어서 개발자들이 이를 활용해 자동화할 수 있음
	* OpenAI Spec 을 지원: `kubectl get --raw /openapi/v2` 를 통해서 OpenAPI spec 을 얻을 수있음

# C) Lesson Learned

# D) Related

 * [[Kubernetes Master]]
 * [[cluster(Kubernetes)]]
 * [[Kubernetes Node]]
 * [[pod(Kubernetes)]], [[deployment(Kubernetes)]], [[service(Kubernetes)]], [[kubelet]]

# E) References
