/**
 * Journal articles explicitly authorized to be listed without a public DOI.
 *
 * Evidence for these keys lives in publication-proof.yml and must not be copied
 * into BibTeX, HTML links, or JSON-LD. Adding a key does not relax DOI checks
 * for any other paper.
 */
export const NON_DOI_DISPLAYED_JOURNAL_KEYS: ReadonlySet<string> = new Set(['Li2025CssMar']);

/** Evidence hosts permitted only for the keys above. */
export const NON_DOI_EVIDENCE_HOSTS: ReadonlySet<string> = new Set(['www.chndoi.org']);

/** Evidence hosts required for every journal article that publishes a DOI. */
export const DOI_EVIDENCE_HOSTS: ReadonlySet<string> = new Set([
  'pubmed.ncbi.nlm.nih.gov',
  'journals.sagepub.com',
]);
