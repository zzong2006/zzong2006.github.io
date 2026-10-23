---
title: "youtube 영상 올리기"
---
# A) History

* comfyUI workflow 셋팅이 필요하다

# B) 후보 모델들

* Mochi 1: [genmo/mochi-1-preview · Hugging Face](https://huggingface.co/genmo/mochi-1-preview)
* HunyuanVideo
* LTX Video: [GitHub - Lightricks/LTX-Video: Official repository for LTX-Video](https://github.com/Lightricks/LTX-Video)

# C) EasyAnimate

[GitHub - aigc-apps/EasyAnimate: 📺 An End-to-End Solution for High-Resolution and Long Video Generation Based on Transformer Diffusion](https://github.com/aigc-apps/EasyAnimate)

내가 본것중에 가장 좋은 img2vid 생성 능력을 보임. 다만 문제는 single gpu 만 처리가 가능하다는 점.

xid 를 사용하면 parallel 추론이 가능하다고 한다: [GitHub - xdit-project/xDiT: xDiT: A Scalable Inference Engine for Diffusion Transformers (DiTs) with Massive Parallelism](https://github.com/xdit-project/xDiT)

그리고 파인튜닝도 지원하는 것 같은데, 판다 동영상을 엄청 튜닝시키면 어떨까 싶음..?

# D) Mochi

I’ve shared a couple ComfyUI workflows, if it helps. Just drag and drop the JSON file on ComfyUI, and it’ll load the workflow, then just install missing nodes in ComfyUI-Manager, and download the missing models:

txt2vid - [https://gist.github.com/Jonseed/7ba98d34ef7684c25b73923f5578a844](https://gist.github.com/Jonseed/7ba98d34ef7684c25b73923f5578a844)  
img2vid - [https://gist.github.com/Jonseed/d2630cc9598055bfff482ae99c2e3fb9](https://gist.github.com/Jonseed/d2630cc9598055bfff482ae99c2e3fb9)

생각보다 너무 별로라서 스킵

## D.1) (망한) 예시

![|280](https://i.imgur.com/2g2N6Ju.png)

이런 이미지가 영상으로 바꿨더니 아래처럼 변했다.

![|280](https://i.imgur.com/jpnz1Pw.jpeg)

# E) ComfyUI

## E.1) CLIP - T5 Encoder

clip 쪽에 구글의 t5 인코더를 사용할 수 있다.

Repos

* [mcmonkey/google\_t5-v1\_1-xxl\_encoderonly · Hugging Face](https://huggingface.co/mcmonkey/google_t5-v1_1-xxl_encoderonly)
* [comfyanonymous/flux\_text\_encoders · Hugging Face](https://huggingface.co/comfyanonymous/flux_text_encoders)

## E.2) Wrapper 설치방법

`comfyUI/custom-node` 디렉토리에 wrapper 레포를 클론해주면 된다.

(참고) wrapper: [GitHub - kijai/ComfyUI-MochiWrapper](https://github.com/kijai/ComfyUI-MochiWrapper)

## E.3) Error Handling

Error msg: `Broken pipe - Unrecognized option 'crf'`

```bash
root@e37df084e7a1:/stable-diffusion# rm /opt/conda/bin/ffmpeg
root@e37df084e7a1:/stable-diffusion# ln -s /bin/ffmpeg /opt/conda/bin/ffmpeg
```

# F) HunyuanVideo

Text-To-Video

[GitHub - Tencent/HunyuanVideo: HunyuanVideo: A Systematic Framework For Large Video Generation Model](https://github.com/Tencent/HunyuanVideo)

```bash
# 1. Create conda environment
conda create -n HunyuanVideo python==3.10.9

# 2. Activate the environment
conda activate HunyuanVideo

conda install pytorch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 pytorch-cuda=12.1 -c pytorch -c nvidia

python -m pip install -r requirements.txt

# 5. Install flash attention v2 for acceleration (requires CUDA 11.8 or above)
python -m pip install ninja
python -m pip install git+https://github.com/Dao-AILab/flash-attention.git@v2.6.3

# 6. Install xDiT for parallel inference (It is recommended to use torch 2.4.0 and flash-attn 2.6.3)
python -m pip install xfuser==0.4.0
```

일반적인 text 2 video 모델이라 규칙적인 비디오 구성이 가능할지 의문이다.

## F.1) 서버 띄우기

(참고) 서버를 띄우기전에 필요한 모델들을 받아놔야 한다.

* video 모델 1 개 (약 25 기가)
* text encoder 2 개

```bash
SERVER_NAME=0.0.0.0 SERVER_PORT=5881 python3 gradio_server.py --flow-reverse
```

## F.2) 기본 셋팅?

비디오 생성을 시도했더니 다음과 같이 진행된다.

```
height: 720
width: 1280
video_length: 129
prompt: ['A cat walks on the grass, realistic style.']
neg_prompt: ['Aerial view, aerial view, overexposed, low quality, deformation, a poor composition, bad hands, bad teeth, bad eyes, bad limbs, distortion']
seed: None
infer_steps: 50
num_videos_per_prompt: 1
guidance_scale: 1
n_tokens: 118800
flow_shift: 7
embedded_guidance_scale: 6
```

## F.3) 생성 기록

**실패 기록 (1)**
* A100 80gb 8ea 로 위 기본 셋팅을 시도했더니 OOM 이슈로 터져버렸다.
* 만드는데도 거의 8 분 정도 걸렸음

낮은 resolution 을 시도해볼 필요가 있음.

아래는 시도 가능한 셋팅인데, 여기서 YouTube short 비율에 적합한 960:544 로 설정했다.

![](https://i.imgur.com/oy8Q54p.png)

Gpu 6 개로 만들게 시키니까 대략 4 분 정도 걸리는데, GPU 나머지 2 개가 놀고 있는것 같아서, 그냥 4 개 짜리로 시도하는것이 좋겠다.

**성공 기록 (1)**
* 960x544 는 성공적으로 만들어진다. 쇼츠 모양도 세로로 딱 맞는것 같음.
* 다만 애니메이션 스타일로 만들어지는데, 원하는 모습이 아니라 프롬프트 수정이 필요한 상황
* 하지만 프롬프트가 바뀔때마다 대략 4 분정도 생성 시간이 걸리는데, 요걸 보완하려면 배치 처리가 필요해보임.

----

## F.4) Comfy-UI Version

[GitHub - kijai/ComfyUI-HunyuanVideoWrapper](https://github.com/kijai/ComfyUI-HunyuanVideoWrapper)

# G) 문제점

* 아직 이전 판다랑 다음 판다랑 어떻게 비슷하게 나오게 할까

# H) 프롬프팅

LLM 한테 이미지 주고 비디오 생성용 프롬프트 작성하게끔 유도할 수 있겠다.

```
Analyze the given image and generate a detailed video prompt by: describing the main subject or action; detailing the setting and background; noting significant visual elements, colors, and textures; including information about lighting, time of day, or weather conditions if relevant; mentioning any movement, progression, or change in the scene; describing the mood or atmosphere; including sensory details beyond visual elements when appropriate; using vivid, descriptive language; maintaining a neutral tone without subjective interpretations; keeping the description under 256 tokens for clarity and conciseness; structure the output as follows: [Main subject/action]. [Setting and background details]. [Visual elements, colors, textures]. [Lighting, time, weather]. [Movement or progression]. [Mood/atmosphere]. [Additional sensory details if applicable].
```

# I) 서브로 배울점들

## I.1) 설치 패키지 - `uv`

poetry 같은 패키지 설치

```bash
git clone https://github.com/genmoai/models
cd models 
pip install uv
uv venv .venv
source .venv/bin/activate
uv pip install setuptools
uv pip install -e .[flash] --no-build-isolation
```
