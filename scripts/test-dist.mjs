import {readFileSync,readdirSync,existsSync} from 'node:fs';import assert from 'node:assert/strict';import yaml from 'js-yaml';import {site} from '../src/config/site.ts';import {join,resolve} from 'node:path';
function walk(p){return readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)])}
const files=walk('dist');const html=files.filter(p=>p.endsWith('.html'));
for(const r of ['index.html','about/index.html','publications/index.html','projects/index.html','status/index.html'])assert.ok(existsSync('dist/'+r),r);
const pub=readFileSync('dist/publications/index.html','utf8');
assert.equal((pub.match(/class="paper"/g)||[]).length,3); // journal articles only (exact class)
assert.equal((pub.match(/class="paper conference"/g)||[]).length,1);
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

for(const doi of ['10.1088/1361-6560/ae6af7','10.1177/08953996261439069','10.1088/1361-6560/ad6eda'])assert.ok(pub.includes(`https://doi.org/${doi}`));
for(const f of html){const s=readFileSync(f,'utf8');assert.doesNotMatch(s,/Albert Einstein|Torvalds|einstein1905|example_pdf|PCFE|NSS\/MIC|mailto:|10\.2\.0\.|127\.0\.0\.1/i,f);for(const m of s.matchAll(/(?:href|src)="(\/[^"?#]*)/g)){const url=m[1];if(url==='/'||url.startsWith('//'))continue;const target=resolve('dist','.'+url);assert.ok(existsSync(target)||existsSync(join(target,'index.html')),`${f}: missing ${url}`)}}
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
assert.deepEqual(homeLd[0].sameAs,['https://orcid.org/0009-0003-2386-133X']);
assert.equal(JSON.stringify(homeLd).includes('ScholarlyArticle'),false);
const pubLd=jsonLd(pub);
const pubArticles=pubLd.flatMap(doc=>doc['@graph']??[]).filter(node=>node['@type']==='ScholarlyArticle');
assert.deepEqual(pubArticles.map(article=>article.identifier.value).sort(),['10.1088/1361-6560/ad6eda','10.1088/1361-6560/ae6af7','10.1177/08953996261439069']);
assert.equal(JSON.stringify(pubLd).includes('DiffuCoCT'),false);
assert.equal(JSON.stringify(pubLd).includes('10.1117'),false);
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
console.log(`Static acceptance passed: ${html.length} pages, 3 papers, ${projects.filter(p=>p.data.public).length} public project details, no demo/private data, local assets resolve.`);
