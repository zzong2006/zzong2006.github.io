---
tags: ["tip"]
---

# A) Pods

## A.1) 강제로 내리기

`kubectl delete pods <팟이름> --grace-period=0 --force`

## A.2) 외부 연결하기

[[service(Kubernetes)|service]] 에서 [[NodePort]] 를 설정하고, [[pod(Kubernetes)|pod]] 이 어떤 노드에 할당되어 있는지 확인한 뒤에, 해당 노드의 `internal ip:port num` 형식으로 연결을 시도하면 된다.

참고) [Pod-외부에서-접속하게-설정하기](https://velog.io/@dojun527/Pod-%EC%99%B8%EB%B6%80%EC%97%90%EC%84%9C-%EC%A0%91%EC%86%8D%ED%95%98%EA%B2%8C-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)

## A.3) 계속 생성되는 팟 제거하기

가끔 팟을 지워도 계속 올라오는 팟들이 있다. 이거는 팟을 지울게 아니라 다른걸 지워야 한다.

`kubectl get all` 을 치면 모든 리소스를 확인할 수 있다.

일반적으로 [[deployment(Kubernetes)]] 가 범인일 수 있는데, [[StatefulSet]] 이라는 것도 확인해봐야 한다.

# B) Related

# C) References
