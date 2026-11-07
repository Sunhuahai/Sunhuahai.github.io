import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { getAuthors, getTitle, getVenue, parseBibtex } from '../src/utils/bibtex.ts';
import {
  articlePublishedDay,
  canonicalUrl,
  personJsonLd,
  scholarlyArticleGraph,
  scholarlyArticleNode,
  serializeJsonLd,
  shareImage,
  type ScholarlySource,
} from '../src/utils/seo.ts';

const EXPECTED_DOIS = [
  '10.1088/1361-6560/ae6af7',
  '10.1177/08953996261439069',
  '10.1088/1361-6560/ad6eda',
];

function papersFromBib(src: string): ScholarlySource[] {
  return parseBibtex(src).map((entry) => ({
    title: getTitle(entry).replace(/--/g, '–'),
    authors: getAuthors(entry).split(', '),
    journal: getVenue(entry).replace(/\\&/g, '&'),
    year: entry.fields.year,
    volume: entry.fields.volume,
    issue: entry.fields.number,
    pages: entry.fields.pages.replace(/--/g, '–'),
    doi: entry.fields.doi,
  }));
}

function webpSize(buf: Buffer): { width: number; height: number } {
  assert.equal(buf.toString('ascii', 0, 4), 'RIFF');
  assert.equal(buf.toString('ascii', 8, 12), 'WEBP');
  const kind = buf.toString('ascii', 12, 16);
  if (kind === 'VP8X') {
    return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  }
  if (kind === 'VP8 ') {
    const frame = buf.subarray(20);
    assert.deepEqual([frame[3], frame[4], frame[5]], [0x9d, 0x01, 0x2a]);
    return { width: frame.readUInt16LE(6) & 0x3fff, height: frame.readUInt16LE(8) & 0x3fff };
  }
  if (kind === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  throw new Error(`Unsupported WebP chunk ${kind}`);
}

test('canonical uses the apex origin, trailing slash, and no query', () => {
  assert.equal(canonicalUrl('/'), 'https://huahaiatlas.com/');
  assert.equal(canonicalUrl('/about'), 'https://huahaiatlas.com/about/');
  assert.equal(canonicalUrl('/about/'), 'https://huahaiatlas.com/about/');
  assert.equal(canonicalUrl('/about/?utm=1#section'), 'https://huahaiatlas.com/about/');
  assert.equal(
    canonicalUrl('https://www.huahaiatlas.com/about?x=1#y'),
    'https://huahaiatlas.com/about/',
  );
  assert.equal(canonicalUrl('http://huahaiatlas.com/publications'), 'https://huahaiatlas.com/publications/');
  assert.equal(canonicalUrl('/about/index.html'), 'https://huahaiatlas.com/about/');
  assert.equal(canonicalUrl('/index.html'), 'https://huahaiatlas.com/');
  assert.equal(canonicalUrl('//publications//'), 'https://huahaiatlas.com/publications/');
  assert.equal(canonicalUrl('/rss.xml'), 'https://huahaiatlas.com/rss.xml');
  assert.equal(canonicalUrl('/publications.bib'), 'https://huahaiatlas.com/publications.bib');
});

test('article day matches the UTC calendar date used on the page', () => {
  assert.equal(articlePublishedDay(new Date('2026-06-24T00:00:00.000Z')), '2026-06-24');
});

test('person JSON-LD keeps confirmed name and ORCID only', () => {
  const person = personJsonLd();
  assert.equal(person['@type'], 'Person');
  assert.equal(person.name, '孙华海');
  assert.equal(person.alternateName, 'Huahai Sun');
  assert.equal(person.url, 'https://huahaiatlas.com/');
  assert.deepEqual(person.sameAs, ['https://orcid.org/0009-0003-2386-133X']);
  const serialized = serializeJsonLd(person);
  assert.doesNotMatch(serialized, /华海图鉴|mailto:|@type":"ScholarlyArticle|telephone|email/i);
  assert.equal(JSON.parse(serialized).name, '孙华海');
});

test('whitelist journal articles become ScholarlyArticle nodes and talks do not', () => {
  const papers = papersFromBib(readFileSync('src/data/papers.bib', 'utf8'));
  assert.deepEqual(
    papers.map((paper) => paper.doi).sort(),
    [...EXPECTED_DOIS].sort(),
  );
  const graph = scholarlyArticleGraph(papers);
  assert.equal(graph['@graph'].filter((node) => node['@type'] === 'ScholarlyArticle').length, 3);
  const serialized = serializeJsonLd(graph);
  const parsed = JSON.parse(serialized);
  const articles = parsed['@graph'].filter(
    (node: { '@type': string }) => node['@type'] === 'ScholarlyArticle',
  );
  assert.deepEqual(
    articles.map((article: { identifier: { value: string } }) => article.identifier.value).sort(),
    [...EXPECTED_DOIS].sort(),
  );
  const huahaiRefs = serialized.match(/https:\/\/huahaiatlas\.com\/#person/g) ?? [];
  assert.ok(huahaiRefs.length >= 4);
  for (const article of articles) {
    for (const author of article.author) {
      if (author['@id']) {
        assert.equal(author['@id'], 'https://huahaiatlas.com/#person');
        assert.equal(author.sameAs, undefined);
        assert.equal(author.name, undefined);
      } else {
        assert.notEqual(author.name, 'Huahai Sun');
        assert.equal(author.sameAs, undefined);
        assert.doesNotMatch(JSON.stringify(author), /orcid/i);
      }
    }
    assert.match(article.url, /^https:\/\/doi\.org\/10\./);
  }
  const conferences = readFileSync('src/data/conferences.yml', 'utf8');
  assert.match(conferences, /DiffuCoCT/);
  assert.doesNotMatch(serialized, /DiffuCoCT|Fully3D|口头报告|海报|10\.1117|mailto:|telephone/);
  assert.doesNotMatch(serialized, /华海图鉴/);
});

test('JSON-LD cannot close the script element', () => {
  assert.equal(serializeJsonLd({ name: '</script><script>' }), '{"name":"\\u003c/script>\\u003cscript>"}');
  assert.doesNotMatch(serializeJsonLd({ name: '</script>' }), /</);
});

test('incomplete or non-author papers are refused', () => {
  const sample: ScholarlySource = {
    title: 'Example',
    authors: ['Huahai Sun', 'Liang Li'],
    journal: 'Physics in Medicine & Biology',
    year: '2026',
    volume: '71',
    issue: '10',
    pages: '105027',
    doi: '10.1088/1361-6560/ae6af7',
  };
  assert.equal(scholarlyArticleNode(sample).name, 'Example');
  assert.throws(() => scholarlyArticleNode({ ...sample, doi: 'not-a-doi' }));
  assert.throws(() => scholarlyArticleNode({ ...sample, authors: ['Liang Li'] }));
  assert.throws(() => scholarlyArticleNode({ ...sample, title: '' }));
});

test('share image dimensions match the file and the seal icon is unchanged', () => {
  const image = readFileSync('public/assets/avatar-illustrated.webp');
  assert.deepEqual(webpSize(image), { width: shareImage.width, height: shareImage.height });
  assert.equal(shareImage.type, 'image/webp');
  assert.equal(shareImage.path, '/assets/avatar-illustrated.webp');
  const seal = createHash('sha256').update(readFileSync('public/favicon.svg')).digest('hex');
  assert.equal(seal, '2e31b1fe09a483de2701e5ee9282c5b5086011d5427128b5497eb9dc42ec8bd4');
  assert.match(readFileSync('public/favicon.svg', 'utf8'), /fill="#000000"/);
  assert.match(readFileSync('public/favicon.svg', 'utf8'), /fill="#FFFFFF"/);
});
