/**
 * Build-time SEO helpers.
 *
 * Canonical URLs always use the configured site origin. JSON-LD is limited to
 * the public person profile and whitelist journal articles. Conference talks,
 * posters, and proceedings are not scholarly articles and must not be passed in.
 */
import { site } from '../config/site.ts';

/** Existing illustrated portrait. Square, so share cards stay `summary`. */
export const shareImage = {
  path: '/assets/avatar-illustrated.webp',
  width: 960,
  height: 960,
  type: 'image/webp',
  alt: '孙华海的个人肖像',
} as const;

const DOI_RE = /^10\.\d{4,9}\/\S+$/;

export interface ScholarlySource {
  title: string;
  authors: readonly string[];
  journal: string;
  year: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
}

export function canonicalUrl(input: string, origin = site.url): string {
  const configured = new URL(origin);
  let path: string;
  if (/^[a-z][a-z0-9+.-]*:/i.test(input)) {
    path = new URL(input).pathname;
  } else {
    path = input.split('?')[0]?.split('#')[0] ?? '/';
  }
  if (!path.startsWith('/')) path = `/${path}`;
  path = path.replace(/\/{2,}/g, '/');
  if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length);
  const leaf = path.slice(path.lastIndexOf('/') + 1);
  if (!leaf.includes('.') && !path.endsWith('/')) path += '/';
  return new URL(path, configured.origin).href;
}

export function articlePublishedDay(date: Date): string {
  const day = date.toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error('Invalid article publication date');
  return day;
}

export function personId(): string {
  return `${new URL(site.url).origin}/#person`;
}

export function personSameAs(): string[] {
  const links = site.links
    .filter((link) => 'href' in link && typeof link.href === 'string' && /^https?:\/\//i.test(link.href))
    .map((link) => (link as { href: string }).href);
  // Keep ORCID first; never include email or unverified Xiaohongshu.
  const unique = [...new Set([site.orcid, ...links.filter((href) => href !== site.orcid)])];
  return unique;
}

export function personNode() {
  return {
    '@type': 'Person',
    '@id': personId(),
    name: site.name,
    alternateName: site.englishName,
    url: canonicalUrl('/'),
    sameAs: personSameAs(),
  };
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    ...personNode(),
  };
}

function required(value: string, field: string, doi: string): string {
  if (!value || !value.trim()) throw new Error(`ScholarlyArticle ${doi} missing ${field}`);
  return value;
}

/** Journal-article structured data. Callers must not pass conference records. */
export function scholarlyArticleNode(paper: ScholarlySource) {
  if (!DOI_RE.test(paper.doi)) throw new Error(`Refusing JSON-LD for unconfirmed DOI: ${paper.doi}`);
  const doi = paper.doi;
  const title = required(paper.title, 'title', doi);
  const journal = required(paper.journal, 'journal', doi);
  const year = required(paper.year, 'year', doi);
  const volume = required(paper.volume, 'volume', doi);
  const issue = required(paper.issue, 'issue', doi);
  const pages = required(paper.pages, 'pages', doi);
  if (!paper.authors.length || paper.authors.some((name) => !name.trim())) {
    throw new Error(`ScholarlyArticle ${doi} missing authors`);
  }
  if (!paper.authors.includes(site.englishName)) {
    throw new Error(`ScholarlyArticle ${doi} does not list ${site.englishName}`);
  }
  const doiUrl = `https://doi.org/${doi}`;
  return {
    '@type': 'ScholarlyArticle',
    '@id': doiUrl,
    name: title,
    author: paper.authors.map((name) =>
      name === site.englishName ? { '@id': personId() } : { '@type': 'Person', name },
    ),
    datePublished: year,
    pagination: pages,
    url: doiUrl,
    sameAs: doiUrl,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'doi',
      value: doi,
    },
    isPartOf: {
      '@type': 'PublicationIssue',
      issueNumber: issue,
      isPartOf: {
        '@type': 'PublicationVolume',
        volumeNumber: volume,
        isPartOf: {
          '@type': 'Periodical',
          name: journal,
        },
      },
    },
  };
}

export function scholarlyArticleGraph(papers: readonly ScholarlySource[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [personNode(), ...papers.map(scholarlyArticleNode)],
  };
}

/** JSON for a script tag. Escapes `<` so the payload cannot close the script. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
