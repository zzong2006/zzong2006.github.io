// 폴더가 화면에 보이는 이름의 정본. 탐색기(explorer-follow-active)와 폴더 페이지
// (folder-page-clean)가 같이 읽는다. 폴더 페이지 제목은 breadcrumb 에도 그대로 쓰이므로
// 세 곳이 한 규칙을 따르게 된다. 예전에는 탐색기만 "논문"이고 폴더 페이지와 경로 줄은
// "papers", 하위 폴더는 탐색기 "Bias Fairness" / 폴더 페이지 "bias_fairness" 로 갈라졌다.
//
// 노트와 폴더, 주소(URL)는 그대로 두고 보이는 이름만 바꾼다.
// 이 파일은 플러그인이 아니다. 두 플러그인이 ../shared/ 로 import 한다
// (로컬 플러그인은 .quartz/plugins 에 symlink 되므로 상대 경로가 실제 위치 기준으로 풀린다).

// 맨 위 폴더를 주제별로 묶고 한국어 이름을 붙인다. 대문의 주제 카드와 같은 이름이다.
// 키는 content/ 아래 폴더 경로를 소문자로 쓴 것이다(주소의 폴더 부분과 같다).
// 여기 없는 새 맨 위 폴더는 탐색기 맨 아래 OTHER_GROUP_TITLE 묶음에 들어간다.
export const FOLDER_GROUPS = [
  {
    title: "검색·추천",
    folders: [
      ["retrieval", "검색"],
      ["recommendation_system", "추천 시스템"],
      ["ads", "광고"],
    ],
  },
  {
    title: "머신러닝·LLM",
    folders: [
      ["machine_learning", "머신러닝"],
      ["generative_ai", "생성형 AI"],
      ["rl", "강화학습"],
      ["graph", "그래프"],
      ["papers", "논문"],
      ["mlops", "MLOps"],
      ["torch", "딥러닝 프레임워크"],
    ],
  },
  {
    title: "통계·수학",
    folders: [
      ["statistic", "통계"],
      ["linear_algebra", "선형대수"],
      ["math", "수학"],
      ["information_theory", "정보 이론"],
    ],
  },
  {
    title: "시스템·데이터",
    folders: [
      ["server", "서버"],
      ["k8s", "Kubernetes"],
      ["data_engineering", "데이터 엔지니어링"],
      ["database", "데이터베이스"],
      ["hadoop", "Hadoop"],
      ["network", "네트워크"],
      ["security", "보안"],
      ["web", "웹"],
    ],
  },
  {
    title: "프로그래밍",
    folders: [
      ["algorithms", "알고리즘"],
      ["programming", "프로그래밍"],
      ["python", "Python"],
      ["c++", "C++"],
      ["go", "Go"],
      ["rust", "Rust"],
      ["os", "운영체제"],
      ["software", "소프트웨어 개념"],
    ],
  },
  {
    title: "기타",
    folders: [
      ["tip", "팁 모음"],
      ["words", "단어장"],
      ["resume", "이력서"],
    ],
  },
]

export const OTHER_GROUP_TITLE = "기타"

// 아래 규칙으로 만들면 어색해지는 하위 폴더만 이름을 정해 둔다. 키는 FOLDER_GROUPS 와 같다.
export const FOLDER_LABELS = {
  "papers/rl": "RL",
  "retrieval/rag": "RAG",
}

// 그 밖의 폴더는 원래 폴더 이름을 다듬어 쓴다. 앞의 밑줄을 떼고, 밑줄을 공백으로 바꾸고,
// 낱말 첫 글자만 대문자로 올린다. LLM, NLP 처럼 이미 대문자인 부분은 건드리지 않는다.
//   _archive -> Archive, bias_fairness -> Bias Fairness, e-commerce -> E-commerce
// 주소는 소문자라 LLM 이 llm 이 되므로, 반드시 주소가 아니라 원래 폴더 이름을 넣는다.
// 탐색기 스크립트에 함수 소스를 그대로 심으므로 이 함수 밖의 것을 참조하면 안 된다.
export function tidyFolderName(name) {
  return String(name ?? "")
    .replace(/^_+/, "")
    .replace(/_+/g, " ")
    .trim()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ")
}

const LABELS = new Map(Object.entries(FOLDER_LABELS))
for (const group of FOLDER_GROUPS) {
  for (const [key, label] of group.folders) LABELS.set(key, label)
}

// folderKey: 소문자 폴더 경로(예: "papers/bias_fairness"). originalName: 원래 폴더 이름.
export function folderDisplayName(folderKey, originalName) {
  const key = String(folderKey ?? "").replace(/\/index$/, "").toLowerCase()
  return LABELS.get(key) ?? tidyFolderName(originalName ?? key.split("/").pop())
}
