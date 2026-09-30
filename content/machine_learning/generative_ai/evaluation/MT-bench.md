---
title: "MT-Bench"
tags:
  - LMSYS
  - LLM
  - evaluation
aliases: []
---

# A) 대화의 다음 턴까지 평가하는 벤치마크

MT-Bench는 대화형 LLM의 답변 품질과 지시 이행 능력을 평가하는 **80개 2턴 질문 세트** 다. Zheng et al.이 2023년 발표한 *Judging LLM-as-a-judge with MT-Bench and Chatbot Arena*에서 소개했다. 평가 대상 모델이 답변을 만들고 별도의 LLM이 그 답변을 채점한다. 이렇게 LLM을 평가자로 쓰는 방법을 **LLM-as-a-judge** 라고 한다.

보통 GPT-4 같은 judge가 각 턴에 1–10점을 매기고 평균을 낸다. MT-Bench 점수는 정해진 질문과 채점 기준 아래에서 얻은 답변 품질 점수이며, 정답률과는 다르다. [논문](https://arxiv.org/abs/2306.05685), [공식 평가 안내](https://github.com/lm-sys/FastChat/tree/main/fastchat/llm_judge)

# B) 80개 질문의 구성

공개된 원본 질문은 영어이며, 8개 범주마다 10개 대화가 있다. 각 대화는 사용자 질문 두 개로 구성된다. 모델 하나가 모든 질문에 답하면 답변은 총 160개가 된다.

| 범주 | 평가하는 과제 |
| --- | --- |
| Writing | 글 작성과 조건에 맞춘 수정 |
| Roleplay | 주어진 역할과 말투 유지 |
| Extraction | 주어진 내용에서 정보 추출 |
| Reasoning | 조건을 따지는 추론 |
| Math | 수학 문제 풀이 |
| Coding | 코드 작성과 변경 |
| STEM | 과학·기술·공학·수학 지식 |
| Humanities | 인문·사회과학 지식 |

예를 들어 공개 질문 `question_id=81`은 첫 턴에 하와이 여행 블로그 글을 쓰게 하고, 두 번째 턴에는 앞선 글의 모든 문장을 알파벳 A로 시작하도록 다시 쓰게 한다. 첫 답변의 내용뿐 아니라 대화 맥락을 이어받아 새 제약을 지키는지도 평가하는 구조다. [질문 데이터](https://github.com/lm-sys/FastChat/blob/587d5cfa1609a43d192cedb8441cac3c17db105d/fastchat/llm_judge/data/mt_bench/question.jsonl)

# C) 답변 생성에서 점수 집계까지

평가에는 답변을 만드는 **대상 모델** 과 점수를 매기는 **judge 모델** 이 참여한다. 두 역할의 모델과 설정을 따로 기록해야 결과를 비교할 수 있다.

1. 대상 모델에 첫 질문을 입력해 답변을 생성한다.
2. 첫 질문과 해당 모델의 답변을 대화 이력에 넣고 두 번째 질문의 답변을 생성한다.
3. Judge가 첫 턴과 두 번째 턴을 각각 채점한다. 두 번째 턴에서는 전체 2턴 대화를 제공하되, 채점 대상은 두 번째 답변이다.
4. 턴별 점수를 저장하고 모델별 평균을 계산한다.

공식 single-answer 프롬프트는 유용성, 관련성, 정확성, 깊이, 창의성, 상세함을 고려하도록 지시한다. Judge는 짧은 평가 이유를 쓴 뒤 점수를 이중 대괄호로 감싸 출력한다. 이유와 점수를 함께 저장하면 낮은 점수가 나온 답변을 다시 살펴볼 수 있다. [Judge 프롬프트](https://github.com/lm-sys/FastChat/blob/587d5cfa1609a43d192cedb8441cac3c17db105d/fastchat/llm_judge/data/judge_prompts.jsonl)

## C.1) 기본 점수는 160개 채점 결과의 평균

모든 질문의 두 턴을 한 번씩 정상 채점했을 때 공식 집계 방식은 다음과 같다.

$$
S = \frac{1}{2N}\sum_{i=1}^{N}\sum_{t=1}^{2}s_{i,t}, \qquad N=80
$$

| 기호 | 의미 |
| --- | --- |
| $N$ | 대화 수, 원본 MT-Bench에서는 80 |
| $i$ | 대화의 번호 |
| $t$ | 첫 번째 또는 두 번째 턴 |
| $s_{i,t}$ | 해당 답변에 judge가 부여한 1–10점 |
| $S$ | 전체 평균 점수 |

예를 들어 1턴 평균이 8.0, 2턴 평균이 6.0이고 각각 80개 평가가 모두 있다면 전체 점수는 7.0이다. 전체 평균과 턴별 평균을 함께 보면 후속 질문에서 품질이 떨어지는지도 드러난다.

다만 공식 `show_result.py`는 실패 점수 `-1`을 제외하고 남은 행의 평균을 계산한다. 평가가 누락되면 위 식처럼 160개를 평균한 결과가 아니다. 유효 점수 수와 실패 수를 함께 확인하고, 범주별 평균도 따로 살펴보는 편이 좋다. [집계 코드](https://github.com/lm-sys/FastChat/blob/587d5cfa1609a43d192cedb8441cac3c17db105d/fastchat/llm_judge/show_result.py)

## C.2) 개별 채점과 답변 쌍 비교

| 방식 | Judge가 하는 일 | 결과 |
| --- | --- | --- |
| Single-answer grading | 답변 하나를 독립적으로 채점 | 1–10점과 평균 점수. 공식 기본 방식 |
| Pairwise comparison | 같은 질문에 대한 두 모델의 답변을 비교 | 승리·패배·무승부와 승률 |
| Reference-guided grading | 참고 답안을 함께 보고 채점 | 개별 채점이나 쌍 비교에 결합 |

Reference-guided grading은 별도의 점수 척도가 아니다. Judge가 풀이의 옳고 그름을 판단하도록 참고 답안을 주는 방법이며, 확인한 FastChat 구현에서는 MT-Bench의 `math`, `reasoning`, `coding` 범주에 적용한다. [평가 생성 코드](https://github.com/lm-sys/FastChat/blob/587d5cfa1609a43d192cedb8441cac3c17db105d/fastchat/llm_judge/gen_judgment.py), [공통 구현](https://github.com/lm-sys/FastChat/blob/587d5cfa1609a43d192cedb8441cac3c17db105d/fastchat/llm_judge/common.py)

쌍 비교에는 특정 기준 모델과 비교하는 `pairwise-baseline`과 모든 모델 쌍을 비교하는 `pairwise-all`이 있다. 공식 집계 코드는 답변 순서를 바꾼 두 판정이 일치할 때 승패를 확정하고, 불일치하면 무승부로 처리한다. 출력의 `win_rate_adjusted`는 무승부를 0.5승으로 계산한 비율이다. 기준 모델, 비교 집합, 무승부 처리 방식이 다른 승률을 그대로 비교해서는 안 된다. [쌍 비교 집계](https://github.com/lm-sys/FastChat/blob/587d5cfa1609a43d192cedb8441cac3c17db105d/fastchat/llm_judge/show_result.py)

# D) 사람과 80% 이상 일치한다는 결과의 조건

논문의 agreement는 **평가자들이 같은 답변을 선호한 비율** 이다. 답변의 사실 정확도가 80%라는 의미는 아니다.

MT-Bench의 1턴 평가에서 무승부를 제외한 S2 조건은 GPT-4 쌍 비교와 사람 사이의 일치율이 85%, 사람끼리는 81%였다. 무승부를 포함하고 순서 교환 후 불일치를 무승부로 처리한 S1에서는 각각 66%, 63%였다. [논문 Table 5(a)](https://arxiv.org/html/2306.05685v4#S4.T5)

이 결과는 당시 모델과 질문, 평가자, 무승부 처리 조건에서 얻었다. 다른 언어·도메인이나 성능 차이가 작은 모델 쌍에서도 같은 일치율이 유지된다고 보장하지 않는다.

# E) Judge의 편향과 평가 범위

Judge도 잘못 채점할 수 있다. 논문은 답변 위치에 따른 **position bias**, 불필요하게 긴 답변을 선호하는 **verbosity bias**, 수학·추론 답변의 오류를 놓치는 문제를 다룬다. 자기 모델의 답변을 선호할 가능성도 살폈지만, 제한된 자료만으로 self-enhancement bias를 확정하지는 않았다. [논문 §3.3–3.4](https://arxiv.org/html/2306.05685v4#S3.SS3)

답변 순서를 바꾸거나 참고 답안을 제공하면 일부 오류를 줄일 수 있지만, 판정의 정확성이 보장되지는 않는다. 특히 80개 2턴 질문만으로 장기 대화, 도구 실행, 한국어 서비스의 품질까지 판단하기는 어렵다.

같은 논문의 Chatbot Arena는 사용자가 익명의 두 모델과 대화하고 선호하는 답변에 투표하는 방식이다. 고정 질문에 대한 judge 점수를 얻는 MT-Bench와는 질문 수집·평가 방식이 다르다. [논문 §2.3](https://arxiv.org/html/2306.05685v4#S2.SS3)

# F) 실험 결과를 비교할 때 기록할 조건

MT-Bench를 모델이나 프롬프트 변경 전후의 비교에 쓴다면 질문 세트와 채점 조건을 고정하는 편이 해석하기 쉽다. 다음 항목을 결과와 함께 남긴다.

- **답변 생성 조건**: 대상 모델의 정확한 버전, chat template, system prompt, temperature, 최대 출력 길이.
- **채점 조건**: judge의 정확한 버전, judge 프롬프트, 참고 답안, 개별 채점 또는 쌍 비교 여부.
- **집계 범위**: 전체·턴별·범주별 평균, 유효 평가 수, 실패·재시도 수, 쌍 비교의 기준 모델과 무승부 처리 방식.

Judge나 프롬프트를 바꿨다면 기존 답변도 새 조건으로 다시 채점해야 변화의 원인을 구분하기 쉽다. 영어 원본을 한국어로 번역한 평가 역시 별도의 변형으로 명시한다. 질문과 언어 조건이 달라진 점수를 원본 MT-Bench 결과와 동일하게 취급할 수는 없다.

실제 서비스 선택에는 서비스 질문으로 만든 별도 평가 세트와 사람의 표본 검토를 함께 쓰는 편이 좋다. MT-Bench 평균에서 차이가 나더라도, 어떤 질문과 턴에서 개선됐는지 확인해야 서비스에서 필요한 능력의 변화인지 판단할 수 있다.

# G) References

- [Zheng et al. (2023), Judging LLM-as-a-judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)
- [FastChat LLM Judge — 실행 방법과 평가 모드](https://github.com/lm-sys/FastChat/tree/main/fastchat/llm_judge)
- [확인한 FastChat 소스 버전: 587d5cfa](https://github.com/lm-sys/FastChat/tree/587d5cfa1609a43d192cedb8441cac3c17db105d/fastchat/llm_judge) — 2026-10-01 확인. 질문·프롬프트·집계 설명은 이 버전을 기준으로 한다.
