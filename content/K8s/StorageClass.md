---
title: "StorageClass"
tags: ["Kubernetes"]
---

# A) Storageclass ?

기존에는 관리자가 `PersistentVolume` 을 개발자 (사용자) 로 부터 요청을 받을 때마다 생성을 해 주었다. 그런데 k8s 에서는 이 작업을 StorageClass 를 통해 자동으로 수행 할 수 있다.

![](https://i.imgur.com/U6jJEUX.png)

개발자가 `PersistentVolumeClaim` 을 생성할 때 이전에는 직접적으로 PersistentVolume 을 참조했다면 지금은 `StorageClass` 를 참조한다.

# B) References
