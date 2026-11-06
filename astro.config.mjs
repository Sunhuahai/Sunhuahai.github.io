import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
 // GitHub Pages for now; restore https://huahaiatlas.com when DNS is pointed.
 site: 'https://sunhuahai.github.io', output: 'static', trailingSlash: 'always',
 integrations: [mdx()],
 markdown: { processor: unified({remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex]}),
 shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
 vite: { build: { rollupOptions: { output: { assetFileNames: '_s/[hash][extname]', chunkFileNames: '_s/[hash].js', entryFileNames: '_s/[hash].js' } } } },
});
