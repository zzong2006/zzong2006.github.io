---
title: "PyTorch"
tags:
  - PyTorch
  - python
  - library
  - deep_learning
  - machine_learning
aliases:
  - 파이토치
---

# A) [[CUDA]]

```python
def run_cuda_benchmark(num_iters: int, profile: bool = False) -> float:
	torch.cuda.synchronize()
	if profile:
		torch.cuda.cudart().cudaProfilerStart()
	start_time = time.perf_counter()

	for _ in range(num_iters):
		layer(x, residual)
	torch.cuda.synchronize()

	end_time = time.perf_counter()
	if profile:
		torch.cuda.cudart().cudaProfilerStart()
	return (end_time - start_time) / num_iters
```

# B) Sampling

1. `torch.multinomia`: 주어진 vector 의 weight 값을 [[statistic/multinomial distribution|multinomial distribution]] 로 치환해서 샘플링을 수행한다.

# C) Indexing

1. `torch.gather`: [torch.gather — PyTorch 2.4 documentation](https://pytorch.org/docs/stable/generated/torch.gather.html)

**Example**

```python
t = torch.tensor([[1, 2], [3, 4]])
torch.gather(t, 1, torch.tensor([[0, 0], [1, 0]]))
# tensor([[ 1,  1], [ 4,  3]])
```

위 예시에서는 `dim=1` (column) 기준으로 인덱싱을 수행한다.

# D) Embedding

1. `torch.nn.Embedding`

* 고정된 사이즈의 embedding 을 저장하는 dictionary 형태의 lookup 테이블
* index 로 구성된 tensor 를 입력으로 받고, embedding tensor 를 반환한다.
* 학습 가능한 embedding 가중치는 $\mathcal{N}(0,1)$ 로 초기화된다.

# E) Data Loading

참조: https://tutorials.pytorch.kr/beginner/data_loading_tutorial.html

## E.1) Dataset

Dataset class 를 정의하고 for loop 를 돌면서 샘플링을 진행한다.

```python
transformed_dataset = CustomDataset(..., transform=...)

for i in range(len(transformed_dataset)):
    sample = transformed_dataset[i]
	...
```

## E.2) Transform

호출될 수 있는 클래스로 구현

```python
tsfm = Transform(params) # transforms 선언
transformed_sample = tsfm(sample) # transforms 호출
```

## E.3) Dataset Sampling

* 파일 전체를 메모리에 올리지 않고 필요할때마다 불러와서 읽음
* 읽은 데이터에 transform 적용

## E.4) `DataLoader`

Dataset 을 for loop 를 통해 반복하는 작업 대신 dataloader 를 사용할 수 있다. `Dataset` 은 샘플과 정답 (label) 을 저장하고, `DataLoader` 는 `Dataset` 을 샘플에 쉽게 접근할 수 있도록 순회 가능한 객체 (iterable) 로 감쌉니다.

### E.4.1) `collate_fn`

데이터 로더에서 생성한 배치 데이터를 받아서 데이터 파이프라인 처리를 진행하는 함수.

❔Transform 과 차이점은 처리하는 데이터가 배치냐 아니냐의 차이점이 아닐까 싶음.

# F) GPU 메모리 관리

## F.1) GPU 메모리 부족 시

아래 방식처럼 현재 [[CUDA]] 메모리를 클리어할 수 있다.

```python
import torch
torch.cuda.empty_cache()
```

또한 아래와 같이 사용하지 않는 변수들도 삭제할 수 있다.

```python
import gc
del variables
gc.collect()
```

실제로는 파이토치는 메모리 자체를 청소하는게 아니라 메모리를 차지하는 변수들을 가리키는 레퍼런스들을 청소한다.

참고) [stackoverflow: how-to-avoid-cuda-out-of-memory-in-pytorch](https://stackoverflow.com/questions/59129812/how-to-avoid-cuda-out-of-memory-in-pytorch)

# G) Related

* [[PyTorch-BigGraph]]

# H) References
