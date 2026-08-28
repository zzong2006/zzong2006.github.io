---
title: "g++"
tags: ["Cpp"]
---

# A) g++ ?

컴파일 명령어

# B) Options

* `-std`: 컴파일링 버전 옵션
	* 예시) `c++14` 로 컴파일: `g++ -std=c++14`
* `-fopenmp`: [[OpenMP]] 사용을 위한 옵션
* `-I`: include 에 해당하는 디렉토리 specify
	* 특이한 점은 directory path 와 `-I` 를 붙여써야된다.
	* 예시) Eigen 경로 추가: `g++ -I/usr/local/include/eigen3`

# C) References
