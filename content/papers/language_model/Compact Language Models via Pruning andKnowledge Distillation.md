---
title: "Compact Language Models via Pruning andKnowledge Distillation"
tags: ["language_model", "distillation", "pruning", "LLM", "nlp", "paper_review", "sLLM"]
---

# A) NVIDIA 의 Pruning 과 Knowledge Distillation 을 통한 언어 모델 압축

최근 NVIDIA 연구진은 structured weight [[pruning]] 과 [[knowledge distillation]] 을 결합한 방법이, 대형 언어 모델을 점차적으로 더 작은 모델로 압축하는 데 매우 효과적이라는 사실을 밝혔습니다. 이 방법으로 만들어진 대표적인 작은 모델로는 [NVIDIA Minitron 8B](https://huggingface.co/nvidia/Minitron-8B-Base) 와 [Minitron 4B](https://huggingface.co/nvidia/Minitron-4B-Base) 가 있습니다. 이들은 더 큰 모델인 [15B](https://arxiv.org/abs/2402.16819) 를 pruning 및 distilling 하여 얻어진 결과물입니다. 이들 모두는 [NVIDIA Nemotron family](https://developer.nvidia.com/blog/leverage-our-latest-open-models-for-synthetic-data-generation-with-nvidia-nemotron-4-340b/) 에 속합니다.

## A.1) Pruning 과 Distillation

### A.1.1) Pruning

Pruning 은 모델의 크기를 줄이고 간소화하는 과정입니다. 크게 두 가지 방식으로 나눌 수 있는데, 하나는 레이어를 제거하는 depth pruning 이고, 다른 하나는 뉴런, attention heads, embedding channels 등을 제거하는 width pruning 입니다. Pruning 후에는 정확도를 유지하거나 회복하기 위해 일정 부분 재훈련이 필요할 수 있습니다.

### A.1.2) Knowledge Distillation

_Model distillation_ 은 복잡하고 큰 teacher model 의 지식을 더 작고 단순한 student model 로 전달하는 기술입니다. 목표는 원래의 대형 모델이 가진 예측 능력을 최대한 유지하면서도 더 빠르고 자원 소모가 적은 효율적인 모델을 만드는 것입니다.

## A.2) Classical Knowledge Distillation Vs SDG Fine-tuning

Knowledge distillation 에는 두 가지 주요 방식이 있습니다:

1. **SDG Finetuning**: 대형 teacher model 에서 생성된 synthetic data 를 사용하여 미리 학습된 작은 student model 을 추가로 fine-tune 합니다. 여기서 student 는 teacher 가 예측한 최종 토큰만 모방합니다. 예시로는 Azure AI Studio 에서 제공되는 Llama 3.1 Azure Distillation 이나 AWS 에서 제공되는 Llama 3.1 405B 를 활용한 synthetic data 생성 및 distillation 튜토리얼이 있습니다.
2. **Classical Knowledge Distillation**: Student 가 단순히 최종 토큰만 학습하는 것이 아니라, training dataset 에서 teacher 의 logits 및 중간 상태까지 모방합니다. 이는 one-shot label 대신 분포 형태의 더 나은 라벨 정보를 제공한다고 볼 수 있으며, 동일한 데이터라도 gradient 에 더 풍부한 피드백이 포함되어 학습 정확도와 효율성을 높일 수 있습니다. 다만, logits 가 너무 커서 저장하기 어렵기 때문에 이를 지원할 수 있는 훈련 프레임워크가 필요합니다.

두 방식은 상호 배타적이지 않으며 서로 보완적인 관계에 있습니다. 이번 글에서는 주로 classical knowledge distillation 방식을 다루고 있습니다.

# B) 중요도 분석

모델을 축소하기 위해서는 모델의 어느 부분이 중요한지 이해하는 것이 매우 중요합니다. 우리는 활성화 기반의 중요도 추정 전략을 제안하는데, 이 방법은 작은 크기의 calibration 데이터셋 (1024 샘플) 을 사용하여 forward propagation 만으로 깊이 (depth), 뉴런 (neuron), 헤드 (head), 임베딩 채널 (embedding channel) 등 여러 축 (axes) 에 대한 민감도 정보 (sensitivity information) 를 **동시**에 계산합니다. 이 방식은 gradient 정보를 활용하고 backward propagation 을 요구하는 기존 방법들에 비해 더 간단하고 비용 효율적입니다.

모델을 pruning 할 때, 특정 축 또는 여러 축의 조합에 대해 pruning 과 중요도 추정을 반복적으로 교차할 수 있습니다. 하지만 우리의 실험 결과에 따르면, **단일 단계 (single-shot) 로 수행되는 중요도 추정만으로 충분하며 반복적인 추정은 추가적인 이점을 제공하지 않는 것으로 나타났습니다.**

# C) Retraining with Classical Knowledge Distillation

학생 모델 (축소된 모델) 은 $N$ 개의 레이어를 가지고 있으며, 이는 원본 모델 (축소되지 않은 모델) 인 교사 모델의 M 개의 레이어에서 지식을 전달받아 학습합니다. 학생 모델은 임베딩 출력 손실, 로짓 손실, 그리고 학생 블록 S 와 교사 블록 T 간에 매핑된 transformer encoder 관련 손실을 최소화하는 방식으로 학습을 진행합니다.

![](https://i.imgur.com/iwXEH5X.png)

# D) Pruning 및 Knowledge Distillation 을 통한 압축 기법

Compact Language Models via Pruning and Knowledge Distillation 에서 수행된 광범위한 ablation 연구를 바탕으로, 효과적인 모델 압축을 위한 몇 가지 최적의 방법들을 정리했습니다.

## D.1) 모델 크기 조정 (Sizing)

* LLM(Large Language Model) 계열을 훈련할 때는 가장 큰 모델을 먼저 훈련한 후, 이를 반복적으로 pruning(가지치기) 및 distillation(지식 증류) 하여 더 작은 LLM 을 얻는 것이 좋습니다.
* 가장 큰 모델이 여러 단계로 나누어진 학습 전략으로 훈련되었다면, 마지막 단계에서 얻은 모델을 pruning 하고 재훈련하는 것이 최선입니다.
* 목표 크기에 가장 가까운 기존 소스 모델을 pruning 하는 것이 효율적입니다.

## D.2) Pruning

* 깊이보다는 너비 (width) 를 줄이는 방식의 pruning 이 더 효과적입니다. 이는 15B 이하의 규모의 모델들에서 특히 잘 작동했습니다.
* 중요도를 한 번에 평가하는 single-shot importance estimation 방식을 사용하는 것이 좋습니다. 반복적인 중요도 평가 (iterative importance estimation) 는 별다른 이점을 제공하지 않았습니다.

## D.3) 재훈련 (Retraining)

* 일반적인 학습 대신 distillation loss 만으로 재훈련하는 것이 권장됩니다.
* 깊이가 크게 줄어든 경우에는 logit 과 중간 상태 (intermediate state), embedding distillation 방식을 함께 사용하는 것이 좋습니다.
* 깊이가 크게 줄어들지 않은 경우에는 logit-only distillation 방식만 사용해도 충분합니다.

# E) Depth-only Pruning

우리는 먼저 각 레이어 또는 연속된 레이어 그룹의 중요성을 평가하기 위해, 해당 레이어들을 모델에서 제거한 후 LM 손실 (Loss) 증가나 다운스트림 작업에서의 정확도 감소를 관찰했습니다.

그 결과, 모델의 처음과 끝에 위치한 레이어들이 가장 중요한 역할을 한다는 것을 확인했습니다. 하지만, LM 손실이 반드시 다운스트림 성능과 직접적으로 연관되지는 않는다는 점도 발견했습니다.

## E.1) Width-only Pruning

우리는 Llama 3.1 8B 모델을 압축하기 위해 embedding (hidden) 차원과 MLP 중간 차원을 너비 축을 따라 pruning 했습니다. 구체적으로는, 앞서 설명한 activation 기반 전략을 사용하여 각 attention head, embedding 채널, 그리고 MLP hidden 차원의 중요도를 계산했습니다. 그런 다음 다음과 같은 방식으로 pruning 을 진행했습니다:

* MLP 중간 차원을 14336 에서 9216 으로 줄였습니다.
* Hidden 크기를 4096 에서 3072 로 줄였습니다.
* Attention head 수와 레이어 수를 재학습시켰습니다.

여기서 주목할 점은 one-shot pruning 직후에는 width-only pruning 의 LM 손실이 depth-only pruning 보다 더 높았지만, 짧은 재학습 이후에는 그 추세가 반전된다는 것입니다.

# F) References

* blog: [How to Prune and Distill Llama-3.1 8B to an NVIDIA Llama-3.1-Minitron 4B Model | NVIDIA Technical Blog](https://developer.nvidia.com/blog/how-to-prune-and-distill-llama-3-1-8b-to-an-nvidia-llama-3-1-minitron-4b-model/)
* paper: [2407.14679](https://arxiv.org/pdf/2407.14679)
