---
tags: ["SIGIR", "paper_review"]
---

# A) Accepted Papers

[SIGIR 2025, Padua, 13-18 July \| Accepted Papers](https://sigir2025.dei.unipd.it/accepted-papers.html)

# B) Bloomberg의 AI 정보 검색 연구 발표 (SIGIR 2025)

[Bloomberg's AI Engineers Publish 3 Information Retrieval Research Papers at SIGIR 2025 \| Bloomberg LP](https://www.bloomberg.com/company/stories/bloomberg-ai-engineers-publish-3-information-retrieval-research-papers-sigir-2025/)

[**Benchmark Granularity and Model Robustness for Image-Text Retrieval: A Reproducibility Study**](https://dl.acm.org/doi/10.1145/3726302.3730290)

- **연구 주제**: 이미지와 텍스트를 연결하는 AI 모델이 실제 사용자 환경에서 어떻게 성능을 발휘하는지 평가함
- **주요 결과**:
	- 검색 쿼리에 더 세부적인 설명을 추가하면 정확도가 최대 16%까지 향상됨
	- 오타가 있거나, 단어의 순서가 바뀌는 경우 검색 품질이 크게 저하됨
	- 단어 순서가 검색 결과에 미치는 영향이 기존에 생각했던 것보다 훨씬 크다는 점을 확인함
- **주요 기여**: 실제 환경에 가까운 테스트 프레임워크를 구축하여, AI 기반 검색 시스템의 신뢰성과 정확성을 높이는 데 기여함

[**An Alternative to FLOPS Regularization to Effectively Productionize SPLADE-Doc**](https://dl.acm.org/doi/10.1145/3726302.3730163)

연구에서는 SPLADE-Doc 모델의 검색 속도를 획기적으로 개선하기 위해 기존의 FLOPS 정규화 기법 대신 새로운 DF-FLOPS 방식을 도입하였습니다. 이 접근을 통해 검색 속도가 약 10배 빨라졌으며, 성능 저하 없이 실제 서비스 환경에서도 사용할 수 있을 만큼 효율성이 높아졌습니다. 또한, 불필요하게 자주 등장하는 고빈도 단어를 효과적으로 제거함으로써 인덱스의 효율성도 크게 향상되었습니다.
