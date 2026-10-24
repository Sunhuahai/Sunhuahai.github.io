import raw from '../data/papers.bib?raw';
export function GET(){return new Response(raw,{headers:{'Content-Type':'application/x-bibtex; charset=utf-8'}})}
