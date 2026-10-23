// 탐색기 맨 위 폴더를 주제별로 묶고, 화면에 보일 이름을 정한다.
// 폴더 33개가 이름순으로 한 줄로 늘어서 있으면 서로 무슨 관계인지 보이지 않는다.
// 대문의 주제 카드와 같은 이름을 써서 대문에서 본 주제를 여기서도 바로 찾게 한다.
//
// 키는 content/ 아래 폴더 경로를 소문자로 쓴 것이다(탐색기의 data-folderpath 에서
// 뒤의 /index 를 뗀 값). 노트와 폴더는 그대로 두고 보이는 이름과 순서만 바꾼다.
// 여기 없는 새 폴더는 맨 아래 OTHER_GROUP_TITLE 묶음에 원래 이름으로 들어간다.
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
