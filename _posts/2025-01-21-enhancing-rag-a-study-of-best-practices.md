---
layout: post
title: RAG 구축 레슨런
date: 2025-01-21 01:00:00
giscus_comments: true
categories: paper-review
toc:
  beginning: true
  sidebar: true
tags: RAG Retrieval WIP
---

아래 9가지 RAG 성능을 향상시키기 위한 연구 주제에 대해 실험 기반의 empirical 조사 결과를 정리

1. RAG 시스템에서 LLM의 크기가 응답 품질에 어떤 영향을 미치는가?
2. 미세한 프롬프트 차이가 검색과 생성의 수준에 크게 영향을 미칠 수 있는가?
3. retrieve 할 문서의 청크 사이즈가 전체 성능에 어떤 영향을 미치는가?
4. 지식 베이스의 크기가 전체 성능에 어떤 영향을 미치는가?
5. 문서 컨텍스트를 얼마나 자주 업데이트해야 정확도를 최적화할 수 있는가?
6. 쿼리를 확장하면 모델의 정밀도가 향상되는가?
7. Contrastive In-Context Learning 예제를 포함하면 RAG 생성에 어떤 영향을 미치는가?
8. 다국어 문서를 포함하면 RAG 시스템의 응답에 어떤 영향을 미치는가?
9. 문서 대신 문장을 가져오는 reranking 방식이 성능에 어떤 영향을 미치는가?

## Key Findings

- RAG 에서 Contrastive In-Context Learning 은 성능 향상에 유의미한 영향을 미침
- 정확하면서도 간결한 문서를 이용하는것이 성능에 핵심 요소
- 쿼리 확장, 문서 크기, retrieval stride 같은 요소들은 의미 있는 개선을 가져오지 않았음
- RAG 지식 베이스의 크기도 반드시 중요한것은 아니며, 오히려 **문서의 품질과 관련성**이 중요

## Experiments

### (1) LLM 크기에 따른 응답 품질 조사

![Image](https://i.imgur.com/O5llP9M.png){: width="80%"}

- Mistral 기반의 7B 와 45B 모델을 baseline 으로 하여 성능 (TruthfulQA, MMLU) 비교
- 모델 크기가 증가할수록 성능이 증가하는것은 맞지만, 특정 task 에 대해서는 성능 향상이 눈에 띌 정도는 아니다.

### (2) 프롬프트에 따른 응답 품질 조사

![Image](https://i.imgur.com/fwfGJGi.png){: width="80%"}

- 사용자 물음에 진실하게 답변하라는 프롬프트 `Help` 와 창의적이고 강아지처럼 답변하라는 적대적인 프롬프트 `Advers` 프롬프트를 비교
- `Advers` 쪽이 일관되게 낮은 성능을 보임.
- 근데 실제 프롬프트를 보면 대놓고 `Advers` 쪽을 망쳐놔서 너무 당연한걸 실험한거 아닌지 모르겠음.

### (3) 청크 사이즈에 따른 응답 품질 조사

![Image](https://i.imgur.com/2seUB76.png){: width="80%"}

- 청크 사이즈를 S, M, L, XL 로 나누어 성능 비교 (순서대로 48, 64, 128, 192 토큰 사이즈)
- top-2 개의 document 만 검색하여 LLM 에 입력후 성능을 측정함
- 청크 사이즈가 클수록 좋은 성능을 확인했지만, 유의미할 정도는 아녔음
- 청크 사이즈를 늘리는 것이 시스템 성능에 크게 영향을 미치지 않는다는 것을 시사

### (4) 지식 베이스 크기에 따른 응답 품질 조사

지식 베이스 크기를 증가시키면 더 많은 정보를 제공할 수 있지만, 관련성을 희석시키고 검색 속도를 늦출 수 있다. 반면, 더 작은 지식 베이스는 더 빠른 검색과 더 높은 관련성을 제공하지만 포괄적인 범위를 갖지 못한다. 일종의 trade-off.

![Image](https://i.imgur.com/UCqxmmM.png){: width="80%"}

- 문서 개수를 1k 또는 10k로 조절하고, top-2 또는 top-5 개의 문서를 검색하여 성능을 측정함
- 실험 결과, 지식 베이스의 크기를 확장하는 것이 성능에 통계적으로 유의미한 영향을 미치지 않았으며, 성능 차이는 거의 없었음 --> 이는 더 큰 지식 베이스나 추가 문서 검색이 RAG 시스템의 출력 품질을 반드시 개선하지는 않는다는 것을 보여줌.
- 이유를 추정하자면, 추가 문서가 특정 쿼리에 대해 관련이 없거나 중복될 수 있기 때문일 수 있음

### (5) 문서 업데이트 빈도 (in retrieval stride)

WIP

### (6) 쿼리 확장

WIP

### (7) Contrastive In-Context Learning 여부에 따른 응답 품질 조사

Contrastive In-Context Learning(ICL) 은 아래처럼 query 에 대한 올바른 정답과 잘못된 정답 (few-shot) 을 제공하는 것이다.

**ICL 예시**

> You are a truthful expert question answering bot and should correctly and concisely answer the following question. Considering these examples: Question: $q$, Correct Answer: $\text{Answer}_{\text{correct}}$. Question: $q$, Incorrect Answer: $\text{Answer}_{\text{incorrect}}$. Question: $q$, Correct Answer:

![Image](https://i.imgur.com/sStpLZ6.png){: width="80%"}

- 실험 결과에서 보다시피 다른 방식들에 비해 가장 좋은 성능을 보였다.
- Doc 과 Doc+ 차이 여부는 negative example 의 추가 여부다. 추가하니 성능이 더 좋아졌음.

### (8) 다국어

WIP

### (9) 문서 대신 일부 문장에 집중할때의 응답 품질 조사

논문에서는 Focus mode 라고 불리는데, document 대신 n 개의 문장을 찾아서 LLM 에 입력하는 방식이다. 아래는 Focus mode 방식에 따른 실험 결과인데, 각 이름은 얼마나 많은 문장을 가져올지 결정하는 것이다. 예를 들어, 20Doc20S 라면, 20개의 document 에서 가장 중요한 문장 한개씩을 가져와 총 20개의 문장을 구성하는 것이다. 일종의 **reranking 방식**이라고 생각할 수 있겠다.

![Image](https://i.imgur.com/lC34C0z.png){: width="80%"}

- 더 많은 문서에서 문장을 가져올수록 성능이 향상되었지만 80개 이상으로 가져오니 큰 성능 향상이 없었다.
- 120Doc 이 80Doc 보다 성능이 유의미하게 좋아지지 않는 이유는 (4) 의 지식 베이스 크기나 (3) 의 청크 사이즈가 커져도 큰 성능 향상이 없는것과 비슷하다고 생각할 수 있겠다.

## References

- [Enhancing Retrieval-Augmented Generation: A Study of Best Practices (pdf)](https://arxiv.org/pdf/2501.07391.pdf)
