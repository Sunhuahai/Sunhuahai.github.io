# Huahai Atlas customization

Identity and UI labels: src/config/site.ts. Feature flags: math, statusPublic (keep false until public launch approved).
Posts: src/content/posts/*.md; draft defaults true, draft routes are not generated. KaTeX and Shiki render at build time, local fonts/CSS, no CDN. tags filter and generated heading TOC supported.
Projects: src/content/projects/*.md; publication_key required and public defaults false.
Papers: src/data/papers.bib and publication-proof.yml, checked against frozen policy/ initial whitelist on every build. See PUBLICATION_POLICY.md before extending.
Theme uses CSS variables and data-theme, responsive navigation with keyboard support.
No analytics, comments, newsletter, email, GitHub identity, citation metrics or remote fonts.
