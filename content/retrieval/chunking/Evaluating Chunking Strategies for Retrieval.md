---
title: "Evaluating Chunking Strategies for Retrieval"
tags:
  - retrieval
  - IR
  - chunking
  - evaluation
  - Chroma
aliases: []
---

[Evaluating Chunking Strategies for Retrieval \| Chroma Research](https://research.trychroma.com/evaluating-chunking) (Chroma 기술 보고서, 2024-07)

# A) 문서 단위 벤치마크로는 청킹을 평가할 수 없다

[[Retrieval-Augmented Generation|RAG]] 는 문서를 [[Chunking|청크]](chunk)로 잘라 임베딩해 두고, 질의와 가까운 청크 몇 개를 LLM 프롬프트에 넣는다. 그래서 문서를 어떻게 자르느냐가 LLM 이 읽는 토큰을 정한다. 한 청크에 관련 토큰과 무관한 토큰이 섞이기도 하고, 한 발췌문이 여러 청크로 쪼개지기도 한다.

MTEB(Massive Text Embedding Benchmark) 같은 기존 정보 검색(IR) 벤치마크는 검색된 **문서**가 관련 있는지와 그 순위([[Normalized Discounted Cumulative Gain|nDCG]]@10 등)를 잰다. 이 방식은 RAG 와 두 군데에서 어긋난다.

- 문서 단위로만 맞았는지 보므로, 같은 문서를 어떻게 잘랐는지에 따른 차이가 드러나지 않는다.
- LLM 은 관련 정보가 컨텍스트 안 어디에 있든 대체로 잘 처리한다. 순위보다 관련 토큰이 들어왔는지가 중요하다.

이 보고서는 검색 결과를 **토큰 단위**로 채점하는 평가를 만들고, 그것으로 청킹 방법들을 비교한다.

# B) 평가 방법

## B.1) LLM 이 질의와 정답 발췌문을 만든다

정답 데이터는 사람이 아니라 LLM 이 코퍼스에서 직접 만든다. 그래서 어떤 도메인 문서로도 평가셋을 만들 수 있고, 새로 생성한 데이터라 임베딩 모델이 학습 때 본 적이 없다.

1. LLM 에게 코퍼스에서 무작위로 뽑은 4,000 자 분량의 텍스트를 주고, 사실을 묻는 질의 하나와 그 답이 담긴 원문 발췌문(excerpt)들을 내게 한다. 질의가 겹치지 않도록 앞서 만든 질의를 최대 50 개 함께 보여 준다.
2. 발췌문 중 하나라도 코퍼스에 글자 그대로 없으면 그 질의를 버린다.
3. **중복 제거**: 질의끼리 임베딩 코사인 유사도가 기준값 이상이면 거의 같은 질의로 보고 제거한다.
4. **관련성 필터**: 질의와 그 발췌문 중 하나라도 코사인 유사도가 기준값 미만이면 질의째 제거한다.

임베딩은 OpenAI `text-embedding-3-large` 다. 두 기준값은 코퍼스마다 걸러진 샘플을 직접 읽어 보며 정했고, 값은 아래 표에 있다.

예를 들어 Wikitext 코퍼스에서는 "What were the main characteristics of the armor used on the ship Atlanta?" 라는 질의와 함께 발췌문 두 개가 생성됐다. 하나는 장갑 뒤를 참나무·소나무 층이 받치고 있었다는 문장, 다른 하나는 선체 상단에 2 인치 장갑을 댔다는 문장이다.

## B.2) 코퍼스

도메인과 정제 상태가 서로 다른 5 개 코퍼스를 썼다. 합계 328,208 토큰, 질의 472 개다.

| 코퍼스 | 토큰 수 | 질의 수 | 관련성 하한 | 중복 기준 | 내용 |
| --- | --- | --- | --- | --- | --- |
| State of the Union | 10,444 | 76 | 0.40 | 0.70 | 2024 년 미국 대통령 연두교서. 구조가 잘 짜인 연설문 |
| Wikitext | 26,649 | 144 | 0.42 | 0.73 | 위키피디아 우수 문서 |
| Chatlogs | 7,727 | 56 | 0.43 | 0.71 | ChatGPT 대화(UltraChat). JSON 문법까지 포함한 원문 |
| Finance | 166,177 | 97 | 0.42 | 0.70 | 금융 보고서 기반 질의응답(ConvFinQA) |
| Pubmed | 117,211 | 99 | 0.40 | 0.67 | 생명과학 논문(PMC Open Access) |

## B.3) 지표: 검색된 토큰과 정답 토큰의 겹침

질의 하나마다 토큰 집합 두 개를 둔다. 토큰은 OpenAI cl100k 토크나이저 기준이다.

- $t_e$: 그 질의의 발췌문들에 들어 있는 토큰. 정답이다.
- $t_r$: 검색된 청크들에 들어 있는 토큰. 검색 결과다.

$$
\text{Recall} = \frac{|t_e \cap t_r|}{|t_e|}, \qquad
\text{Precision} = \frac{|t_e \cap t_r|}{|t_r|}, \qquad
\text{IoU} = \frac{|t_e \cap t_r|}{|t_e| + |t_r| - |t_e \cap t_r|}
$$

- [[Recall]]: 정답 토큰 중 검색 결과에 들어온 비율. 답에 필요한 내용을 놓쳤는지 본다.
- Precision: 검색된 토큰 중 정답 토큰의 비율. LLM 이 읽을 토큰 중 쓸모 있는 것이 얼마인지 본다.
- IoU (Intersection over Union): 두 집합의 Jaccard 유사도다. 놓친 정답 토큰과 함께 딸려 온 무관한 토큰이 모두 값을 낮춘다.

청크끼리 경계를 겹치게 자르는 설정을 overlap 이라 한다. 예를 들어 크기 800, overlap 400 이면 각 청크가 앞 청크의 뒤쪽 400 토큰을 다시 담는다. 이때 같은 토큰이 두 청크에 들어 있으면 $|t_r|$ 에서는 두 번 세고, 분자에서는 한 번만 센다. 그래서 overlap 이 크면 Precision 과 IoU 가 내려간다.

**Precision$_\Omega$** 는 발췌문 토큰을 담은 청크를 빠짐없이, 그리고 그것만 가져왔을 때의 Precision 이다. Recall 이 100% 일 때 낼 수 있는 Precision 의 상한이므로, 검색 모델이 아니라 청킹이 정답 주변에 무관한 토큰을 얼마나 붙이는지를 보여 준다.

설명용 가상 수치로 계산해 보자. 앞의 Atlanta 질의의 발췌문 두 개가 합쳐 40 토큰이고, 200 토큰짜리 청크 5 개(1,000 토큰)를 가져왔는데 그 안에 발췌문 토큰이 30 개 들어 있었다고 하자.

- Recall = 30 / 40 = 75%
- Precision = 30 / 1,000 = 3%
- IoU = 30 / (40 + 1,000 − 30) = 30 / 1,010 ≈ 3.0%

검색한 토큰 수 $|t_r|$ 이 정답 토큰 수 $|t_e|$ 보다 훨씬 크면 IoU 의 분모가 거의 $|t_r|$ 이 되어 IoU 와 Precision 이 비슷해진다. 아래 결과표에서 두 열이 거의 같고 한 자릿수인 것도 이 때문이다.

# C) 비교한 청킹 방법

★ 는 이 보고서가 새로 제안한 방법이다.

| 방법 | 경계를 정하는 방식 |
| --- | --- |
| `TokenTextSplitter` | 내용과 무관하게 정해진 토큰 수마다 자른다. |
| `RecursiveCharacterTextSplitter` | 구분자 목록을 앞에서부터 시도해, 청크가 최대 길이 안에 들어올 때까지 재귀적으로 자른다. LangChain 기본 구분자(`\n\n`, `\n`, 공백)로는 아주 짧은 청크가 많이 생겨서, 보고서는 문장 끝 구분자(`.`, `?`, `!`)를 추가해 썼다. |
| `KamradtSemanticChunker` | 문장 단위로 나눈 뒤, 이웃한 구간의 임베딩 사이 코사인 거리가 튀는 곳에서 자른다. 기본 기준은 "모든 이웃 거리 중 상위 5% 에 드는 거리" 라는 상대값이어서, 코퍼스가 클수록 청크가 커지고 길이를 직접 정할 수 없다. |
| ★ `KamradtModifiedChunker` | 위 방법의 거리 기준값을 이진 탐색으로 조정해, 가장 긴 청크가 사용자가 정한 길이를 넘지 않게 한다. |
| ★ `ClusterSemanticChunker` | 문서를 50 토큰 이하 조각으로 나눠 각각 임베딩한다. 그다음 동적 프로그래밍으로, 정해진 최대 길이 안에서 "청크 안 조각 쌍들의 코사인 유사도 합" 이 가장 커지도록 조각을 묶는다. |
| ★ `LLMSemanticChunker` | 50 토큰 조각마다 번호 태그를 붙여 LLM(GPT-4o)에 주고, 몇 번 조각 뒤에서 자를지 번호만 답하게 한다. |

Kamradt 계열은 문서를 앞에서부터 훑으며 거리가 튀는 곳에서 바로 자르는 탐욕적(greedy) 방식이다. 지금 자른 위치가 뒤쪽 청크 구성에 어떤 영향을 주는지는 보지 않는다. ClusterSemanticChunker 는 가능한 묶음 전체에서 유사도 합을 최대화하므로 이 한계가 없다. 대신 최적 분할이 코퍼스 전체에 따라 정해지므로, 문서가 추가되면 청크를 다시 계산해야 한다.

# D) 결과: 문장 경계에서 작게 자르면 단순한 방법도 강하다

조건은 임베딩 `text-embedding-3-large`, 질의마다 청크 5 개 검색, 모든 질의·코퍼스의 평균(%)이다. 크기는 최대 청크 길이(토큰)이고 괄호 안은 실제 평균 길이다. 원문 Results 표에서 비교에 필요한 행만 옮겼다.

| 방법 | 크기 | overlap | Recall | Precision | Precision$_\Omega$ | IoU |
| --- | --- | --- | --- | --- | --- | --- |
| Recursive | 200 (평균 137) | 0 | 88.1 | 7.0 | 29.9 | 6.9 |
| TokenText | 200 | 0 | 87.0 | 5.2 | 21.0 | 5.1 |
| TokenText (OpenAI 기본값) | 800 | 400 | 87.9 | 1.4 | 4.7 | 1.4 |
| Kamradt | 지정 없음 (평균 660) | 0 | 83.6 | 1.5 | 7.4 | 1.5 |
| ★ KamradtModified | 300 (평균 397) | 0 | 87.1 | 2.1 | 10.5 | 2.1 |
| ★ Cluster | 400 (평균 182) | 0 | 91.3 | 4.5 | 20.7 | 4.5 |
| ★ Cluster | 200 (평균 103) | 0 | 87.3 | 8.0 | 34.0 | 8.0 |
| ★ LLM (GPT-4o) | 지정 없음 (평균 240) | 0 | 91.9 | 3.9 | 19.9 | 3.9 |

- **청크를 작게, overlap 없이 자르면 Precision 과 IoU 가 오른다.** 같은 TokenText 라도 800 / overlap 400 에서 200 / overlap 0 으로 바꾸면 Precision 이 1.4% 에서 5.2% 로 오르고, Recall 은 둘 다 87% 대로 비슷하다. 청크가 작을수록 발췌문 밖 토큰이 덜 딸려 오고, overlap 이 없으면 같은 토큰을 두 번 세지 않는다.
- **OpenAI 기본값은 가장 비효율적이다.** OpenAI Assistants 파일 검색의 기본 설정(800 토큰, overlap 400)을 TokenText 로 재현하면, Recall 은 평균보다 약간 낮고 나머지 지표는 모두 최하위다.
- **RecursiveCharacterTextSplitter 200 / overlap 0 은 1 위는 아니지만 모든 지표에서 상위권이다.** 크기 400 이하·overlap 0 조건에서는 모든 지표에서 TokenText 를 앞선다. 문장 끝 구분자를 추가한 설정의 결과다.
- **ClusterSemanticChunker 는 최대 길이에 따라 강점이 갈린다.** 400 이면 Recall 이 91.3% 로 두 번째로 높다. 200 이면 Recall 은 평균 수준이지만 Precision, Precision$_\Omega$, IoU 가 모두 가장 높다.
- **LLMSemanticChunker 는 Recall 이 가장 높고(91.9%) 나머지 지표는 평균 수준이다.**
- **Kamradt 기본값은 모든 지표에서 평균보다 약간 낮다.** 길이 상한을 둔 KamradtModified 는 평균 청크가 660 에서 397 토큰으로 짧아졌는데도 Recall 이 83.6% 에서 87.1% 로 올랐다.

임베딩 모델을 작은 `all-MiniLM-L6-v2` 로 바꾸면 overlap 의 효과가 달라진다. Recall 이 가장 높은 것은 TokenText 크기 250 / overlap 125 의 82.4% 이고, 같은 크기에서 overlap 을 0 으로 하면 77.1% 로 떨어진다. 저자들은 이를 컨텍스트가 짧은 모델에서는 Recall 을 위해 overlap 이 필요하다는 뜻으로 해석한다. 이 모델에서도 Precision, Precision$_\Omega$, IoU 는 ClusterSemanticChunker 가 가장 높다.

# E) 한계

- LLM 이 만드는 질의가 특정 스타일로 쏠린다. 앞서 만든 질의를 보여 주는 것만으로는 다양성이 충분히 늘지 않았다.
- 코퍼스 5 개, 질의 472 개로 규모와 도메인 다양성이 작다.
- LLM 이 생성하지 않은 다른 관련 문장이 코퍼스에 있어도 정답으로 치지 않는다. 검색이 그런 문장을 가져오면 무관한 토큰으로 계산된다.
- 청킹 실행 시간은 비교하지 않았다. 거의 즉시 끝나는 방법부터 수십 분 걸리는 LLMSemanticChunker 까지 차이가 크다.
