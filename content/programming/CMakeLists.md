---
tags: ["C++"]
---

# CMakeLists ?

* Tags
	* #[[g++]]
* 참고한 사이트들
	* https://www.tuwlab.com/ece/27260

# `SET()`: 변수 정의

* `SET(<변수명> <값>)`
* List 변수 정의: `SET(<목록 변수명> <항목> <항목> …)`
	* 예시) `SET ( SRC_FILES main.c foo.c bar.c )`
* `$`: 변수참조  

# `$변수명` 또는 `${<변수명>}`

* 예시)`ADD_EXECUTABLE(app.out${SRC_FILES} )`
* `PROJECT ( <프로젝트명> )`: 프로젝트 이름 설정
* `ADD_EXECUTABLE ( <실행_파일명> <소스_파일> <소스_파일> )`  
: 빌드 대상 바이너리 추가
	* `<소스_파일>` : 실행 파일을 생성하는 데 필요한 소스 파일
	* `<실행_파일명>` : 생성할 바이너리의 파일명

# References
