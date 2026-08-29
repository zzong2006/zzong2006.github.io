---
title: "Linux"
tags:
  - tip
  - linux
aliases: []
---

# 1. Pip Install

## 1.1. Command not Found Error

`pip install` 을 통해 라이브러리를 설치해도 명령어를 찾을 수 없는경우

```bash
echo "export PATH=\"`python3 -m site --user-base`/bin:\$PATH\"" >> ~/.bashrc
source ~/.bashrc
```

를 통해 `bin` 경로를 환경 변수로 알려주면 된다.

Reference: [python - pip installs packages successfully, but executables not found from command line - Stack Overflow](https://stackoverflow.com/a/62151306/4533917)

# 2. Permission

## 2.1. Root 권한 얻기

참고: https://askubuntu.com/questions/617850/changing-from-user-to-superuser

# 3. Process

## 3.1. 현재 돌아가는 프로세스가 어느 위치에서 돌아가는지 확인하기

`pwdx <PID>`  
permission 필요한 경우 `sudo` 붙이기

## 3.2. 프로세스 출력 확인하기

```bash
tail -f /proc/<pid>/fd/1
```

## 3.3. 프로세스 전체 커맨드 (CMD) 확인하기

```bash
ps -fwwp <pid>
```

## 3.4. 특정 이름을 포함하고 있는 프로세스 죽이기

```bash
pkill -9 -ef wandb
```

# 4. 압축

* 압축하기: `tar -cvf <압축할 파일이름>.tar abc`
* 압축풀기: `tar -xf <압축한 파일이름>.tar`

# 5. Commands

## 5.1. Grep

### 5.1.1. 찾으려는 문자 앞 뒤로 살펴보기

`grep -A 4 -B 4 'Trace' *`  
Trace 라는 단어를 가진 문장 기준으로 앞으로 (A) 4 문장, 뒤로 (B) 4 문장 출력

# 6. File System

폴더 용량 확인하기 (폴더 내 파일 용량까지 함께 고려)

```bash
du -sh <folder_name>
```

* 정확하지 않음 !

해당 디렉토리 내 폴더의 용량 순으로 정렬하기

```bash
du -sh */ | sort -hr
```

# 7. CPU

## 7.1. 지원가능한 Instruction Set 알아보기

```bash
cat /proc/cpuinfo
```

[[RocksDB]] 의 경우 node dependency 가 존재하여 해당 node CPU 에서 avx2 명령어를 지원하지 않으면 에러가 발생한다. 이런 경우 다시 설치해야됨.

# 8. Network

`nload` 를 사용하면 현재 네트워크의 throughput 을 파악할 수 있다.

# 9. Related

# 10. References
