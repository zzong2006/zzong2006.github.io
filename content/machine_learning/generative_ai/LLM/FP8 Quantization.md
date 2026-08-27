---
title: "FP8 Quantization"
tags: ["LLM", "quantization", "inference", "serving", "Qwen"]
aliases: ["FP8", "FP8 Quantization"]
---

# A) 한줄 요약

FP8 Quantization은 LLM의 weight, activation tensor, 때로는 KV cache를 8-bit floating point로 낮춰 inference 비용을 줄이는 방법이다.

핵심 이점은 단순히 모델 파일이 작아지는 데서 끝나지 않는다. H100/H200 같은 Hopper GPU와 Blackwell GPU에서는 FP8 Tensor Core를 쓸 수 있으므로, FP8 kernel이 제대로 붙으면 메모리 사용량, memory bandwidth, [[Prefill|prefill]] 구간의 matrix multiplication/GEMM 처리량이 함께 좋아질 수 있다.

다만 FP8이 항상 latency를 줄이는 것은 아니다. small batch decode, KV cache 병목, MoE routing, 통신, scheduler overhead가 병목이면 weight를 FP8로 줄여도 체감이 작을 수 있다. 그래서 FP8은 "메모리를 줄이는 옵션"이면서 동시에 "하드웨어와 serving engine이 맞아야 빨라지는 옵션"으로 봐야 한다.

# B) FP8이 왜 도움이 되나

BF16/FP16은 값 하나를 16bit로 저장한다. FP8은 값 하나를 8bit로 저장한다. 같은 parameter 수라면 weight 메모리는 대략 절반으로 줄어든다.

```text
BF16 weight: 2 bytes / parameter
FP8 weight:  1 byte  / parameter
```

이 차이는 큰 모델에서 바로 VRAM 차이로 나타난다. 예를 들어 70B급 dense model의 weight만 놓고 보면 BF16은 대략 140GB가 필요하지만, FP8은 대략 70GB 수준으로 내려간다. 실제 serving에서는 KV cache, activation buffer, CUDA graph, workspace가 추가로 필요하므로 전체 VRAM이 정확히 절반이 되지는 않는다.

두 번째 이점은 bandwidth다. LLM inference는 많은 구간에서 weight를 메모리에서 읽어와 matrix multiplication을 수행한다. 같은 계산을 하더라도 읽어야 하는 weight byte가 줄면 memory bandwidth 압력이 낮아진다.

세 번째 이점은 하드웨어 가속이다. Hopper 계열 H100/H200과 Blackwell 계열 GPU는 FP8 Tensor Core 경로를 제공한다. serving engine이 FP8 GEMM kernel을 제대로 쓰면 단순히 메모리만 줄이는 것이 아니라 throughput도 올라갈 수 있다.

# C) FP8은 INT4나 NVFP4와 무엇이 다른가

FP8은 float 포맷이다. INT4/AWQ/GPTQ처럼 정수 grid에 값을 맞추는 방식과 다르게, exponent와 mantissa를 가진 작은 floating point로 값을 표현한다.

| 방식 | 주 사용처 | 장점 | 주의점 |
| --- | --- | --- | --- |
| FP8 | H100/H200/Blackwell inference | 품질과 성능의 균형이 좋고 hardware support가 좋음 | A100에서는 네이티브 이점이 약함 |
| INT8 | 범용 quantization | 안정적이고 지원 폭이 넓음 | FP8 Tensor Core 경로보다 느릴 수 있음 |
| INT4/AWQ/GPTQ | weight-only 압축 | VRAM 절감 폭이 큼 | activation tensor는 보통 고정밀로 남아 compute 이득이 제한될 수 있음 |
| NVFP4 | Blackwell 중심 inference | FP8보다 더 강한 압축 | Blackwell 의존성이 크고 scale/calibration에 민감함 |

일반적으로 H200을 쓴다면 FP8이 가장 자연스러운 선택지다. A100은 FP8 Tensor Core가 없으므로 INT4/AWQ/GPTQ나 BF16 serving이 더 현실적일 수 있다. Blackwell이면 FP8뿐 아니라 NVFP4 같은 더 공격적인 포맷도 검토할 수 있다.

여기서 activation은 sigmoid, ReLU, GELU 같은 activation function을 뜻하는 말이 아니다. quantization 문맥에서는 layer 사이를 흘러가는 중간 tensor, 즉 hidden state나 MLP/attention의 중간 출력값을 가리키는 경우가 많다.

weight와 activation tensor를 따로 보는 이유는 둘의 성격이 다르기 때문이다. weight는 모델 파일에 고정된 값이라 offline에서 한 번 quantize해둘 수 있다. 반면 activation tensor는 요청마다, token마다, layer마다 값의 분포가 달라진다. 그래서 activation까지 FP8로 낮추려면 runtime scale 계산, calibration, kernel 지원이 더 중요해진다.

INT4/AWQ/GPTQ 같은 weight-only quantization은 weight 메모리를 크게 줄이지만, activation tensor가 BF16/FP16으로 남는 경우가 많다. 이때 kernel이 실제 곱셈을 어떻게 처리하느냐에 따라 compute 이득이 제한될 수 있다. 반대로 FP8 W8A8처럼 weight와 activation을 함께 낮추면 Tensor Core가 더 직접적으로 이득을 볼 수 있다.

# D) FP8 적용 방식

FP8을 적용하는 방법은 크게 세 가지다.

## D.1) 이미 quantized된 FP8 checkpoint를 사용한다

가장 쉬운 방법은 모델 제공자가 이미 만든 `-FP8` checkpoint를 쓰는 것이다. Qwen 계열은 이런 모델을 많이 제공한다. 예를 들어 `Qwen/Qwen3-235B-A22B-FP8` 모델 카드는 fine-grained FP8 quantization을 사용하며, block size는 `128`이라고 설명한다.

vLLM에서는 OpenAI-compatible server를 다음처럼 띄울 수 있다.

```shell
vllm serve Qwen/Qwen3-235B-A22B-FP8 \
  --enable-reasoning \
  --reasoning-parser deepseek_r1
```

SGLang에서는 다음처럼 띄운다.

```shell
python -m sglang.launch_server \
  --model-path Qwen/Qwen3-235B-A22B-FP8 \
  --reasoning-parser qwen3
```

이 경로가 가장 안전하다. weight scale, activation scale, block size, metadata가 모델 카드와 `config.json`에 맞춰 들어가 있기 때문이다.

## D.2) Serving engine에서 runtime FP8 quantization을 켠다

두 번째 방법은 BF16 checkpoint를 그대로 두고, serving engine에서 FP8 quantization 옵션을 켜는 것이다.

개념적으로는 다음에 가깝다.

```shell
vllm serve <bf16-model> --quantization fp8
```

이 방식은 실험이 빠르다. 모델을 따로 변환하지 않고 FP8 경로를 확인할 수 있다. 대신 production에서는 pre-quantized checkpoint보다 불리할 수 있다. runtime scale 계산, dynamic activation quantization, kernel 지원 여부에 따라 latency와 품질이 흔들릴 수 있기 때문이다.

## D.3) Calibration 기반 PTQ로 직접 만든다

세 번째 방법은 calibration dataset을 사용해 직접 FP8 checkpoint를 만드는 것이다. NVIDIA ModelOpt, LLM Compressor 같은 도구가 이 역할을 한다.

대략적인 흐름은 다음과 같다.

```text
BF16 checkpoint
-> calibration dataset 준비
-> layer별 activation/weight range 측정
-> FP8 scale 결정
-> quantized checkpoint 저장
-> vLLM/SGLang/TensorRT-LLM에서 서빙
```

이 방식은 production에서 중요하다. 단순히 값을 FP8로 바꾸는 것보다, 어떤 layer를 quantize할지, 어떤 layer를 제외할지, activation scale을 static으로 둘지 dynamic으로 둘지 정해야 품질 손실을 줄일 수 있다.

## D.4) KV cache FP8은 별도 옵션이다

weight가 FP8이라고 KV cache도 자동으로 FP8이 되는 것은 아니다. KV cache는 긴 context와 동시 요청 수에서 VRAM을 크게 먹는 부분이다.

vLLM 같은 serving engine에서는 KV cache dtype을 따로 설정할 수 있다.

```shell
vllm serve <model> --kv-cache-dtype fp8
```

KV cache FP8은 긴 context나 높은 concurrency에서 메모리 효율이 좋다. 대신 attention 품질에 영향을 줄 수 있으므로, perplexity보다 실제 task benchmark와 long-context 품질을 같이 봐야 한다.

# E) 언제 throughput과 latency가 좋아지나

FP8이 잘 먹히는 조건은 꽤 분명하다.

1. GPU가 H100/H200/Blackwell처럼 FP8 Tensor Core를 지원한다.
2. serving engine이 해당 모델 구조의 FP8 kernel을 제대로 지원한다.
3. batch가 충분히 커서 GEMM 처리량이 병목이다.
4. weight memory bandwidth가 병목이다.
5. activation tensor와 KV cache까지 함께 줄여야 하는 workload다.

이 조건이 맞으면 FP8은 throughput을 꽤 올릴 수 있다. 같은 GPU에서 더 큰 batch를 처리하거나, 같은 batch를 더 낮은 VRAM으로 돌릴 수 있다.

반대로 아래 상황에서는 latency 개선이 작을 수 있다.

1. batch size가 1에 가깝고 decode가 짧다.
2. KV cache bandwidth가 병목이다.
3. MoE 모델에서 expert routing이나 all-to-all 통신이 병목이다.
4. quantize/dequantize overhead가 kernel 이득보다 크다.
5. CPU scheduler, tokenizer, network overhead가 더 크다.

즉 FP8은 "항상 빨라지는 스위치"가 아니다. [[Prefill|prefill throughput]], decode throughput, first-token latency, per-token latency를 나눠서 봐야 한다.

# F) Qwen FP8 모델을 볼 때 체크할 것

Qwen의 `-FP8` 모델을 쓸 때는 아래를 먼저 확인한다.

1. 모델 카드에 `FP8`, `quantization_config`, `block size`가 명시되어 있는가?
2. `vllm`이나 `sglang` 권장 최소 버전이 있는가?
3. thinking mode를 쓰는 모델이면 reasoning parser 설정이 필요한가?
4. H200/Blackwell처럼 FP8 kernel을 제대로 탈 수 있는 GPU인가?
5. KV cache dtype은 별도로 줄일 것인가?
6. BF16 대비 benchmark 품질과 latency를 직접 비교했는가?

Qwen3 FP8 모델 카드 기준으로는 `sglang>=0.4.6.post1` 또는 `vllm>=0.8.5`를 사용해 OpenAI-compatible endpoint를 만들 수 있다고 안내한다. 또한 Qwen3의 thinking/non-thinking mode는 serving framework에서도 별도 parser 설정과 sampling 설정을 맞춰야 한다.

# G) 실무 판단

H200을 가지고 있다면 FP8은 꽤 좋은 기본 선택지다. BF16보다 VRAM을 줄이고, FP8 Tensor Core를 활용할 수 있기 때문이다.

다만 "FP8 모델을 쓰면 latency, throughput, memory가 모두 좋아진다"라고 말하면 과하다. memory는 좋아질 가능성이 높고, throughput도 조건이 맞으면 좋아진다. latency는 workload에 따라 다르다.

실험할 때는 아래 순서가 무난하다.

1. BF16 baseline을 먼저 측정한다.
2. 같은 모델의 official `-FP8` checkpoint가 있으면 그것부터 써본다.
3. [[Prefill|prefill throughput]], decode throughput, first-token latency, per-token latency를 나눠서 측정한다.
4. KV cache memory가 문제라면 `--kv-cache-dtype fp8`도 따로 비교한다.
5. 품질은 benchmark score뿐 아니라 긴 reasoning, tool use, multilingual output을 따로 본다.

결론적으로 FP8은 H100/H200 세대에서 가장 실용적인 저정밀 serving 옵션 중 하나다. A100에서는 효과가 제한적이고, Blackwell에서는 FP8보다 더 공격적인 NVFP4까지 선택지가 넓어진다.

# References

- Qwen, [Qwen3-235B-A22B-FP8](https://huggingface.co/Qwen/Qwen3-235B-A22B-FP8)
- Qwen, [Qwen3 Documentation](https://qwen.readthedocs.io/en/latest/)
- vLLM, [Quantization](https://docs.vllm.ai/en/latest/features/quantization/)
- SGLang, [Qwen Usage](https://qwen.readthedocs.io/en/latest/deployment/sglang.html)
- NVIDIA, [Transformer Engine FP8](https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/examples/fp8_primer.html)
- NVIDIA, [Introducing NVFP4](https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/)
- [[Quantization]]
- [[AWQ]]
- [[Prefill]]
