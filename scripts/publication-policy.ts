import assert from 'node:assert/strict';
import { parseBibtex } from '../src/utils/bibtex.ts';
import { parseConferenceDate } from '../src/utils/conference-date.ts';
import {
  DOI_EVIDENCE_HOSTS,
  NON_DOI_DISPLAYED_JOURNAL_KEYS,
  NON_DOI_EVIDENCE_HOSTS,
} from '../src/utils/journal-allowlist.ts';
import yaml from 'js-yaml';

type Proof = {
  bibkey: string;
  kind: string;
  publication_status: string;
  evidence_url: string;
  publisher_url: string;
  verified_on: string;
  public_pdf_allowed: boolean;
};

function httpsHost(url: string, hosts: ReadonlySet<string>, label: string) {
  const parsed = new URL(url);
  assert.equal(parsed.protocol, 'https:', label);
  assert.ok(hosts.has(parsed.hostname), `${label} host ${parsed.hostname}`);
}

export function validate(bib: string, proof: string, baselineBib: string, baselineProof: string) {
  const entries = parseBibtex(bib),
    frozen = parseBibtex(baselineBib),
    records = (yaml.load(proof) as { records: Proof[] }).records,
    initial = (yaml.load(baselineProof) as { records: Proof[] }).records;
  assert.equal(entries.length, frozen.length, 'Initial whitelist size changed');
  assert.equal(new Set(entries.map((e) => e.key)).size, entries.length, 'Duplicate BibTeX key');
  assert.equal(new Set(records.map((r) => r.bibkey)).size, records.length, 'Duplicate proof key');
  assert.equal(records.length, entries.length, 'Every paper requires proof');
  for (const key of NON_DOI_DISPLAYED_JOURNAL_KEYS) {
    assert.ok(
      entries.some((e) => e.key === key),
      `Allowlisted non-DOI article missing: ${key}`,
    );
  }
  for (const e of entries) {
    const original = frozen.find((f) => f.key === e.key);
    assert.ok(original, 'Paper outside whitelist');
    assert.deepEqual(e, original, 'Verified metadata changed');
    const r = records.find((item) => item.bibkey === e.key);
    assert.ok(r, 'Missing proof');
    assert.equal(r.publication_status, 'published');
    assert.equal(r.kind, 'journal_article');
    assert.equal(e.type, 'article');
    assert.equal(r.public_pdf_allowed, false);
    assert.match(r.verified_on, /^\d{4}-\d{2}-\d{2}$/);
    assert.deepEqual(
      r,
      initial.find((item) => item.bibkey === e.key),
    );
    if (NON_DOI_DISPLAYED_JOURNAL_KEYS.has(e.key)) {
      assert.equal(e.fields.language, 'zh', `${e.key} must be marked zh`);
      assert.ok(!e.fields.doi, `${e.key} must not carry a DOI`);
      assert.ok(!e.fields.url, `${e.key} must not carry a URL`);
      assert.ok(e.fields.author.includes('孙华海'), `${e.key} must list 孙华海`);
      httpsHost(r.evidence_url, NON_DOI_EVIDENCE_HOSTS, `${e.key} evidence_url`);
      httpsHost(r.publisher_url, NON_DOI_EVIDENCE_HOSTS, `${e.key} publisher_url`);
      assert.equal(r.publisher_url, r.evidence_url);
      assert.equal(r.publisher_url.startsWith('https://doi.org/'), false, `${e.key} must not use doi.org`);
      assert.equal(r.evidence_url.startsWith('https://doi.org/'), false, `${e.key} evidence must not be a doi.org URL`);
    } else {
      httpsHost(r.evidence_url, DOI_EVIDENCE_HOSTS, `${e.key} evidence_url`);
      assert.match(e.fields.doi, /^10\.\d{4,9}\/.+$/);
      assert.equal(r.publisher_url, `https://doi.org/${e.fields.doi}`);
      assert.ok(e.fields.author.includes('Sun, Huahai'));
    }
  }
  return entries;
}

const CONF_TYPES = new Set(['oral', 'poster', 'proceedings']);
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /\+?\d[\d\s().-]{7,}\d/;

export type ConferenceRecord = {
  authors: string[];
  title: string;
  event: string;
  location: string;
  date: string;
  type: string;
  url: string;
  doi?: string;
  note?: string;
};

/** Light gate for 科研 → 会议 entries. Talks/posters are allowed here only. */
export function validateConferences(yamlText: string) {
  const data = yaml.load(yamlText) as { records?: ConferenceRecord[] } | null;
  assert.ok(data && Array.isArray(data.records), 'conferences.yml must have records: []');
  const records = data!.records!;
  const seen = new Set<string>();
  for (const [i, r] of records.entries()) {
    const label = `conference[${i}]`;
    assert.ok(
      Array.isArray(r.authors) && r.authors.length > 0 && r.authors.every((a) => typeof a === 'string' && a.trim()),
      `${label}: authors required`,
    );
    for (const field of ['title', 'event', 'location', 'date', 'type', 'url'] as const) {
      assert.ok(typeof r[field] === 'string' && String(r[field]).trim(), `${label}: ${field} required`);
    }
    assert.ok(
      parseConferenceDate(r.date),
      `${label}: date must be YYYY, YYYY-MM, YYYY-MM-DD, or YYYY-MM-DD/YYYY-MM-DD`,
    );
    assert.ok(CONF_TYPES.has(r.type), `${label}: type must be oral|poster|proceedings`);
    assert.ok(/^https:\/\//i.test(r.url), `${label}: url must be https`);
    assert.ok(!/\.pdf(\?|#|$)/i.test(r.url), `${label}: no PDF links`);
    const blob = [r.title, r.event, r.location, r.url, r.note || '', r.doi || '', ...r.authors].join('\n');
    assert.ok(!EMAIL_RE.test(blob), `${label}: no email`);
    // Ignore ISO dates and HH:MM so program notes do not trip the phone heuristic.
    const forPhone = blob.replace(/\d{4}-\d{2}(?:-\d{2})?/g, '').replace(/\d{1,2}:\d{2}/g, '');
    assert.ok(!PHONE_RE.test(forPhone), `${label}: no phone`);
    if (r.doi !== undefined && r.doi !== null && String(r.doi) !== '') {
      assert.ok(typeof r.doi === 'string' && r.doi.trim() && !r.doi.startsWith('http'), `${label}: doi should be bare DOI`);
    }
    const key = `${r.type}|${r.title}|${r.event}|${r.date}`;
    assert.ok(!seen.has(key), `${label}: duplicate conference record`);
    seen.add(key);
  }
  return records;
}
