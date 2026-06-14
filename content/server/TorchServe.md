---
title: "TorchServe"
tags: ["inference", "server"]
---

직렬화된 모델을 `torch-model-archiver` 를 통해 MAR 파일 형태로 저장할 수 있습니다.

예시

```bash
torch-model-archiver --model-name densenet161 --version 1.0 --model-file ./serve/examples/image_classifier/densenet_161/model.py --serialized-file densenet161-8d451a50.pth --export-path model_store --extra-files ./serve/examples/image_classifier/index_to_name.json --handler image_classifier
```

# A) Related

# B) References
