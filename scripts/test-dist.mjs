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
assert.ok(!readFileSync('dist/index.html','utf8').includes('华海图鉴'));
const robots=readFileSync('dist/robots.txt','utf8');
assert.match(robots,/Allow:\s*\//);
assert.doesNotMatch(robots,/Disallow:\s*\/\s*$/m);
assert.ok(robots.includes('Sitemap: https://huahaiatlas.com/sitemap.xml'));
assert.equal(site.url,'https://huahaiatlas.com','Expected custom domain origin');
for(const r of ['posts/voice-input-revolution.html','posts/writing-as-daily-practice.html','posts/why-the-past-feels-better.html'])assert.ok(existsSync('dist/'+r),r);
console.log(`Static acceptance passed: ${html.length} pages, 3 papers, ${projects.filter(p=>p.data.public).length} public project details, no demo/private data, local assets resolve.`);
