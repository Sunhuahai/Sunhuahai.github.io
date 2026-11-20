import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {parseConferenceDate} from '../src/utils/conference-date.ts';import {validate,validateConferences} from './publication-policy.ts';
const bib=readFileSync('policy/published.bib','utf8'),proof=readFileSync('policy/publication-proof.yml','utf8');
test('whitelist passes',()=>assert.equal(validate(bib,proof,bib,proof).length,4));
test('reject altered author',()=>assert.throws(()=>validate(bib.replace('Sun, Huahai','Anonymous'),proof,bib,proof)));
test('reject extra paper',()=>assert.throws(()=>validate(bib+'\n@article{unpublished,author={Sun, Huahai}}',proof,bib,proof)));
test('reject duplicate',()=>assert.throws(()=>validate(bib+'\n'+bib,proof,bib,proof)));
test('reject accepted status',()=>assert.throws(()=>validate(bib,proof.replace(/^(\s+)publication_status: published/m,'$1publication_status: accepted'),bib,proof)));
test('reject invalid evidence',()=>assert.throws(()=>validate(bib,proof.replace('https://pubmed.ncbi.nlm.nih.gov/42102855/','http://example.org'),bib,proof)));
test('reject PDF hosting',()=>assert.throws(()=>validate(bib,proof.replace('public_pdf_allowed: false','public_pdf_allowed: true'),bib,proof)));

const emptyConf='records: []\n';
const sampleConf=`records:\n  - authors: [Huahai Sun]\n    title: Sample talk\n    event: Example Conference\n    location: Beijing, China\n    date: "2024-06"\n    type: oral\n    url: https://example.com/program\n`;
test('empty conferences pass',()=>assert.equal(validateConferences(emptyConf).length,0));
test('valid conference passes',()=>assert.equal(validateConferences(sampleConf).length,1));
test('reject conference pdf url',()=>assert.throws(()=>validateConferences(sampleConf.replace('https://example.com/program','https://example.com/talk.pdf'))));
test('reject conference bad type',()=>assert.throws(()=>validateConferences(sampleConf.replace('oral','keynote'))));
test('reject conference http url',()=>assert.throws(()=>validateConferences(sampleConf.replace('https://','http://'))));
test('reject conference email',()=>assert.throws(()=>validateConferences(sampleConf.replace('Sample talk','Sample talk contact a@b.com'))));
test('conference day range passes',()=>assert.equal(validateConferences(sampleConf.replace('date: "2024-06"','date: "2024-06-01/2024-06-03"')).length,1));
test('reject impossible conference day',()=>assert.throws(()=>validateConferences(sampleConf.replace('date: "2024-06"','date: "2024-02-31"'))));
test('reject reversed conference range',()=>assert.throws(()=>validateConferences(sampleConf.replace('date: "2024-06"','date: "2024-06-10/2024-06-01"'))));
test('month dates stay unchanged and same-month ranges format in English',()=>{
  assert.deepEqual(parseConferenceDate('2025-05'),{index:'2025-05',label:'2025-05'});
  assert.deepEqual(parseConferenceDate('2026-11-07/2026-11-14'),{index:'2026-11',label:'November 7–14, 2026'});
  assert.equal(parseConferenceDate('2024-02-31'),null);
});
test('reject DOI stripped from an existing article',()=>assert.throws(()=>validate(bib.replace('\n  doi     = {10.1088/1361-6560/ae6af7},\n  url     = {https://doi.org/10.1088/1361-6560/ae6af7}',''),proof,bib.replace('\n  doi     = {10.1088/1361-6560/ae6af7},\n  url     = {https://doi.org/10.1088/1361-6560/ae6af7}',''),proof)));
test('reject chndoi evidence on a DOI article',()=>{
  const changed=proof.replace('https://pubmed.ncbi.nlm.nih.gov/42102855/','https://www.chndoi.org/Resolution/Handler?doi=10.1000/x');
  assert.throws(()=>validate(bib,changed,bib,changed));
});
test('reject DOI field on the authorized Chinese article',()=>{
  const withDoi=bib.replace('language = {zh}','language = {zh},\n  doi     = {10.13505/j.1007-1482.2025.30.04.006}');
  assert.throws(()=>validate(withDoi,proof,withDoi,proof));
});
test('reject non-allowlisted article without a DOI',()=>{
  const otherBib=bib.replaceAll('Li2025CssMar','Unlisted2025');
  const otherProof=proof.replaceAll('Li2025CssMar','Unlisted2025');
  assert.throws(()=>validate(otherBib,otherProof,otherBib,otherProof));
});
test('reject moving the Chinese article evidence off the authorized host',()=>{
  const changed=proof.replaceAll('https://www.chndoi.org/Resolution/Handler?doi=10.13505/j.1007-1482.2025.30.04.006','https://example.org/record');
  assert.throws(()=>validate(bib,changed,bib,changed));
});
test('live conference records keep the oral talk and add only the authorized poster',()=>{
  const records=validateConferences(readFileSync('src/data/conferences.yml','utf8'));
  assert.equal(records.length,2);
  const oral=records.find(r=>r.type==='oral');
  assert.ok(oral);
  assert.equal(oral.title,'DiffuCoCT: Dual-Domain Collaborative Diffusion Network for Dual-Detector CT Scatter Correction');
  assert.equal(oral.date,'2025-05');
  assert.equal(oral.url,'https://hqlab.sjtu.edu.cn/fully3d-2025/program');
  assert.equal(oral.doi,undefined);
  const poster=records.find(r=>r.type==='poster');
  assert.ok(poster);
  assert.deepEqual(poster.authors,['Huahai Sun','Liang Li']);
  assert.equal(poster.title,'Physics-Informed Jointly Constrained Spectral Signal Decomposition for High-Resolution X-Ray Fluorescence Computed Tomography');
  assert.equal(poster.event,'2026 IEEE Nuclear Science Symposium, Medical Imaging Conference and International Symposium on Room Temperature Semiconductor Detectors (IEEE NSS/MIC/RTSD 2026)');
  assert.equal(poster.location,'Granada, Spain');
  assert.equal(poster.date,'2026-11-07/2026-11-14');
  assert.equal(poster.url,'https://nssmic.ieee.org/2026/');
  assert.equal(poster.note,'Poster Presentation · MIC-05-442 · Abstract #1630');
  assert.equal(poster.doi,undefined);
  assert.equal(parseConferenceDate(poster.date)?.label,'November 7–14, 2026');
  assert.equal(parseConferenceDate(oral.date)?.label,'2025-05');
});
