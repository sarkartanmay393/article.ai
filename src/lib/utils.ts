/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { Article, ArticleSection, ArticleMetadata, Citation } from '~/types/article';

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