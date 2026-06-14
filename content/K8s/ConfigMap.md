---
tags: ["Kubernetes"]
---

# ConfigMap ?

환경 변수나 설정값들을 변수로 관리해서 Pod 가 생성될때 이 값을 넣어줄 수 있는데, 이러한 기능을 제공하는 것이 바로 Configmap 과 Secret 이다.  

configmap 은 설정 정보를 저장해놓는 일종의 저장소 역할을 하며 key/value 형식으로 저장이 된다.

# Configmap 생성하는 방법

configmap 을 생성하는 방법은 literal (문자) 로 생성하는 방법과 파일로 생성하는 방법 두가지가 있다.  

## Literal

```bash
Kubectl create configmap <configmap name> --from-literal=<key>=<value>
```

## File

출처: [https://bcho.tistory.com/1267](https://bcho.tistory.com/1267) 

# Related

# References

* https://bcho.tistory.com/1267
