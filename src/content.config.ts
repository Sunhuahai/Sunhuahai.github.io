import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
const posts = defineCollection({ loader: glob({pattern:'**/*.{md,mdx}',base:'./src/content/posts'}), schema:z.object({title:z.string(), date:z.coerce.date(), description:z.string(), tags:z.array(z.string()).default([]), draft:z.boolean().default(true), math:z.boolean().default(false), toc:z.boolean().default(true)}) });
const projects = defineCollection({ loader:glob({pattern:'**/*.md',base:'./src/content/projects'}), schema:z.object({title:z.string(),slug:z.string(),publication_key:z.string(),category:z.string(),year:z.number(),public:z.boolean().default(false),cover:z.string().optional()}) });
export const collections={posts,projects};
