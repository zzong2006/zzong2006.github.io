---
title: "service(Kubernetes)"
tags: ["Kubernetes"]
aliases: ["service", "서비스"]
---

# A) Kubernetes Service ?

Kubernetes Service 는 논리적 [[pod(Kubernetes)|pod]] set 을 정의하고 외부 트래픽 노출 및 load balancing, 그리고 그 pods 들에 대한 service discovery 를 가능하게 해주는 추상 계층이다.

Service 가 대상으로 하는 pod set 은 보통 LabelSelector 에 의해 결정됨

* A Service is defined using YAML (preferred) or JSON, like all Kubernetes objects.
* Service 는 여러분의 Application 이 traffic 에 실릴 수 있도록 도와주는데, ServiceSpec 에서 `type` 을 지정함으로써 다양한 방식을 통해 노출시킨다.
	* `ClusterIP` (기본값) - 클러스터 내에서 내부 IP 에 대해 서비스를 노출한다.
		* 이 방식은 오직 클러스터 내에서만 서비스가 접근될 수 있도록 한다.
	* `NodePort` - NAT 가 이용되는 클러스터 내에서 선택된 각 노드들의 동일한 포트에 서비스를 노출시킨다. [[NodePort]]
		* 단일 pod 의 service port 를 호스트의 특정 포트에 매핑시켜서 `<NodeIP>: <NodePort>` 를 이용하여 클러스터 외부로부터 서비스가 접근할 수 있도록 한다.
			* NodePort 타입으로 지정 가능한 호스트의 포트 대역은 **30000-32767**
		* `ClusterIP` 의 상위 집합이다.
	* `LoadBalancer` - (지원 가능한 경우) 기존 클라우드에서 외부용 로드 밸런서를 생성하고, 서비스에 고정된 공인 IP 를 할당한다.
		* `NodePort` 의 상위 집합이다.
	* `ExternalName` - 이름으로 CNAME 레코드를 반환함으로써, 임의의 이름을 이용하여 서비스를 노출
		* Spec 에서 `externalName` 으로 명시한다.
* Service 와 label
	* Service 는 kubernetes 의 객체들에 대해 논리 연산을 허용해주는 기본 grouping 단위인 label 과 selector 를 이용하여 pod set 과 match 시킴
		* label 은 object 들에 붙여진 key & value 쌍으로 다양한 방식으로 이용 가능함
			* 개발 및 테스트, 상용 환경에 대한 객체들의 지정
			* 임베디드된 버전 태그들
			* 태그들을 이용하는 객체들에 대한 분류
		* label 은 object 의 생성 시점 또는 이후 시점에 붙여질 수 있고 언제든지 수정할 수 있음
	* ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FuJvwttdEVL.png?alt=media&token=d72899e3-18b8-47ff-8799-392b3edce02f)
	* Service 는 pod set 에 걸쳐 traffic 을 routing 한다.
		* 그리고 종속적인 pod 들 사이에서 discovery 와 routing 은 [[service(Kubernetes)]] 들에 의해 처리됨
	* 

# B) Related

# C) References
