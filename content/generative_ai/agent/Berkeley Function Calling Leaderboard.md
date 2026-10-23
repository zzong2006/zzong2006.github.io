---
title: "Berkeley Function Calling Leaderboard (BFCL)"
tags:
  - LLM
  - agent
  - evaluation
  - benchmark
aliases:
  - BFCL
  - Berkeley Function-Calling Leaderboard
---

# A) LLM 이 함수를 맞는 인자로 호출하는지 평가한다

**Function calling**(tool use)은 LLM 이 외부 함수나 API 를 쓰도록, 호출할 함수 이름과 인자를 정해진 형식으로 출력하는 능력이다. LLM 이 직접 함수를 실행하지는 않는다. 애플리케이션이 LLM 의 출력을 받아 실제로 실행하고, 그 결과를 다시 LLM 에게 돌려준다.

```text
사용자: "서울 날씨 알려줘"
  → LLM 출력: get_weather(city="Seoul")        ← 이 출력이 맞는지가 평가 대상
  → 애플리케이션이 실행: {"temp": 18, "sky": "clear"}
  → LLM 답변: "서울은 18도이고 맑습니다."
```

**BFCL** 은 UC Berkeley Gorilla 팀(Patil, Mao, Yan, Ji, Suresh, Stoica, Gonzalez)이 만든 function calling 벤치마크이자 리더보드다. 2024 년 2 월 리더보드를 처음 공개하고 버전을 올려 오다가, 그 내용을 정리한 논문을 ICML 2025 에 냈다. [논문](https://proceedings.mlr.press/v267/patil25a.html), [리더보드](https://gorilla.cs.berkeley.edu/leaderboard.html)

논문은 표준 벤치마크가 없던 이유를 두 가지로 든다.

1. **호출이 맞는지 판정하기 어렵다.** 확실한 방법은 함수를 실제로 실행해 결과를 보는 것인데, 실행 가능한 함수를 수천 개 갖추기는 어렵다. 실제 웹 API(RapidAPI 등)에 의존한 ToolBench 는 API 응답이 들쭉날쭉해 재현이 어려웠고, LLM 에게 채점을 맡긴 벤치마크는 채점 모델의 편향을 안고 간다.
2. **실제 함수와 질문을 다양하게 모으기 어렵다.** 기존 벤치마크의 질문은 대부분 LLM 이 만든 것이었고, 여러 함수를 동시에 호출하는 패턴(parallel call)을 다루지 않았다.

BFCL 은 첫 번째 문제를 **AST 기반 채점** 으로, 두 번째 문제를 **사용자가 실제로 보낸 함수·질문 수집** 으로 풀었다. 이후 버전마다 여러 턴의 대화, 웹 검색, 기억 관리로 범위를 넓혔다.

# B) 버전마다 범위가 넓어졌다

| 버전 | 공개 | 추가된 것 | 규모 |
| --- | --- | --- | --- |
| V1 | 2024-02 | 단일 턴 호출. Python·Java·JavaScript·REST·SQL | 2,000 개 |
| V2 Live | 2024-08-19 | 사용자가 실제로 보낸 함수 문서와 질문 | 수집 64,517 개에서 2,251 개 |
| V3 | 2024-09-19 | 여러 턴 대화(multi-turn), 상태 기반 채점 | 8 개 API 묶음, 1,000 개 질의 |
| V4 | 2025-07-17 | 웹 검색, 기억 관리, 프롬프트 형식 민감도 | 웹 검색 200, 기억 465, 형식 민감도 5,200 |

출처: [V1 블로그](https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html), [V2 블로그](https://gorilla.cs.berkeley.edu/blogs/12_bfcl_v2_live.html), [V3 블로그](https://gorilla.cs.berkeley.edu/blogs/13_bfcl_v3_multi_turn.html), [V4 블로그](https://gorilla.cs.berkeley.edu/blogs/15_bfcl_v4_web_search.html), [CHANGELOG](https://github.com/ShishirPatil/gorilla/blob/main/berkeley-function-call-leaderboard/CHANGELOG.md). V1 공개일은 Gorilla 저장소 README 의 "02/26 리더보드 공개" 기록과, 논문에 적힌 V2 데이터 수집 시작일(2024-02-26)로 맞춰 본 것이다.

리더보드는 지금도 갱신된다. 2026-10 확인 기준 리더보드 페이지는 V4 이고 마지막 갱신일은 2026-04-12 다.

# C) 과제의 모습

## C.1) 단일 턴: 함수 문서와 질문 하나

V1 블로그가 예로 든 항목이다. 모델은 함수 문서(JSON schema)와 질문을 받는다.

```text
질문: 5000 달러를 연이율 5%, 월복리로 3 년 투자했을 때의 미래 가치를 예측해 줘.

함수: finance.predict_future_value
  present_value               (number, 필수)  현재 가치
  annual_interest_rate        (number, 필수)  연이율
  compounding_periods_per_year (integer, 선택) 연간 복리 횟수
  time_years                  (number, 필수)  기간(년)
```

블로그는 GPT-4 가 `annual_interest_rate=5` 를, Gorilla OpenFunctions-v2 가 `0.05` 를 넘긴 사례를 보여 주며 앞쪽을 실패로 다룬다. 함수 이름과 인자 구성은 같아도, 함수가 이율을 소수로 받는다면 `5` 는 500% 로 계산된다. 이런 차이를 잡아내는 것이 채점의 핵심이다.

단일 턴 과제는 함수 개수와 호출 횟수에 따라 나뉜다 (논문 부록 C).

| 범주 | 함수 목록 | 기대하는 호출 | 예 |
| --- | --- | --- | --- |
| Simple | 1 개 | 1 번 | 위의 미래 가치 계산 |
| Multiple | 여러 개 | 그중 하나를 1 번 | 날씨 함수가 방해물로 섞인 목록에서 주문 함수를 골라 호출 |
| Parallel | 1 개 | 같은 함수를 여러 번 | "서울과 부산 날씨" → `get_weather` 두 번 |
| Parallel Multiple | 여러 개 | 여러 함수를 여러 번 | 질의 두 개를 합치고 함수 세 개를 준 뒤 그중 둘만 호출 |
| Irrelevance | 1 개 이상 | 호출하지 않음 | 맞는 함수가 없거나 필수 정보가 빠진 질문 |
| Relevance | 1 개 이상 | 최소 1 번 | 맞는 함수가 있는 질문 |

Irrelevance 범주는 원래 항목에서 함수를 빼거나 질문에서 필수 인자 정보를 지워 만든다 (부록 B). 이때 모델은 함수를 지어내 호출하는 대신 되묻거나 할 수 없다고 답해야 한다. 리더보드는 이 두 범주를 묶어 **hallucination measure** 라고 부른다.

## C.2) V2 Live: 실제 사용자 질문

V1 의 질문은 연구진이 GitHub 인기 저장소의 함수로부터 만든 것이었다. 공개된 질문은 시간이 지나면 모델 학습 데이터에 섞일 수 있다. V2 는 2024-02-26 부터 2024-04-01 까지 BFCL 의 공개 모델 엔드포인트로 들어온 실제 질의 64,517 개를 모아, 중복과 공개 데이터셋 항목을 걸러 내고 사람이 최소한으로만 다듬어 2,251 개를 남겼다.

실제 질의는 연구진이 만든 질의와 모양이 달랐다. 항목당 함수 후보가 평균 3 개(최대 37 개), 함수당 인자가 평균 4 개(최대 28 개)였고 한국어를 포함해 15 개 넘는 언어가 섞여 있었다. 범주도 한쪽으로 쏠렸다. Multiple 이 1,053 개, Irrelevance 가 882 개인 반면 Parallel 은 16 개뿐이었다.

논문은 V1 과 V2 를 비교해 학습 데이터 오염도 점검했다 (Table 2–3). 모델이 데이터를 학습에서 봤다면 그 데이터의 perplexity(모델이 문장을 얼마나 예상하기 쉬운지를 나타내는 값, 낮을수록 익숙함)가 낮게 나온다.

- Llama 2-7B 는 V1 에서 3.47, V2 에서 2.56 으로, 새로 모은 V2 쪽이 오히려 낮았다. V1 을 외웠다는 신호가 없다.
- xLAM-7B 는 V1 에서 3.67, V2 에서 5.09 로 V2 에서만 크게 높았다. V1 에만 유난히 익숙하다는 뜻으로, 저자들은 오염이나 일반화 부족의 신호로 읽는다.

## C.3) V3 multi-turn: 상태가 있는 API 와 여러 턴

V3 는 상태를 가진 가상 API 8 개를 만들었다. 차량 제어, 주식 거래 봇, 여행 예약, 파일 시스템을 주 API 로, 메시지·Twitter·티켓·수학 API 를 보조 API 로 쓴다 (논문 부록 E.3). 사용자 질의는 GPT-4o 가 함수 호출 경로를 먼저 정하고 그 경로가 필요한 자연어 요청을 쓰는 식으로 만들고, 정답 경로는 사람이 주석했다.

리더보드 점수에 들어가는 범주는 네 가지이고 각 200 개다.

| 범주 | 시험하는 것 |
| --- | --- |
| Base | 필요한 정보가 다 주어진 여러 턴 요청 |
| Missing Parameters | 한 턴에서 필수 정보가 빠져 있다. 호출 대신 되물어야 하고, 다음 턴에 사용자가 정보를 준다 |
| Missing Functions | 한 턴에서 필요한 함수가 목록에 없다. 없다고 알려야 하고, 다음 턴에 함수가 추가된다 |
| Long Context | 질의나 함수 실행 결과가 매우 길다 |

V3 블로그의 파일 시스템 예시다.

1. **초기 상태**: 현재 디렉터리가 이미 `alex` 다.
2. **사용자 턴**: "나는 Alex 야. 내 이름으로 된 디렉터리로 가서, 숨김 파일까지 포함해 내용을 보여 줘."
3. **정답 경로**: `pwd()` 로 현재 위치를 확인하고 `ls(a=True)` 를 호출한다.
4. **실패한 모델의 경로**: `cd(folder='alex')` 가 실패하자 `ls()` 를 부르고, `mkdir(dir_name='alex')` 로 디렉터리를 새로 만들었다.

마지막 `mkdir` 때문에 파일 시스템 상태가 정답과 달라지고, 다음 절의 상태 검사에서 실패한다. 사용자가 요청하지 않은 변경을 만든 것이다.

## C.4) V4 agentic: 웹 검색과 기억

- **웹 검색**: 모델에게 DuckDuckGo 검색 함수(제목·요약·URL 반환)와 웹 페이지 본문을 가져오는 함수를 준다. 질문은 검색을 여러 번 이어야 풀리는(multi-hop) 질문 100 개로 사람이 만들었고, 검색 결과 요약을 주는 판과 주지 않는 판으로 200 개 항목이 된다. 모델마다 학습 데이터 시점이 다르므로 "2024 년 TIME 올해의 인물" 처럼 최근이지만 이제는 바뀌지 않는 사실을 묻는다.
- **기억 관리**: 학업 상담, 고객 지원, 의료 보조 등 5 개 도메인에서 여러 대화에 걸쳐 사용자 정보를 조금씩 알려 준다. 대화가 끝나면 기억 저장소의 내용을 저장해 두고, 대화 기록을 비운 상태에서 저장소만 보고 답하게 한다. 앞서 들은 정보를 찾고, 더하고, 고치고, 지우는지 본다.
- **형식 민감도**: 같은 문제를 프롬프트 형식 26 가지로 바꿔 각 200 개씩 돌려, 형식만 바꿨을 때 점수가 얼마나 흔들리는지 본다. 종합 점수에는 넣지 않는다.

웹 검색과 기억 과제의 최종 답은 `{'answer': ..., 'context': ...}` 형식으로 받는다. `answer` 칸만 소문자로 바꾸고 문장부호를 지운 뒤 정답과 정확히 같을 때 맞은 것으로 친다. "관련 정보를 찾지 못해 확실하지 않다(no ...)" 같은 문장에 정답 단어 "no" 가 우연히 들어가 맞은 것으로 처리되는 일을 막기 위해서다 (논문 §4.5).

# D) 채점

## D.1) AST 부분 일치

**AST**(Abstract Syntax Tree, 추상 구문 트리)는 코드 문자열을 문법 구조에 따라 나무 형태로 분해한 것이다. `f(a=1, b="x")` 를 파싱하면 "함수 이름 `f`, 인자 `a` 의 값 `1`, 인자 `b` 의 값 `"x"`" 처럼 구성 요소별로 꺼낼 수 있다. BFCL 은 모델 출력을 Python `ast` 모듈로 파싱하고, 함수를 실행하지 않은 채 이름과 인자를 정답과 비교한다 (§4.1).

정답은 값 하나가 아니라 **허용되는 값의 목록(possible answers)** 으로 주석되어 있다. 앞의 미래 가치 예시라면 다음과 같은 형태다 (설명용으로 만든 목록이다).

```text
finance.predict_future_value:
  present_value:                 [5000]
  annual_interest_rate:          [0.05]
  compounding_periods_per_year:  [12]
  time_years:                    [3]
```

호출이 맞으려면 다음을 모두 만족해야 한다.

1. 함수 이름이 정확히 같다.
2. 필수 인자가 모두 있고, 함수 문서에 없는 인자는 없다.
3. 인자마다 값이 허용 목록 안에 있다. 문자열은 대소문자를 무시하고 공백과 일부 문장부호를 지운 뒤 비교한다. 그래서 날짜 `"20th June"` 과 `"2023-06-20"`, 지명 `"New York City"` 와 `"NYC"` 를 목록에 함께 넣어 둘 수 있다 (부록 H).
4. 타입이 맞다. Python 에서는 float 자리에 int 를 넣어도 되지만, Java·JavaScript 에서는 `5.0` 처럼 float 로 써야 한다.
5. 여러 호출을 기대하는 범주에서는 순서와 상관없이 정답 호출이 하나도 빠짐없이 짝지어져야 한다. 하나라도 빠지면 그 항목 전체가 실패다.

실제로 실행해 결과를 비교하는 방식(executable evaluation)과 견주기 위해, 논문은 실행 가능한 일부 항목을 두 방식으로 모두 채점했다. 두 점수와 모델 순위는 강하게 상관했다 (Figure 3). 실행 기반 범주는 2025-04-09 리더보드에서 빠졌다 (CHANGELOG).

## D.2) Multi-turn: 상태 검사와 응답 검사

여러 턴 과제는 매 턴이 끝날 때 두 가지를 검사하고, 모든 턴에서 둘 다 통과해야 그 항목을 맞은 것으로 친다 (§4.4).

- **상태 검사(state-based)**: 턴이 끝난 뒤 API 의 내부 상태(파일 목록, 관심 종목 목록 등)가 정답 상태와 같은지 본다. 같은 결과에 이르는 경로가 여러 개여도 상태만 맞으면 통과한다.
- **응답 검사(response-based)**: 모델이 부른 함수들이 정답의 최소 호출 경로를 부분집합으로 포함하는지 본다. 주가 조회처럼 상태를 바꾸지 않는 요청에서, 모델이 함수를 부르지 않고 값을 지어냈는지를 잡는다. 정답 경로 외의 추가 호출은 허용한다.

한 턴에 20 단계를 넘기면 강제로 종료하고 실패로 친다. 두 검사를 모두 통과해야 하는 규칙은 2024-10-30 부터 적용됐다.

## D.3) 종합 점수

V4 의 종합 점수(Overall Accuracy)는 다섯 묶음의 가중 평균이다 (V4 블로그, CHANGELOG 2025-07-17).

| 묶음 | 가중치 |
| --- | --- |
| Agentic (웹 검색과 기억의 단순 평균) | 40% |
| Multi-Turn | 30% |
| Live (V2 실제 사용자 질문) | 10% |
| Non-Live (V1 단일 턴) | 10% |
| Hallucination Measure (Irrelevance·Relevance) | 10% |

V3 까지는 Live, Non-Live, Multi-Turn 을 3 분의 1 씩 반영했다. CHANGELOG 는 단일 턴 과제에서 대부분 모델이 높은 점수를 내 차이가 잘 드러나지 않게 되자, 여러 단계가 필요한 과제 쪽으로 가중치를 옮겼다고 설명한다. 같은 모델이라도 V3 와 V4 의 종합 점수는 계산식이 달라 직접 비교할 수 없다. 리더보드 페이지의 짧은 설명은 아직 "모든 하위 범주의 단순 평균" 이라고 적혀 있으므로, 계산식은 CHANGELOG 와 V4 블로그를 기준으로 본다.

리더보드는 모델마다 **FC** 모드(모델 API 의 기본 function calling 기능 사용)와 **Prompt** 모드(함수 문서를 프롬프트에 넣고 호출을 텍스트로 출력하게 함)를 구분해 표시한다. 같은 모델도 모드에 따라 점수가 다르다.

# E) 발표 당시 결과

논문 Table 1 에서 종합 점수가 가장 높았던 것은 gpt-4o-2024-11-20 으로, Prompt 모드 66.4, FC 모드 65.8 이었다. 논문의 정리는 다음과 같다 (§5.1).

- 상위 모델은 단일 턴, 실제 사용자 질문, hallucination 범주에서 높은 점수를 낸다.
- 여러 턴 과제와 agentic 과제, 특히 기억 관리에서는 개선 여지가 크다.

단일 턴 호출은 이미 잘하지만, 상태를 추적하며 여러 단계를 이어 가는 일은 아직 어렵다는 뜻이다. V4 의 가중치 변경도 이 관찰을 반영한다.

# F) 한계

- **AST 일치는 실행의 대리 지표다.** 허용 목록에 빠진 표현이 있으면 맞는 호출도 실패한다. CHANGELOG 에는 정답 목록 수정 기록이 꾸준히 있다. 예를 들어 2024-10-16 에는 Live Simple 에서만 104 개 항목의 정답을 고쳤다. 같은 V4 안에서도 수정 시점에 따라 점수가 조금씩 다르다.
- **사용자는 각본대로만 움직인다.** Missing Parameters 범주는 다음 턴에서 사용자가 빠진 정보를 주도록 미리 정해져 있다. 모델이 어떻게 되묻든 사용자의 답은 같다. 사용자 반응까지 바뀌는 상황은 [[tau-bench|τ-bench]] 가 LLM 사용자 시뮬레이터로 다룬다. BFCL 논문은 반대로, LLM 사용자 시뮬레이터가 환각과 지시 불이행을 일으켜 평가를 흐린다는 점을 τ-bench 의 약점으로 든다.
- **도메인 정책은 없다.** "기본 이코노미는 변경 불가" 같은 업무 규칙을 지키는지는 평가하지 않는다.
- **모드와 프롬프트 형식이 점수에 섞인다.** FC 와 Prompt 모드의 차이, V4 의 형식 민감도 결과가 보여 주듯 형식만 바꿔도 점수가 움직인다.

다른 에이전트 벤치마크와의 비교는 [[LLM Agent Benchmarks]] 에 모았다.

# References

- [Patil et al. (2025), The Berkeley Function Calling Leaderboard (BFCL): From Tool Use to Agentic Evaluation of Large Language Models, ICML 2025](https://proceedings.mlr.press/v267/patil25a.html)
- [BFCL 리더보드](https://gorilla.cs.berkeley.edu/leaderboard.html) — 2026-10 확인, V4
- [BFCL V1 블로그](https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html), [V2 Live 블로그](https://gorilla.cs.berkeley.edu/blogs/12_bfcl_v2_live.html), [V3 multi-turn 블로그](https://gorilla.cs.berkeley.edu/blogs/13_bfcl_v3_multi_turn.html), [V4 블로그](https://gorilla.cs.berkeley.edu/blogs/15_bfcl_v4_web_search.html)
- [BFCL CHANGELOG](https://github.com/ShishirPatil/gorilla/blob/main/berkeley-function-call-leaderboard/CHANGELOG.md)
