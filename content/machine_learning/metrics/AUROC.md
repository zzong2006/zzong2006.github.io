---
title: "AUROC"
tags:
  - metrics
  - machine_learning
aliases: []
---

# A) AUROC ?

Area Under the Receiver Operating Characteristic Curve

The AUROC score summarizes the [[ROC Curve|ROC]] curve into an single number that describes the performance of a model for multiple thresholds at the same time. Notably, an AUROC score of 1 is a perfect score and an AUROC score of 0.5 corresponds to random guessing.

종류: `'binary'`, `'multiclass'` or `multilabel`.

See the documentation of [`BinaryAUROC`](https://lightning.ai/docs/torchmetrics/stable/classification/auroc.html#torchmetrics.classification.BinaryAUROC "torchmetrics.classification.BinaryAUROC"), [`MulticlassAUROC`](https://lightning.ai/docs/torchmetrics/stable/classification/auroc.html#torchmetrics.classification.MulticlassAUROC "torchmetrics.classification.MulticlassAUROC") and [`MultilabelAUROC`](https://lightning.ai/docs/torchmetrics/stable/classification/auroc.html#torchmetrics.classification.MultilabelAUROC "torchmetrics.classification.MultilabelAUROC") for the specific details of each argument influence and examples.

## A.1) Multi-class

`[1, 0, 2]` 같이 여러 종류의 positive class 가 존재하는 케이스.

**Output**

멀티클래스의 경우, 각 클래스를 positive class 로 간주하고 나머지 모든 클래스를 negative class 로 처리하는 방식으로 metric 이 계산됩니다. 이를 one-vs-rest 접근법이라고 합니다. 현재 이 metric 은 one-vs-one 방식을 지원하지 않습니다. 기본적으로는 모든 클래스에 대한 평균값이 metric 으로 보고되지만, `average` 인자를 설정하여 이 동작을 변경할 수 있습니다.

## A.2) Multi-label

`[1, 0, 1]` 같이 positive label 이 여러개 있는 것.

# B) References

* [AUROC — PyTorch-Metrics 1.4.2 documentation](https://lightning.ai/docs/torchmetrics/stable/classification/auroc.html)
* [분류: ROC 및 AUC  |  Machine Learning  |  Google for Developers](https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc)
