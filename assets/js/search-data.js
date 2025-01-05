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
        },{id: "nav-repositories",
          title: "repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
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
            },{id: "post-kv-cache-에-대해-알아보자",
      
        title: "KV-Cache 에 대해 알아보자",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/kv-cache/";
        
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
    },{id: "post-semantic-retrieval-at-walmart",
      
        title: "Semantic Retrieval at Walmart",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/semantic-retrieval-at-walmart/";
        
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
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
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
