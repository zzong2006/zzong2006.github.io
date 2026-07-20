---
title: "Ingress"
tags:
  - Kubernetes
aliases: []
---

# A) Ingress ?

Ingress 는 [[cluster(Kubernetes)]] 내의 서비스에 대한 외부 접근을 관리하는 API object

일반적으로 HTTP 를 관리하며 부하 분산, SSL Termination, 이름 기반의 가상 호스팅을 제공할 수 있음

Ingress 는 클러스터 외부에서 내부 [[service(Kubernetes)]] 로 HTTP 와 HTTPS 경로를 노출

이때, traffic routing 은 ingress resource 에 정의된 규칙에 의해 control 됨

* Ingress 동작
	* ![[img-f7de69ef94.png]]
* Ingress 는 resource 만 생성해서는 효과가 없고, ingress controller 가 반드시 필요함
	* ingress-nginx 와 같은 ingress controller 를 배포해야 할 수 있음
	* ingress controller 는 일반적으로 load balancer 를 이용하여 ingress 수행을 담당하는데, traffic 을 처리할 때 도움이 되도록 edge router 또는 additional frontend 를 구성할 수 있음

# B) References
