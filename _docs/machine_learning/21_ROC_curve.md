---
layout: default
title:  "ROC and AUC curve"
category: Machine Learning
order: 19
---

출처: https://angeloyeo.github.io/2020/08/05/ROC.html

---

## ROC

ROC(Receiver Operating Characteristic) curve는 binary classification의 모델의 성능을 표현하기 위한 curve이다.

ROC curve를 한 마디로 이야기하자면 ROC 커브는 좌상단에 붙어있는 커브가 더 좋은 분류기를 의미한다고 생각할 수 있다.

<img src="https://i.loli.net/2020/11/05/zCOZHVBKhbeW5Dx.png" alt="img" style="zoom: 50%;" />

* TPR은 True Positive Rate, 그리고 FPR은 False Positive Rate를 의미한다.

### True Positive Rate와 False Positive Rate의 관계

일반적으로 binary 분류기는 출력 값이 threshold 이상인 경우를 positive, 이하일 경우 negative로 결정한다.

만약 true positive rate (TPR)이 높다면, 어떤 값이든 다 positive로 선택하려고 할 것이기 때문에 **낮은 threshold**를 의미한다.

* TPR은 sensitivity 로 표현된다. 
* 즉,  TPR이 1에 가까울수록 positive를 잘 구별한다.

또한, false positive rate(FPR)도 동시에 높아지게 되는데, 그 이유는 threshold를 너무 낮춰버리면 negative example도 positive로 판정하기 때문이다. 

* FPR은 (1 - specificity) 으로 표현된다.
* 즉, FPR이 0에 가까울수록 negative를 잘 구별한다.

당연하게도, 높은 threshold는 TPR과 FPR을 동시에 낮춘다.

결과적으로, threshold가 변함에 따라서 False Positive Rate(FPR)과 True Positive Rate(TPR)의 어느정도는 비례적으로 값이 바뀐다는 것을 알 수 있다.

### Curve위의 한 점이 의미하는 것은 무엇인가?

![img](https://i.loli.net/2020/11/05/qseSzhDQVRbT8Zw.gif)

* 빨간색 pdf는 true positive, 파란색 pdf는 true negative example의 분포를 의미한다.
* 왼쪽 그래프의 $x$ 는 threshold를 의미한다.

Curve 위의 점은 특정 threshold에 대한, FPR과 TPR의 비율을 의미한다. 

즉, ROC Curve는 가능한 모든 threshold에 대한 FPR와 TPR의 비율을 표시한 것이다.

### Curve의 휨 정도가 의미하는 것은 무엇인가?

positive와 negative 클래스를 더 잘 구별할 수 있다면 ROC 커브는 좌상단에 더 가까워지게 된다.

![img](https://i.loli.net/2020/11/05/mJXUncZlaSg2wdt.gif)

## AUC (Area Under the Curve)

AUC는 ROC  곡선 아래의 영역을 의미한다. 즉, AUC가 높다는 사실은 클래스를 구별하는 모델의 성능이 휼륭하다는 것을 의미한다.

위 그림에서 두 class 분포가 완전히 겹칠 경우, ROC 곡선이 선형이 되면서 AUC 값이 0.5가 되는데, 이 경우 해당 모델은 이진 분류기의 능력을 완전히 상실했다는 의미가 된다.

반대로, AUC 값이 1에 가까울수록, 높은 성능을 보이는 것이라 생각할 수 있다.