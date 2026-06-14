---
title: "Kubernetes Configuration"
---

* 각 configuration 파일은 3 개의 파트로 구성되어 있음
	* metadata
		* label: service 의 selector 가 해당 label 의 이름을 선택하도록 한다.
			* ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FWDiBKJfoT5.png?alt=media&token=404e0d97-c3b9-4b6c-bbbd-f34cbedd886c)
	* specification
		* replicas, template, selector
			* deployment yaml 에서 spec 의 template 는 pod 에 대한 청사진을 의미함
			* each template has it’s own “metadata” and “spec” section
	* status: 자동적으로 생성됨
		* self-healing related
		* etcd 가 현재 status 를 가지고 있음
* YAML configuration file
	* strict indentation
		* yaml online validator 를 사용하면 좋음
	* human friendly
* 나머지는 다음과 같음: apiVersion & kind
	* kind: Deployment, Service etc.
	* apiVersion: apps/v1, v1 etc.
