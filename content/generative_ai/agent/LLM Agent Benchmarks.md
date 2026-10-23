---
title: "LLM 에이전트·도구 사용 벤치마크 비교"
tags:
  - LLM
  - agent
  - evaluation
  - benchmark
aliases:
  - 에이전트 벤치마크 비교
  - agent benchmarks
  - 에이전트 벤치마크
  - tool use benchmarks
---

# A) 답변 품질이 아니라 행동의 결과를 채점한다

[[MT-bench]] 같은 대화 벤치마크는 모델이 쓴 답변 글을 채점한다. 에이전트 벤치마크는 모델이 **도구를 써서 무언가를 한 결과** 를 채점한다. 함수를 올바른 인자로 불렀는지, 데이터베이스가 원하는 상태로 바뀌었는지, 웹을 뒤져 맞는 답을 찾아냈는지를 본다. 여기서 에이전트는 도구 호출 → 결과 관찰 → 다음 행동 결정을 여러 차례 반복하는 LLM 시스템을 말한다.

이 노트는 세 벤치마크를 같은 기준으로 비교한다. 셋은 에이전트 능력의 서로 다른 부분을 맡는다.

- [[Berkeley Function Calling Leaderboard|BFCL]]: 주어진 함수 목록에서 맞는 함수를 골라 **정확한 인자로 호출** 하는가. 호출하지 말아야 할 때 참는가.
- [[tau-bench|τ-bench]]: 사용자와 여러 턴 대화하면서 **도메인 정책을 지키며** 데이터베이스를 원하는 상태로 바꾸는가. 그것을 **매번** 해내는가.
- [[BrowseComp]]: 실제 웹에서 검색을 수십 번 이어 가며 **찾기 어려운 사실 하나** 를 찾아내는가.

각 벤치마크의 과제 예시, 채점식, 수치는 해당 노트에 있다. 여기서는 관계와 차이만 다룬다.

# B) 공통 기준으로 비교

| 기준 | BFCL | τ-bench | BrowseComp |
| --- | --- | --- | --- |
| 만든 곳, 처음 공개 | UC Berkeley, 2024-02 | Sierra, 2024-06 | OpenAI, 2025-04 |
| 측정 대상 | 함수 선택과 인자 생성의 정확성 | 사용자 대화 속 정책 준수와 작업 완수, 반복 신뢰성 | 오래 이어지는 웹 검색으로 사실 찾기 |
| 환경 | 함수 문서. V3 부터 상태가 있는 가상 API, V4 부터 실제 웹 검색 | 가상 데이터베이스, 도구, 정책 문서 | 실제 웹 |
| 상호작용 상대 | 없음. V3 부터 미리 정해진 사용자 턴 | 고객 역할을 하는 LLM 사용자 시뮬레이터 (모델 고정, 채점 대상 아님) | 없음 |
| 채점 대상 | 호출 문법(AST), API 상태, 답 문자열 | 대화 후 데이터베이스 상태와 필수 출력 값 | 최종 답 하나 |
| 채점자 | 규칙 기반 | 규칙 기반 | LLM grader |
| 대표 지표 | 범주별 정확도의 가중 평균 | pass^1, pass^k | 정확도, calibration error |
| 규모 | V1 2,000, V2 2,251, V3 1,000, V4 웹 검색 200·기억 465 | retail 115, airline 50 | 1,266 |
| 후속 | V2, V3, V4 로 같은 리더보드 안에서 확장 | τ²-bench, τ³-bench | BrowseComp-ZH, BrowseComp-Plus |

## B.1) 무엇을 채점하나: 과정이 아니라 결과

세 벤치마크 모두 에이전트가 거친 경로를 정답 경로와 한 줄씩 맞춰 보지 않는다. 결과만 본다.

- BFCL multi-turn 은 턴이 끝난 뒤의 API 상태를 본다. 응답 검사도 정답의 최소 호출이 들어 있는지만 보고 추가 호출은 허용한다.
- τ-bench 는 대화가 끝난 뒤의 데이터베이스가 정답 데이터베이스와 같은지 본다.
- BrowseComp 은 최종 답 문자열만 본다.

경로를 고정하면 다른 합당한 경로로 같은 결과에 이른 에이전트가 틀린 것으로 채점된다. 결과 상태를 보면 이 문제가 사라진다. 대신 결과에 흔적을 남기지 않는 잘못은 놓친다. τ-bench 에서 쓰기 전에 사용자 동의를 받지 않아도 성공으로 채점되는 것이 그 예다.

## B.2) 누가 채점하나: 규칙인가 LLM 인가

BFCL 과 τ-bench 의 채점은 규칙으로 정해져 있다. 같은 출력에는 항상 같은 점수가 나온다. BrowseComp 은 답이 짧아서 의미가 같은지만 판단하면 되지만, 그 판단을 LLM grader 에게 맡긴다. 표기가 다른 같은 답(예: 이름의 다른 표기)을 맞게 처리할 수 있는 대신, grader 모델이 바뀌면 점수가 조금 달라질 수 있다.

다만 τ-bench 는 채점이 규칙 기반이어도 **대화 상대** 가 LLM 이다. 사용자 시뮬레이터가 실수하면 에이전트 잘못이 아닌데도 실패로 기록된다. τ²-bench 의 분석에서 airline 대화의 47% 에 시뮬레이터 오류가 있었고, 13% 는 과제 완료를 불가능하게 만드는 오류였다. BFCL 은 반대로 사용자 턴을 각본으로 고정해 이 변동을 없앤 대신, 모델이 어떻게 되묻든 사용자 반응이 같다.

## B.3) 한 번 성공과 매번 성공

BFCL 과 BrowseComp 은 과제당 한 번 실행한 정확도를 기본으로 한다. τ-bench 는 같은 과제를 여러 번 돌려 pass^k(k 번 모두 성공할 확률)를 따로 보고한다. 사용자 시뮬레이터가 매번 다르게 말하기 때문에 같은 과제도 실행마다 결과가 갈리고, pass^1 이 60% 인 에이전트의 pass^8 이 25% 밑으로 떨어질 수 있다.

BrowseComp 도 반복 실행을 쓰지만 목적이 다르다. 64 번 풀게 한 뒤 투표나 자신감으로 답 하나를 고르면 정확도가 오른다는 결과로, 여러 번 시도해 한 번이라도 맞히는 쪽(pass@k 에 가까운 방향)을 본다.

## B.4) 어떤 질문에 어떤 벤치마크를 보나

| 알고 싶은 것 | 볼 벤치마크 |
| --- | --- |
| 우리 API 를 function calling 으로 붙였을 때 호출 형식이 맞게 나오는가 | BFCL 의 단일 턴과 Live 범주 |
| 맞는 도구가 없거나 정보가 부족할 때 지어내지 않고 되묻는가 | BFCL 의 Irrelevance, Missing Parameters·Functions |
| 고객 상담 에이전트가 업무 규칙을 지키며 같은 품질을 반복하는가 | τ-bench 의 pass^k |
| 사용자에게 조작을 안내해야 하는 기술 지원 | τ²-bench 의 telecom |
| 리서치 에이전트가 끝까지 파고드는가 | BrowseComp, 검색기 비교는 BrowseComp-Plus |

# C) 비슷한 계열의 벤치마크

| 벤치마크 | 만든 곳, 공개 | 과제 | 환경 | 채점 | 규모와 발표 당시 결과 |
| --- | --- | --- | --- | --- | --- |
| [GAIA](https://arxiv.org/abs/2311.12983) | Meta, Hugging Face 등, 2023-11 | 일반 비서 질문. 첨부 파일·멀티모달 포함 | 실제 웹, 파일, 코드 실행 | 짧은 답의 정규화 후 일치 | 466 문제, 3 단계 난이도. 사람 92%, GPT-4 + 플러그인 15% |
| [WebArena](https://arxiv.org/abs/2307.13854) | CMU, 2023-07 | 웹사이트를 클릭·입력으로 조작해 작업 완수 | 직접 띄운 쇼핑몰·포럼·GitLab·CMS·지도·위키 | 답 문자열 또는 사이트 상태를 프로그램으로 검사 | 812 과제. GPT-4 에이전트 14.41%, 사람 78.24% |
| [SWE-bench](https://arxiv.org/abs/2310.06770) | Princeton 등, 2023-10 | 실제 GitHub 이슈를 해결하는 코드 수정 | 저장소 코드와 테스트 | 수정 후 테스트 실행 | 12 개 Python 저장소의 2,294 이슈. Claude 2 1.96% |

**GAIA** 는 BrowseComp 의 앞 세대에 해당한다. 둘 다 정답이 짧은 문자열 하나라 채점이 쉽고, 웹 검색이 필요하다. GAIA 는 이미지·스프레드시트·오디오 같은 첨부 파일 읽기, 코드 실행까지 섞어 "여러 도구를 고루 쓰는 능력" 을 본다. 난이도는 풀이에 필요한 행동 수와 도구 수로 세 등급을 나눈다. Level 1 은 도구를 쓰지 않거나 하나만 쓰고 5 번 이하의 행동으로 풀리고, Level 2 는 5–10 번의 행동에 여러 도구를 섞어야 하며, Level 3 은 행동 수와 도구 수에 제한이 없다. BrowseComp 은 다른 도구를 빼고 "끈질긴 검색" 하나로 좁혀, 사람도 두 시간 안에 70% 를 못 푸는 난이도로 올렸다.

**WebArena** 는 웹을 다루지만 BrowseComp 과 방향이 다르다. BrowseComp 은 정보를 **찾는** 일이고 검색 API 로 페이지를 읽는다. WebArena 는 쇼핑몰에서 주문을 바꾸거나 GitLab 에서 이슈를 만드는 식으로 웹사이트를 **조작하는** 일이고, 에이전트가 페이지의 버튼을 클릭하고 입력창에 타이핑한다. 사이트를 Docker 로 직접 띄우므로 실제 웹과 달리 내용이 바뀌지 않고, 작업 후 사이트 상태를 프로그램으로 검사한다. 상태로 채점한다는 점은 τ-bench 와 같지만 사용자 시뮬레이터는 없다.

**SWE-bench** 는 τ-bench 와 저자(Shunyu Yao, Karthik Narasimhan)가 겹치고, 결과를 실행으로 검증한다는 원칙도 같다. 모델이 만든 코드 수정을 저장소에 적용하고, 실제 수정에서 실패→통과로 바뀐 테스트가 통과하는지와 기존 테스트가 깨지지 않는지를 본다. 2024-08 OpenAI 가 사람이 검토해 문제 설명이 충분하고 테스트가 공정한 500 개만 고른 SWE-bench Verified 를 냈고, 이후 모델 발표에서는 이 판이 많이 인용된다.

세 계열을 한 축으로 놓으면 다음과 같다. 에이전트가 바꾸는 대상이 **없음**(GAIA, BrowseComp: 답만 냄) → **웹사이트 상태**(WebArena) → **데이터베이스 상태**(τ-bench, BFCL multi-turn) → **코드 저장소**(SWE-bench) 로 갈수록, 정답을 문자열이 아니라 실행 결과로 확인하게 된다. 어느 쪽이든 사람이 주석한 정답 상태와 검사 함수가 벤치마크 품질을 좌우한다. τ-bench, BFCL, SWE-bench 모두 공개 뒤 주석 오류를 고친 수정판(τ-Bench Verified, CHANGELOG 의 정답 수정, SWE-bench Verified)이 나온 것도 이 때문이다.

같은 계열의 한국어 벤치마크로는 조건에 맞는 항목을 빠짐없이 찾아 표로 채우는 [[Ko-WideSearch - Korean Breadth-Search Benchmark|Ko-WideSearch]] 가 있다. 에이전트 학습 연구에서 이 벤치마크들이 어떻게 쓰이는지는 [[Qwen-AgentWorld - Language World Models for General Agents|Qwen-AgentWorld]](BFCL v4, SWE-Bench), [[SAGE - Steerable Agentic Data Generation for Deep Search with Execution Feedback|SAGE]](GAIA, BrowseComp) 노트에 예가 있다.

# D) 점수를 인용할 때 함께 적을 조건

에이전트 벤치마크 점수는 모델 하나가 아니라 "모델 + 도구 + 환경 + 채점 설정" 의 결과다. 다음이 하나라도 다르면 같은 이름의 점수라도 비교가 성립하지 않는다.

- **버전**: BFCL V3 와 V4 는 종합 점수의 가중치가 다르고, τ-bench 는 과제 수정 전후 점수가 다르다.
- **호출 방식**: BFCL 의 FC 모드와 Prompt 모드, τ-bench 의 function calling 과 ReAct 형식.
- **반복 횟수**: τ-bench 의 pass^1 인지 pass^k 인지, k 와 실행 횟수.
- **상대 모델**: τ-bench 의 사용자 시뮬레이터 모델, BrowseComp 의 grader 모델.
- **도구**: BrowseComp 의 검색 API 나 검색기. BrowseComp-Plus 에서 검색기만 바꿔도 같은 GPT-5 의 정확도가 55.9% 와 70.1% 로 갈렸다.

# References

- [Patil et al. (2025), The Berkeley Function Calling Leaderboard (BFCL)](https://proceedings.mlr.press/v267/patil25a.html)
- [Yao et al. (2024), τ-bench](https://arxiv.org/abs/2406.12045)
- [Barres et al. (2025), τ²-Bench](https://arxiv.org/abs/2506.07982)
- [Wei et al. (2025), BrowseComp](https://arxiv.org/abs/2504.12516)
- [Mialon et al. (2023), GAIA: a benchmark for General AI Assistants](https://arxiv.org/abs/2311.12983)
- [Zhou et al. (2023), WebArena: A Realistic Web Environment for Building Autonomous Agents](https://arxiv.org/abs/2307.13854)
- [Jimenez et al. (2023), SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770)
- [OpenAI (2024), Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/)
