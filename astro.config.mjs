import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Icons from 'unplugin-icons/vite';
export default defineConfig({
 site: 'https://huahaiatlas.com', output: 'static', trailingSlash: 'always',
 integrations: [mdx()],
 markdown: { processor: unified({remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex]}),
 shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
 vite: {
  plugins: [Icons({ compiler: 'astro' })],
  build: { rollupOptions: { output: { assetFileNames: '_s/[hash][extname]', chunkFileNames: '_s/[hash].js', entryFileNames: '_s/[hash].js' } } },
 },
});
