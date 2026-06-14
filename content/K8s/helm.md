---
tags: ["Kubernetes", "server"]
aliases: ["헬름"]
---

# Helm ?

[[Kubernetes]] 리소스들을 간편하게 관리할 수 있도록 도와주는 툴입니다.

하나의 커맨드로 클러스터 내에 리소스들을 설치하고 변경사항을 반영 할 수 있으며, 이러한 변경사항들은 리비전으로 관리할 수 있습니다. 또한, `.tar.gz` 확장자로 클러스터 리소스 정의를 패키징하여 원격 저장소를 통해 공유 할 수 있도록 도와줍니다.

# Chart

chart 는 헬름에서 사용하는 패키지의 포맷이다.

차트는 특정 디렉토리 구조를 가진 파일들로 구성된다.

# Lesson Learned

`helm install` 시, 가끔 명령어로 `--values values.yml` 와 같이 파일을 통해 커스텀 밸류값을 넣어주라는 내용이 있다.

이런 경우, `helm install -f values.yml` 과 같이, 가장 맨 앞에 `-f` 와 함께 넣어준다. 맨 뒤에 설정하면 인식을 못한다.

# Related

# References

* [Helm | Using Helm](https://helm.sh/docs/intro/using_helm/)
