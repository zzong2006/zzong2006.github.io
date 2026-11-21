---
title: "Knowledge Distillation"
tags:
  - machine_learning
aliases: []
---

사진을 보고 무엇이 찍혔는지 맞히는 이미지 분류 모델을 휴대폰 앱에 넣으려 한다고 하자.

- 크고 정확한 모델이 이미 있다. 하지만 휴대폰에서 돌리기엔 너무 무겁고 느리다.
- 같은 데이터로 작은 모델을 처음부터 학습하면 빠르긴 한데 정확도가 꽤 떨어진다.

큰 모델이 이미 배운 것을 작은 모델에게 옮겨 담을 수는 없을까? 큰 모델의 출력을 작은 모델의 학습 목표로 쓰는 방법이 knowledge distillation(지식 증류)이다.

# A) 한눈에 보기

- **큰 모델(teacher)의 출력 확률을 작은 모델(student)이 따라가게 학습한다**: 정답 하나만 주는 라벨보다 샘플마다 담긴 정보가 많다.
- **Temperature 는 teacher 의 출력을 얼마나 완만하게 펼칠지 정한다**: 높이면 작은 확률로 묻혀 있던 "어느 오답이 정답과 비슷한지" 가 드러난다.
- **Loss 는 teacher 분포와의 KL divergence 에 정답 라벨의 cross-entropy 를 섞는다**: 두 항의 비중은 α 로 정한다.
- **처음부터 작은 모델을 학습하는 것보다 낫다**: 라벨이 촘촘하고, 라벨 없는 데이터에도 teacher 가 라벨을 붙여 주고, 서빙 비용은 작은 모델 그대로다.
- **검색에서는 cross-encoder 를 teacher 로, bi-encoder 를 student 로 쓴다**: 점수 범위가 달라서 점수를 그대로 맞추지 않고, 후보 목록의 분포나 두 문서의 점수 차이를 맞춘다.
- **Student 는 teacher 의 실수까지 배운다**: teacher 가 자주 틀리는 영역에서는 정답 라벨과 섞거나 teacher 를 먼저 검증한다.

# B) Teacher 와 Student

**Teacher 는 이미 학습을 마친 크고 정확한 모델이고, student 는 실제로 서비스할 작은 모델이다.**

- Teacher 는 학습 때만 쓰고 서비스에는 올리지 않는다. 그래서 느려도 괜찮다.
- Student 는 서비스 조건(응답 시간, 메모리)에 맞춰 크기를 먼저 정한다. 층 수를 줄이거나 차원을 줄인 같은 계열 모델일 때가 많지만, 구조가 완전히 달라도 된다.

학습은 두 단계로 이어진다.

1. Teacher 를 정답 라벨로 학습한다. 이미 있는 모델을 그대로 써도 된다.
2. 학습 데이터의 사진마다 teacher 의 출력 확률을 구하고, student 가 그 확률을 따라가도록 학습한다.

![[img-f08ec9311e.png|700]]

위 그림의 위쪽은 정답 라벨(hard label)로 teacher 를 학습하는 장면이고, 아래쪽은 teacher 의 출력 확률(soft label)로 student 를 학습하는 장면이다.

# C) Soft label 과 temperature

## C.1) Soft label 에 담긴 것

같은 고양이 사진 한 장을 두 가지 라벨로 비교해 보자.

- **정답 라벨 (hard label)**: 고양이 1, 나머지 0 이다.
	- "개" 와 "자동차" 가 똑같이 틀린 답으로 취급된다.
- **Teacher 의 출력 (soft label)**: 고양이 0.83, 개 0.10, 호랑이 0.05, 자동차 0.01 이다.
	- 이 사진이 개와는 조금 닮았고 자동차와는 전혀 닮지 않았다는 정보가 들어 있다.

**Soft label 은 오답들 사이의 순서까지 알려 준다.**

- 정답 라벨은 사진 한 장마다 "고양이다" 한 가지만 알려 준다.
- Teacher 의 출력은 그 사진이 각 클래스와 얼마나 닮았는지를 클래스 수만큼 알려 준다.
- Hinton 은 이 오답 사이의 정보를 dark knowledge 라 불렀다.

## C.2) Temperature 로 분포를 펼치기

**잘 학습된 teacher 는 정답에 확률을 거의 몰아준다.**

- 위 예에서 자동차는 0.01 이다.
- 이런 작은 값은 loss 에 거의 영향을 주지 못해서, "자동차와는 전혀 안 닮았다" 는 정보가 student 에게 잘 전해지지 않는다.

그래서 softmax 에 들어가기 전의 점수(logit) $z_i$ 를 temperature $T$ 로 나눈 뒤 확률로 바꾼다.

$$
q_i = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}
$$

- **T = 1**: 보통의 [[softmax function|softmax]] 다.
- **T 가 1 보다 크면**: 점수 차이가 줄어든 효과가 나서 분포가 완만해진다.
- **T 가 1 보다 작으면**: 점수 차이가 커져 분포가 더 뾰족해진다.

아래 그림은 같은 고양이 사진에서 정답 라벨, T = 1 의 teacher 출력, T = 4 의 teacher 출력을 나란히 놓은 것이다. 막대 높이가 각 클래스의 확률이다.

![[img-4d1a2a14bc.png]]

**T 를 4 로 올리면 1 등은 그대로인데 오답 사이의 차이가 눈에 보이게 커진다.**

- 고양이는 0.83 → 0.41 로 내려가지만 여전히 가장 높다.
- 자동차는 0.01 → 0.14 로 올라와서, 개(0.24)·호랑이(0.21)보다 낮다는 순서가 loss 에 실제로 반영된다.

**T 를 너무 높이면 반대로 정보가 사라진다.**

- T = 10 이면 네 클래스가 0.31 / 0.25 / 0.24 / 0.20 으로 거의 같아져서, 고양이가 정답이라는 정보까지 약해진다.
- 그래서 T 는 검증 데이터로 고른다.

# D) Distillation loss

**Student 는 두 가지 목표를 동시에 따라간다.**

1. 같은 temperature $T$ 에서 teacher 의 분포 $q$ 와 비슷한 분포를 낸다.
2. T = 1 에서 정답 라벨 $y$ 를 맞힌다.

두 항을 α 로 섞은 것이 Hinton 등이 제안한 loss 다.

$$
L = \alpha \cdot T^2 \cdot \mathrm{KL}\left(q_T \,\|\, p_T\right) + (1-\alpha) \cdot \mathrm{CE}\left(y,\ p_1\right)
$$

- $q_T$, $p_T$: temperature $T$ 에서 구한 teacher 와 student 의 분포
- $p_1$: T = 1 에서 구한 student 의 분포
- 첫 항은 두 분포가 얼마나 다른지 재는 [[KL-Divergence]] 이고, 둘째 항은 정답 라벨에 대한 [[cross-entropy]] 다.

**두 항이 맡는 역할이 다르다.**

- KL 항은 오답 사이의 순서처럼 정답 라벨에 없는 정보를 옮긴다.
- 정답 라벨 항은 teacher 가 틀린 사진에서 student 가 teacher 를 따라 틀리지 않게 붙잡는다.
- Hinton 등은 정답 라벨 쪽 비중을 꽤 작게 둘 때 결과가 가장 좋았다고 적었다.

실제로는 T 를 올리면 KL 항의 gradient 가 대략 $1/T^2$ 로 작아진다. 그래서 $T^2$ 를 곱해 T 를 바꿔도 두 항의 비중이 유지되게 한다 (부록).

KL 의 방향은 teacher 분포를 앞에 둔 forward KL 이다. Teacher 가 확률을 준 곳에 student 도 확률을 깔도록 만든다. 방향에 따른 차이는 [[KL-Divergence]] 노트에 있다.

# E) 작은 모델을 처음부터 학습하는 것과의 차이

같은 크기의 student 를 정답 라벨만으로 학습하는 경우와 비교하면 차이가 셋이다.

1. **샘플 하나에 담긴 라벨이 촘촘하다.**
	- 정답 라벨은 사진마다 클래스 하나만 알려 주고, soft label 은 모든 클래스에 대한 닮은 정도를 알려 준다.
	- Hinton 등의 MNIST 실험에서 작은 모델은 정답 라벨만으로 학습하면 테스트 오류가 146 개였고, teacher 를 따라 학습하면 74 개였다. Teacher 의 오류는 67 개였다.
2. **라벨이 없는 데이터에도 teacher 가 라벨을 붙인다.**
	- 사람이 라벨을 단 사진이 10 만 장뿐이어도, 라벨 없는 사진 수백만 장에 teacher 출력을 붙여 student 학습에 쓸 수 있다.
	- 정답 라벨만 쓰면 사람이 라벨을 단 양이 곧 학습 데이터의 상한이다.
3. **서빙 비용은 작은 모델 그대로다.**
	- Teacher 는 학습 때만 쓰므로, 서비스할 때의 응답 시간과 메모리는 student 크기로 정해진다.
	- 큰 모델을 그대로 서비스하면 정확하지만 느리고, 작은 모델만 학습하면 빠르지만 덜 정확하다. Distillation 은 빠른 쪽을 고르고 정확도 차이를 줄인다.

**Distillation 은 teacher 가 아는 것을 옮길 뿐, teacher 가 모르는 것은 가르치지 못한다.**

- Teacher 가 자주 틀리는 영역에서는 student 도 같이 틀린다.
- Student 가 teacher 에 비해 너무 작으면 teacher 의 분포를 따라가지 못해 효과가 줄어든다.

# F) 검색 랭킹 사례: Cross-Encoder → Bi-Encoder

## F.1) 두 구조와 distillation 이 필요한 이유

쇼핑 검색에서 질의 「아이폰 15 케이스」 에 맞는 상품을 찾는다고 하자. 질의와 상품의 관련도를 매기는 신경망은 크게 둘이다. 자세한 비교는 [[Bi-Encoder vs Cross-Encoder]] 에 있다.

- **Cross-encoder**: 질의와 상품 제목을 한 입력으로 이어 붙여 넣고 점수 하나를 낸다.
	- 질의 단어와 제목 단어를 첫 층부터 서로 비교하므로 정확하다.
	- 질의가 올 때마다 후보 수만큼 모델을 돌려야 해서, 상품 수백만 개 전체에는 쓸 수 없다.
- **Bi-encoder**: 질의와 상품을 따로 벡터로 만들고 두 벡터의 cosine 유사도나 내적을 점수로 쓴다.
	- 상품 벡터를 미리 계산해 둘 수 있어서 전체 상품에서 바로 찾을 수 있다.
	- 상품 하나를 벡터 하나에 압축하므로 덜 정확하다.

**그래서 cross-encoder 를 teacher, bi-encoder 를 student 로 둔다.**

- 서비스는 빠른 bi-encoder 가 맡고, 정확도는 cross-encoder 의 판단을 따라가며 끌어올린다.
- 앞의 고양이 예와 비교하면 클래스 자리에 같은 질의의 후보 상품들이 온다.

## F.2) 점수 스케일 문제

질의 「아이폰 15 케이스」 의 후보 네 개에 두 모델이 매긴 점수가 다음과 같다고 하자.

| 후보 상품 | Cross-encoder 점수 (logit) | Bi-encoder 점수 (cosine) |
| --- | --- | --- |
| 아이폰 15 실리콘 케이스 | 8.2 | 0.82 |
| 아이폰 15 프로 케이스 | 6.9 | 0.80 |
| 아이폰 14 케이스 | 3.0 | 0.78 |
| 아이폰 15 본체 | −1.5 | 0.60 |

**두 점수는 범위가 달라서 값을 그대로 맞출 수 없다.**

- Cross-encoder 점수는 범위 제한이 없는 logit 이다. 8.2 도 −1.5 도 나온다.
- Cosine 은 −1 과 1 사이다. Student 가 아무리 학습해도 8.2 에는 닿을 수 없다.
- 그래서 teacher 점수를 정답으로 두고 MSE 로 회귀하면 student 는 불가능한 목표를 쫓는다.

**Cross-encoder 점수는 같은 질의 안에서의 순서만 뜻이 있다.**

- 어떤 질의에서는 가장 맞는 상품이 3.1 이고, 다른 질의에서는 9.0 일 수 있다.
- 3.1 이라는 값 자체가 "관련 있다" 를 뜻하지 않는다. 같은 질의의 다른 후보보다 높은지가 중요하다.

그래서 점수의 절대값을 버리고, 같은 질의 안에서의 상대적인 관계만 맞추는 방법을 쓴다. 대표적인 것이 아래 두 가지다.

## F.3) Listwise KL: 후보 목록의 점수 분포 맞추기

**같은 질의의 후보 점수를 softmax 로 확률 분포로 바꾸고, 두 분포를 KL 로 맞춘다.**

- Teacher 점수 8.2, 6.9, 3.0, −1.5 에 softmax 를 씌우면 0.78, 0.21, 0.00, 0.00 이 된다.
- Student 의 cosine 은 그대로 softmax 를 씌우면 0.27, 0.26, 0.26, 0.21 로 네 후보가 거의 같은 확률이 된다. 그래서 cosine 을 작은 temperature τ 로 나눈 뒤 softmax 를 씌운다. τ = 0.05 면 0.47, 0.31, 0.21, 0.01 이다.
- 이 두 분포의 KL 을 loss 로 쓴다. 고양이 예에서 클래스 분포를 맞추던 것과 같은 식이다.

아래 그림은 두 분포를 후보별로 나란히 놓은 것이다. 막대 높이가 후보 목록 안에서의 확률이다.

![[img-d156664049.png]]

**Student 는 「아이폰 14 케이스」 를 정답에 너무 가깝게 보고 있다.**

- Teacher 는 이 후보에 거의 0 을 주는데 student 는 0.21 을 준다.
- KL 을 줄이려면 student 는 「아이폰 14 케이스」 의 점수를 내리고 「아이폰 15 실리콘 케이스」 의 점수를 올려야 한다.
- 숫자 하나 차이를 구분하는 법을 정답 라벨 없이 teacher 에게서 배운다.

**Softmax 는 모든 점수에 같은 값을 더해도 결과가 같다.**

- 그래서 teacher 의 점수가 8.2 근처든 3.1 근처든 상관이 없고, 같은 질의 안에서 얼마나 벌어져 있는지만 남는다.
- 점수 범위의 차이는 temperature 로 맞춘다.

RocketQAv2 가 cross-encoder 와 bi-encoder 를 함께 학습하며 이 방식을 썼다.

## F.4) Margin MSE: 두 문서 점수 차이 맞추기

**정답 문서와 오답 문서의 점수 차이(margin)를 teacher 와 같게 맞춘다.**

Hofstätter 등(2020)은 구조가 다른 랭킹 모델은 점수의 크기 자체가 다르게 나온다는 점에서 출발해 이 방식을 제안했다.

$$
L = \Big( \big(s(q, d^+) - s(q, d^-)\big) - \big(t(q, d^+) - t(q, d^-)\big) \Big)^2
$$

- $s$: student 의 점수, $t$: teacher 의 점수
- $d^+$: 정답 문서, $d^-$: 오답 문서

위 예에서 정답을 「아이폰 15 실리콘 케이스」, 오답을 「아이폰 14 케이스」 로 두면 teacher 의 차이는 8.2 − 3.0 = 5.2 다.

- Student 가 두 상품에 20.0 과 14.8 을 주든 5.2 와 0.0 을 주든, 차이가 5.2 면 loss 는 0 이다.
- 점수의 높낮이는 자유롭게 두고 간격만 teacher 에 맞춘다.

**Margin MSE 는 차이의 크기까지 맞추므로 student 점수의 범위가 넓어야 한다.**

- Cosine 끼리의 차이는 최대 2 라서 5.2 에 닿지 못한다.
- 그래서 margin MSE 로 학습하는 bi-encoder 는 보통 범위 제한이 없는 내적을 점수로 쓴다.

두 방식은 맞추는 정보가 다르다.

- **Listwise KL**: 질의 하나의 후보 여러 개를 한꺼번에 보고, 간격의 크기는 temperature 에 맡긴 채 후보 사이의 상대적인 확률만 맞춘다.
- **Margin MSE**: 정답·오답을 한 쌍씩 보고, 간격의 크기까지 teacher 를 따른다.

## F.5) 데이터 쪽 활용: hard negative 와 false negative 거르기

Teacher 는 점수를 따라가게 하는 데만 쓰지 않고, 학습 데이터를 고치는 데도 쓴다.

**Teacher 점수가 높은 hard negative 는 실제로는 정답일 수 있어서 뺀다.**

- Bi-encoder 학습에서는 질의와 비슷하지만 정답이 아닌 [[hard negative]] 를 일부러 넣는다.
- 라벨이 질의마다 한두 개뿐이라, 이렇게 뽑은 후보에 라벨이 안 달린 실제 정답(false negative)이 섞인다.
- 예를 들어 「아이폰 15 투명 케이스」 가 라벨이 없다는 이유로 negative 로 뽑힐 수 있다. Cross-encoder 가 이 상품에 높은 점수를 주면 negative 에서 뺀다.
- RocketQA 가 이렇게 false negative 를 걸러 bi-encoder 성능을 올렸다.

**라벨이 없는 질의에는 teacher 가 정답을 골라 준다.**

- 검색 기록에만 있고 사람이 라벨을 달지 않은 질의에 대해, cross-encoder 점수가 높은 후보를 정답으로 붙여(pseudo-label) 학습 데이터를 늘린다.

## F.6) Teacher 가 틀릴 때의 위험

**Student 는 teacher 의 실수까지 그대로 배운다.**

- Cross-encoder 가 질의 단어가 많이 겹치는 제목을 과하게 좋아하면, 「아이폰 15 케이스 아이폰 15 케이스 호환」 처럼 단어만 반복한 상품도 높게 매긴다. Student 도 그 상품을 높게 매기도록 학습된다.
- 다른 분야(예: 영어 웹 문서)로 학습한 cross-encoder 를 그대로 쓰면, 쇼핑 질의에서 자신 있게 틀린 점수를 낸다. 분포가 뾰족하게 틀리면 student 는 그 틀린 순서를 강하게 따라간다.

**데이터를 고칠 때도 teacher 의 실수가 데이터에 남는다.**

- Teacher 가 진짜 오답에 높은 점수를 주면, 가장 쓸모 있는 hard negative 가 false negative 로 오인되어 빠진다.
- 반대로 teacher 가 실제 정답에 낮은 점수를 주면 false negative 가 그대로 남는다.

그래서 보통 다음을 함께 한다.

- 사람이 라벨을 단 평가셋으로 teacher 의 정확도를 먼저 잰다. Teacher 가 student 보다 낫지 않은 영역이 있으면 그 영역에는 쓰지 않는다.
- 정답 라벨 항을 섞어 teacher 를 맹목적으로 따르지 않게 한다.
- False negative 를 거르는 기준을 보수적으로 잡고, 걸러진 것 일부를 사람이 확인한다.

# G) 그 밖의 사례

**LLM 을 teacher 로 두고 작은 분류기를 student 로 학습한다.**

- 리뷰 감성이나 검색어 의도처럼 사람이 라벨을 달려면 비용이 큰 작업에 LLM 이 대량으로 라벨을 붙인다.
- 그 라벨로 작은 분류기를 학습하면 사람 라벨링 비용을 줄이고 서비스도 작은 모델로 한다.
- 이때도 LLM 의 라벨 오류가 분류기로 그대로 옮겨 간다.

**언어모델끼리의 distillation 에는 "어떤 문장 위에서 teacher 를 따라 할 것인가" 가 더 붙는다.**

- 언어모델은 자기가 생성한 토큰을 다음 입력으로 다시 받는다.
- Teacher 가 만든 고정 데이터 위에서 배우면 off-policy, student 가 직접 생성한 문장 위에서 teacher 에게 토큰마다 채점받으면 on-policy 다. 둘의 차이와 비용은 [[on-policy distillation]] 에 있다.
- 데이터를 섞는 비율과 분포 비교 방식(발산 함수)을 설정값으로 두고 두 방식을 하나로 묶은 알고리즘이 [[GKD]] 다.

# H) 부록: 식

## H.1) Temperature 와 T²

Teacher logit 을 $v_i$, student logit 을 $z_i$, temperature $T$ 에서의 분포를 각각 $q_i$, $p_i$ 라 하자. Soft label 에 대한 cross-entropy 를 student logit 으로 미분하면 다음과 같다.

$$
\frac{\partial C}{\partial z_i} = \frac{1}{T}\left(p_i - q_i\right)
$$

T 가 logit 크기보다 충분히 크고 logit 평균이 0 이면 $\exp(x/T) \approx 1 + x/T$ 로 근사할 수 있다. 그러면 클래스 수를 $N$ 이라 할 때 다음이 된다.

$$
\frac{\partial C}{\partial z_i} \approx \frac{1}{N T^2}\left(z_i - v_i\right)
$$

Gradient 가 $1/T^2$ 로 작아지므로 soft 항에 $T^2$ 를 곱해 정답 라벨 항과의 비중을 맞춘다. 이 근사에서 soft 항은 logit 차이의 제곱을 줄이는 것과 같아진다.

## H.2) Listwise KL

질의 $q$ 의 후보 $d_1, \dots, d_k$ 에 대해 teacher 점수 $t_i$, student 점수 $s_i$ 로 두 분포를 만든다.

$$
q_i = \frac{\exp(t_i / T)}{\sum_j \exp(t_j / T)}, \qquad p_i = \frac{\exp(s_i / \tau)}{\sum_j \exp(s_j / \tau)}
$$

$$
L = \sum_{i=1}^{k} q_i \log \frac{q_i}{p_i}
$$

본문 예시는 $T = 1$, $\tau = 0.05$ 다. 이때 KL 값은 약 0.30 이고, student 의 τ 를 1 로 두면 약 0.78 이다.

# I) 관련 노트

- [[Bi-Encoder vs Cross-Encoder]]
- [[hard negative]]
- [[InfoNCE]]
- [[Re-ranking]]
- [[KL-Divergence]]
- [[softmax function]]
- [[label smoothing]]
- [[on-policy distillation]]
- [[GKD]]

# J) References

- [Distilling the Knowledge in a Neural Network (Hinton et al., 2015)](https://arxiv.org/abs/1503.02531)
- [Improving Efficient Neural Ranking Models with Cross-Architecture Knowledge Distillation (Hofstätter et al., 2020)](https://arxiv.org/abs/2010.02666)
- [RocketQA: An Optimized Training Approach to Dense Passage Retrieval for Open-Domain Question Answering (Qu et al., NAACL 2021)](https://arxiv.org/abs/2010.08191)
- [RocketQAv2: A Joint Training Method for Dense Passage Retrieval and Passage Re-ranking (Ren et al., EMNLP 2021)](https://arxiv.org/abs/2110.07367)
