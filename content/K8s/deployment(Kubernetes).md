---
tags: ["Kubernetes"]
aliases: ["디플로이먼트"]
---

* Once you have a running Kubernetes cluster, you can deploy your containerized applications on top of it.
	* To do so, you create a [[deployment(Kubernetes)]] configuration.
* Deployment 는 Application instance 를 생성하고 업데이트하는 역할을 담당한다.
	* 즉, 어떻게 생성하고 업데이트 하는지 지시한다.
* Deployment 가 만들어지면, [[Kubernetes Master]] 는 해당 deployment 에 포함된 application instance 가 cluster 의 개별 [노드]([[Kubernetes Node]]) 에서 실행되도록 스케줄링함

![|500](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FEuyKvPQz87.png?alt=media&token=7f8d0397-84f6-4879-b963-25bf0aea7ceb)

# A) 자동 복구 (self-healing) 메커니즘: 머신의 장애나 정비 상황에 대응

* 인스턴스 생성 이후, deployment controller 가 지속적으로 해당 인스턴스를 모니터링함
* instance 를 구동 중인 노드가 다운되거나 삭제되면 deployment controller 는 instance 를 클러스터 내부의 다른 노드의 인스턴스로 교체함
* [[kubectl]] 이라는 kubernetes CLI 를 통해 deployment 를 생성하고 관리할 수 있음
	* kubectl 은 cluster 와 상호작용 하기 위해 kubernetes API 를 사용함
* Rolling Update
	* `maxUnavailable`: update 과정이 진행될 때 가능한 최대 unavailable pod 개수
		* 절대값이나 퍼센트도 가능하며, `maxSurge` 가 `0` 인 경우는 `0` 이 될 수 없음
		* 예를 들어, 이 값이 30% 으로 설정되는 경우, rolling update 시작 시, 기존 ReplicaSet 은 70% 까지 즉시 내려감
	* `maxSurge`: 한번에 생성 가능한 최대 pod 개수
		* 예를 들어, 이 값이 30% 로 설정되는 경우, 기존과 새로운 pod 의 개수가 130% 를 넘어가지 않는다.
