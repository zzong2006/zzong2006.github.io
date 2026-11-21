---
title: "Open Neural Network Exchange (ONNX)"
aliases: ["ONNX"]
tags:
  - deep_learning
  - machine_learning
---

PyTorch 로 학습한 랭킹 모델을, Python 이 없는 C++ 서빙 서버나 NVIDIA 의 [[TensorRT]] 에서 돌리고 싶다고 하자.

- 학습 코드는 PyTorch 에 묶여 있다.
- 서빙 쪽 도구는 PyTorch 코드를 읽지 못한다.
- 그 사이에 "어떤 연산을 어떤 순서로 하는지" 를 프레임워크와 상관없이 적어 둔 파일이 있으면 된다.

ONNX (Open Neural Network Exchange) 가 그 파일 형식이다. 이 파일을 어떻게 최적화해 실행하는지는 [[Model Compilation]] 에 있다.

# A) ONNX 파일에 담기는 것

- **계산 그래프**: 연산 (노드) 과 연산 사이를 흐르는 텐서 (선) 의 연결.
- **weight**: 학습된 값.
- **입력 · 출력 정의**: 이름, 자료형, 모양. 배치 크기처럼 바뀌는 차원은 이름으로 비워 둘 수 있다.
- **opset 버전**: 각 연산의 정의를 몇 번째 판으로 따르는지. 같은 연산도 판이 바뀌며 지원하는 옵션이 달라진다.

# B) PyTorch 에서 내보내기

**`torch.onnx.export` 는 예시 입력을 모델에 한 번 흘려 보내며 실행된 연산을 기록한다.**

- 그래서 Python `if` · `for` 로 입력마다 다르게 도는 부분은, 예시 입력이 지나간 길만 그래프에 남는다.
- 배치 크기 · 후보 수처럼 요청마다 달라지는 차원은 가변으로 지정해야 한다. 지정하지 않으면 예시 입력의 크기로 고정된다.
- 최근 PyTorch 는 torch.compile 과 같은 방식으로 그래프를 잡는 exporter 도 제공한다.

# C) ONNX 파일을 실행하는 곳

- **[[onnxruntime|ONNX Runtime]]**: ONNX 를 실행하는 범용 엔진이다. CPU · GPU 를 모두 지원한다.
- **[[TensorRT]]**: ONNX 를 읽어 NVIDIA GPU 전용 엔진으로 다시 만든다.
- **[[Triton]] Inference Server**: ONNX 파일과 TensorRT 엔진을 그대로 올려 서빙한다.

# D) 자주 막히는 자리

1. **지원되지 않는 연산**: 직접 만든 연산이나 아주 새로운 연산은 해당 opset 에 없어서 내보내기가 실패한다.
2. **사라진 분기**: 예시 입력이 안 지나간 분기는 그래프에 없다.
3. **고정된 크기**: 가변 차원을 지정하지 않아, 다른 크기의 입력에서 실행이 실패한다.

**내보낸 뒤에는 원본 PyTorch 모델과 같은 입력을 넣어 출력을 비교한다.**

- 값이 소수점 아래에서 조금 다른 것은 정상이다.
- 크게 다르면 위 세 가지 중 하나를 의심한다.

# References

- [ONNX tutorials](https://github.com/onnx/tutorials)
- [PyTorch, torch.onnx](https://pytorch.org/docs/stable/onnx.html)
