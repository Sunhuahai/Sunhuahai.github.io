# Publication policy

## Journal articles（文章）

Initial release is restricted to the exact three entries from the handoff published.bib and publication-proof.yml, preserved in policy/ as an independent baseline. Build rejects missing or duplicate proof, metadata changes, nonpublished status, unknown keys, nonofficial evidence and PDF redistribution. Every project must reference an allowlisted publication.

To add a paper later: verify full authors/title/year/journal/volume/issue/pages/DOI and formal publication on the publisher or official bibliographic record; obtain user authorization for expanding this initial whitelist; update both src/data/ files and policy/ with the reviewed evidence; run check/build/test; review the diff before deployment. Never treat an accepted abstract, poster, oral presentation or under-review paper as a published paper.

No citation counts, impact factors, awards, licensed PDFs, private code or unpublished research are imported. No CV, email or social links beyond the verified ORCID.

## Conference records（会议）

The research page (`/publications/`, nav label 科研) may list conference talks, posters, and conference proceedings under the **会议** section only. These items live in `src/data/conferences.yml` and must never be presented as journal papers or mixed into `papers.bib`.

Allowed types: `oral` (口头报告), `poster` (海报), `proceedings` (会议论文).

Each record requires: authors, title, full event name, location, date (`YYYY` or `YYYY-MM`), type, and an official HTTPS URL (conference site, program page, or publisher record). Optional: DOI, short note. No PDF links, email addresses, or phone numbers. Adding or changing conference entries needs Huahai's explicit authorization and a review of the official source before deployment.
