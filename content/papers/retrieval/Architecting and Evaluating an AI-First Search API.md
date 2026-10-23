---
title: "Architecting and Evaluating an AI-First Search API"
tags:
  - retrieval
  - IR
  - search_engine
  - API
  - evaluation
  - Perplexity
  - y2025
aliases: [AI-First Search API, Perplexity Search API]
---

# A) 검색 API의 독자가 바뀌었다

Perplexity의 "Architecting and Evaluating an AI-First Search API"에서 제일 흥미로운 지점은 검색 API를 바라보는 관점이다.

예전 검색 API의 독자는 사람이었다. API는 관련 있어 보이는 URL과 snippet을 주고, 사람은 그중 하나를 클릭해서 읽었다.

AI-first search에서는 독자가 사람이 아니라 LLM agent다. 검색 결과는 사람이 훑어볼 후보 목록이 아니라, 곧바로 downstream generation pipeline에 들어가는 context가 된다. 그래서 좋은 검색 API는 단순히 "관련 문서를 잘 찾는 API"가 아니라, **모델이 바로 사용할 수 있는 작고 정확한 evidence를 낮은 latency로 주는 API** 에 가까워진다.

이 관점은 [[Retrieval-Augmented Generation]]에서 말하는 [[Context Precision]]과 바로 연결된다. 문서 전체가 관련 있어도, 모델에게 필요한 건 그 안의 특정 paragraph나 span일 수 있다. 너무 넓은 context는 도움이 아니라 noise가 된다.

# B) 기존 검색 API가 부족했던 이유

Perplexity가 보기엔 기존 search API들은 AI workflow에 그대로 넣기 애매했다.

첫 번째 문제는 결과 단위가 너무 컸다는 점이다. 사람이 클릭할 때는 URL 단위 결과가 괜찮지만, LLM에게는 문서 전체보다 더 작은 context unit이 필요하다. 필요한 한 문단을 찾고 싶은데 문서 전체를 던져주면, 모델은 제한된 context window를 쓸데없는 내용에 써버린다.

두 번째 문제는 freshness와 latency다. 자체 index를 가진 API는 최신성이 떨어질 수 있고, SERP scraping 방식은 더 포괄적인 결과를 줄 수 있지만 느리다. AI product에서는 검색 호출이 답변 생성 앞단에 들어가기 때문에, 검색 latency가 그대로 사용자 경험에 붙는다.

세 번째 문제는 lexical search와 semantic search가 따로 노는 것이다. [[BM25]] 같은 lexical retrieval은 entity나 exact keyword에 강하고, [[DPR]] 계열 dense retrieval은 paraphrase와 intent matching에 강하다. AI agent query는 둘 다 필요로 하는 경우가 많다.

그래서 Perplexity의 결론은 꽤 명확하다. AI-first search는 URL 목록을 잘 반환하는 시스템이 아니라, **LLM에게 넣을 evidence 조각을 잘 고르는 시스템** 이어야 한다.

# C) 설계 기준은 세 가지다

Perplexity가 제시하는 기준은 크게 세 가지다.

1. **Completeness, freshness, speed**: 충분히 넓은 web coverage, 계속 갱신되는 index, user-facing product에 넣을 수 있는 latency가 함께 필요하다.
2. **Fine-grained content understanding**: 문서를 URL 단위로만 보면 안 된다. section, paragraph, span 같은 sub-document unit을 검색과 ranking의 단위로 다뤄야 한다.
3. **Hybrid retrieval and ranking**: [[Inverted Index]] 기반 lexical signal과 dense embedding 기반 semantic signal을 retrieval과 ranking 양쪽에서 함께 써야 한다.

여기서 중요한 건 이 세 기준이 서로 독립적이지 않다는 점이다.

예를 들어 fine-grained content understanding이 약하면 [[Chunking]]이 흔들리고, chunk가 흔들리면 ranking이 좋은 문서를 골라도 실제 LLM context는 지저분해진다. 반대로 retrieval이 좋아도 freshness가 부족하면 최신 질문에는 틀린 evidence를 줄 수 있다.

# D) 전체 구조는 세 경로로 읽으면 된다

복잡한 시스템도지만, 한 번에 다 보려고 하지 말고 세 경로로 나누면 읽기 쉽다.

```text
Offline indexing path
---------------------
Web pages
  -> Crawler and indexer
  -> Content understanding
  -> Sub-document segmentation
  -> Web-scale index

Online retrieval path
---------------------
User or agent query ----\
                         -> Hybrid retrieval
Web-scale index --------/
  -> Candidate set
  -> Prefiltering
  -> Fast lexical + embedding scorers
  -> Cross-encoder re-ranker
  -> Document / span results
  -> Curated context for LLM

Improvement loop
----------------
AI evaluations + human feedback
  -> Embedding / ranking model improvement
  -> Parser / ruleset improvement
```

Offline path는 웹을 읽고 index에 넣는 흐름이다. 이때 중요한 건 문서를 통째로 저장하는 게 아니라, 나중에 retrieval unit으로 쓸 수 있게 구조화된 span으로 쪼개는 것이다.

Online path는 query time의 흐름이다. 먼저 lexical과 semantic branch로 후보를 넓게 모은다. 그다음 cheap scorer로 빠르게 줄이고, 마지막에는 더 비싼 cross-encoder [[Re-ranking]]으로 정밀하게 정렬한다.

Improvement loop는 이 시스템이 계속 좋아지는 경로다. 실제 product에서 나온 answer, AI evaluation, human feedback이 parsing과 embedding/ranking model 개선으로 다시 들어간다.

# E) Offline Path: Web을 계속 다시 읽는 문제

Web-scale search에서 index는 한 번 만들어두는 물건이 아니다. 계속 새 URL을 발견해야 하고, 이미 아는 URL도 다시 읽어야 한다.

Perplexity는 article 기준으로 2,000억 개 이상의 unique URL을 추적한다고 설명한다. Crawler와 indexing fleet도 수만 개 CPU, 수백 TB RAM 규모라고 한다.

규모 자체도 크지만, 더 어려운 건 budget 배분이다.

| 목표 | 하고 싶은 일 | 부딪히는 문제 |
|---|---|---|
| Completeness | 새 URL을 넓게 발견하기 | 새 문서를 많이 넣으면 기존 문서 refresh가 밀림 |
| Freshness | 이미 아는 URL을 최신으로 유지하기 | 자주 안 바뀌는 문서를 계속 읽으면 낭비 |
| Latency | query time에 빠르게 응답하기 | index와 ranking이 커질수록 serving 비용 증가 |

그래서 모든 URL을 같은 주기로 다시 읽는 방식은 어렵다. Perplexity는 ML model로 어떤 URL을 언제 다시 index할지 예측한다고 설명한다. 문서의 중요도와 update frequency를 같이 보는 셈이다.

이 관점은 [[Lucene]]이나 [[Elasticsearch]] 운영에서도 꽤 실용적이다. 큰 corpus에서는 index freshness가 단순 batch schedule 문제가 아니라, crawl/index budget allocation 문제가 된다.

# F) Parsing은 전처리가 아니라 retrieval 품질이다

AI-first search에서 page parsing은 생각보다 중심에 있다.

웹 문서는 지저분하다. 어떤 페이지는 table이 핵심이고, 어떤 페이지는 list가 핵심이고, 어떤 페이지는 forum thread처럼 자유 텍스트가 핵심이다. 하나의 고정 rule로 모든 페이지를 잘 읽기는 어렵다.

Perplexity는 site나 content type에 따라 dynamic ruleset을 적용하고, frontier LLM으로 parsing 결과를 평가한 뒤 ruleset을 개선하는 loop를 둔다고 설명한다.

평가 축은 두 가지다.

| 평가 축 | 핵심 질문 | 실패 예시 |
|---|---|---|
| Completeness | 의미 있는 정보를 충분히 가져왔는가 | table의 핵심 값, caption, 본문 일부를 놓침 |
| Quality | 원래 구조와 의미를 잘 보존했는가 | 광고, nav, boilerplate가 섞이거나 list 구조가 깨짐 |

이 둘은 자주 충돌한다. 너무 엄격하게 filtering하면 필요한 정보가 빠지고, 너무 느슨하게 가져오면 garbage context가 들어온다.

그래서 parsing은 "HTML을 text로 바꾸는 전처리" 정도로 보면 안 된다. 좋은 span을 만들지 못하면 retrieval과 ranking이 좋아도 LLM에게 들어가는 evidence가 흐려진다.

# G) Online Path: 넓게 모으고 비싸게 줄인다

Query time의 기본 전략은 [[Cascade Ranking System]]과 비슷하다.

처음부터 가장 비싼 모델로 모든 문서를 평가하지 않는다. 앞단에서는 recall을 넓게 확보하고, 뒤로 갈수록 더 정밀하고 비싼 모델을 쓴다.

흐름은 대략 이렇다.

1. **Hybrid candidate generation**: lexical retrieval과 semantic retrieval을 함께 실행해 candidate set을 만든다.
2. **Prefiltering**: 명백히 stale하거나 query와 무관한 결과를 빠르게 제거한다.
3. **Fast ranking**: lexical scorer와 embedding scorer로 후보를 더 줄인다.
4. **Cross-encoder re-ranking**: 남은 후보에 더 강한 모델을 써서 최종 순서를 조정한다.
5. **Context unit selection**: URL 전체뿐 아니라 section, paragraph, span 단위 결과를 반환한다.

이 구조의 핵심은 stage마다 역할이 다르다는 점이다. 앞단은 cheap and broad, 뒷단은 expensive and precise하다. 그래야 품질과 latency를 같이 잡을 수 있다.

# H) Search API 평가는 agent 안에서 봐야 한다

이 글의 후반부는 evaluation 이야기다.

Perplexity는 Search API를 따로 떼어놓고 평가하기보다, agent가 실제로 search API를 호출해 문제를 푸는 workflow 안에서 평가한다. 공개한 `search_evals`도 이런 목적의 framework다.

평가 원칙은 단순하다.

| 원칙 | 의미 |
|---|---|
| Spectrum of complexity | 단순 factual QA부터 deep research task까지 본다 |
| Neutrality | 여러 API를 같은 harness와 조건에서 비교한다 |
| Simplicity | 재현과 확장이 쉬워야 한다 |

사용 benchmark는 SimpleQA, FRAMES, BrowseComp, HLE다. [[RAGAS]]처럼 context 자체의 품질을 직접 보는 방식과는 조금 다르다. 여기서는 Search API가 최종 agent answer quality에 얼마나 기여하는지를 end-to-end로 본다.

# I) 결과는 빠르고 좋다는 주장이다

Perplexity article에 제시된 latency 결과는 다음과 같다. 기준은 AWS `us-east-1`에서 시작한 요청이다.

| Provider | p50 | p75 | p90 | p95 |
|---|---:|---:|---:|---:|
| Perplexity | 358ms | 443ms | 604ms | 763ms |
| Exa | 1375ms | 1499ms | 1798ms | 2188ms |
| Brave | 513ms | 637ms | 728ms | 808ms |
| SERP Based | 1342ms | 1586ms | 1743ms | 1790ms |

p50도 중요하지만, agent workflow에서는 p95가 특히 중요하다. Search를 여러 번 호출하는 agent라면 tail latency 하나가 전체 task latency를 길게 끌고 갈 수 있다.

Quality benchmark도 함께 제시한다.

| Provider | SimpleQA | FRAMES | BrowseComp | HLE |
|---|---:|---:|---:|---:|
| Perplexity | 0.930 | 0.453 | 0.371 | 0.288 |
| Exa | 0.781 | 0.399 | 0.265 | 0.242 |
| Brave | 0.822 | 0.320 | 0.221 | 0.191 |
| SERP Based | 0.890 | 0.437 | 0.348 | 0.248 |

이 표에서 Perplexity가 말하고 싶은 건 "quality와 latency를 둘 다 잡았다"는 것이다.

다만 이 결과는 Perplexity가 제시한 benchmark다. 실무에서는 그대로 믿기보다, `search_evals`를 가져와 자기 query distribution, 모델, latency budget으로 다시 재는 편이 더 안전하다.

# J) 실무에서 가져갈 점

첫째, retrieval target을 URL이나 document로 고정하지 말자. LLM에게 필요한 건 종종 문서 전체가 아니라 특정 span이다.

둘째, parsing 품질을 과소평가하지 말자. 좋은 parser는 좋은 chunk를 만들고, 좋은 chunk는 좋은 context를 만든다.

셋째, hybrid retrieval은 거의 기본값에 가깝다. lexical branch는 entity와 exact constraint에 강하고, semantic branch는 intent와 paraphrase에 강하다.

넷째, Search API 평가는 traditional IR metric만으로 부족하다. [[Normalized Discounted Cumulative Gain|NDCG]]나 recall도 필요하지만, agent workflow에서는 answer correctness, citation usefulness, context compactness, latency를 함께 봐야 한다.

다섯째, product feedback loop가 ranking asset이 된다. 실제 answer generation 결과와 human feedback이 embedding/ranking model 개선에 들어가면, search는 독립 component가 아니라 product와 함께 학습되는 system이 된다.

# K) References

- [Architecting and Evaluating an AI-First Search API](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api)
- [perplexityai/search_evals](https://github.com/perplexityai/search_evals)
