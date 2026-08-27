---
tags: ["deep_learning", "LLM"]
aliases: ["DDP"]
---

# A) DistributedDataParallel ?

![|600](https://i.imgur.com/q9FkFgE.png)

a batch is sent to each GPU worker which has its own copy of the model. There the gradients are computed and then aggregated to update the model on each worker.

# B) `local_rank`

```python
torch.cuda.set_device(args.local_rank)
```

* 한개의 컴퓨터에서 연산을 진행하는 경우, `local` 이라는 키워드가 붙는다.
	* 만약 연산하는 컴퓨터가 여러개라면 global 이다.
* `rank` 는 컴퓨터의 process id 라고 생각하면 된다.
	* 기본적으로 여러개 컴퓨터를 사용하는 구조가 포함되어있는 패키지이기 때문에 한개의 컴퓨터에서 쓴다면 그냥 0 이라고 쓰면 된다.

# C) References

* [[PYTORCH] DistributedDataParallel이란? - Nvidia APEX로 구현하기 :: PAINTYCODE](https://paintycode.tistory.com/29)
