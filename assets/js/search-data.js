// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-",
    title: "",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/index.html";
          },
        },{id: "nav-about",
          title: "about",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/about/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-tags",
          title: "tags",
          description: "tags 모음집",
          section: "Navigation",
          handler: () => {
            window.location.href = "/tags/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "dropdown-projects",
              title: "projects",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "";
              },
            },{id: "dropdown-blog",
              title: "blog",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/blog/";
              },
            },{id: "post-deepseek-r1-o1-을-이기는-중국의-reasoning-모델",
      
        title: "DeepSeek-R1, o1 을 이기는 중국의 reasoning 모델",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/deepseek-r1/";
        
      },
    },{id: "post-kv-cache-에-대해-알아보자",
      
        title: "KV-Cache 에 대해 알아보자",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/kv-cache/";
        
      },
    },{id: "post-llm-이용해서-임베딩-모델의-품질-높이기",
      
        title: "LLM 이용해서 임베딩 모델의 품질 높이기",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/improving-text-embeddings-with-llm/";
        
      },
    },{id: "post-rag-구축-레슨런",
      
        title: "RAG 구축 레슨런",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/enhancing-rag-a-study-of-best-practices/";
        
      },
    },{id: "post-ml-recap-beta-distribution",
      
        title: "ML Recap - Beta Distribution",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/beta-distribution/";
        
      },
    },{id: "post-bge-임베딩-학습-방법-탐방해보기",
      
        title: "BGE 임베딩 학습 방법 탐방해보기",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/bge-embed-train/";
        
      },
    },{id: "post-ann-방법론중-하나인-hnsw-알고리즘-정리",
      
        title: "ANN 방법론중 하나인 HNSW 알고리즘 정리",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/hnsw/";
        
      },
    },{id: "post-임베딩도-더-좋은-데이터가-필요하다-kalm-embedding",
      
        title: "임베딩도 더 좋은 데이터가 필요하다, KaLM-Embedding",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/kalm-embedding/";
        
      },
    },{id: "post-ml-recap-basic-feature-engineering",
      
        title: "ML Recap - Basic Feature Engineering",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/basic-feature-engineering/";
        
      },
    },{id: "post-ml-recap-linear-regression",
      
        title: "ML Recap - Linear Regression",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/linear-regression/";
        
      },
    },{id: "post-kaggle-의-multilingual-chatbot-arena-대회",
      
        title: "kaggle 의 multilingual-chatbot-arena 대회",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/kaggle-wsdm-cup/";
        
      },
    },{id: "post-embedding-과-reranker-은-무슨-차이일까",
      
        title: "Embedding 과 Reranker 은 무슨 차이일까?",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/embed-and-rerank/";
        
      },
    },{id: "post-llm-기반-dense-retrieval-을-위한-학습방법-llara",
      
        title: "LLM 기반 Dense Retrieval 을 위한 학습방법, LLaRA",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/use-llm-for-dense-retrieval/";
        
      },
    },{id: "post-algorithm-lesson-learned-string",
      
        title: "Algorithm lesson learned - string",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/algorithm-lesson-learned-string/";
        
      },
    },{id: "post-간단한-방법으로-ai-모델-속이기-bon-jail-breaking",
      
        title: "간단한 방법으로 AI 모델 속이기, BoN Jail-breaking",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/best-of-n-jailbreaking/";
        
      },
    },{id: "post-microsoft-에서-만든-multi-agent-framework-autogen",
      
        title: "Microsoft 에서 만든 Multi-Agent framework, AutoGen",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/autogen/";
        
      },
    },{id: "post-google-의-agent-프레임워크-langfun",
      
        title: "Google 의 agent 프레임워크, langfun",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/langfun/";
        
      },
    },{id: "post-meta-에서-만든-agent-벤치마크-gaia",
      
        title: "Meta 에서 만든 Agent 벤치마크, GAIA",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/gaia/";
        
      },
    },{id: "post-fc-보다는-code-실행이-더-좋은-agent-를-만든다",
      
        title: "FC 보다는 Code 실행이 더 좋은 Agent 를 만든다",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/code-act/";
        
      },
    },{id: "post-multi-agent-관련-리소스-모음",
      
        title: "Multi-Agent 관련 리소스 모음",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/multi-agents-resources/";
        
      },
    },{id: "post-llm-이-json-응답을-잘-하도록-하는법",
      
        title: "LLM 이 json 응답을 잘 하도록 하는법",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/constrained-decoding/";
        
      },
    },{id: "post-llama-에-대해서-알아보자",
      
        title: "llama 에 대해서 알아보자",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/llama/";
        
      },
    },{id: "post-algorithm-lesson-learned-array",
      
        title: "Algorithm lesson learned - array",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/algorithm-lesson-learned-array/";
        
      },
    },{id: "post-semantic-retrieval-at-walmart",
      
        title: "Semantic Retrieval at Walmart",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/semantic-retrieval-at-walmart/";
        
      },
    },{id: "post-차원-축소-전략-중-하나인-linear-discriminant-analysis",
      
        title: "차원 축소 전략 중 하나인 Linear Discriminant Analysis",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/lda/";
        
      },
    },{id: "post-don-39-t-do-rag",
      
        title: "Don&#39;t do RAG",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/no-rag/";
        
      },
    },{id: "post-the-collection-of-rag-competitions",
      
        title: "The collection of RAG competitions",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/rag-competition/";
        
      },
    },{id: "post-행렬-미분-기초-with-trace",
      
        title: "행렬 미분 기초 (with Trace)",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/matrix-derivative/";
        
      },
    },{id: "post-text-embedding-모델-e5",
      
        title: "Text Embedding 모델: E5",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/e5/";
        
      },
    },{id: "post-새로운-bert-모델-modernbert",
      
        title: "새로운 Bert 모델: ModernBERT",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/modern-bert/";
        
      },
    },{id: "post-sft-데이터셋의-노이즈를-줄여보자",
      
        title: "SFT 데이터셋의 노이즈를 줄여보자",
      
      description: "데이터 디노이징 프레임워크 RobustFT",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2024/robust-ft/";
        
      },
    },{id: "news-construction-새로운-블로그-스타일로-변경했습니다-blog-위주로-수정하고-있습니다-sparkles",
          title: ':construction: 새로운 블로그 스타일로 변경했습니다. blog 위주로 수정하고 있습니다.:sparkles:',
          description: "",
          section: "News",},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%7A%7A%6F%6E%67%32%30%30%36@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-inspire',
        title: 'Inspire HEP',
        section: 'Socials',
        handler: () => {
          window.open("https://inspirehep.net/authors/1010907", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://www.alberteinstein.com/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
