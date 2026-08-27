---
tags: ["python"]
---

# 1. Python Packaging ?

## 1.1. 파이썬 패키징을 사용하는 이유

1. 프로젝트 간 코드를 재사용하기 위해
2. 코드의 유지보수를 쉽게하기 위해
   패키징은 코드에 대한 문서화나 조직화를 요구하기 때문에 이후에도 쉽게 코드를 이해할 수 있다.
3. 다른사람들에게 내 코드를 공유하기 위해

# 2. Python Directory Structure

패키징을 하기전에 적절한 폴더 구조를 구성해야 한다. python 는 다음과 같은 일부 특정 폴더로 구성되어 있다.

1. 패키지 이름을 가진 root directory
2. Source codes: root directory 의 subdirectory 에 (`.py` 확장자를 지닌) 한개 이상의 모듈
3. Build instructions: 어떻게 패키지를 설치 및 빌드하는지에 대한 설명서
4. Documentation: root directory 내 README 파일과 `docs` 라는 이름의 subdirectory 에 있는 docmentations
5. Package test: 테스트를 위한 `tests` 라는 subdirectory

## 2.1. 예시: `Pycounts`

```bash
pycounts
├── .readthedocs.yml           ┐
├── CHANGELOG.md               │
├── CONDUCT.md                 │
├── CONTRIBUTING.md            │
├── docs                       │
│   ├── changelog.md           │
│   ├── conduct.md             │
│   ├── conf.py                │ 
│   ├── contributing.md        │ Package documentation
│   ├── example.ipynb          │
│   ├── index.md               │
│   ├── make.bat               │
│   ├── Makefile               │
│   └── requirements.txt       │
├── LICENSE                    │
├── README.md                  ┘
├── pyproject.toml             ┐ 
├── src                        │
│   └── pycounts               │ Package source code, metadata,
│       ├── __init__.py        │ and build instructions 
│       └── pycounts.py        ┘
└── tests                      ┐
    └── test_pycounts.py       ┘ Package tests
```

# 3. MANIFEST in

`MANIFEST.in`

* 이 파일에는 내부 패키지 directory 에 들어있지는 않지만 포함시키고 싶은 파일을 적을 수 있다.
* 일반적으로 `readme`, `LICENSE`, `requirements.txt` 와 같은 파일을 포함한다.
* 예시

```latex
include LICENSE
include requirements.txt
```

* `setup.py`
* `setup()` 함수
	* `name`: 패키지의 이름
	* `version`: 패키지의 배포 버전
	* `description`: 패키지에 대한 설명
	* url: 패키지를 대표하는 웹페이지
	* author: 패키지의 작성자
	* `license`: 패키지의 라이센스
	* packages: 프로젝트에 포함되는 패키지 리스트
	* install_requires: 실행 환경에 필요한 최소한의 패키지 리스트
	* `python_requires`: 실행 환경에 필요한 파이썬 버전

# 4. `__init__.py` 의 용도

`__init__.py` 파일은 해당 디렉터리가 패키지의 일부임을 알려주는 역할을 한다.

## 4.1. `__all__` ?

특정 디렉터리의 모듈을 `*` 를 사용하여 import 할 때에는 다음과 같이 해당 디렉터리의 `__init__.py` 파일에 `__all__` 변수를 설정하고 import 할 수 있는 모듈을 정의해 주어야 한다.

**예시**

```python
# C:/doit/game/sound/__init__.py 
__all__ = ['echo']
```

여기에서 `__all__` 이 의미하는 것은 sound 디렉터리에서 `*` 기호를 사용하여 import 할 경우 이곳에 정의된 echo 모듈만 import 된다는 의미이다.`

# 5. Related

# 6. References

* https://py-pkgs.org/01-introduction
* [05-3 패키지 - 점프 투 파이썬](https://wikidocs.net/1418)
