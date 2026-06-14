---
tags: ["programming", "python", "algorithm", "string"]
---

# 1. 두 String 이 주어질 경우 문제

## 1.1. ([[anagram]]) 인지 확인하기

* 예시) `cat`, `tac` 가 주어질 때, `tac` 를 잘 나열하면 `cat` 이 되므로 `True`
* 이 문제는 두 가지 방법으로 풀 수 있었음
	* `Counter` 사용
		* 두 개의 `Counter` 가 서로 동일하면 `True`
		* 만약 하나의 `Counter` 만 사용할 수 있을 경우, 한 string 이 count 를 올리면, 다른 string 은 count 를 내리는 방식으로 진행
	* [[sorting]] 사용
		* 시간 복잡도: `O(nlog(n))`
		* 위 예시에서 `cat` 이나 `tac` 둘 다 정렬하면 `act` 가 되므로, 서로 [[anagram]] 인걸 알 수 있다.
