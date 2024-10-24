// types/article.ts
export type ArticleSection = {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'code' | 'callout';
  content: string;
  metadata?: {
    level?: number;          // For headings (h1, h2, etc.)
    listType?: 'bullet' | 'numbered';  // For lists
    language?: string;       // For code blocks
    style?: string;         // For custom styling
    citations?: Citation[];  // For academic content
  };
  children?: ArticleSection[];  // For nested content
};

export type Citation = {
  id: string;
  text: string;
  url?: string;
  type: 'website' | 'book' | 'article' | 'paper';
  author?: string;
  date?: string;
};

export type ArticleMetadata = {
  title: string;
  summary: string;
  keywords: string[];
  targetAudience: string;
  readingTime: number;    // in minutes
  wordCount: number;
  language: string;
  tone: string;
  style: string;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  generationParams: {
    prompt?: string;
    temperature?: number;
    model?: string;
    timestamp: string;
  };
  version: number;
};

export type Article = {
  id: string;
  metadata: ArticleMetadata;
  content: ArticleSection[];
  created_at: string;
  updated_at: string;
};

