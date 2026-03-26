import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const newsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    author: z.string().default('Marco V.'),
    image: z.string().optional(),
  }),
});

const artistsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/artists" }),
  schema: z.object({
    name: z.string(),
    role: z.string().default('Resident Artist'),
    specialty: z.string(),
    image: z.string().optional(),
    bio: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = {
  'news': newsCollection,
  'artists': artistsCollection,
};
