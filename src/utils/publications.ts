import raw from '../data/papers.bib?raw';
import {parseBibtex,getAuthors,getTitle,getVenue,getCleanBibtex} from './bibtex';
export const papers = parseBibtex(raw).sort((a,b)=>Number(b.fields.year)-Number(a.fields.year)).map(p=>({
 key:p.key,title:getTitle(p).replace(/--/g,'–'),authors:getAuthors(p).split(', '),journal:getVenue(p).replace(/\\&/g,'&'),year:p.fields.year,volume:p.fields.volume,issue:p.fields.number,pages:p.fields.pages.replace(/--/g,'–'),doi:p.fields.doi,bib:getCleanBibtex(p),
}));
