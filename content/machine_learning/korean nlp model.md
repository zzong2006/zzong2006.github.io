---
tags: ["NLP"]
---

# Korean Nlp Model ?

한국어 자연어 처리에 대한 모델을 정리한다.

# KcELECTRA

공개된 한국어 Transformer 계열 모델들은 대부분 한국어 위키, 뉴스 기사, 책 등 잘 정제된 데이터를 기반으로 학습한 모델입니다. 한편, 실제로 NSMC 와 같은 User-Generated Noisy text domain 데이터셋은 정제되지 않았고 구어체 특징에 신조어가 많으며, 오탈자 등 공식적인 글쓰기에서 나타나지 않는 표현들이 빈번하게 등장합니다.

KcELECTRA 는 위와 같은 특성의 데이터셋에 적용하기 위해, 온라인 뉴스에서 댓글과 대댓글을 수집해, 토크나이저와 ELECTRA 모델을 처음부터 학습한 Pretrained ELECTRA 모델입니다.

기존 KcBERT 대비 데이터셋 증가 및 vocab 확장을 통해 상당한 수준으로 성능이 향상되었습니다.

KcELECTRA 는 Huggingface 의 Transformers 라이브러리를 통해 간편히 불러와 사용할 수 있습니다. (별도의 파일 다운로드가 필요하지 않습니다.)

[GitHub - Beomi/KcELECTRA: 🤗 Korean Comments ELECTRA: 한국어 댓글로 학습한 ELECTRA 모델](https://github.com/Beomi/KcELECTRA)

# References
