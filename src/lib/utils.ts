/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import type { Article, ArticleSection, ArticleMetadata, Citation } from '~/types/article';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertJsonToArticle(jsonData: any): Article {
  const convertSection = (section: any): ArticleSection => {
    return {
      id: section.id,
      type: section.type,
      content: section.content,
      metadata: section.metadata,
      children: section.children ? section.children.map(convertSection) : undefined
    };
  };

  const convertCitation = (citation: any): Citation => {
    return {
      id: citation.id,
      text: citation.text,
      url: citation.url,
      type: citation.type,
      author: citation.author,
      date: citation.date
    };
  };

  const metadata: ArticleMetadata = {
    title: jsonData.metadata.title,
    summary: jsonData.metadata.summary,
    keywords: jsonData.metadata.keywords,
    targetAudience: jsonData.metadata.targetAudience,
    readingTime: jsonData.metadata.readingTime,
    wordCount: jsonData.metadata.wordCount,
    language: jsonData.metadata.language,
    tone: jsonData.metadata.tone,
    style: jsonData.metadata.style,
    seoMetadata: jsonData.metadata.seoMetadata,
    generationParams: jsonData.metadata.generationParams,
    version: jsonData.metadata.version
  };

  const article: Article = {
    id: jsonData.id,
    metadata: metadata,
    content: jsonData.content.map(convertSection),
    created_at: jsonData.created_at,
    updated_at: jsonData.updated_at
  };

  return article;
}

export const generateArticlePrompt = () => `Generate a well-structured article based on the given user inputs of topic, style selection, tone selection, and length in JSON object.

Consider the following user inputs:

- **Topic**: The subject or theme of the article.
- **Style Selection**: The writing style, such as narrative, expository, persuasive, or descriptive.
- **Tone Selection**: The emotional tone of the article, like formal, informal, optimistic, or critical.
- **Length**: The desired length of the article, typically in terms of word count or paragraphs.

# Steps

1. **Understand the Topic**: Conduct initial research if necessary to gather essential information about the topic.
2. **Choose the Style**: Structure the article according to the selected writing style. For instance:
   - Narrative: Focus on storytelling with a clear sequence of events.
   - Expository: Emphasize explanation and factual information with a clear thesis and supporting points.
   - Persuasive: Aim to convince the reader using arguments and evidence.
   - Descriptive: Use vivid imagery and descriptions to engage the reader's senses.
3. **Set the Tone**: Apply the chosen tone throughout the article to maintain consistency. Adapt language, phrasing, and attitude to suit the tone.
4. **Determine the Structure**: Organize the article into logical sections or paragraphs, ensuring it aligns with the specified length.
5. **Drafting the Article**: Craft the introduction, body, and conclusion, adhering to the inputs for style, tone, and length.
6. **Review and Edit**: Revise the content for coherence, clarity, and conciseness. Ensure grammar and syntax meet professional standards.
7. The main body should provide key insights or detailed information on the topic, using headings where necessary.
8. Include at least one list (bullet points or numbered) if applicable to break down key points.
9. Add at least one quote from an expert in the field related to the topic, with proper citation.

Ensure that the article has the following metadata:
- Title
- Summary (brief description of the article)
- Keywords (up to 5 relevant keywords)
- Target audience (who the article is written for)
- Approximate reading time (in minutes)
- Word count
- Language (use "en" for English)
- Tone (e.g., informative, casual, authoritative)
- Style (e.g., professional, creative)
- SEO metadata (meta title and meta description for SEO purposes)


# Examples

*Example 1:*

**Input**: 
- Topic: Benefits of Renewable Energy
- Style: Expository
- Tone: Optimistic
- Length: 500 words


# Output

Here’s an example of how the JSON format for the generated article should look:

{
  "metadata": {
    "title": "The Future of Artificial Intelligence",
    "summary": "An exploration of AI's impact on society and technology",
    "keywords": ["AI", "technology", "future", "machine learning"],
    "targetAudience": "tech-savvy professionals",
    "readingTime": 5,
    "wordCount": 1200,
    "language": "en",
    "tone": "informative",
    "style": "professional",
    "seoMetadata": {
      "metaTitle": "The Future of AI: A Comprehensive Overview",
      "metaDescription": "Explore the future implications of AI technology and how it will impact industries and society in the coming years."
    }
  },
  "content": [
    {
      "type": "heading",
      "content": "The Future of Artificial Intelligence",
      "metadata": { "level": 1 }
    },
    {
      "type": "paragraph",
      "content": "Artificial Intelligence has become an integral part of our daily lives, influencing industries from healthcare to finance. Its rapid development has raised both excitement and concern about the future."
    },
    {
      "type": "heading",
      "content": "Key Developments in AI",
      "metadata": { "level": 2 }
    },
    {
      "type": "list",
      "content": "Here are some key areas where AI is making significant progress:",
      "metadata": { "listType": "bullet" },
      "children": [
        { "content": "Machine Learning advancements" },
        { "content": "Natural Language Processing" },
        { "content": "AI Ethics and Bias Reduction" }
      ]
    },
    {
      "type": "quote",
      "content": "AI is not just transforming technology; it is reshaping society itself.",
      "metadata": {
        "citations": [
          {
            "text": "AI Impact Report 2024",
            "type": "article",
            "author": "Dr. Jane Smith",
            "date": "2024"
          }
        ]
      }
    }
  ]
}

(Note: Real examples should have full paragraphs and adhere to specified styles and tones.)

**Note**:
- Consider varying sentence structure and vocabulary to maintain reader engagement.
- Pay attention to the target audience's potential level of expertise when drafting the article.
- Ensure factual accuracy and provide citations or references if needed.
- Add \n in text for next line (especially in body).
- Content texts inside Content array must add upto word length or wordCount.`;


export const logAiThings = (thing: any) => {
  try {
    console.info(thing);
  } catch (error) {
    console.error(error);
  }
};