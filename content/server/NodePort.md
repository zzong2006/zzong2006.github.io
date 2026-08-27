---
tags: ["Kubernetes"]
---

# NodePort ?

nodeport 를 구성하기 위한 yaml 예시: `helloworld-nodeport.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: helloworld-nodeport
spec:
  type: NodePort
  ports:
  - port: 8080
    protocol: TCP
    nodePort: 30808
  selector:
    app: helloworld
```

* `port` 는 application pod 의 service port 를 의미함
* `nodePort` 는 실제 호스트 (e.g. worker node, master node) 포트를 의미하며, application pod 의 port 가 mapping 될 port 를 의미함

# References
