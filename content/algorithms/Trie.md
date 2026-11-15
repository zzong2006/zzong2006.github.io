---
title: "Trie"
aliases: ["prefix tree", "LeetCode 208"]
tags:
  - algorithm
  - data_structure
  - leetcode
---

# A) Trie ?

Trie (prefix tree) 는 문자열을 글자 단위로 쪼개 트리에 저장하는 자료구조다. 루트에서 시작해 글자를 하나씩 따라 내려가면 단어가 된다. 공통 접두사를 가진 단어들은 그 접두사까지 같은 경로를 공유한다.

```
"app", "apple", "apt" 를 넣은 모습

(root)
  └─ a
     └─ p
        ├─ p  ● (app 끝)
        │  └─ l
        │     └─ e  ● (apple 끝)
        └─ t  ● (apt 끝)
```

연결 리스트처럼 보이지만 노드마다 다음 글자가 여러 개일 수 있으므로 트리다. 그래서 `next` 포인터 하나 대신 "글자 → 자식 노드" dict 를 둔다.

# B) 노드에 필요한 것

- `children`: 글자를 키로, 자식 노드를 값으로 갖는 dict
- `is_end`: 여기서 끝나는 단어가 있는지. 이것이 없으면 `"app"` 을 넣었는지, `"apple"` 의 앞부분일 뿐인지 구분할 수 없다.

글자 자체를 노드에 저장할 필요는 없다. 이미 부모 dict 의 키로 들어 있다.

# C) 구현

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True

    def _find(self, prefix: str):
        node = self.root
        for ch in prefix:
            node = node.children.get(ch)
            if node is None:
                return None
        return node

    def search(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and node.is_end

    def startsWith(self, prefix: str) -> bool:
        return self._find(prefix) is not None
```

`search` 와 `startsWith` 는 글자를 따라 내려가는 과정이 같고, 마지막에 `is_end` 를 확인하는지만 다르다. 그래서 내려가는 부분을 `_find` 로 뺀다.

## C.1) 자주 하는 실수

- **노드 하나를 객체 두 개로 표현하기.** 자식 dict 를 담는 클래스와 `is_end` 를 담는 클래스를 따로 두면 `curr[w].node.is_end`, `curr[w].trie` 처럼 접근이 길어진다. 노드 클래스 하나에 `children` 과 `is_end` 를 함께 둔다.
- **현재 위치를 dict 로 들고 다니기.** `curr` 가 노드가 아니라 자식 dict 를 가리키면, 마지막 글자에 `is_end` 를 표시하려고 인덱스를 비교해야 하고, 접두사 노드에서 탐색을 시작하는 확장 (아래 E) 도 번거로워진다. `curr` 는 노드를 가리키게 하고, 루프가 끝난 뒤 `node.is_end = True` 한 줄로 표시한다.

# D) 복잡도와 해시셋과의 차이

단어 길이를 $L$ 이라 하면 `insert`, `search`, `startsWith` 모두 $O(L)$ 이다. 저장된 단어가 몇 개든 상관없다.

단어 존재 여부만 확인한다면 해시셋도 평균 $O(L)$ 이다 (문자열 해시 계산에 길이만큼 걸린다). Trie 의 장점은 **접두사로 찾기**다. 해시셋으로 "ap 로 시작하는 단어가 있나?" 를 물으려면 모든 단어를 훑어야 한다.

# E) 자동완성으로 확장하기

[LeetCode 1268. Search Suggestions System](https://leetcode.com/problems/search-suggestions-system/) 처럼 접두사로 시작하는 단어를 모으려면, `_find` 로 접두사 노드까지 내려간 뒤 거기서 [[DFS]] 로 `is_end` 인 노드를 모은다. 자식을 글자 순서대로 방문하면 사전순으로 나온다.

```python
def suggest(self, prefix: str, limit: int = 3) -> list[str]:
    node = self._find(prefix)
    result = []

    def dfs(n, path):
        if len(result) == limit:
            return
        if n.is_end:
            result.append(path)
        for ch in sorted(n.children):
            dfs(n.children[ch], path + ch)

    if node:
        dfs(node, prefix)
    return result
```

# References

- [LeetCode 208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [LeetCode 1268. Search Suggestions System](https://leetcode.com/problems/search-suggestions-system/)
