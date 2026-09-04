---
title: "TFRecord"
tags:
  - TensorFlow
  - python
  - machine_learning
  - deep_learning
aliases: []
---

# TFRecord ?

* [[TFRecord]] 의 단점
	* 엄격한 포맷
		* `tf.train.Feature(float_list=tf.train.FloatList(value=[value]))` 와 같이 [[TFRecord]] 에 저장할 모든 데이터는 TensorFlow 에서 제공하는 데이터 타입으로 변환해야 한다.
	* [[Apache Parquet]] 과의 상호 변환 문제
		* [[TFRecord]] 변환 과정에서 사용한 tokenize, 이미지 인코딩 등의 값을 기존에 사용하던 [[Apache Parquet|parquet]] 에 추가 후 업로드 할 때 `tf.data.example` 등의 [[TFRecord]] 역변환 과정을 거쳐야 한다.
	* 데이터 열람의 불편함
		* [[TFRecord]] 를 사용하는 경우 Python object 타입이나 numpy 등을 자유롭게 사용하지 못하고, 데이터 열람을 위해 뷰어나 변환 도구를 새로 만들어야 한다는 점

# References
