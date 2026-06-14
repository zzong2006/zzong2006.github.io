---
tags: ["NLP", "machine_learning"]
aliases: ["NER"]
---

# A) Named Entity Recognition

**NER (Named Entity Recognition, 개체명 인식)** 은 텍스트에서 **의미 있는 개체(entity)를 식별하고 분류**하는 NLP 태스크이다. 문장 속 단어들이 사람, 조직, 장소, 날짜 등 어떤 카테고리에 속하는지 태깅하는 것이 목표.

## A.1) 기본 예시

```
입력: "Steve Jobs founded Apple in Cupertino in 1976"

출력:
  Steve Jobs  → PERSON
  Apple       → ORGANIZATION
  Cupertino   → LOCATION
  1976        → DATE
```

한국어 예시:

```
입력: "삼성전자가 서울에서 갤럭시 S24를 출시했다"

출력:
  삼성전자     → ORGANIZATION
  서울        → LOCATION
  갤럭시 S24  → PRODUCT
```

## A.2) 표준 Entity 카테고리

일반적인 NER 태그셋:

| 카테고리 | 설명 | 예시 |
|---------|------|------|
| PERSON (PER) | 사람 이름 | 이순신, Elon Musk |
| ORGANIZATION (ORG) | 조직/회사 | 삼성전자, Google |
| LOCATION (LOC) | 장소 | 서울, Silicon Valley |
| DATE/TIME | 날짜/시간 | 2025년, 3월 15일 |
| PRODUCT | 상품/제품 | 갤럭시 S24, iPhone |
| QUANTITY | 수량 | 100만 개, 270mm |
| MONEY | 금액 | 99,000원, $999 |

도메인에 따라 커스텀 태그셋을 정의하기도 한다. 예를 들어 이커머스에서는 브랜드, 카테고리, 색상, 재질 등 **상품 속성 기반 태그셋**을 사용 (→ [[retrieval/e-commerce/GRAM - Generative Retrieval and Alignment Model|GRAM]]에서 16개 속성 정의).

## A.3) NER 방법론

### A.3.1) 규칙 기반

정규표현식이나 사전(dictionary) 매칭으로 개체 추출:

```python
# 간단한 규칙 기반 예시
import re
dates = re.findall(r'\d{4}년 \d{1,2}월', text)
```

장점: 해석 가능, 빠름. 단점: 새로운 패턴에 대응 불가.

### A.3.2) 시퀀스 라벨링 (BIO 태깅)

각 토큰에 B(Begin), I(Inside), O(Outside) 태그를 부여:

```
삼성   → B-ORG
전자   → I-ORG
가     → O
서울   → B-LOC
에서   → O
갤럭시  → B-PRODUCT
S24   → I-PRODUCT
를     → O
출시   → O
했다   → O
```

- **B-XXX**: 개체의 시작
- **I-XXX**: 개체의 내부 (연속)
- **O**: 개체가 아닌 토큰

대표 모델: BiLSTM-CRF, BERT + CRF

### A.3.3) Transformer 기반

[[machine_learning/NLP/BART|BERT]] 등 사전학습 모델을 fine-tuning하여 토큰 분류:

```
[CLS] 삼성 전자 가 서울 에서 ... [SEP]
  ↓    ↓    ↓   ↓   ↓   ↓
  -  B-ORG I-ORG O B-LOC O  ...
```

현재 가장 널리 사용되는 방식. 성능이 높고, 문맥을 잘 이해함.

## A.4) 이커머스에서의 NER 활용

이커머스 검색에서 NER은 **query와 상품 title에서 핵심 속성을 추출**하는 데 사용된다:

```
Query:   "나이키 검정 운동화 270"
  → 브랜드: 나이키
  → 색상: 검정
  → 카테고리: 운동화
  → 사이즈: 270

Product: "나이키 에어맥스 90 블랙 메쉬 러닝화 270mm"
  → 브랜드: 나이키
  → 시리즈: 에어맥스
  → 모델: 90
  → 색상: 블랙
  → 재질: 메쉬
  → 카테고리: 러닝화
  → 사이즈: 270mm
```

이렇게 추출된 속성들을 **정규화**(검정→블랙, 운동화→러닝화 등)하면, query와 product 간 어휘 불일치 문제를 해결할 수 있다.

# B) Related

- [[retrieval/e-commerce/GRAM - Generative Retrieval and Alignment Model|GRAM]] — NER 속성 기반 코드를 generative retrieval에 활용
- [[machine_learning/NLP/BART|BERT]] — NER에 가장 많이 사용되는 base model

# C) References
