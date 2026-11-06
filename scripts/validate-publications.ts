import {readFileSync,readdirSync} from 'node:fs';import assert from 'node:assert/strict';import yaml from 'js-yaml';
import {validate,validateConferences} from './publication-policy.ts';
const read=(p:string)=>readFileSync(p,'utf8');
const entries=validate(read('src/data/papers.bib'),read('src/data/publication-proof.yml'),read('policy/published.bib'),read('policy/publication-proof.yml'));
const keys=new Set(entries.map(e=>e.key));
for(const f of readdirSync('src/content/projects')){
 if(!f.endsWith('.md'))continue;
 const fm=yaml.load(read(`src/content/projects/${f}`).split('---')[1]) as {public:boolean;publication_key:string};
 if(fm.public)assert.ok(keys.has(fm.publication_key),'Public project requires published paper');
}
const conferences=validateConferences(read('src/data/conferences.yml'));
console.log(`Publication gate passed: ${entries.length} verified journal articles; ${conferences.length} conference records; project references valid.`);
