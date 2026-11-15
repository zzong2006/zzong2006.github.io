---
title: "Attention"
tags:
  - NLP
  - deep_learning
  - LLM
  - transformer
aliases: ["attention", "self-attention", "self attention"]
---

"배가 아프다" 의 '배' 와 "배를 탔다" 의 '배' 는 같은 토큰이다. 그래도 모델이 다음 단어를 잘 고르려면 두 '배' 의 표현이 달라야 한다. 주변에 '아프다' 가 있는지 '탔다' 가 있는지를 보고 표현을 바꿔야 한다.

attention 은 이 일을 하는 연산이다. 각 토큰이 시퀀스의 다른 토큰들 중 어디를 얼마나 참고할지 정하고, 그 비율대로 다른 토큰의 정보를 섞어 새 표현을 만든다. 비율을 정해 섞는다는 점에서 가중 평균이고, 넓게 보면 [[pooling]] 의 한 종류다.

attention 은 번역 모델에서 처음 쓰였다. [[seq2seq]] 번역 모델은 입력 문장 전체를 고정 길이 벡터 하나로 압축해 넘겼는데, 문장이 길면 정보가 다 담기지 않았다. Bahdanau, Cho, Bengio (2014) 는 출력 단어를 하나 만들 때마다 입력의 모든 위치를 다시 보고, 관련 있는 위치에 더 큰 가중치를 주게 했다. [[transformer]] 는 여기서 RNN 을 빼고 attention 만으로 모델을 쌓았고, 지금의 LLM 은 모두 이 구조를 쓴다.

# A) Query, key, value

**attention 에는 역할이 다른 세 종류의 벡터가 들어간다.**

- **query**: 표현을 새로 만들려는 쪽이다. 이 토큰이 어떤 정보를 찾는지를 나타낸다.
- **key**: 참고 대상이 되는 쪽이다. 각 토큰이 어떤 정보를 갖고 있는지를 나타내고, query 와 내적해 관련도를 계산하는 데만 쓴다.
- **value**: 실제로 섞이는 내용이다. 관련도로 정한 비율만큼 가져간다.

key 와 value 를 나누는 이유는 관련도를 판단할 때 쓸 특징과 실제로 전달할 정보가 다를 수 있기 때문이다. transformer 에서는 세 벡터를 모두 같은 토큰의 hidden vector(그 층에 들어온 토큰 표현) $x$ 에서 서로 다른 학습 가중치로 만든다: $q = xW^Q$, $k = xW^K$, $v = xW^V$.

# B) Scaled dot-product attention

query 여러 개를 한꺼번에 계산하려고 벡터들을 행으로 쌓은 행렬 $Q, K, V$ 로 쓴다 (Vaswani et al., 2017).

$$
\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^{\top}}{\sqrt{d_k}}\right)V
$$

$Q$ 는 query $n$ 개를, $K$ 와 $V$ 는 key·value $m$ 개를 쌓은 행렬이다. $V$ 의 $i$ 번째 행은 $K$ 의 $i$ 번째 행과 같은 토큰에서 나온다. $d_k$ 는 query·key 벡터의 길이다. 계산은 네 단계다.

1. **관련도 점수**: $S = QK^\top$ 를 계산한다. $S_{ij}$ 는 query $i$ 와 key $j$ 의 내적이고, 클수록 둘이 관련 있다고 본다.
2. **스케일링**: $S$ 를 $\sqrt{d_k}$ 로 나눈다. 이유는 아래 따로 본다.
3. **가중치**: 행마다 softmax 를 적용해 가중치 행렬 $A$ 를 얻는다. 각 행은 0 이상이고 합이 1 이다.
4. **가중 평균**: $O = AV$ 를 계산한다. 출력의 $i$ 번째 행은 value 들을 $A$ 의 $i$ 번째 행 비율로 더한 값이다.

관련도를 내적 대신 작은 [[multilayer perceptrons|MLP]] 로 계산하는 방식도 있다. Bahdanau 의 방식이 이것이고 additive attention 이라 부른다. 내적 방식은 행렬곱 한 번으로 끝나서 더 빠르기 때문에 transformer 가 이쪽을 택했다.

# C) Step by Step 예시

토큰 3 개, 벡터 길이 2 인 작은 예를 손으로 따라가 본다. 숫자는 설명용으로 고른 값이다.

$$
Q = K = \begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{bmatrix}, \qquad
V = \begin{bmatrix} 1 & 0 \\ 0 & 2 \\ 3 & 3 \end{bmatrix}
$$

행 하나가 토큰 하나다. 토큰 1 의 query $[1, 0]$ 을 세 key 와 내적하면 $[1, 0, 1]$ 이 나온다. 같은 계산을 세 query 에 모두 하고 $\sqrt{2} \approx 1.414$ 로 나누면 다음과 같다.

$$
S = QK^\top = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{bmatrix}, \qquad
\frac{S}{\sqrt{2}} = \begin{bmatrix} 0.707 & 0 & 0.707 \\ 0 & 0.707 & 0.707 \\ 0.707 & 0.707 & 1.414 \end{bmatrix}
$$

행마다 softmax 를 적용한다. 첫 행은 $e^{0.707} \approx 2.03$, $e^{0} = 1$ 이므로 가중치가 $2.03 : 1 : 2.03$ 을 합 1 로 맞춘 $[0.401, 0.198, 0.401]$ 이 된다.

$$
A = \begin{bmatrix} 0.401 & 0.198 & 0.401 \\ 0.198 & 0.401 & 0.401 \\ 0.248 & 0.248 & 0.503 \end{bmatrix}, \qquad
O = AV = \begin{bmatrix} 1.604 & 1.599 \\ 1.401 & 2.006 \\ 1.759 & 2.007 \end{bmatrix}
$$

토큰 1 의 출력은 $0.401 \times [1, 0] + 0.198 \times [0, 2] + 0.401 \times [3, 3] = [1.604, 1.599]$ 다. 토큰 1 의 query 와 내적이 큰 토큰 1, 3 의 value 가 40% 씩, 내적이 0 인 토큰 2 의 value 가 20% 섞였다. 토큰 3 은 자기 key 와의 내적이 2 로 가장 커서 자기 value 를 절반 가까이(0.503) 가져온다.

![[img-eab0541d86.png]]

같은 계산을 value 벡터가 놓인 평면에 그리면 위와 같다. 보라색 점 세 개가 value $v_1, v_2, v_3$ 이고, 빨간 선 위의 숫자가 토큰 1 이 각 value 에 준 가중치다.

**attention 의 출력은 항상 value 들이 만드는 삼각형 안의 한 점이다.**

- 가중치가 0 이상이고 합이 1 이므로 출력은 value 들의 가중 평균이다.
- 토큰 1 의 출력은 $v_1$ 과 $v_3$ 쪽으로 같은 비율(0.401)로, $v_2$ 쪽으로는 덜(0.198) 끌려간다.
- 삼각형 안의 어느 점을 고를지는 query 와 key 의 내적이 정한다.

# D) √d_k 로 나누는 이유

**벡터가 길수록 내적값의 폭이 커져서, 나누지 않으면 softmax 가 한 칸에 몰린다.**

- query 와 key 의 원소가 평균 0, 분산 1 인 독립 확률변수라면 내적은 원소 $d_k$ 개 곱의 합이라 분산이 $d_k$ 다 (Vaswani et al., 2017). 표준편차가 $\sqrt{d_k}$ 로 커진다.
- 무작위 벡터 쌍 10,000 개로 측정하면 $d_k = 64$ 에서 표준편차 8.08, $d_k = 512$ 에서 22.5 로 $\sqrt{d_k}$ (8.0, 22.6) 와 거의 같다.

**한 칸에 몰린 softmax 는 학습 신호를 거의 전달하지 못한다.**

- 지금 LLM 에서 흔한 $d_k = 128$ 이면 내적의 표준편차가 약 11.3 이다.
- 점수가 $[11.3, 0, -11.3]$ 이면 softmax 는 $[0.99999, 0.00001, 0.0000000002]$ 다. 가장 큰 가중치를 자기 점수로 미분한 값이 약 0.00001 이라 기울기가 거의 0 이다.
- $\sqrt{d_k}$ 로 나눠 점수를 $[1, 0, -1]$ 로 줄이면 가중치는 $[0.665, 0.245, 0.090]$, 같은 기울기는 0.22 다.

# E) LLM 안의 self-attention

앞의 식은 attention 한 번이다. LLM 은 여기에 네 가지를 더한다. query·key·value 를 같은 시퀀스에서 만들고, 뒤에 오는 토큰을 가리고, 여러 개를 나란히 돌리고, 위치 정보를 넣는다.

## E.1) Self-attention

**번역 모델의 attention 은 두 시퀀스를 이었지만, self-attention 은 한 시퀀스 안의 토큰들이 서로를 참고한다.**

- 번역 모델은 query 를 출력 문장에서, key·value 를 입력 문장에서 가져왔다. 이것을 cross-attention 이라 한다.
- self-attention 은 그 층에 들어온 토큰 hidden vector 들을 쌓은 행렬 $X$ 하나에서 $Q = XW^Q$, $K = XW^K$, $V = XW^V$ 를 모두 만든다.

![[img-c76cafc344.png|340]]

"The animal didn't cross the street because it was too tired" 에서 'it' 이 무엇을 가리키는지는 다른 단어를 봐야 안다. 위 그림은 학습된 transformer 의 한 층에서 'it'(오른쪽)이 각 단어(왼쪽)에 준 가중치를 선의 진하기로 그린 것이다. 'animal' 이 가장 진하므로, 이 층을 지난 'it' 의 표현에는 'animal' 의 value 가 가장 많이 섞인다.

인코더만 쓰는 [[Bidirectional Encoder Representations from Transformers|BERT]] 는 모든 토큰이 모든 토큰을 본다. [[GPT]] 계열처럼 다음 토큰을 예측하는 LLM 은 여기에 다음 제약을 건다.

## E.2) Causal mask

**LLM 은 학습할 때 각 토큰이 자기보다 뒤의 토큰을 보지 못하게 가린다.**

- LLM 은 "앞 토큰들을 보고 다음 토큰을 맞히는" 문제로 학습하고, 문장 전체가 있으므로 모든 위치의 예측을 한 번에 계산한다.
- 이때 토큰 $i$ 가 뒤의 토큰을 볼 수 있으면 맞힐 답이 입력에 들어 있는 셈이다.
- 그래서 softmax 전에 그 자리의 점수에 $-\infty$ 를 더한다. $e^{-\infty} = 0$ 이라 가려진 칸의 가중치는 정확히 0 이 된다.

$$
A = \operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}} + M\right), \qquad
M_{ij} = \begin{cases} 0 & j \le i \\ -\infty & j > i \end{cases}
$$

![[img-e481315063.png]]

앞의 토큰 세 개 예에 마스크를 씌우면 가중치가 위 오른쪽처럼 바뀐다. 행 하나가 query 하나의 가중치이고, 빗금 친 칸이 가린 자리다. 남은 칸끼리 softmax 를 다시 하므로 합 1 을 나눠 갖는다.

- 토큰 1 은 자기 자신만 볼 수 있어서 출력이 자기 value $[1, 0]$ 그대로다.
- 토큰 2 는 점수 $[0, 0.707]$ 두 칸만 남아 가중치가 $[0.330, 0.670]$, 출력이 $[0.330, 1.340]$ 이 된다.
- 토큰 3 은 원래 모든 토큰을 볼 수 있는 마지막 위치라 결과가 마스크 전과 같다.

**뒤에 토큰이 붙어도 앞 토큰들의 출력은 바뀌지 않는다.** 토큰 $i$ 의 출력은 $1, \dots, i$ 번째 토큰에만 의존하기 때문이다. 토큰을 하나씩 생성할 때 쓰는 KV cache 가 이 성질 위에 서 있다.

## E.3) Multi-head attention

**softmax 한 번은 query 하나당 가중치 분포 하나만 만들므로, attention 을 여러 개 나란히 돌린다.**

- 한 토큰이 문법상 주어와 앞 문장의 지시 대상을 동시에 참고해야 한다고 하자. 분포 하나로 두 토큰에 가중치를 나눠 주면 두 value 가 한 벡터로 평균되어 각각의 정보가 흐려진다.
- multi-head attention 은 $W^Q, W^K, W^V$ 를 $h$ 벌 두고 attention 을 $h$ 번 따로 계산한 뒤, 결과를 이어 붙여 $W^O$ 로 다시 섞는다.

$$
\begin{aligned}
\text{head}_i &= \operatorname{Attention}\left(XW_i^Q,\ XW_i^K,\ XW_i^V\right) \\
\operatorname{MultiHead}(X) &= \operatorname{Concat}\left(\text{head}_1, \dots, \text{head}_h\right) W^O
\end{aligned}
$$

- head 하나의 벡터 길이 $d_h$ 를 hidden vector 길이 $d_{\text{model}}$ 의 $h$ 분의 1 로 줄이므로, 전체 연산량은 head 하나짜리와 비슷하다. 원 transformer 는 $d_{\text{model}} = 512$, $h = 8$, $d_h = 64$ 를 썼다.
- head 마다 key·value 가 따로 있다. 그래서 생성할 때 저장하는 KV cache 크기가 head 수에 비례하고, 이것을 줄이는 기법(MQA·GQA·MLA)이 나왔다 ([[Attention 최적화 기법]]).

## E.4) 위치 정보

**attention 식에는 토큰의 위치가 들어갈 자리가 없어서, 위치 정보를 따로 넣는다.**

- 마스크가 없을 때 입력 토큰의 순서를 바꾸면 출력도 같은 순서로 바뀔 뿐 값은 같다. "나는 밥을 먹었다" 와 "밥은 나를 먹었다" 를 구분하지 못한다.
- 입력 임베딩에 위치 벡터를 더하는 방식, attention 점수에 거리에 따른 값을 더하는 방식, query·key 를 위치만큼 회전시키는 방식이 있다 ([[Positional Encoding]]).
- 지금의 LLM 은 대부분 회전 방식인 [[Rotary Positional Embedding|RoPE]] 를 쓴다 (Su et al., 2021). 두 벡터를 각자 자기 위치만큼 돌린 뒤 내적하면, 결과가 두 토큰의 거리에만 의존한다.
- key 는 자기 위치만 보고 한 번 돌려 저장하면 되므로, 뒤에 토큰이 붙어도 다시 계산할 필요가 없다.

# F) 시퀀스 길이의 제곱으로 느는 비용

**토큰 하나가 모든 토큰과 내적하므로, 점수 행렬은 head 마다 층마다 $L \times L$ 칸이다.**

- $L$ 은 시퀀스의 토큰 수다. 길이가 2 배면 점수 행렬은 4 배다.
- $Q, K, V$ 를 만드는 행렬곱(projection)은 $L$ 에 비례한다. 둘의 연산량 비는 $L / (2 d_{\text{model}})$ 이다 (식은 부록).
- $d_{\text{model}} = 4096$ 인 모델이면 8K 토큰에서 둘이 같아지고, 128K 토큰에서는 attention 행렬 계산이 projection 의 16 배다.

![[img-4a60496d83.png]]

위 그래프는 $d_{\text{model}} = 4096$ 에서 두 연산량을 길이별로 계산한 것이다. 두 축이 모두 로그라서 $L$ 에 비례하는 projection 은 기울기 1, $L^2$ 에 비례하는 attention 행렬 계산은 기울기 2 의 직선이 된다. 짧은 시퀀스에서는 projection 이 대부분이고, 8K 에서 두 선이 만난 뒤로는 attention 쪽이 빠르게 커진다.

**메모리도 길이의 제곱으로 는다.**

- 식을 그대로 구현하면 점수 행렬을 GPU 메모리에 통째로 만든다.
- head 32 개, 8K 토큰, 원소당 2 바이트면 한 층의 점수 행렬만 4 GiB 다. 학습 때는 역전파를 위해 이것을 보관해야 한다.
- 계산 결과는 같게 두고 이 행렬을 메모리에 만들지 않는 방법이 FlashAttention 이다 ([[Attention 최적화 기법]]).

## F.1) 긴 문서를 대량으로 인코딩할 때

문서 1 억 개를 임베딩 모델로 벡터로 바꾼다고 하자. 대부분 500 토큰 남짓이지만 가끔 8,192 토큰짜리가 섞여 있다.

**GPU 는 배치를 직사각형 텐서로 계산하므로, 짧은 문서도 배치에서 가장 긴 문서 길이까지 padding 된다.**

- padding 토큰은 attention mask 로 가려도 계산은 그대로 한다. mask 는 결과에서 빼 줄 뿐이다.
- 512 토큰 문서 31 개와 8,192 토큰 문서 1 개를 한 배치에 넣으면 실제 토큰은 24,064 개인데, 계산은 32 × 8,192 = 262,144 토큰만큼 한다. projection 연산이 약 11 배로 늘어난다.
- attention 행렬은 길이의 제곱이라 차이가 더 크다. 실제로는 약 7,500 만 칸인데 padding 후에는 약 21 억 칸, 29 배쯤 된다.

**길이가 비슷한 문서끼리 묶고, 배치 크기를 문서 수가 아니라 토큰 수로 정한다.**

- 문서를 길이순으로 정렬하거나 길이 구간별로 나눠(bucketing) 배치를 만들면 padding 이 거의 사라진다.
- 배치마다 "문서 수 × 그 배치의 최대 길이" 가 정해 둔 토큰 예산을 넘지 않게 문서 수를 정한다. 짧은 구간은 수백 개씩, 8K 구간은 몇 개씩 묶인다.
- 문서 수를 고정하면 긴 구간에서는 메모리가 넘치고, 짧은 구간에서는 GPU 가 논다.
- 정렬하면 순서가 바뀌므로 문서 id 를 함께 들고 다니며 결과를 원래 문서에 붙인다.

**길이가 8 배면 attention 행렬 계산은 64 배다.**

- $d_{\text{model}} = 1024$ 인 임베딩 인코더라면 2K 토큰에서 이미 attention 행렬 계산이 projection 만큼 커지고, 8K 에서는 4 배다.
- 그래서 수가 적은 긴 문서가 GPU 시간의 상당 부분을 쓴다. 긴 문서를 잘라 낼지, 여러 조각으로 나눠 인코딩할지를 이 비용과 함께 정한다.

padding 을 아예 만들지 않는 방법도 있다. 배치의 문서를 한 줄로 이어 붙이고 문서 경계 위치만 넘겨, attention 이 각 문서 안에서만 계산되게 한다. FlashAttention 의 가변 길이(varlen) 함수가 이 방식이다.

# G) 토큰을 하나씩 생성할 때: KV cache

**생성할 때는 다음 토큰을 모르므로, 토큰 하나를 만들어 입력 끝에 붙이고 모델을 다시 돌리기를 반복한다.**

- 앞 토큰들의 key·value 는 뒤에 토큰이 붙어도 바뀌지 않는다. 그래서 한 번 계산한 key·value 를 층마다 GPU 메모리에 저장해 두고, 새 토큰 하나의 query·key·value 만 계산한다. 이 저장소가 [[KV Cache]] 다.
- prompt 전체를 한 번에 넣어 캐시를 채우는 단계를 prefill, 새 토큰 하나씩 만드는 단계를 decode 라고 한다 ([[Prefill]]).

**캐시는 토큰 수에 비례해 커지고, decode 는 이 캐시를 읽는 속도에 묶인다.**

- Llama 3 8B 는 토큰 하나에 캐시 128 KiB 를 쓴다. 8K 토큰 요청 16 개면 16 GiB 로 모델 가중치와 맞먹는다. 계산 과정은 [[KV Cache]] 노트에 있다.
- decode 는 토큰 하나를 만들 때마다 캐시 전체를 읽지만 계산할 양은 적다. 그래서 GPU 연산 속도가 아니라 메모리를 읽는 속도가 병목이다.

# H) 비용을 줄이는 기법

attention 의 비용은 연산량, 메모리를 오가는 바이트 수, KV cache 크기 세 가지로 나눠 볼 수 있다. 무엇을 줄이느냐에 따라 기법이 나뉜다.

- key·value head 를 나눠 쓰거나 압축한다: MQA, GQA, MLA
- 같은 계산을 메모리 왕복을 줄여서 한다: FlashAttention
- 캐시를 담는 방식을 바꾼다: PagedAttention, KV cache 양자화
- 보는 토큰 수를 줄인다: sliding window, NSA, DSA
- softmax attention 을 다른 연산으로 바꾼다: linear attention, hybrid

기법별 원리와 측정값은 [[Attention 최적화 기법]] 에 있다.

# 부록: 연산량 식

곱셈 한 번과 덧셈 한 번을 합쳐 2 FLOPs 로 센다. head 수 $h$ 와 head 길이 $d_h$ 를 곱하면 $d_{\text{model}}$ 이다.

$$
\begin{aligned}
\text{FLOPs}_{\text{proj}} &\approx 4 \times 2 L d_{\text{model}}^2 = 8 L d_{\text{model}}^2 \\
\text{FLOPs}_{\text{attn}} &\approx 2 \times 2 L^2 d_h \times h = 4 L^2 d_{\text{model}}
\end{aligned}
$$

- 첫 줄은 $Q, K, V$ 를 만들고 출력에 $W^O$ 를 곱하는 행렬곱 네 번이다.
- 둘째 줄은 head 마다 $QK^\top$ 와 $AV$ 를 계산하는 연산이다.
- 두 식의 비가 $L / (2 d_{\text{model}})$ 이다. $d_{\text{model}} = 4096$, $L = 8192$ 면 1 이다.
- causal mask 를 쓰면 절반의 칸은 계산할 필요가 없지만 여전히 $L^2$ 에 비례한다. key·value head 를 줄인 GQA 모델은 $K, V$ projection 이 작아서 위 식이 근사다.

# References

- Bahdanau, Cho, Bengio, 2014, [Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473)
- Vaswani et al., 2017, [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — 리뷰는 [[Attention Is All You Need]]
- Su et al., 2021, [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- Llama Team, Meta, 2024, [The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783) — Table 3 의 모델 설정
- [Visualizing A Neural Machine Translation Model (Mechanics of Seq2seq Models With Attention)](https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/)
- 딥 러닝을 이용한 자연어 처리 입문, [어텐션 메커니즘](https://wikidocs.net/22893), [트랜스포머](https://wikidocs.net/31379)
