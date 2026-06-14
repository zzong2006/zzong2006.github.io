---
tags: ["server", "deep_learning", "MLOps"]
aliases: ["트리톤"]
---

# A) Triton ?

Triton Inference Server 는 딥러닝 모델을 높은 성능으로 서빙을 할 수 있는 오픈소스 추론서버입니다. [[machine_learning/Open Neural Network Exchange|ONNX]], TensorFlow, PyTorch, TensorRT 와 같은 다양한 딥러닝 프레임워크를 지원하며 다양한 모델 실행과 효율적인 배치 전략을 통해 하드웨어 활용도를 극대화할 수 있도록 최적화 설계되었습니다 (C++ base).

# B) Repository

The Triton Inference Server serves models from one or more model repositories that are specified when the server is started. While Triton is running, the models being served can be modified as described in [Model Management](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_management.html).

S3 부터 일반적인 python script 까지 띄울 수 있음

다만 huggingface 는 지원하지 않는 것으로 보임

# C) 모델 구성

모델 저장소에 있는 각 모델은 필수 및 선택 정보를 제공하는 모델 구성을 포함해야 합니다. 일반적으로 이 구성 정보는 `config.pbtxt` 파일에 저장되며, 이는 [ModelConfig protobuf](https://github.com/triton-inference-server/common/blob/main/protobuf/model_config.proto) 형식으로 지정됩니다.

모델을 Triton 서버에서 사용하려면 이러한 구성이 반드시 필요합니다.

## C.1) Example

예를 들어, [[TensorRT]] 모델이 두 개의 입력 (`input0`, `input1`) 과 하나의 출력 (`output0`) 을 가지고 있다고 가정해봅시다. 이때 모든 입력과 출력은 16 개의 항목으로 구성된 float32 텐서입니다. 이 모델에 대한 최소한의 설정은 다음과 같습니다:

* **입력**: `input0`, `input1` (각각 16 개의 float32 항목)
* **출력**: `output0` (16 개의 float32 항목)

```
platform: "tensorrt_plan"
  max_batch_size: 8
  input [
    {
      name: "input0"
      data_type: TYPE_FP32
      dims: [ 16 ]
    },
    {
      name: "input1"
      data_type: TYPE_FP32
      dims: [ 16 ]
    }
  ]
  output [
    {
      name: "output0"
      data_type: TYPE_FP32
      dims: [ 16 ]
    }
  ]
  ```

# D) Vs. [[BentoML]]

# E) Related

# F) References
