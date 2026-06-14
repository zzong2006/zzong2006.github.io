---
title: "Subsampling Frequent words"
---

# A) Word2Vec 학습에서 자주 등장하는 단어 처리

Word2Vec 모델을 학습할 때, 관사 “the”와 같은 단어들은 문장에서 중요하지 않지만 빈도수가 많아 embedding layer 에서 자주 업데이트됩니다. 이로 인해 embedding 의 학습 시간은 증가하지만, embedding vector 의 정확도에는 큰 영향을 미치지 않습니다.

이 문제를 해결하기 위해 [[Subsampling Frequent words]] 방법을 사용합니다. 이 방법의 핵심은 Embedding matrix 를 학습할 때 단어들을 무작위로 제외시키는 것입니다. 특히 자주 등장하는 단어일수록 더 자주 제외시켜야 합니다.

단어별로 제외되는 확률은 다음과 같이 정의됩니다:

$$
\displaystyle P\left(w_{i}\right)=1-\sqrt{\frac{t}{f\left(w_{i}\right)}}
$$

여기서 $f\left(w_{i}\right)$ 는 각 단어 $w_{i}$ 가 [[corpus]] 에서 출현하는 횟수입니다. 즉, 자주 등장하는 단어일수록 확률값이 줄어들게 됩니다. 그리고 $t$ 는 parameter 값으로 $10^{−5}$ 을 추천합니다.
