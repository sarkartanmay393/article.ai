import type { DeepPartial } from "ai";
import { z } from "zod";

export const articleSchema = z.object({
  metadata: z.object({
    title: z.string().describe('The title of the article.'),
    summary: z.string().describe('A brief summary of the article.'),
    keywords: z.array(z.string()).describe('Relevant keywords related to the article.'),
    targetAudience: z.string().describe('Description of the target audience.'),
    readingTime: z.number().describe('Approximate reading time in minutes.'),
    wordCount: z.number().describe('The total word count of the article.'),
    language: z.string().describe('The language of the article, e.g., "en" for English.'),
    tone: z.string().describe('The tone of the article, e.g., "calm", "informative".'),
    style: z.string().describe('The style of the article, e.g., "casual", "professional".'),
    seoMetadata: z.object({
      metaTitle: z.string().describe('The SEO title for the article.'),
      metaDescription: z.string().describe('The SEO description for the article.'),
    }).describe('SEO metadata for the article.'),
  }),
  content: z.string().describe('The content of the article in markdown format.'),
  // content: z.array(
  //   z.union([
  //     z.object({
  //       type: z.literal('heading').describe('A heading element.'),
  //       content: z.string().describe('The text content of the heading.'),
  //       metadata: z.object({
  //         level: z.number().describe('Heading level, e.g., 1 for H1, 2 for H2.'),
  //       }).optional(),
  //     }),
  //     z.object({
  //       type: z.literal('paragraph').describe('A paragraph element.'),
  //       content: z.string().describe('The text content of the paragraph.'),
  //     }),
  //     z.object({
  //       type: z.literal('list').describe('A list element.'),
  //       content: z.string().describe('The introduction to the list.'),
  //       metadata: z.object({
  //         listType: z.enum(['bullet', 'numbered']).describe('The type of list, either bullet or numbered.'),
  //       }).describe('Metadata for the list.'),
  //       children: z.array(
  //         z.object({
  //           content: z.string().describe('The content of each list item.'),
  //         })
  //       ).describe('An array of list items.'),
  //     }),
  //     z.object({
  //       type: z.literal('quote').describe('A quote element.'),
  //       content: z.string().describe('The quote text.'),
  //       metadata: z.object({
  //         citations: z.array(
  //           z.object({
  //             text: z.string().describe('The citation text.'),
  //             type: z.string().describe('The type of citation, e.g., oral, article.'),
  //             author: z.string().describe('The author of the citation.'),
  //             date: z.string().describe('The date of the citation.'),
  //           })
  //         ).describe('An array of citation details for the quote.'),
  //       }).describe('Metadata for the quote, including citations.'),
  //     }),
  //   ])
  // ).describe('An array of content blocks in the article.'),
});

export type PartialArticle = DeepPartial<typeof articleSchema>;

export type Article = z.infer<typeof articleSchema>;