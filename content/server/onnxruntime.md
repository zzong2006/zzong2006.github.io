---
title: "ONNX Runtime"
tags:
  - machine_learning
  - open_source
  - deep_learning
aliases: ["ONNX Runtime"]
---

PyTorch 랭킹 모델을 [[mlops/Open Neural Network Exchange|ONNX]] 파일로 내보냈다고 하자. 이제 이 파일을 읽어 실제로 점수를 계산할 엔진이 필요하다.

ONNX Runtime 은 Microsoft 가 만든 ONNX 실행 엔진이다. PyTorch 없이 Python · C++ · C# · Java 등 여러 언어와 OS 에서 쓸 수 있다. 컴파일 도구 전체에서의 자리는 [[Model Compilation]] 에 있다.

# A) 하는 일

1. ONNX 파일을 읽는다.
2. 그래프를 정리한다. 상수 미리 계산하기, 안 쓰는 연산 지우기, 이어진 연산 합치기 같은 변형을 basic · extended · all 단계로 골라 켠다.
3. 고른 백엔드로 실행한다.

# B) Execution Provider

**같은 ONNX 그래프를 CPU · NVIDIA GPU · 다른 가속기 중 어디서 돌릴지 Execution Provider 로 고른다.**

- CPU, CUDA, [[TensorRT]], OpenVINO (Intel), CoreML (Apple) 등이 있다.
- 여러 개를 우선순위대로 주면, 앞의 provider 가 처리하지 못한 연산을 뒤의 provider (보통 CPU) 가 맡는다.
- 연산이 GPU 와 CPU 를 오가면 그 사이에 데이터 복사가 생겨 느려진다. 그래프 전체가 한 provider 에서 도는지 확인한다.

# C) 양자화 도구

ONNX Runtime 에는 ONNX 모델을 INT8 로 바꾸는 도구가 들어 있다 ([[Quantization]]).

- **dynamic quantization**: weight 만 미리 INT8 로 바꾸고, activation 의 범위는 실행 중에 계산한다. calibration 데이터가 필요 없다.
- **static quantization**: calibration 데이터를 흘려 activation 범위를 미리 정한다. 실행 중 계산이 없어 더 빠르다.

# D) 학습 가속

ONNX Runtime 은 추론뿐 아니라 PyTorch 학습을 빠르게 하는 기능 (ONNX Runtime Training) 도 제공한다.

# References

- [ONNX Runtime](https://onnxruntime.ai/)
- [ONNX Runtime inference examples](https://github.com/microsoft/onnxruntime-inference-examples)
