---
tags: ["Kubernetes"]
---

# 1. Kubectl ?

# 2. Lesson Learned

## 2.1. Pod Status

[[pod(Kubernetes)|pod]] 상태를 보면 `Init:0/1` 이렇게 되어 있는데, 이것은 팟이 초기화 컨테이너 ([[init container]] 를 포함하고 있고, 해당 컨테이너의 작업이 마무리 되지 않았다는 뜻이다. 만약 마무리 되었다면 `Running` 상태로 바뀐다.

만약 계속

**Refer**: [docker - Kubernetes pods hanging in Init state - Stack Overflow](https://stackoverflow.com/questions/50075422/kubernetes-pods-hanging-in-init-state)

# 3. Related

# 4. References

* [Init Containers | Kubernetes](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/)
