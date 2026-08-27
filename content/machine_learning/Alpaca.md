
# 1. Alpaca ?

OpenAI InstructGPT(GPT3.5) 로 Instruct Set 52k 개 제작후, [[Llama]] 7B 모델을 full [[fine tuning]] 한 모델

단순히 말을 잇는 것이 아닌, Instruct 에 맞게 행동하는 LM: “모델은 이미 수많은 정보를 알고 있지만, 어떻게 말할지 모를 뿐”

# 2. KoAlpaca

한국어 Instruction set 을 제작하여 한국어 LM 인 Polyglot-ko 모델들을 기반으로 학습

언어 모델의 크기가 작아도, 좋은 파인튜닝 데이터로 새 능력을 넣어줄 수 있다.

Emergent. Vs Instruct-Tuning

100B 이상 크기의 LLM 에서 나타나는 Emergent  
 Emergent?  

* Few-shot, Zero-shot 에서 뛰어난 능력 발견  
* 꼭 100B 아니어도 60B 수준에서도 발견되기도 함

별도의 학습 없이 모델의 내재된 능력만으로도 작업이 가능 LLM 은 모든 상황에 대응하기 쉽지만…  
$\rightarrow$ 필요한 Use-case 에 대응하는 LM?  
$\rightarrow$ Target domain \& Task 를 이해하는 LM?

가성비 좋은 접근법

모델 크기가 커지면 성능이 좋아진다

어느 크기 수준의 LM 을 / 어느 수준의 데이터로 / 얼마를 들여서 학습할까?  
$\rightarrow \quad$ 현실적인 수준의 ‘ 가성비 ’ 옵션  
$\rightarrow$ 학습뿐 아니라 서비스 서빙도 고려해야 함

데이터 가성비

* Pretrain Dataset (> 1TB)
* Domain Dataset (> 10GB)
* Task Dataset (>5k sample)

학습 비용 가성비

Pretrained 학습 비용  

* Polyglot-Ko 5.8B
	* A100 256 대, 12 일  
	* \$32/h x 32 x 24 x 12 = 3.8 억원
* KoLLAMA 7B
	* TPUv4 64 대, 90 일
	* \$103/h x 24 x 90 = 2.89 억원
* KoLLAMA 13B
	* TPUV4-128, 90 일  
	* \$206/h x 24 x 90 = 5.8 억원

Finetuning 학습 비용

* Polyglot-Ko 5.8B
	* A100 80G 1 대, 12hrs  
	* \$36 = 약 5 만원
* Polyglot-Ko 12.8B
	* A100 80G 4 대, 12hrs
	* \$144 = 약 20 만원

서빙 비용 가성비

![](https://i.imgur.com/ztyKIMY.png)

얼마나 빠른 응답이 필요한지?

1. ms 단위 이하의 즉각적 응답 필요
	1. 상시 GPU 로 떠있는 서버가 필요
	2. BentoML, NVIDIA Triton, Text-generation-inference
2. 수 초 단위의 (지연된) 응답
	1. Serverless GPU 서비스 활용
	2. Cold start 이슈 발생: 3~10s 지연
	3. 서비스를 사용하지 않을때 (거의) 무과금
3. 배치성 작업
	1. 오늘 입력할때 내일 결과가 나와도 괜찮은 수준일 경우
	2. 메이저 클라우드 서비스의 spot instances
	3. 저렴한 GPU: Lambda Labs / Data Crunch / Vast.ai

Resaerch Agendas

여전히 한국어 능력은 거의 없음  
새로운 한국어 $\mathrm{LM} ?$  
Polyglot-Ko v2  
KoLLAMA  
KoRWKV: RWKV(RNN) 모델을 한국어로 학습중. 4000 토큰을 넘어 무한한 Context 를 목적으로 함

질 좋은 한국어 데이터셋, 그리고 컴퓨팅 파워  
→ “ 질 좋은 데이터란?”

* PLM 의 내부 지식과 충돌하지 않는 데이터
* 겹치지 않는 다양한 Instruct/Input

LIMA: 더 적고, 더 고품질의 데이터

1000 개 샘플로 SFT 를? \#LIMA (by META)  
$\rightarrow$ Alpaca(5 만개) 보다 훨씬 적은 1000 개  
$\rightarrow$ 사람의 큐레이션  
$\rightarrow \quad$ SFT 는 말하는 방향성 뿐  
$\rightarrow$ 원하는 수준/성향의 Output 을 알려주는 것  
$\rightarrow$ Pretrain(혹은 Domain Adaptation) 단계에서 들어간 데이터가 매우 중요함!

$\rightarrow$ 파인튜닝 방식은 크게 중요하지 않다.

QLoRa: 4bit LoRA

* 48GB GPU 로 65B LM 을 LoRA 튜닝 가능
* 모델은 4Bit Normal Float (NF4) 데이터 타입으로, 학습엔 BFloat16
* 최근 연구: 3/4 bit PEQA (from NAVER cloud team)

## 2.1. 버저닝

### 2.1.1. V1.0

* Alpaca 데이터셋을 deepL 번역으로 데이터 생성 & 학습
* 번역된 데이터를 기반으로 Output 을 ChatGPT API 로 생성, [[Batch Decoding]] 활용

### 2.1.2. V1.1 & v1.1a

* KoAlpaca 가 말을 너무 짧게하는 문제가 있었음 → 친절하게 답변하는 LM 을 만들자
* 네이버 지식인 데이터를 기반으로 질문 - 답변 데이터쌍 생성
	* 지식인의 “ 채택 ” 데이터는 Human Preference 일 것이다 라는 가정
	* But, 데이터에 노이즈가 너무 많음
* 지식인의 질문과 답변을 ChatGPT 에 입력으로 넣어서 rewrite 하도록 요청

### 2.1.3. v.1.1a

* 답변을 생성할때 단순히 rewrite 하는 것이 아니라, 질문과 노이즈한 답변에 기반하여 답변을 작성하도록 chatGPT 에게 요청 → 노이즈한 답변을 맥락으로 파악하고 답변 작성
* 기존의 할루시네이션 현상을 막을 수 있는 장점이 있음. 즉, 일종의 information extraction 능력이 향상되어, 좋은 검색 엔진만 붙인다면 좋은 답변 가능

## 2.2. 개발기

Reference: [[re:COMMIT] 명령어를 이해하는 오픈소스 언어 모델 ‘KoAlpaca’ 개발기 - 이준범 연구원 - YouTube](https://www.youtube.com/watch?v=7HbugcCBXwE&ab_channel=goorm%EB%AA%A8%EB%91%90%EA%B0%80%EA%B0%9C%EB%B0%9C%EC%9E%90%EA%B0%80%EB%90%9C%EB%8B%A4)

니즈: Pretrain → Domain Adaptation → Task Adaptation

### 2.2.1. 현실적 이슈

인력 (AI 개발자) / 예산 (비싼 GPU) / (충분한) 데이터 / 그 외 복합 이슈 (Privacy, Legal Issue)

### 2.2.2. 대안

1. LLM API 서비스 활용하기: ChatGPT, GPT-4, HyperClova
	1. 장점: 고성능 / 사용한 만큼 비용 부과 / 큰 모델을 곧바로 서비스 적용 가능 / AI 개발자 말고 기존 개발자도 이용 가능
	2. 단점: 서버 관리가 된다는 보장이 없음 / 서비스 유지가 의존적 / 매우 낮은 Quota (e.g. GPT-4 는 분당 200 건)
2. 작은 LM 만들기 (<1B): BERT, GPT-2
	1. 장점: 원하는 형태의 출력 가능 / 비싸지 않은 학습 비용 / CPU 등으로 서빙하면 비용 절감 가능
	2. 단점: 제한된 성능 / Task 별 파인튜닝용 데이터 구축 필요 / AI 개발 인력 필요 / LLM 보다 성능이 좋을지 알 수 없음 / 여전히 서빙에 대한 고려가 필요함
3. 적당한 LLM (< 100B 이내) 으로 서비스 만들기: LLAMA, Polyglot-ko 등
	1. 장점: GPT-4 급은 아니어도 어느 정도 나오는 성능 / 모델의 성능을 꾸준히 개선시킬 수 있음
	2. 단점: 도메인 관련 텍스트 데이터 필요 / AI 개발 인력 필요 / (GPU) 서빙에 대한 진지한 고려가 필요함

# 3. Related

# 4. References
