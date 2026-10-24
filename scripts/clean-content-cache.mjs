// Astro's glob loader can retain deleted entries when a collection becomes empty.
// Rebuild only the generated content cache to prevent publishing removed posts.
import {rmSync} from 'node:fs';
rmSync('.astro',{recursive:true,force:true});
rmSync('node_modules/.astro',{recursive:true,force:true});
