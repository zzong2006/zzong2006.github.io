---
title: "Coding Problems"
tags: ["programming"]
---

# A) NAVER 코딩 테스트

## A.1) (1) 번

너무 길어서 생략: error 처리가 필요한 stack 을 구현하는 문제

```python
def solution(S):
    def check_flow_error(num):
        if num < 0 or num > (2 ** 20 - 1):
            return True
        else:
            return False

    orders = S.split(" ")
    stack = []
    for order in orders:
        if order == 'POP':
            if stack:
                stack.pop()
            else:
                return -1
        elif order == 'DUP':
            if stack:
                stack.append(stack[-1])
            else:
                return -1
        elif order.isdigit():
            value = int(order)
            if check_flow_error(value):
                return -1
            else:
                stack.append(value)
        elif order == '-':
            if len(stack) < 2:
                return -1
            else:
                first = stack.pop()
                second = stack.pop()
                result = first - second
                if check_flow_error(result):
                    return -1
                else:
                    stack.append(result)
        elif order == '+':
            if len(stack) < 2:
                return -1
            else:
                first = stack.pop()
                second = stack.pop()
                result = first + second
                if check_flow_error(result):
                    return -1
                else:
                    stack.append(result)
        # print(stack)
    if stack: # if the stack is empty, the machine reports an error
        return stack[-1]
    else:
        return -1
```

## A.2) (2) 번

![](https://i.imgur.com/5y6UXak.png)

```python
def solution(S):
    def is_valid(given_stack, ch):
        if ((given_stack[-1] == 'A' and ch == 'B') or 
            (given_stack[-1] == 'B' and ch == 'A') or 
            (given_stack[-1] == 'C' and ch == 'D') or 
            (given_stack[-1] == 'D' and ch == 'C')):
            return True
        else:
            return False
    stack = []
    for s in S:
        if not stack:
            stack.append(s)
        else:
            if is_valid(stack, s):
                stack.pop()
            else:
                stack.append(s)
    if stack:
        answer = ''.join(stack)
    else:
        answer = ""
    return answer
```

## A.3) (3) 번

![](https://i.imgur.com/G7qAKxI.png)

```python
def solution(S):
    def find_divied(idx, S):
        """
            aa 'bbb' aa 'bbb' aa
            -> return 2 or 6 (index of matched with divied(=2))
        """
        count = 0
        for w in range(idx, len(S)):
            if S[w] == 'a':
                count += 1
            if count == divided:
                return w

    def get_between_legnth(start, S):
        """
            aa 'bbb' aa 'bbb' aa
            -> return 3 (total number of characters), 5 (index of next 'a')
        """
        count = 0
        for w in range(start, len(S)):
            if S[w] == 'a':
                return count, w
            else:
                count += 1

    a_count = 0
    for i in range(len(S)):
        if S[i] == 'a':
            a_count += 1
    if a_count % 3 != 0:
        return 0
    else:   
        divided = a_count // 3
        if divided != 0:
            # get left
            i = find_divied(0, S)
            left, j = get_between_legnth(i + 1, S)
            # get right
            k = find_divied(j, S)
            right, _ = get_between_legnth(k + 1, S)
            # print(i, left, j, k, right)
            return (left + 1) * (right + 1)
        else:
            if len(S) < 3:
                return 0
            else:
                n = (len(S) - 2)
                return (n * (n + 1)) // 2 
```

### A.3.1) 두 배열 합치기 (Merge Two Sorted Arrays)

* **문제 설명:**  
	정렬된 두 배열 A 와 B 가 주어집니다. 배열 A 에는 배열 B 의 모든 원소를 포함할 수 있도록 끝부분에 충분한 빈 공간 (None) 이 마련되어 있습니다. 이 두 배열을 **공간 복잡도 O(1)**로 합쳐서, 정렬된 상태로 배열 A 에 저장하는 문제입니다.
	
* **입력 예시:**
	
          `A = [1, 3, 5, 7, 9, None, None, None] B = [4, 5, 6]`
        
* **출력 예시:**
	
          `A = [1, 3, 4, 5, 5, 6, 7, 9]`
        

	IGNORE_WHEN_COPYING_START

	content_copy download

	Use code [with caution](https://support.google.com/legal/answer/13505487).

	IGNORE_WHEN_COPYING_END

* **해결 방법 (Two Pointers):**
	
	* 세 개의 포인터를 사용합니다:
		
		* i: 배열 A 의 실제 데이터 마지막 인덱스 (예시에서는 9 의 위치, 즉 len(A) - len(B) - 1 에서 시작)
			
		* j: 배열 B 의 마지막 인덱스 (예시에서는 6 의 위치, 즉 len(B) - 1 에서 시작)
			
		* k: 합쳐진 결과가 저장될 배열 A 의 가장 마지막 인덱스 (예시에서는 가장 오른쪽 None 의 위치, 즉 len(A) - 1 에서 시작)
	* A[i] 와 B[j] 를 비교합니다.
		
		* A[i] 가 B[j] 보다 크거나 같으면 (또는 j 가 음수가 되어 B 배열을 다 쓴 경우), A[k] 에 A[i] 값을 넣고 i 와 k 를 1 씩 감소시킵니다.
			
		* B[j] 가 A[i] 보다 크면 (또는 i 가 음수가 되어 A 배열의 원본 데이터를 다 쓴 경우), A[k] 에 B[j] 값을 넣고 j 와 k 를 1 씩 감소시킵니다.
	* k 가 0 보다 작아질 때까지 (즉, 배열 A 의 앞부분까지 모두 채워질 때까지) 이 과정을 반복합니다. 만약 j 가 아직 0 보다 크거나 같다면 B 배열에 남은 요소들을 A 배열의 앞부분 (A[0] 부터 A[k] 까지) 에 순서대로 마저 채워 넣습니다. (이 로직은 k 가 인덱스이므로 k >= 0 동안 반복하고, B 의 남은 요소는 while j >= 0 루프로 처리하는 것이 더 명확합니다.)

	**핵심:** 배열 A 의 뒤쪽 빈 공간부터 큰 값을 채워나가기 때문에, 기존 A 배열의 데이터를 덮어쓰는 문제 없이 O(1) 공간 복잡도로 병합이 가능합니다.

---

### A.3.2) Search Sorted Matrix (정렬된 행렬에서 원소 찾기)

* **문제 설명:**  
	각 행과 각 열이 오름차순으로 정렬된 2 차원 행렬 (matrix) 에서 특정 값 (target) 이 위치한 행과 열의 인덱스를 찾는 문제입니다.
	
* **입력 예시:**
	
          `matrix = [   [20, 40, 63,  80],   [30, 50, 80, 100],   [40, 60, 95, 110],   [50, 65,105, 150] ] val = 60`
        

	IGNORE_WHEN_COPYING_START

	content_copy download

	Use code [with caution](https://support.google.com/legal/answer/13505487).

	IGNORE_WHEN_COPYING_END

* **출력 예시 (60 을 찾을 경우):**  
	(2, 1) (0-indexed)
	
* **해결 방법:**
	
	* 탐색 시작점을 행렬의 **오른쪽 위** (또는 왼쪽 아래) 모서리로 정합니다. (예시에서는 matrix[0][마지막 열 인덱스] 즉, 80 의 위치)
		
	* 현재 위치의 값과 찾으려는 값 (val) 을 비교합니다:
		
		* 만약 val 이 현재 값보다 **작으면**, 현재 값보다 큰 값들이 있는 현재 열에는 val 이 존재할 수 없으므로, **왼쪽으로 이동**합니다 (열 인덱스 감소).
			
		* 만약 val 이 현재 값보다 **크면**, 현재 값보다 작은 값들이 있는 현재 행에는 val 이 존재할 수 없으므로, **아래쪽으로 이동**합니다 (행 인덱스 증가).
			
		* 만약 val 과 현재 값이 **같으면**, 원소를 찾은 것이므로 해당 위치를 반환합니다.
	* 이 과정을 반복하다가 행렬의 범위를 벗어나게 되면 (예: 행 인덱스가 행의 수보다 커지거나, 열 인덱스가 0 보다 작아지면), 해당 값은 행렬에 존재하지 않는 것입니다.
* **이유:**  
	오른쪽 위에서 시작할 경우, 왼쪽으로 이동하면 현재 값보다 항상 작거나 같은 값들만 나오게 되고, 아래로 이동하면 현재 값보다 항상 크거나 같은 값들만 나오게 됩니다. 이 속성을 이용해 매 단계마다 탐색할 필요가 없는 행 또는 열을 하나씩 제외시킬 수 있습니다.
	
* **시간 복잡도:**  
	O(n + m) (여기서 n 은 행의 수, m 은 열의 수). 최악의 경우, 시작점에서 대각선 반대편 끝까지 이동하며, 각 단계에서 행 또는 열 인덱스 중 하나만 변경됩니다.

---
