---
title: "CUDA"
tags: ["Cpp"]
---

# CUDA에서 Blocks와 Threads의 결합

## Blocks와 Threads의 개념

CUDA에서 병렬 처리를 효율적으로 수행하기 위해서는 **Blocks**와 **Threads**를 적절히 결합하는 것이 중요합니다. 각 Block은 여러 Thread로 구성되며, 이들은 GPU 상에서 병렬로 실행됩니다.

- **N개의 Block**과 **Block당 M개의 Thread**를 실행할 수 있습니다.
- `kernel<<<N, M>>>(…)` 형식으로 커널을 호출하여 N개의 Block과 각 Block당 M개의 Thread를 지정합니다.

## Indexing을 통한 접근

각 Thread는 고유한 index 값을 가지며, 이를 통해 데이터를 처리할 수 있습니다. 예를 들어, 배열의 각 요소에 대해 하나의 Thread가 작업을 수행하도록 설정할 수 있습니다.

- `blockIdx.x`는 Grid 내에서 현재 Block의 인덱스를 나타냅니다.
- `threadIdx.x`는 해당 Block 내에서 현재 Thread의 인덱스를 나타냅니다.
  
따라서, 고유한 index 값은 다음과 같이 계산됩니다:
```cpp
int index = threadIdx.x + blockIdx.x * M;
```

## A.1) 예시: 벡터 덧셈

벡터 덧셈 문제에서는 각 요소에 대해 병렬로 연산이 이루어집니다. 이를 위해 다음과 같은 방식으로 커널을 작성할 수 있습니다:

```cpp
__global__ void add(int *a, int *b, int *c) {
    int index = threadIdx.x + blockIdx.x * blockDim.x;
    c[index] = a[index] + b[index];
}
```

여기서 `blockDim.x` 는 한 Block 당 사용하는 Thread 의 개수를 나타내며, 이를 통해 전체 배열에 대한 연산이 가능합니다.

## A.2) 임의 크기의 벡터 처리

일반적으로 벡터 크기는 `blockDim.x` 와 일치하지 않기 때문에 배열 끝부분을 넘어가는 접근을 방지해야 합니다. 이를 해결하기 위해 조건문을 추가하여 유효한 범위 내에서만 연산이 이루어지도록 합니다:

```cpp
__global__ void add(int *a, int *b, int *c, int n) {
    int index = threadIdx.x + blockIdx.x * blockDim.x;
    if (index < n)
        c[index] = a[index] + b[index];
}
```

커널 호출 시에는 다음과 같이 N 개의 요소에 대해 적절히 블록과 스레드를 설정해 줍니다:

```cpp
add<<<(N + THREADS_PER_BLOCK - 1) / THREADS_PER_BLOCK, THREADS_PER_BLOCK>>>(d_a, d_b, d_c);
```

## A.3) 스레드 간 데이터 공유 및 동기화

### A.3.1) 블록 내 스레드 간 데이터 공유

블록 내 여러 스레드는 **공유 메모리 (shared memory)** 를 통해 데이터를 공유할 수 있습니다. 공유 메모리는 `__shared__` 키워드를 사용하여 정의되며 각 블록마다 할당됩니다. 그러나 다른 블록들 간에는 이 데이터를 공유할 수 없습니다.

### A.3.2) 협력적 스레드 처리 (Cooperating Threads)

스레드들이 협력하여 작업하는 경우가 많습니다. 예를 들어 1D 배열에 1D stencil 연산을 적용하는 경우를 생각해 봅시다:

- 출력 원소는 반경 (radius) 범위 내 입력 원소들의 합입니다.
- 반경이 3 인 경우 출력 원소 하나는 총 7 개의 입력 원소들의 합으로 계산됩니다.

각 스레드는 하나의 출력 원소를 담당하며 여러 번 동일한 입력 값을 읽어야 하는 상황이 발생합니다. 이러한 문제를 해결하기 위해 공유 메모리를 활용하여 중복된 데이터 접근 횟수를 줄일 수 있습니다.

### A.3.3) 최적화: 캐싱 (Caching)

공유 메모리에 데이터를 캐싱함으로써 반복적인 데이터 접근 비용을 줄이고 성능 향상을 도모할 수 있습니다.통해 데이터를 공유할 수 있습니다. 공유

- Read (blockDim.x + 2 * radius) input elements from global memory to
- shared memory
- global memory 는 device memory (블록 간 공유)
- Compute blockDim.x output elements
- Write blockDim.x output elements to global memory
- **global** void stencil_1d(int *in, int *out) {
- **shared** int temp[BLOCK_SIZE + 2 * RADIUS] // 공유 메모리 초기화
- int gindex = threadIdx.x + blockIdx.x * blockDim.x;
- int lindex = threadIdx.x + RADIUS;
- // Read input elements into shared memory
- temp[lindex] = in[gindex]; // 겹치는 가운데 원소들 저장
- if (threadIdx.x < RADIUS) {
- temp[lindex - RADIUS] = in[gindex - RADIUS]; // 안겹치는 왼쪽 저장
- temp[lindex + BLOCK_SIZE] = in[gindex + BLOCK_SIZE]; // 오른쪽
- 저장
- }
- // Synchronize (ensure all the data is available)
- __syncthreads();
- // Apply the stencil
- int result = 0;
- for (int offset = -RADIUS ; offset <= RADIUS ; offset++)
- result += temp[lindex + offset];
- 위 코드에서 void __syncthreads() 는 barrier 형태로, 블럭 내 모든 스레드들을 동기화
- 시키는 역할을 한다 (Use to prevent data hazards).
- All threads must reach the barrier
- In conditional code, the condition must be uniform across the block
- Coordinating Host & Device
- Kernel launches are asynchronous
- Control returns to the CPU immediately
- CPU needs to synchronize before consuming the results
- cudaMemcpy() : Blocks the CPU until the copy is complete Copy begins when
- all preceding CUDA calls have completed.
- cudaMemcpyAsync() : Asynchronous, does not block the CPU
- cudaDeviceSynchronize() : Blocks the CPU until all preceding CUDA calls
- have completed
- Multiple host threads can share a device
- A single host thread can manage multiple devices
- cudaSetDevice(i) to select current device
- cudaMemcpy(…) for peer-to-peer copies

# B) CUDA 기초 및 병렬 프로그래밍 구조

CUDA는 GPU의 강력한 병렬 연산 능력을 활용하여, 대용량 데이터를 빠르게 처리할 수 있도록 지원하는 NVIDIA의 프로그래밍 모델입니다. 본 문서는 CUDA의 기본 개념, 그리고 Blocks와 Threads를 활용한 병렬 처리 구조를 정리합니다.

---

## B.1) CUDA 함수 및 메모리 구조

### B.1.1) `__global__` 함수

CUDA C/C++에서 `__global__` 키워드는 해당 함수(커널)가 **디바이스(GPU)**에서 실행되고, **호스트(CPU)** 코드에서 호출됨을 의미합니다.

```cpp
__global__ void mykernel(void) {
}
```

이렇게 정의된 커널 함수는 다음과 같이 실행됩니다.

```cpp
mykernel<<<1,1>>>();
```
- `<<< >>>` 구문은 커널 런치(syntax)로, CPU에서 GPU로 병렬 함수를 호출할 때 사용됩니다.
- 괄호 내 숫자는 블록과 스레드의 개수(예시: 블록 1개, 스레드 1개)를 지정합니다.

### B.1.2) 메모리 관리

CUDA에서는 **호스트 메모리**와 **디바이스 메모리**가 분리되어 있습니다.
- 호스트 포인터: CPU 메모리를 가리킴
- 디바이스 포인터: GPU 메모리를 가리킴

디바이스 메모리는 다음 API로 관리합니다:
- `cudaMalloc()`, `cudaFree()`, `cudaMemcpy()` 등
- 각각 C언어의 `malloc()`, `free()`, `memcpy()`와 유사하게 동작합니다.

#### B.1.2.1) 예시: 두 벡터의 합 구하기 (단일 값)

```cpp
__global__ void add(int *a, int *b, int *c) {
    *c = *a + *b;
}
```
호스트 코드 예시는 다음과 같습니다:

```cpp
int main(void) {
    int a = 2, b = 7, c; // 호스트 변수
    int *d_a, *d_b, *d_c; // 디바이스 변수
    int size = sizeof(int);

    cudaMalloc((void**)&d_a, size);
    cudaMalloc((void**)&d_b, size);
    cudaMalloc((void**)&d_c, size);

    cudaMemcpy(d_a, &a, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_b, &b, size, cudaMemcpyHostToDevice);

    add<<<1,1>>>(d_a,d_b,d_c);

    cudaMemcpy(&c,d_c,size,cudaMemcpyDeviceToHost);

    cudaFree(d_a); cudaFree(d_b); cudaFree(d_c);
    return 0;
}
```

---

## B.2) CUDA에서 Blocks와 Threads 결합

### B.2.1) Block/Thread 구조

GPU는 **Block** 단위로 작업을 나누고 각 Block은 여러 개의 **Thread**들로 구성됩니다.
- N개의 Block과 Block당 M개의 Thread를 배치할 수 있습니다.
- 호출 형태:
  ```cpp
  kernel<<<N,M>>>(...);
  ```

### B.2.2) 인덱싱(indexing)

각 Thread는 고유 인덱스 값을 가지며 이를 통해 데이터(예: 배열의 각 원소)에 접근할 수 있습니다.
- Grid 내 Block 번호 : `$ \text{blockIdx.x} $`
- Block 내 Thread 번호 : `$ \text{threadIdx.x} $`
  
고유 index 계산식:
```cpp
int index = threadIdx.x + blockIdx.x * M;
```

### B.2.3) `#define` N 512

---

## B.3) 벡터 덧셈 예제 (병렬화)

벡터 덧셈 문제에서는 각 Thread가 배열 한 원소씩 담당하여 연산을 수행하도록 합니다.

```cpp
__global__ void add(int* a, int* b,int* c){
    int index = threadIdx.x + blockIdx.x * blockDim.x;
    c[index] = a[index] + b[index];
}
```
여기서 `$ \text{blockDim.x} $`는 한 Block 당 Thread 개수입니다.

#### B.3.1.1) main() 코드 예시 (병렬 처리)

```cpp
a = (int*)malloc(size); random_ints(a,N);
b = (int*)malloc(size); random_ints(b,N);
c = (int*)malloc(size);

// Device memory 할당 및 복사 생략...

add<<<N/M,M>>>(d_a,d_b,d_c);

// 결과 복사 및 해제...
```

---

## B.4) 임의 크기의 벡터에 대한 안전한 접근

실제로 배열 크기($N$)가 항상 블록/스레드 총합과 일치하지 않으므로,
배열 경계 밖으로 접근하지 않도록 조건문을 추가해야 합니다:

```cpp
__global__ void add(int* a,int* b,int* c,int n){
    int index = threadIdx.x + blockIdx.x * blockDim.x;
    if(index < n)
        c[index] = a[index] + b[index];
}
```
실행 시:
```cpp
add<<<(N+THREADS_PER_BLOCK -1)/THREADS_PER_BLOCK , THREADS_PER_BLOCK>>>(d_a,d_b,d_c,N);
```

---

## B.5) 스레드 간 데이터 공유와 동기화

### B.5.1) 블록 내 스레드간 공유메모리 활용

동일한 Block 내 여러 Threads는 공유메모리를 통해 데이터를 효율적으로 공유할 수 있습니다.
공유메모리는 `__shared__` 키워드를 사용하여 선언하며,
블록마다 독립적으로 할당되어 다른 블록에서는 접근할 수 없습니다.

### B.5.2) 협업형 스레드 처리(Cooperating Threads)

예를 들어 반경(radius)이 $r$인 경우,
출력 원소 하나를 계산하려면 입력 배열 중 연속된 $(2r+1)$개의 값이 필요합니다.
각 Thread가 출력값 하나씩 담당하더라도 입력값 일부가 여러 번 읽히게 됩니다.

이를 개선하기 위해 모든 Thread가 필요한 입력값들을 먼저 공유메모리에 캐싱하고,
계산 후 결과만 저장함으로써 전역메모리(Global Memory)의 불필요한 읽기를 줄일 수 있습니다.

#### B.5.2.1) Stencil 연산 예시 코드

```cpp
#define BLOCK_SIZE ...
#define RADIUS ...

__global__ void stencil_1d(int* in,int* out){
   __shared__ int temp[BLOCK_SIZE + 2*RADIUS];

   int gindex = threadIdx.x + blockIdx.x * blockDim.x;
   int lindex = threadIdx.x + RADIUS;

   // 전역 메모리 -> 공유메모리 복사 
   temp[lindex] = in[gindex];

   if(threadIdx.x < RADIUS){
       temp[lindex - RADIUS]      = in[gindex - RADIUS];     // 왼쪽 경계부 캐싱 
       temp[lindex + BLOCK_SIZE ] = in[gindex + BLOCK_SIZE]; // 오른쪽 경계부 캐싱 
   }

   __syncthreads(); // 모든 쓰레드 동기화(barrier)

   // stencil 적용 
   int result=0;
   for(int offset=-RADIUS; offset<=RADIUS ; ++offset)
       result += temp[lindex+offset];
   
   out[gindex]=result; 
}
```
> $\texttt{void~\_\_syncthreads()}$는 한 블록 내 모든 스레드가 해당 지점까지 도달할 때까지 대기하게 하여 데이터 레이스(data hazard)를 방지하는 역할을 합니다.

---

## B.6) 추가 참고사항: Host & Device 간 동기화

- 커널 런치는 비동기로 실행되어 CPU 제어권이 즉시 반환됩니다.
- 결과 소비 전 반드시 동기화 필요:
	- `cudaMemcpy()` : 데이터 복사 완료까지 CPU 대기(blocking)
	- `cudaDeviceSynchronize()` : 앞선 모든 CUDA 호출 완료까지 대기(blocking)
	- `cudaMemcpyAsync()` : 비동기로 복사 진행(CPU 즉시 반환)
- 여러 host thread 또는 multi-GPU 환경에서는 별도의 device 선택(`cudaSetDevice(i)`), peer-to-peer 복사 등이 가능합니다.
