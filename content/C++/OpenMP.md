---
tags: ["Cpp"]
---

# A) OpenMP ?

OpenMP(Open Multi-Processing) 이란, shared 메모리 multiprocessing 을 지원하는 API 를 의미한다.

다양한 언어를 지원하는 것이 특징: [[C++]], 포트란 등

# B) 기초 사용법

`#pragma omp parallel`

```c++
#pragma omp parallel
//병렬 처리 할 한줄

#pragma omp parallel
{
	/*
	병렬 처리 할 여러줄
	*/
}```

## 예시
```c++
#pragma omp parallel
printf("thread num %d : first hello world\n", omp_get_thread_num()); // thread 개수만큼 실행
printf("thread num %d : second hello world\n", omp_get_thread_num()); // 한번만 실행
return 0;

/*
thread num 0 : first hello world
thread num 2 : first hello world
thread num 1 : first hello world
thread num 3 : first hello world
thread num 0 : second hello world
*/
```

# C) `omp for`

`for` loop 를 여러 스레드에서 동시 실행

* 이중 loop 인 경우에도 오직 가장 outer loop 만 병렬로 실행한다.
* 모두 병렬처리 하고 싶다면, `#pragma omp parallel for collapse(n)` 을 사용 ([참고](https://stackoverflow.com/questions/13357065/how-does-openmp-handle-nested-loops))

## C.1) 예시

```c++
#pragram omp parallel for
for(int i = 0 ;i < 5; i++)
{
    printf("thread %d : %d (in parallel)\n", omp_get_thread_num(), i);
}
/*
thread 0 : 0 (in parallel)
thread 1 : 1 (in parallel)
thread 2 : 2 (in parallel)
thread 3 : 3 (in parallel)
thread 4 : 4 (in parallel)
*/
```

* schedule: 병렬화 구문의 task 를 chunk 단위로 분할하여, 어떻게 스레드에게 분배할지 정하는 방식 ([refer site](https://sbinroom.tistory.com/entry/OpenMP-%EB%B3%91%EB%A0%AC-%EC%B2%98%EB%A6%AC-%EC%8A%A4%EC%BC%80%EC%A4%84%EB%A7%81))
	* scheduling 종류
		* static: 구동 전 각 스레드에게 분배함
		* dynamic: 구동 중 task 를 끝낸 thread 에게 남은 task 를 분배함
		* guided: static 과 dynamic 을 합친 방식으로, 구동 전 각 스레드에게 분배 후 구동 중에 task 를 끝낸 스레드에게 남은 task 를 분배
	* 예시) `#pragma omp parallel for schedule(static, 10)`
		* `10` 은 task 의 크기

# D) References
