/** Public identity. `title` is the wordmark; `homeTitle` is the approved document title. */
export const site = {
 title: 'Huahai Atlas', chineseTitle: '华海图鉴', name: '孙华海', englishName: 'Huahai Sun',
 /** Approved homepage `<title>` / social title. Do not append the wordmark. */
 homeTitle: '孙华海 Huahai Sun · 华海图鉴',
 url: 'https://huahaiatlas.com', subtitle: 'Physics, Mathematics & Computation',
 /** Fallback for routes without an approved description (404, status, project details, RSS). */
 description: '孙华海的学术主页：X 射线计算成像、物理约束建模与机器学习。',
 pages: {
  home: '孙华海（Huahai Sun）的学术主页，收录期刊文章、会议记录、研究项目与博客。',
  about: '了解孙华海（Huahai Sun）的研究方向与学术背景。',
  publications: '孙华海的期刊文章与会议记录，包含口头报告、海报及会议论文。',
  projects: '孙华海的公开研究项目及相关学术成果。',
  blog: '孙华海的研究笔记与随笔。',
 },
 role: '清华大学 · 工程物理系 · 博士研究生',
 bio: "我是孙华海，目前在清华大学攻读核科学与技术博士学位。我关注如何结合成像物理、统计建模和机器学习，实现更可靠、更高效的 X 射线 CT 定量成像；也对大模型推理与高效计算系统感兴趣。",
 englishBio: "I am a Ph.D. student in Nuclear Science and Technology at Tsinghua University. My research interests lie at the intersection of X-ray computational imaging, physics-informed modeling, inverse problems, and machine learning. I am also interested in efficient inference for large language models.",
 /** Only explicitly public author identifier; no email, CV, or GitHub. */
 orcid: 'https://orcid.org/0009-0003-2386-133X',
 /** Public status domain stays inactive until DNS/ICP/routing acceptance. */
 statusPublic: false,
 /** Generate blog routes and show blog navigation/home content when enabled. */
 blogEnabled: true,
 /** Locally packaged math CSS; math rendering enabled at build time. */
 math: true,
 nav: [{label:'首页',href:'/'},{label:'关于',href:'/about/'},{label:'科研',href:'/publications/'},{label:'项目',href:'/projects/'},{label:'博客',href:'/blog/'}],
 interests: ['X-ray CT & Spectral Imaging','Physics-Informed Computational Imaging','Inverse Problems & Numerical Optimization','Machine Learning & Efficient Inference'],
 labels: {
  skip:'跳至内容', theme:'切换深浅色主题', menu:'导航菜单',
  research:'科研', articles:'文章', conferences:'会议',
  papers:'已发表论文', allPapers:'全部科研', allArticles:'全部文章',
  projects:'公开研究项目', blog:'研究与随笔', allProjects:'浏览项目',
  bib:'BibTeX', copy:'复制引用', copied:'已复制', copyFailed:'请手动复制下方引用',
  doi:'DOI ↗', evidence:'出版记录 ↗', year:'年份', all:'全部',
  emptyBlog:'文章正在酝酿中', emptyBlogBody:'这里将记录研究、数学与计算的思考。暂时没有公开文章。',
  back:'返回列表', tags:'标签', contents:'目录',
  statusTitle:'服务状态', statusBody:'网站已公开上线，独立状态监测尚未接入。',
  footer:'探索物理、数学与计算的交汇处。', notFound:'页面未找到', home:'返回首页'
 },
} as const;
