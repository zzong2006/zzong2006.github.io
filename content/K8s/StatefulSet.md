---
title: "StatefulSet"
tags: ["Kubernetes"]
---

# Statefulset ?

a Kubernetes resource object that manages a set of pods with unique identities. By assigning a persistent ID that is maintained even if the pod is rescheduled, a StatefulSet helps maintain the uniqueness and ordering of pods.

StatefulSet 은 ReplicaSet 을 생성하지도 않고, pod 레플리카들은 이전 저번으로 롤백할수도 없다. 일반적으로 StatefulSets 들은 각 어플리케이션들이 persistent storage 가 필요할 경우에 사용한다.

# Vs. Deployment

[[deployment(Kubernetes)]] 를 사용할지 StatefulSet 을 사용할지 결정하는 방법은 [[pod(Kubernetes)|pod]] 간 구별이 필요하냐 하지 않느냐로 결정한다. deployment 는 팟이 모두 동일하다는 가정이 있다. 하지만 StatefulSet 은 팟이 서로 구분되어 동일하지 않고 교체 가능하지도 않다. 그래서 [[Persistent Volumes]] 도 서로 구분되어야 한다.

# Related

# References
