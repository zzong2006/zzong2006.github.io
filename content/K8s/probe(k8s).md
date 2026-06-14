---
tags: ["Kubernetes"]
---

# probe(k8s) ?

Liveness, Readiness and Startup Probes (probe: 조사) ([관련 링크](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/))

* probes 들은 [[kubelet]] 가 container 의 상태를 조사하는데 사용하는 일종의 지표 역할을 한다.

## Liveness

liveness probes 는 container 를 재시작할지 판단하는데 사용한다.

예를 들어, liveness probes 는 [[deadlock]] 상태를 확인하는데 사용할 수 있다.

## Readiness

readiness probes 는 container 가 traffic 을 받아들일 준비가 되었는지 확인하기 위해 사용한다.

하나의 pod 은 pod 내 모든 container 들이 준비될 때 준비되었다고 정한다.

만약 pod 이 준비되지 않았다면, [[kubelet]] 은 이 pod 을 Service load balancer 에서 제거한다.

* startup probes 는 container application 이 시작했다는 것을 확인할 때 사용할 수 있다.
	* readiness 나 liveness 보다 우선시되며, startup probes 를 먼저 확인한 뒤에 다른 probes 를 살핀다.
	* 시작이 오래걸릴 것 같은 느린 container 들을 체크하는데 유용하며, kubelet 이 이 콘테이너들을 재시작시키기 전에 유예기간을 줄 수 있다.
* Configurations
	* `periodSeconds`: kubelet 이 얼마나 자주 probe 를 수행하는지 (sec 단위)
	* `initialDelaySeconds`: 첫번째 probe 를 수행하기 전에 기다리는 시간 (sec 단위)
	* `failureThreshold`: probes 실패 제한 횟수
		* `failureThreshold * periodSeconds` 를 통해 최대 기다리는 시간을 정할 수 있다.
	* `httpGet`: HTTP GET Request 를 보내서 probe 를 수행한다.
		* request return code 값이 200 보다 크거나 같고 400 보다 작으면 성공으로 인식한다. 다른 code 들은 모두 실패로 인식한다.
		* 예시: named port 를 사용한 HTTP probes

```javascript
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

# Related

# References
