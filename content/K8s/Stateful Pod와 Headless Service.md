---
title: "Stateful Pod와 Headless Service"
tags: ["Kubernetes"]
---
데이터베이스처럼 **안정적인 네트워크 이름과 저장 공간이 필요한 상태 저장(Stateful) 애플리케이션**을 쿠버네티스에서 운영하기 위한 패턴입니다.

면접에서 이 둘을 묶어 물어본다는 것은, 이 패턴의 핵심 원리를 이해하는지 보려는 의도입니다.

#### Z.1.1.1) **StatefulSet 이란?**

Deployment가 stateless(상태가 없는) 앱을 위한 것이라면, StatefulSet은 **stateful(상태가 있는)** 앱을 위한 컨트롤러입니다. Deployment와 가장 큰 차이점은 **Pod에게 안정적인 고유성(Stable Identity)을 보장**해준다는 점입니다.

- **안정적인 네트워크 이름:** Pod는 (StatefulSet 이름)-(순서) 형태의 예측 가능한 호스트네임을 가집니다. (예: db-0, db-1) Pod가 재시작되어도 이 이름과 IP는 유지됩니다.
- **안정적인 스토리지:** 각 Pod는 자신만의 고유한 Persistent Volume(PV)에 연결됩니다. db-0 Pod는 항상 data-db-0 볼륨에 연결되어, 재시작되어도 자신의 데이터를 그대로 사용할 수 있습니다.

#### Z.1.1.2) **Headless Service 란?**

일반적인 Service는 하나의 가상 IP(ClusterIP)를 생성하고, 들어온 요청을 여러 Pod에게 로드 밸런싱합니다.

반면, **Headless Service**는 clusterIP: None으로 설정하여 **가상 IP를 만들지 않습니다.** 대신, Service의 DNS 이름으로 조회(lookup)하면 **로드 밸런서 IP 하나가 아닌, Service에 연결된 모든 Pod들의 실제 IP 목록을 반환**합니다.

#### Z.1.1.3) **둘을 왜 같이 쓸까?**

StatefulSet으로 db-0, db-1 Pod를 만들고, 이들을 Headless Service (이름: mysql)와 연결하면 마법이 일어납니다.

- db-0.mysql, db-1.mysql 이라는 **안정적이고 예측 가능한 DNS 주소**가 생깁니다.
- 이제 db-0 Pod는 db-1 Pod와 통신해야 할 때, 로드밸런서를 통하는 게 아니라 db-1.mysql이라는 고유 주소를 사용해 **직접 통신**할 수 있게 됩니다.

이것이 바로 데이터베이스 클러스터의 Master 노드가 Slave 노드를 정확히 찾아내거나, 복제(Replication)를 설정하는 데 필수적인 기능입니다.
