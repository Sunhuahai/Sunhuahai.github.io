import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {validate} from './publication-policy.ts';
const bib=readFileSync('policy/published.bib','utf8'),proof=readFileSync('policy/publication-proof.yml','utf8');
test('whitelist passes',()=>assert.equal(validate(bib,proof,bib,proof).length,3));
test('reject altered author',()=>assert.throws(()=>validate(bib.replace('Sun, Huahai','Anonymous'),proof,bib,proof)));
test('reject extra paper',()=>assert.throws(()=>validate(bib+'\n@article{unpublished,author={Sun, Huahai}}',proof,bib,proof)));
test('reject duplicate',()=>assert.throws(()=>validate(bib+'\n'+bib,proof,bib,proof)));
test('reject accepted status',()=>assert.throws(()=>validate(bib,proof.replace(/^(\s+)publication_status: published/m,'$1publication_status: accepted'),bib,proof)));
test('reject invalid evidence',()=>assert.throws(()=>validate(bib,proof.replace('https://pubmed.ncbi.nlm.nih.gov/42102855/','http://example.org'),bib,proof)));
test('reject PDF hosting',()=>assert.throws(()=>validate(bib,proof.replace('public_pdf_allowed: false','public_pdf_allowed: true'),bib,proof)));
