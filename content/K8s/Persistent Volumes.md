---
title: "Persistent Volumes"
tags: ["Kubernetes"]
---

# Persistent Volumes ?

# Volumes (Background)

콘테이너의 On-disk 파일들은 임시적이다. 이러한 특성은 콘테이너가 crash 되는 경우 파일의 손실을 발생시킨다. [[kubelet]] 이 콘테이너를 재시작해도 clean 한 상태로 진행된다. 추가적으로, 두 콘테이너가 파일을 공유하는 경우에는 pod 을 통해 공유해야되는 문제도 있다.

volume 은 쿠버네티스의 추상적 개념으로 위와 같은 문제들을 해결한다. Pod 은 동시에 여러 종류의 volume 을 사용할 수 있다. Ephemeral(임시적) 볼륨 타입은 pod 의 lifetime 동안만 살아있고, persistent volume 은 pod 의 생명 주기를 넘어서까지 살이있다.

# References

* https://kubernetes.io/docs/concepts/storage/persistent-volumes/
* https://kubernetes.io/docs/concepts/storage/volumes/
