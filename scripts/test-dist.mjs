import {readFileSync,readdirSync,existsSync} from 'node:fs';import assert from 'node:assert/strict';import yaml from 'js-yaml';import {site} from '../src/config/site.ts';import {join,resolve} from 'node:path';
function walk(p){return readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)])}
const files=walk('dist');const html=files.filter(p=>p.endsWith('.html'));
for(const r of ['index.html','about/index.html','publications/index.html','projects/index.html','status/index.html'])assert.ok(existsSync('dist/'+r),r);
const pub=readFileSync('dist/publications/index.html','utf8');
const articleClasses=[...pub.matchAll(/<article class="([^"]*)"/g)].map((m)=>m[1]);
assert.equal(articleClasses.filter((c)=>c==='paper').length,4);
assert.equal(articleClasses.filter((c)=>c==='paper conference').length,2);
assert.match(pub,/id="articles"/);
assert.match(pub,/id="conferences"/);
assert.match(pub,/>科研</);
assert.match(pub,/>文章</);
assert.match(pub,/>会议</);
assert.match(pub,/口头报告/);
assert.match(pub,/DiffuCoCT/);
assert.match(pub,/hqlab\.sjtu\.edu\.cn\/fully3d-2025\/program/);

const home=readFileSync('dist/index.html','utf8');
assert.match(home,/>科研</);
assert.doesNotMatch(home,/>论文</);
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  assert.doesNotMatch(s, /sunhh19@icloud\.com/, `plain iCloud must not appear: ${f}`);
  assert.doesNotMatch(s, /@mails?\.tsinghua\.edu\.cn|@tsinghua\.edu\.cn/i, `Tsinghua email forbidden: ${f}`);
  assert.doesNotMatch(s, /tel:|\+86[\d\-\s]{8,}/i, `phone forbidden: ${f}`);
}
assert.match(home, /social-links/);
assert.match(home, /data-u="sunhh19"/);
assert.match(home, /data-d="icloud\.com"/);
assert.match(home, /https:\/\/github\.com\/Sunhuahai/);
assert.match(home, /https:\/\/space\.bilibili\.com\/473733680/);
assert.match(home, /data-xhs="9601941483"/);
assert.match(home, /href="\/rss\.xml"/);
assert.doesNotMatch(home, /x\.com\/|twitter\.com\//i);

for(const doi of ['10.1088/1361-6560/ae6af7','10.1177/08953996261439069','10.1088/1361-6560/ad6eda'])assert.ok(pub.includes(`https://doi.org/${doi}`));
assert.match(pub,/Physics-Informed Jointly Constrained Spectral Signal Decomposition for High-Resolution X-Ray Fluorescence Computed Tomography/);
assert.match(pub,/2026 IEEE Nuclear Science Symposium, Medical Imaging Conference and International Symposium on Room Temperature Semiconductor Detectors \(IEEE NSS\/MIC\/RTSD 2026\)/);
assert.match(pub,/Granada, Spain/);
assert.match(pub,/November 7–14, 2026/);
assert.match(pub,/2026-11/);
assert.match(pub,/2025-05/);
assert.match(pub,/Poster Presentation · MIC-05-442 · Abstract #1630/);
assert.match(pub,/https:\/\/nssmic\.ieee\.org\/2026\//);
assert.match(pub,/海报/);
assert.doesNotMatch(pub,/ieee2026\.eventclass\.it|abstractBooklet|\.pdf/i);
assert.match(pub,/2026 中国体视学学会 CBCT 金属伪影消除挑战赛（CSS-MAR 2026）/);
assert.match(pub,/李亮,\s*<strong>孙华海<\/strong>,\s*汪令行,\s*朱磊/);
assert.match(pub,/中国体视学与图像分析/);
assert.match(pub,/30\(4\), 397–405 · 2025/);
assert.match(pub,/期刊文章 · 中文/);
assert.match(pub,/4 篇正式发表期刊文章/);
assert.match(pub,/2 条会议记录/);
assert.doesNotMatch(pub,/10\.13505|chndoi\.org|https:\/\/doi\.org\/(?:undefined|"|\s)/);
const bibOut=readFileSync('dist/publications.bib','utf8');
const cssMar=bibOut.split('@article{Li2025CssMar')[1]?.split('@article{')[0]??'';
assert.ok(cssMar.includes('language = {zh}'));
assert.doesNotMatch(cssMar,/\bdoi\b|\burl\b/i);
assert.doesNotMatch(bibOut,/10\.13505|chndoi\.org/);
const honors=[
  'Selected for the Young Science and Technology Talent Development Program, China Association for Science and Technology (CAST).',
  'Outstanding Presentation Recommendation, Young Scholars Forum.',
];
const aboutHtml=readFileSync('dist/about/index.html','utf8');
assert.match(aboutHtml,/Honors &amp; Awards|Honors & Awards/);
for(const line of honors){
  assert.equal(aboutHtml.split(line).length-1,1,line);
  assert.equal(pub.includes(line),false,line);
}
for(const f of html){const s=readFileSync(f,'utf8');assert.doesNotMatch(s,/Albert Einstein|Torvalds|einstein1905|example_pdf|PCFE|mailto:|10\.2\.0\.|127\.0\.0\.1|10\.13505|chndoi\.org/i,f);if(f.endsWith('publications/index.html')){assert.match(s,/NSS\/MIC/);}else if(!f.includes('pagefind')){assert.doesNotMatch(s,/NSS\/MIC|CSS-MAR|Physics-Informed Jointly Constrained/,f);if(!f.endsWith('about/index.html')){for(const line of honors)assert.equal(s.includes(line),false,`${f}: ${line}`);}}for(const m of s.matchAll(/(?:href|src)="(\/[^"?#]*)/g)){const url=m[1];if(url==='/'||url.startsWith('//'))continue;const target=resolve('dist','.'+url);assert.ok(existsSync(target)||existsSync(join(target,'index.html')),`${f}: missing ${url}`)}}
assert.equal(files.filter(f=>/\.pdf$/i.test(f)).length,0);const posts=walk('src/content/posts').filter(f=>/\.mdx?$/.test(f)).filter(f=>yaml.load(readFileSync(f,'utf8').split('---')[1]).draft===false);if(site.blogEnabled){assert.ok(existsSync('dist/blog/index.html'));if(posts.length===0)assert.ok(readFileSync('dist/blog/index.html','utf8').includes('文章正在酝酿中'));}else{assert.ok(!existsSync('dist/blog'));assert.ok(!readFileSync('dist/sitemap.xml','utf8').includes('/blog/'));for(const f of html)assert.ok(!readFileSync(f,'utf8').includes('href="/blog/'),`Hidden blog link: ${f}`);}assert.equal(files.filter(f=>/^dist\/blog\/.+\/index.html$/.test(f)).length,site.blogEnabled?posts.length:0);assert.ok(!files.some(f=>f.includes('qa-math')||f.includes('qa-draft')));
const projects=walk('src/content/projects').filter(f=>f.endsWith('.md')).map(f=>({slug:f.split('/').pop().replace(/\.md$/,''),data:yaml.load(readFileSync(f,'utf8').split('---')[1])}));
for(const p of projects)assert.equal(existsSync(`dist/projects/${p.slug}/index.html`),p.data.public===true,`Project visibility: ${p.slug}`);
assert.match(readFileSync('dist/index.html','utf8'),/<title>孙华海 Huahai Sun · 华海图鉴<\/title>/);
const robots=readFileSync('dist/robots.txt','utf8');
assert.match(robots,/Allow:\s*\//);
assert.doesNotMatch(robots,/Disallow:\s*\/\s*$/m);
assert.ok(robots.includes('Sitemap: https://huahaiatlas.com/sitemap.xml'));
assert.equal(site.url,'https://huahaiatlas.com','Expected custom domain origin');
for(const r of ['posts/voice-input-revolution.html','posts/writing-as-daily-practice.html','posts/why-the-past-feels-better.html'])assert.ok(existsSync('dist/'+r),r);

const pages=html.filter(f=>!f.includes('pagefind')&&!f.includes('/posts/'));
const metaContent=(s,attr,name)=>s.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];
const approvedDescriptions={
  'index.html':'孙华海（Huahai Sun）的学术主页，收录期刊文章、会议记录、研究项目与博客。',
  'about/index.html':'了解孙华海（Huahai Sun）的研究方向与学术背景。',
  'publications/index.html':'孙华海的期刊文章与会议记录，包含口头报告、海报及会议论文。',
  'projects/index.html':'孙华海的公开研究项目及相关学术成果。',
  'blog/index.html':'孙华海的研究笔记与随笔。',
};
for(const [rel,description] of Object.entries(approvedDescriptions)){
  const s=readFileSync('dist/'+rel,'utf8');
  assert.equal(metaContent(s,'name','description'),description,rel);
  assert.equal(metaContent(s,'property','og:description'),description,rel);
}
assert.equal(metaContent(readFileSync('dist/blog/voice-input-revolution/index.html','utf8'),'name','description'),'语音输入真正改变的不是速度，而是把口语整理成可用文本的能力。');
assert.equal(metaContent(readFileSync('dist/projects/scatterfusionnet/index.html','utf8'),'name','description'),site.description);
assert.match(home,/<title>孙华海 Huahai Sun · 华海图鉴<\/title>/);
assert.match(home,/property="og:title" content="孙华海 Huahai Sun · 华海图鉴"/);
assert.match(home,/property="og:site_name" content="Huahai Atlas"/);
assert.match(home,/<span>Huahai Atlas<\/span>/);
assert.doesNotMatch(home,/>状态</);
assert.match(home,/property="og:type" content="website"/);
assert.match(home,/property="og:image" content="https:\/\/huahaiatlas\.com\/assets\/avatar-illustrated\.webp"/);
assert.match(home,/property="og:image:width" content="960"/);
assert.match(home,/property="og:image:height" content="960"/);
assert.match(home,/name="twitter:card" content="summary"/);
assert.match(home,/rel="alternate" type="application\/rss\+xml"[^>]*href="https:\/\/huahaiatlas\.com\/rss\.xml"/);
assert.match(home,/href="\/favicon\.svg"/);
const status=readFileSync('dist/status/index.html','utf8');
assert.match(status,/网站已公开上线，独立状态监测尚未接入。/);
assert.doesNotMatch(status,/私有预览|正式上线后开放/);
assert.match(status,/name="robots" content="noindex"/);
assert.doesNotMatch(status,/>状态</);
assert.ok(existsSync('dist/status/index.html'));
const notFound=readFileSync('dist/404.html','utf8');
assert.match(notFound,/name="robots" content="noindex"/);
assert.equal(metaContent(notFound,'name','description'),site.description);
for(const f of pages){
  if(f.endsWith('/404.html')||f.endsWith('dist/404.html')||f.endsWith('status/index.html'))continue;
  assert.doesNotMatch(readFileSync(f,'utf8'),/noindex/,f);
  assert.doesNotMatch(readFileSync(f,'utf8'),/href="\/status\/"/,f);
}
for(const f of pages){
  const s=readFileSync(f,'utf8');
  const canons=[...s.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(canons.length,1,f);
  assert.match(canons[0],/^https:\/\/huahaiatlas\.com\//,f);
  assert.doesNotMatch(canons[0],/[?#]|www\./,f);
  assert.ok(canons[0].endsWith('/'),f);
  assert.equal(metaContent(s,'property','og:url'),canons[0],f);
}
function jsonLd(s){return [...s.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));}
const homeLd=jsonLd(home);
assert.equal(homeLd.length,1);
assert.equal(homeLd[0]['@type'],'Person');
assert.equal(homeLd[0].name,'孙华海');
assert.deepEqual(homeLd[0].sameAs,['https://orcid.org/0009-0003-2386-133X','https://github.com/Sunhuahai','https://space.bilibili.com/473733680']);
assert.equal(JSON.stringify(homeLd).includes('ScholarlyArticle'),false);
const pubLd=jsonLd(pub);
const pubArticles=pubLd.flatMap(doc=>doc['@graph']??[]).filter(node=>node['@type']==='ScholarlyArticle');
assert.deepEqual(pubArticles.map(article=>article.identifier.value).sort(),['10.1088/1361-6560/ad6eda','10.1088/1361-6560/ae6af7','10.1177/08953996261439069']);
assert.equal(JSON.stringify(pubLd).includes('DiffuCoCT'),false);
assert.equal(JSON.stringify(pubLd).includes('10.1117'),false);
assert.equal(JSON.stringify(pubLd).includes('10.13505'),false);
assert.equal(JSON.stringify(pubLd).includes('CSS-MAR'),false);
assert.equal(JSON.stringify(pubLd).includes('Physics-Informed Jointly'),false);
assert.equal(JSON.stringify(pubLd).includes('chndoi.org'),false);
const projectPages=pages.filter(f=>/^dist\/projects\/[^/]+\/index\.html$/.test(f));
assert.equal(projectPages.length,2);
for(const f of projectPages){
  const articles=jsonLd(readFileSync(f,'utf8')).flatMap(doc=>doc['@graph']??[]).filter(node=>node['@type']==='ScholarlyArticle');
  assert.equal(articles.length,1,f);
  assert.ok(['10.1088/1361-6560/ae6af7','10.1088/1361-6560/ad6eda'].includes(articles[0].identifier.value),f);
}
const postPages=pages.filter(f=>/^dist\/blog\/[^/]+\/index\.html$/.test(f));
assert.ok(postPages.length>=3);
for(const f of postPages){
  const s=readFileSync(f,'utf8');
  assert.equal(metaContent(s,'property','og:type'),'article',f);
  const published=metaContent(s,'property','article:published_time');
  assert.match(published,/^\d{4}-\d{2}-\d{2}$/,f);
  assert.ok(s.includes(`${published} · `),f);
  assert.equal(metaContent(s,'property','article:author'),'https://orcid.org/0009-0003-2386-133X',f);
  assert.equal(jsonLd(s).length,0,f);
}
const blogIndex=readFileSync('dist/blog/index.html','utf8');
assert.equal(metaContent(blogIndex,'property','og:type'),'website');
assert.equal(metaContent(blogIndex,'property','article:published_time'),undefined);
console.log(`Static acceptance passed: ${html.length} pages, 4 papers, ${projects.filter(p=>p.data.public).length} public project details, no demo/private data, local assets resolve.`);
